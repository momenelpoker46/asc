import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Sun, Moon, Bell } from 'lucide-react';

const AdminHeader = ({ title }) => {
  const { darkMode, toggleDarkMode, user } = useAuth();
  
  return (
    <header className="bg-secondary-900/50 backdrop-blur-sm sticky top-0 z-10 p-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">{title}</h1>

      <div className="flex items-center space-x-6 space-x-reverse">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="بحث..."
            className="bg-secondary-800 border border-secondary-700 text-white placeholder-secondary-400 rounded-lg py-2 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-secondary-800 hover:bg-secondary-700 text-secondary-300 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          <button className="relative p-2 rounded-full bg-secondary-800 hover:bg-secondary-700 text-secondary-300 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
            {user?.firstName?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-semibold">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</div>
            <div className="text-xs text-secondary-400">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
