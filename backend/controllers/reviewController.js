// Experiment 4: Building RESTful APIs - Review Controller
const Review = require('../models/Review');
const Game = require('../models/Game');

// @desc    Add a review for a game
// @route   POST /api/reviews/:gameId
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, title, body } = req.body;
    const gameId = req.params.gameId;

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user._id, game: gameId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this game' });
    }

    const review = await Review.create({
      user: req.user._id,
      game: gameId,
      rating,
      title,
      body,
    });

    // Update game's average rating
    const reviews = await Review.find({ game: gameId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    game.rating = Math.round(avgRating * 10) / 10;
    game.numReviews = reviews.length;
    await game.save();

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a game
// @route   GET /api/reviews/:gameId
// @access  Public
const getGameReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = req.body.rating || review.rating;
    review.title = req.body.title || review.title;
    review.body = req.body.body || review.body;
    await review.save();

    // Recalculate game rating
    const reviews = await Review.find({ game: review.game });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Game.findByIdAndUpdate(review.game, {
      rating: Math.round(avgRating * 10) / 10,
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();

    // Recalculate game rating
    const reviews = await Review.find({ game: review.game });
    const avgRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;
    await Game.findByIdAndUpdate(review.game, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a review as helpful
// @route   PUT /api/reviews/:reviewId/helpful
// @access  Private
const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getGameReviews, updateReview, deleteReview, markHelpful };
