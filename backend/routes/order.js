// // const express = require('express');
// // const router  = express.Router();
// // const authMiddleware = require('../middleware/authMiddleware');
// // const { placeOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');

// // router.post('/place',   authMiddleware, placeOrder);
// // router.get('/mine',     authMiddleware, getMyOrders);
// // router.get('/all',      authMiddleware, getAllOrders);

// // module.exports = router;

// const express = require('express');
// const router  = express.Router();
// const { authMiddleware } = require('../middleware/authMiddleware');
// const { placeOrder, cancelOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');

// router.post('/place',       authMiddleware, placeOrder);
// router.put('/:id/cancel',   authMiddleware, cancelOrder);
// router.get('/mine',         authMiddleware, getMyOrders);
// router.get('/all',          authMiddleware, getAllOrders);

// module.exports = router;

const express = require('express');
const router  = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { placeOrder, cancelOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const Order = require('../models/Order');

router.post('/place',       authMiddleware,                    placeOrder);
router.put('/:id/cancel',   authMiddleware,                    cancelOrder);
router.get('/mine',         authMiddleware,                    getMyOrders);
router.get('/all',          authMiddleware, adminMiddleware,   getAllOrders);

// Admin approve/reject
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: `Order ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;