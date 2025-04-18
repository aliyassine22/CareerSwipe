import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/who-we-are" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Who We Are
            </Link>
            <Link to="/Register" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Register
            </Link>
            <Link to="/Login" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
