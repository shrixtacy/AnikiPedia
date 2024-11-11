import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, User, Zap } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-blue-600 text-white py-4 comic-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick} 
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
            <Link 
              to="/" 
              className="text-3xl font-title flex items-center gap-2 hover:text-yellow-400 transition-colors"
            >
              <Zap className="w-8 h-8" />
              <span className="animate-float">Anikipedia</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/search" 
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={24} />
            </Link>
            <Link 
              to="/profile" 
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Profile"
            >
              <User size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;