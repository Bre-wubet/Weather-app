import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';

// Pages
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
                  {/* Public routes */}
                  <Route path="/" element={ <Home />   } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  
                  {/* Protected routes */}
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
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
