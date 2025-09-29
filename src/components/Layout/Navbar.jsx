import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Home,
  BookOpen,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              حلهالي
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link 
              to="/" 
              className="flex items-center space-x-2 space-x-reverse text-secondary-700 hover:text-primary-600 transition-colors dark:text-secondary-300 dark:hover:text-primary-400"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            
            {user && user.role === 'student' && (
              <>
                <Link 
                  to="/exams" 
                  className="flex items-center space-x-2 space-x-reverse text-secondary-700 hover:text-primary-600 transition-colors dark:text-secondary-300 dark:hover:text-primary-400"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>الامتحانات</span>
                </Link>
                
                <Link 
                  to="/account" 
                  className="flex items-center space-x-2 space-x-reverse text-secondary-700 hover:text-primary-600 transition-colors dark:text-secondary-300 dark:hover:text-primary-400"
                >
                  <User className="w-4 h-4" />
                  <span>حسابي</span>
                </Link>
              </>
            )}
            
            <Link 
              to="/pricing" 
              className="flex items-center space-x-2 space-x-reverse text-secondary-700 hover:text-primary-600 transition-colors dark:text-secondary-300 dark:hover:text-primary-400"
            >
              <CreditCard className="w-4 h-4" />
              <span>الأسعار</span>
            </Link>

            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 space-x-reverse text-green-600 hover:text-green-700 transition-colors dark:text-green-400 dark:hover:text-green-300 font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-secondary-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-secondary-700 dark:text-secondary-300">
                  مرحباً، {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 space-x-reverse bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link
                  to="/login"
                  className="text-secondary-700 hover:text-primary-600 transition-colors dark:text-secondary-300 dark:hover:text-primary-400"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
