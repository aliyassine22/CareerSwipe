import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="w-full px-0">
        <div className="flex justify-between h-16 items-center">
          {/* Left aligned logo that will appear above sidebar */}
          <div className="flex items-center pl-4 w-64 border-r border-gray-300">
            <Link to="/" className="text-xl font-bold text-indigo-600">CareerSwipe</Link>
          </div>
          {/* Right side content */}
          <div className="flex-1 flex justify-end pr-4">
            <span className="text-sm text-gray-500">Find your perfect match</span>
          </div>
        </div>
      </div>
    </header>
  );
}
