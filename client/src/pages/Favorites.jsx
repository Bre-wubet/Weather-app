import { useWeather } from '../context/WeatherContext';
import { WiDaySunny } from 'react-icons/wi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Favorites = () => {
  const {
    favorites,
    isFavoritesLoading: isLoading,
    removeFromFavorites,
    setLocation
  } = useWeather();

  const handleRemove = async (cityName) => {
    try {
      await removeFromFavorites.mutateAsync(cityName);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Error removing from favorites');
    }
  };

  const handleSelect = (lat, lon) => {
    setLocation({ lat, lon });
    toast.success('Loading weather data...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Favorite Locations</h1>

      {!favorites?.length ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <WiDaySunny className="text-6xl mx-auto mb-4" />
          <p>No favorite locations yet. Add some from the home page!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <motion.div
              key={favorite.cityName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold dark:text-white">
                  {favorite.cityName}
                </h2>
                <button
                  onClick={() => handleRemove(favorite.cityName)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <p>Lat: {favorite.lat.toFixed(2)}°</p>
                  <p>Lon: {favorite.lon.toFixed(2)}°</p>
                </div>
                <button
                  onClick={() => handleSelect(favorite.lat, favorite.lon)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Weather
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;