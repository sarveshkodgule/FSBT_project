// Experiment 4: Building RESTful APIs - Cart Routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:gameId', protect, updateCartItem);
router.delete('/:gameId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;
