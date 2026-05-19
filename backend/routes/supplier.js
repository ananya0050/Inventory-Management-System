const express = require('express');
const router  = express.Router();

// Same middleware already used across the project
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

// Every route is protected:
//  authMiddleware  → verifies the JWT token and attaches req.user
//  adminMiddleware → blocks non-admin users with 403

router.get('/',       authMiddleware, adminMiddleware, getAllSuppliers);  // GET all
router.get('/:id',    authMiddleware, adminMiddleware, getSupplierById); // GET one
router.post('/',      authMiddleware, adminMiddleware, addSupplier);      // CREATE
router.put('/:id',    authMiddleware, adminMiddleware, updateSupplier);  // UPDATE
router.delete('/:id', authMiddleware, adminMiddleware, deleteSupplier);  // DELETE

module.exports = router;