// Experiment 4: Building RESTful APIs - Game Routes
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getGames,
  getGameById,
  getFeaturedGames,
  getGamesByGenre,
  createGame,
  updateGame,
  deleteGame,
  getGenres,
} = require('../controllers/gameController');

router.get('/featured', getFeaturedGames);
router.get('/genres', getGenres);
router.get('/genre/:genre', getGamesByGenre);
router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', protect, adminOnly, createGame);
router.put('/:id', protect, adminOnly, updateGame);
router.delete('/:id', protect, adminOnly, deleteGame);

module.exports = router;
