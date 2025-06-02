import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon, BellIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [notifications, setNotifications] = useState(false);

  const handleNotificationChange = async () => {
    if (!notifications && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotifications(true);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    } else {
      setNotifications(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Theme Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {darkMode ? (
                <MoonIcon className="h-6 w-6 text-gray-400" />
              ) : (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              )}
              <div>
                <h2 className="text-lg font-semibold dark:text-white">Dark Mode</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle between light and dark theme
                </p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              className={`${darkMode ? 'bg-blue-600' : 'bg-gray-200'}
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${darkMode ? 'translate-x-6' : 'translate-x-1'}
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>

        {/* Units Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BeakerIcon className="h-6 w-6 text-blue-500" />
              <div>
                <h2 className="text-lg font-semibold dark:text-white">Temperature Unit</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred temperature unit
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setUnits('metric')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  units === 'metric'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Celsius
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  units === 'imperial'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Fahrenheit
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BellIcon className="h-6 w-6 text-yellow-500" />
              <div>
                <h2 className="text-lg font-semibold dark:text-white">Weather Alerts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified about severe weather conditions
                </p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onChange={handleNotificationChange}
              className={`${notifications ? 'bg-blue-600' : 'bg-gray-200'}
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span className="sr-only">Toggle notifications</span>
              <span
                className={`${notifications ? 'translate-x-6' : 'translate-x-1'}
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;