// Experiment 3: Connecting to MongoDB - Game Model
// Experiment 4: Building RESTful APIs
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        'Action', 'Adventure', 'RPG', 'Strategy', 'Sports',
        'Racing', 'Simulation', 'Horror', 'Puzzle', 'Fighting',
        'Shooter', 'Platformer', 'Sandbox', 'MMO', 'Battle Royale'
      ],
    },
    platform: [
      {
        type: String,
        enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
      },
    ],
    developer: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    image: {
      type: String,
      default: '',
    },
    trailer: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 100,
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index for search
gameSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Game', gameSchema);
