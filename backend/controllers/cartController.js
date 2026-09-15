// Experiment 4: Building RESTful APIs - Cart Controller
const Cart = require('../models/Cart');
const Game = require('../models/Game');

// Helper: get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.game', 'title image price discountPrice stock');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { gameId, quantity = 1 } = req.body;

    const game = await Game.findById(gameId);
    if (!game || !game.isActive) {
      return res.status(404).json({ message: 'Game not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.game.toString() === gameId
    );

    const price = game.discountPrice > 0 ? game.discountPrice : game.price;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ game: gameId, quantity, price });
    }

    await cart.save();
    const populated = await cart.populate('items.game', 'title image price discountPrice');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:gameId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.game.toString() === req.params.gameId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const populated = await cart.populate('items.game', 'title image price discountPrice');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:gameId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.game.toString() !== req.params.gameId
    );

    await cart.save();
    const populated = await cart.populate('items.game', 'title image price discountPrice');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear the cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 }
    );
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
