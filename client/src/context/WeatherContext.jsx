import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:5000/api/weather';

export const WeatherProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const queryClient = useQueryClient();

  // Get weather by coordinates
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError
  } = useQuery({
    queryKey: ['weather', location?.lat, location?.lon],
    queryFn: async () => {
      if (!location) return null;
      const { data } = await axios.get(`${API_BASE_URL}/coords`, {
        params: {
          lat: location.lat,
          lon: location.lon,
          userId: localStorage.getItem('userId')
        }
      });
      return data;
    },
    enabled: !!location,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Weather fetch error:', error);
      toast.error(error.response?.data?.message || 'Error loading weather data');
    }
  });

  // Get weather by city name
  const searchCity = async (city) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/city`, {
        params: {
          city,
          userId: localStorage.getItem('userId')
        }
      });
      setLocation({
        lat: data.coord.lat,
        lon: data.coord.lon
      });
      return data;
    } catch (error) {
      console.error('City search error:', error);
      throw error;
    }
  };

  // Add to favorites
  const addToFavorites = useMutation({
    mutationFn: async ({ cityName, lat, lon }) => {
      const { data } = await axios.post(`${API_BASE_URL}/favorites`, {
        userId: localStorage.getItem('userId'),
        cityName,
        lat,
        lon
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    }
  });

  // Remove from favorites
  const removeFromFavorites = useMutation({
    mutationFn: async (cityName) => {
      const { data } = await axios.delete(`${API_BASE_URL}/favorites`, {
        data: {
          userId: localStorage.getItem('userId'),
          cityName
        }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    }
  });

  // Get favorites
  const { data: favorites, isLoading: isFavoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return [];
      const { data } = await axios.get(`${API_BASE_URL}/favorites/${userId}`);
      return data;
    }
  });

  // Get search history
  const { data: searchHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return [];
      const { data } = await axios.get(`${API_BASE_URL}/history/${userId}`);
      return data;
    }
  });

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          toast.success('Location detected successfully');
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Error detecting location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please allow location access to get local weather';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
          }
          toast.error(errorMessage);
        }
      );
    } else {
      const message = 'Geolocation is not supported by your browser';
      console.error(message);
      toast.error(message);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        isWeatherLoading,
        weatherError,
        location,
        setLocation,
        getCurrentLocation,
        searchCity,
        favorites,
        isFavoritesLoading,
        addToFavorites,
        removeFromFavorites,
        searchHistory,
        isHistoryLoading
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
