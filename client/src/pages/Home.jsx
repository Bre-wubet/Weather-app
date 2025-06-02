import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';
import { WiDaySunny, WiNightClear, WiRain, WiSnow, WiCloudy, WiThunderstorm } from 'react-icons/wi';
import toast from 'react-hot-toast';

const weatherIcons = {
  '01d': WiDaySunny,
  '01n': WiNightClear,
  '02d': WiCloudy,
  '02n': WiCloudy,
  '03d': WiCloudy,
  '03n': WiCloudy,
  '04d': WiCloudy,
  '04n': WiCloudy,
  '09d': WiRain,
  '09n': WiRain,
  '10d': WiRain,
  '10n': WiRain,
  '11d': WiThunderstorm,
  '11n': WiThunderstorm,
  '13d': WiSnow,
  '13n': WiSnow,
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    weatherData,
    isWeatherLoading: isLoading,
    weatherError: error,
    getCurrentLocation,
    searchCity,
    addToFavorites
  } = useWeather();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      await searchCity(searchQuery);
      toast.success(`Weather data loaded for ${searchQuery}`);
      setSearchQuery('');
    } catch (error) {
      toast.error('Error fetching weather data');
    }
  };

  const handleAddToFavorites = async () => {
    if (!weatherData?.current) return;
    try {
      await addToFavorites.mutateAsync({
        cityName: weatherData.current.name,
        lat: weatherData.current.coord.lat,
        lon: weatherData.current.coord.lon
      });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error('Error adding to favorites');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search for a city..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Use My Location
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p>Error loading weather data. Please try again.</p>
        </div>
      )}

      {weatherData?.current && (
        <div className="space-y-8">
          {/* Current Weather */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold dark:text-white">{weatherData.current.name}</h2>
              <button
                onClick={handleAddToFavorites}
                className="text-blue-500 hover:text-blue-600"
              >
                Add to Favorites
              </button>
            </div>
            <div className="flex items-center gap-4">
              {weatherData.current.weather[0].icon && (
                <div className="text-6xl text-gray-700 dark:text-gray-300">
                  {React.createElement(
                    weatherIcons[weatherData.current.weather[0].icon] || WiDaySunny
                  )}
                </div>
              )}
              <div>
                <p className="text-4xl font-bold dark:text-white">
                  {Math.round(weatherData.current.main.temp)}°C
                </p>
                <p className="text-gray-500 dark:text-gray-400 capitalize">
                  {weatherData.current.weather[0].description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Feels Like</p>
                <p className="text-xl dark:text-white">{Math.round(weatherData.current.main.feels_like)}°C</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Humidity</p>
                <p className="text-xl dark:text-white">{weatherData.current.main.humidity}%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Wind</p>
                <p className="text-xl dark:text-white">{Math.round(weatherData.current.wind.speed)} m/s</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Pressure</p>
                <p className="text-xl dark:text-white">{weatherData.current.main.pressure} hPa</p>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          {weatherData.forecast && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 dark:text-white">7-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <p className="font-medium dark:text-white">
                      {format(new Date(day.dt * 1000), 'EEE')}
                    </p>
                    {day.weather[0].icon && (
                      <div className="text-3xl mx-auto my-2 text-gray-700 dark:text-gray-300">
                        {React.createElement(
                          weatherIcons[day.weather[0].icon] || WiDaySunny
                        )}
                      </div>
                    )}
                    <p className="font-bold dark:text-white">{Math.round(day.temp.max)}°C</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {Math.round(day.temp.min)}°C
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;