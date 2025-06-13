import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon, userId } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    if (!OPENWEATHER_API_KEY) {
      console.error('OpenWeather API key is not configured');
      return res.status(500).json({ message: 'Weather service is not properly configured' });
    }

    // 1. Fetch current weather
    const currentWeather = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    // 2. Fetch 5-day forecast (every 3 hours)
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    // 3. Extract one forecast per day (preferably around midday)
    const forecastList = forecastResponse.data.list;
    const dailyForecast = [];
    const seenDates = new Set();

    for (const item of forecastList) {
      const date = item.dt_txt.split(' ')[0];
      if (!seenDates.has(date) && item.dt_txt.includes('12:00:00')) {
        dailyForecast.push(item);
        seenDates.add(date);
      }
    }

    // 4. Save search history if userId is provided
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          $push: {
            searchHistory: {
              query: `${lat},${lon}`,
              timestamp: new Date()
            }
          }
        });
      } catch (error) {
        console.error('Error saving to search history:', error);
      }
    }

    // 5. Return data
    res.json({
      current: currentWeather.data,
      forecast: dailyForecast.slice(0, 5) // Return next 5 days
    });

  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);

    if (error.response?.data?.cod === '429') {
      return res.status(429).json({ message: 'Too many requests to weather service' });
    }

    if (error.response?.data?.cod === '401') {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    res.status(500).json({ message: 'Error connecting to weather service. Please try again later.' });
  }
};


export const getWeatherByCity = async (req, res) => {
  try {
    const { city, userId } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // Get coordinates first
    const cityData = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const { lat, lon } = cityData.data.coord;

    // Get forecast using coordinates
    const forecast = await axios.get(ONE_CALL_URL, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        exclude: 'minutely,hourly'
      }
    });

    // Save to search history if userId is provided
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          $push: {
            searchHistory: {
              query: city,
              timestamp: new Date()
            }
          }
        });
      } catch (error) {
        console.error('Error saving to search history:', error);
      }
    }

    res.json({
      current: cityData.data,
      forecast: forecast.data.daily.slice(0, 7)
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    
    if (error.response?.data?.cod === '429') {
      return res.status(429).json({ message: 'Too many requests to weather service' });
    }
    
    if (error.response?.data?.cod === '401') {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    if (error.response?.data?.message) {
      return res.status(error.response.status || 500).json({ 
        message: `Weather API error: ${error.response.data.message}` 
      });
    }

    // For network errors or other issues
    res.status(500).json({ 
      message: 'Error connecting to weather service. Please try again later.' 
    });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    const { userId, cityName, lat, lon } = req.body;

    if (!userId || !cityName || !lat || !lon) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          favorites: {
            cityName,
            lat,
            lon,
            addedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json(user.favorites);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { userId, cityName } = req.body;

    if (!userId || !cityName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favorites: { cityName }
        }
      },
      { new: true }
    );

    res.json(user.favorites);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.searchHistory);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Error fetching search history' });
  }
};