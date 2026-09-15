// Experiment 4: Building RESTful APIs - Order Controller
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
      paymentMethod,
      shippingAddress,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      paidAt: paymentMethod !== 'cod' ? new Date() : null,
    });

    // Clear user cart after placing order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 }
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.game', 'title image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    if (req.body.status === 'completed') order.deliveredAt = new Date();

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed order' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
