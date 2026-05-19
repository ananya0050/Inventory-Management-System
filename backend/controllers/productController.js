const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const products = await Product.find({
      name: { $regex: search, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addProduct = async (req, res) => {
  const { name, category, supplier, price, stock } = req.body;
  try {
    const product = await Product.create({ name, category, supplier, price, stock });

    // ── Emit to ALL connected clients ──
    const io = req.app.get('io');
    io.emit('product:added', product);

    res.status(201).json({ message: 'Product added successfully!', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });

    // ── Emit update to all clients ──
    const io = req.app.get('io');
    io.emit('product:updated', updated);

    res.json({ message: 'Product updated successfully!', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    // ── Emit delete to all clients ──
    const io = req.app.get('io');
    io.emit('product:deleted', { _id: req.params.id });

    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };