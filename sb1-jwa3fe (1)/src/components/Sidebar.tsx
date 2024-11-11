import React from 'react';
import { Link } from 'react-router-dom';
import { X, Search, Calendar, List, BookOpen, Zap } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Calendar, label: 'Upcoming Anime', path: '/upcoming' },
    { icon: List, label: 'Categories', path: '/categories' },
    { icon: BookOpen, label: 'Watchlist', path: '/watchlist' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-out z-50 comic-border border-l-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-title">Menu</span>
            </Link>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li 
                  key={item.path}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-float"
                >
                  <Link 
                    to={item.path} 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;