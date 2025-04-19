import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">CareerSwipe</Link>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Find your perfect match</span>
          </div>
        </div>
      </div>
    </header>
  );
}
