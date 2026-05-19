const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const path   = require('path');
const fs     = require('fs');

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const users = await User
      .find({ isDeleted: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── MAKE ADMIN ───────────────────────────────────────────────────────────────
// Only an existing admin can call this (enforced in route by adminMiddleware)
const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted)
      return res.status(404).json({ message: 'User not found.' });

    if (user.role === 'admin')
      return res.status(400).json({ message: `${user.name} is already an admin.` });

    user.role = 'admin';
    await user.save();

    // Notify all connected clients via Socket.IO
    const io = req.app.get('io');
    if (io) io.emit('user:roleChanged', { userId: user._id.toString(), role: 'admin' });

    res.json({ message: `${user.name} is now an admin!`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── REMOVE ADMIN ─────────────────────────────────────────────────────────────
const removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted)
      return res.status(404).json({ message: 'User not found.' });

    // Cannot demote yourself
    if (user._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot remove your own admin role.' });

    // Guard: ensure at least one admin remains
    const adminCount = await User.countDocuments({ role: 'admin', isDeleted: false });
    if (adminCount <= 1)
      return res.status(400).json({
        message: 'Cannot remove the last admin. Assign another admin first.',
        code: 'LAST_ADMIN',
      });

    user.role = 'user';
    await user.save();

    const io = req.app.get('io');
    if (io) io.emit('user:roleChanged', { userId: user._id.toString(), role: 'user' });

    res.json({ message: `${user.name}'s admin role has been removed.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── DELETE USER ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser || targetUser.isDeleted)
      return res.status(404).json({ message: 'User not found.' });

    // Self-deletion guard for admins
    if (targetUser._id.toString() === req.user._id.toString()) {
      const otherAdmins = await User.countDocuments({
        role: 'admin',
        isDeleted: false,
        _id: { $ne: req.user._id },
      });

      if (otherAdmins === 0) {
        return res.status(400).json({
          message: 'You must assign another admin before deleting your account.',
          code: 'LAST_ADMIN',
        });
      }
    }

    // Soft delete — keeps data integrity; JWT check will block future logins
    targetUser.isDeleted = true;
    await targetUser.save();

    // Push real-time notification to the specific user's socket room
    const io = req.app.get('io');
    if (io) {
      io.emit(`user:deleted:${targetUser._id}`, {
        message: 'Your account has been deleted by admin.',
      });
    }

    res.json({ message: `${targetUser.name} has been deleted.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── GET OWN PROFILE ─────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── UPDATE PROFILE (name + email) ───────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name)  user.name  = name.trim();
    if (email) {
      const taken = await User.findOne({ email, _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Email already in use.' });
      user.email = email.toLowerCase().trim();
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id:             user._id,
        name:           user.name,
        email:          user.email,
        role:           user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── CHANGE PASSWORD ─────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both fields are required.' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });

    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(400).json({ message: 'Current password is incorrect.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── UPLOAD PROFILE PICTURE ───────────────────────────────────────────────────
// Uses multer (configured in routes/user.js)
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Delete old picture from disk if it exists
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const relativePath = `/uploads/profiles/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    res.json({
      message: 'Profile picture updated.',
      profilePicture: relativePath,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getUsers,
  makeAdmin,
  removeAdmin,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
};