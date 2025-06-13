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

    // 1. Get current weather (including coordinates)
    const currentWeatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const { coord, name } = currentWeatherResponse.data;

    // 2. Get 5-day forecast (3-hour intervals)
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: coord.lat,
        lon: coord.lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    // 3. Convert 3-hour forecasts into daily summaries (e.g. daily max/min)
    const dailyForecast = [];

    const forecastMap = {};

    forecastResponse.data.list.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0]; // Get date only
      if (!forecastMap[date]) {
        forecastMap[date] = [];
      }
      forecastMap[date].push(entry);
    });

    for (const [date, entries] of Object.entries(forecastMap)) {
      const temps = entries.map(e => e.main.temp);
      dailyForecast.push({
        date,
        min: Math.min(...temps),
        max: Math.max(...temps),
        weather: entries[0].weather[0], // Use first entry's weather info
      });
    }

    // Optional: Limit to next 5 days
    const trimmedForecast = dailyForecast.slice(0, 5);

    // 4. Save to search history if userId is provided
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
        console.error('Error saving to search history:', error.message);
      }
    }

    // 5. Send response
    res.json({
      current: currentWeatherResponse.data,
      forecast: trimmedForecast
    });

  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);

    const apiMessage = error.response?.data?.message;
    const status = error.response?.status || 500;

    if (status === 404) {
      return res.status(404).json({ message: 'City not found. Please check the spelling.' });
    }

    if (status === 401) {
      return res.status(401).json({ message: 'Invalid API key. Please check your .env file.' });
    }

    res.status(status).json({
      message: `Weather API error: ${apiMessage || 'Unknown error'}`
    });
  }
};


export const addToFavorites = async (req, res) => {
  try {
    const { userId, cityName, lat, lon } = req.body;
    console.log('Received addToFavorites request:', { userId, cityName, lat, lon });

    if (!userId || !cityName || !lat || !lon) {
      console.log('Missing required fields:', { userId, cityName, lat, lon });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
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

    console.log('Successfully added to favorites:', updatedUser.favorites);
    res.json(updatedUser.favorites);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding to favorites: ' + error.message });
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