import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const { data: weatherData, isLoading: isWeatherLoading, error: weatherError } = useQuery({
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
  });

  // Get weather by city name
  const searchCity = async (city) => {
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
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
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