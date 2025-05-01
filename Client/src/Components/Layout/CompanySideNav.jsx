import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faBriefcase,
  faListAlt,
  faUsers,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function CompanySideNav() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('http://localhost:4000/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Clear localStorage items
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      
      // Use window.location for a full refresh to ensure proper state reset
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-gray-100 h-full w-64 border-r border-gray-300 flex flex-col sticky top-0">
      <div className="px-4 py-6 flex-grow overflow-y-auto">
        {/* Sidebar Header */}
        <div className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Company Dashboard
        </div>

        {/* Navigation Links */}
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/company/profile"
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              Company Details
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/company/create-job"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
              Create Job Posting
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/company/manage-jobs"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faListAlt} className="mr-2" />
              Manage Job Postings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/company/applicants"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Applicants
            </NavLink>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          className="mt-6 flex items-center px-3 py-2 w-full rounded-md bg-red-100 text-red-600 hover:bg-red-200 text-sm font-medium"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
