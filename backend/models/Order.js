// Experiment 3: Connecting to MongoDB - Order Model
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  title: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'cod', 'wallet'],
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
