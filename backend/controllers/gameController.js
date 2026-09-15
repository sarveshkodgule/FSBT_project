// Experiment 4: Building RESTful APIs - Game Controller
const Game = require('../models/Game');

// @desc    Get all games with filter, search, pagination
// @route   GET /api/games
// @access  Public
const getGames = async (req, res) => {
  try {
    const { search, genre, platform, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Genre filter
    if (genre) query.genre = genre;

    // Platform filter
    if (platform) query.platform = { $in: [platform] };

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') query.featured = true;

    // Sorting options
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const total = await Game.countDocuments(query);
    const games = await Game.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      games,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single game by ID
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game || !game.isActive) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured games
// @route   GET /api/games/featured
// @access  Public
const getFeaturedGames = async (req, res) => {
  try {
    const games = await Game.find({ featured: true, isActive: true }).limit(6);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get games by genre
// @route   GET /api/games/genre/:genre
// @access  Public
const getGamesByGenre = async (req, res) => {
  try {
    const games = await Game.find({ genre: req.params.genre, isActive: true });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new game (Admin)
// @route   POST /api/games
// @access  Private/Admin
const createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a game (Admin)
// @route   PUT /api/games/:id
// @access  Private/Admin
const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a game (Admin - soft delete)
// @route   DELETE /api/games/:id
// @access  Private/Admin
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all genres list
// @route   GET /api/games/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await Game.distinct('genre');
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGames,
  getGameById,
  getFeaturedGames,
  getGamesByGenre,
  createGame,
  updateGame,
  deleteGame,
  getGenres,
};
