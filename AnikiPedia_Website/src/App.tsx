import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import UpcomingPage from './pages/UpcomingPage';
import CategoriesPage from './pages/CategoriesPage';
import { Zap } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-comic">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/upcoming" element={<UpcomingPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
          </main>
          <footer className="bg-blue-600 text-white py-4 text-center comic-border">
            <p className="flex items-center justify-center font-title text-xl">
              <Zap className="mr-2" /> Anime Encyclopedia © 2023
            </p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;