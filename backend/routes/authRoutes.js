// Experiment 2: Express.js Routing
// Experiment 6: User Authentication and Authorization
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/wishlist/:gameId', protect, toggleWishlist);

module.exports = router;
