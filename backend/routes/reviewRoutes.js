// Experiment 4: Building RESTful APIs - Review Routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addReview,
  getGameReviews,
  updateReview,
  deleteReview,
  markHelpful,
} = require('../controllers/reviewController');

router.post('/:gameId', protect, addReview);
router.get('/:gameId', getGameReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);
router.put('/:reviewId/helpful', protect, markHelpful);

module.exports = router;
