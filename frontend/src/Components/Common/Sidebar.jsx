// src/Components/Common/Sidebar.jsx
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

import { navigationItems } from "../../config/navigation";
import './navbar.css'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleSidebar}
      />

      <aside className="fixed left-0 w-64 bg-white shadow-md h-screen pt-16 z-50">
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <span id="sidebar-logo" className="text-blue-600 text-xl font-bold ml-2 md:ml-0">
              MindfulConnect
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={toggleSidebar}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${
                    location.pathname === path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Version info */}
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500">MindfulConnect v1.0</div>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
