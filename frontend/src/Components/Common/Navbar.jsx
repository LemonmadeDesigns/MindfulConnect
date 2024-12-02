// src/Components/Common/Navbar.jsx
import PropTypes from 'prop-types';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { navigationItems } from '../../config/navigation';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side with logo and navigation */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <span className="text-blue-600 text-xl font-bold ml-2 md:ml-0">MindfulConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-8 space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side user info */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.username || user?.email?.split('@')[0] || 'User'}
            </span>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};

export default Navbar;