import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check session status on component mount
    axios
      .get('http://localhost:4000/check-session', { withCredentials: true })
      .then((response) => setIsLoggedIn(response.data.success))
      .catch(() => setIsLoggedIn(false));
  }, []);

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

      {/* Login or User Icon */}
      <div>
        {isLoggedIn ? (
          <Link to="/seeker/profile">
            <FaUserCircle className="text-indigo-600 text-3xl" />
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-full hover:bg-indigo-700 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
