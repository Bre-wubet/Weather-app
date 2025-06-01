import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const WeatherCard = ({ data, onToggleFavorite, isFavorite }) => {
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {data.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{data.weather[0].description}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <HeartIconSolid className="h-6 w-6 text-red-500" />
          ) : (
            <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.main.temp)}°C
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Feels like {Math.round(data.main.feels_like)}°C
            </p>
          </div>
          <div className="text-right">
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
              className="w-20 h-20"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Humidity</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {data.main.humidity}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Wind Speed</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {data.wind.speed} m/s
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pressure</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {data.main.pressure} hPa
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Visibility</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {(data.visibility / 1000).toFixed(1)} km
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 