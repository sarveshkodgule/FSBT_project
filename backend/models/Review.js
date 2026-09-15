// Experiment 3: Connecting to MongoDB - Review Model
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// One review per user per game
reviewSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
