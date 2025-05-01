import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session status on component mount
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/auth/status', { withCredentials: true });
        if (response.data.authenticated) {
          setIsLoggedIn(true);
          
          // Update localStorage if needed
          if (!localStorage.getItem('userId') || !localStorage.getItem('userType')) {
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userType', response.data.userType);
          }
        } else {
          // Clear localStorage and state if not authenticated
          setIsLoggedIn(false);
          localStorage.removeItem('userId');
          localStorage.removeItem('userType');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
      }
    };
    
    checkAuthStatus();
    
    // Set up interval to periodically check authentication status
    const intervalId = setInterval(checkAuthStatus, 60000); // Check every minute
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/auth/logout', {}, { withCredentials: true });
      
      // Clear localStorage items
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      
      // Update local state
      setIsLoggedIn(false);
      
      // Redirect to home page with a forced refresh
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-b from-white to-gray-100 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-600">CareerSwipe</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center gap-8">
        <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
          About Us
        </Link>
        <Link to="/who-we-are" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
          Who We Are
        </Link>
        {/* <Link to="/Register" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
          Register
        </Link> */}
      </nav>

      {/* User Icon and Logout (only shown when logged in) */}
      <div>
        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <Link to="/seeker/profile" className="text-indigo-600 text-3xl">
              <FaUserCircle />
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
