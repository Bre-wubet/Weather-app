import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);

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

  // Weather data fetch
  const { data: weatherData, isLoading, error } = useQuery(
    ['weather', location],
    async () => {
      if (!location) return null;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/weather`, {
        params: {
          lat: location.lat,
          lon: location.lon
        }
      });
      return response.data;
    },
    {
      enabled: !!location
    }
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search for a city..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Use My Location
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500">
          <p>Error loading weather data. Please try again.</p>
        </div>
      )}

      {weatherData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Current Weather</h2>
          {/* Weather data display will go here */}
        </div>
      )}
    </div>
  );
};

export default Home; 