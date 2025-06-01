import express from 'express';
import { getWeatherByCoords, getWeatherByCity } from '../controllers/weatherController.js';

const router = express.Router();

// Get weather by coordinates
router.get('/coords', getWeatherByCoords);

// Get weather by city name
router.get('/city', getWeatherByCity);

export default router; 