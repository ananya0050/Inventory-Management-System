const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },

    // Soft-delete flag — set true when admin deletes a user
    isDeleted: { type: Boolean, default: false },

    // Profile picture — stored as relative path (e.g. /uploads/profiles/abc.jpg)
    profilePicture: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);