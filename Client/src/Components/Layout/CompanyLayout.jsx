import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import CompanySideNav from './CompanySideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function CompanyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button 
          className="md:hidden fixed z-10 bottom-4 right-4 p-2 rounded-full bg-indigo-600 text-white shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Sidebar - hidden on mobile unless toggled, always visible on larger screens */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block flex-shrink-0`}>
          <CompanySideNav />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
