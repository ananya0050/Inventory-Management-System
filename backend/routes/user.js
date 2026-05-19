const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const crypto  = require('crypto');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getUsers,
  makeAdmin,
  removeAdmin,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
} = require('../controllers/userController');

// ─── MULTER CONFIG (profile picture upload) ────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profiles'));
  },
  filename: (req, file, cb) => {
    const ext    = path.extname(file.originalname);
    const unique = crypto.randomBytes(8).toString('hex');
    cb(null, `${req.user._id}_${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
router.get('/',                 authMiddleware, adminMiddleware, getUsers);
router.put('/:id/make-admin',   authMiddleware, adminMiddleware, makeAdmin);
router.put('/:id/remove-admin', authMiddleware, adminMiddleware, removeAdmin);
router.delete('/:id',           authMiddleware, adminMiddleware, deleteUser);

// ─── PROFILE ROUTES (any authenticated user) ──────────────────────────────────
router.get('/me',              authMiddleware, getProfile);
router.put('/me/update',       authMiddleware, updateProfile);
router.put('/me/password',     authMiddleware, changePassword);
router.post('/me/picture',     authMiddleware, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;