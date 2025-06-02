import express from 'express';
import {
  getWeatherByCoords,
  getWeatherByCity,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getSearchHistory
} from '../controllers/weatherController.js';

const router = express.Router();

// Weather routes
router.get('/coords', getWeatherByCoords);
router.get('/city', getWeatherByCity);

// Favorites routes
router.post('/favorites', addToFavorites);
router.delete('/favorites', removeFromFavorites);
router.get('/favorites/:userId', getFavorites);

// Search history routes
router.get('/history/:userId', getSearchHistory);

export default router;