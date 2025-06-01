import { useQuery } from 'react-query';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';

const Favorites = () => {
  // Fetch favorites from API
  const { data: favorites, isLoading, error } = useQuery(
    'favorites',
    async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/favorites`);
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading favorites. Please try again later.</p>
      </div>
    );
  }

  if (!favorites?.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Favorites Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Add locations to your favorites to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Favorite Locations
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        {favorites.map((favorite) => (
          <WeatherCard
            key={favorite._id}
            data={favorite.weatherData}
            isFavorite={true}
            onToggleFavorite={() => {/* Handle remove from favorites */}}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites; 