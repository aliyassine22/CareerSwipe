import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SeekerSideNav from './SeekerSideNav';

export default function SeekerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SeekerSideNav />

        {/* Page Content */}
        <div className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
