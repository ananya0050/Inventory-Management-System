const Supplier = require('../models/Supplier');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/suppliers
// Returns all suppliers sorted newest first
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/suppliers/:id
// Returns a single supplier by MongoDB _id
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/suppliers
// Creates a new supplier
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
const addSupplier = async (req, res) => {
  const { supplierName, email, phoneNumber, address, totalOrders } = req.body;

  try {
    // Manual required-field check (schema validation also runs below)
    if (!supplierName || !email || !phoneNumber || !address) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const supplier = await Supplier.create({
      supplierName,
      email,
      phoneNumber,
      address,
      totalOrders: Number(totalOrders) || 0,
    });

    res.status(201).json({ message: 'Supplier added successfully!', supplier });
  } catch (err) {
    // Mongoose validation error (e.g. missing required field caught by schema)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/suppliers/:id
// Updates an existing supplier by _id
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
const updateSupplier = async (req, res) => {
  const { supplierName, email, phoneNumber, address, totalOrders } = req.body;

  try {
    const updated = await Supplier.findByIdAndUpdate(
      req.params.id,
      { supplierName, email, phoneNumber, address, totalOrders: Number(totalOrders) || 0 },
      { new: true, runValidators: true } // new:true returns the updated doc
    );

    if (!updated) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier updated successfully!', supplier: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/suppliers/:id
// Permanently deletes a supplier
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
};