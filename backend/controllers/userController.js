// Experiment 6: Authorization - Admin User Management
const User = require('../models/User');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const Game = require('../models/Game');
    const Order = require('../models/Order');

    const totalUsers = await User.countDocuments();
    const totalGames = await Game.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      totalUsers,
      totalGames,
      totalOrders,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats };
