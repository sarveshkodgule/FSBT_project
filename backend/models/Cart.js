// Experiment 3: Connecting to MongoDB - Cart Model
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: Number,
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Recalculate total before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
