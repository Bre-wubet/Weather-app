import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';

// Pages
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

// Components
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <ThemeProvider>
          <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
          </Router>
        </ThemeProvider>
      </WeatherProvider>
    </QueryClientProvider>
  );
}

export default App;
