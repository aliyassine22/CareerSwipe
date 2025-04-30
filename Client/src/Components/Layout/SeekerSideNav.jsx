import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSyncAlt, 
  faBookmark, 
  faHistory, 
  faCommentDots, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function SeekerSideNav() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('http://localhost:4000/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-gray-100 h-full min-h-screen w-64 border-r border-gray-300">
      <div className="px-4 py-6">
        <div className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Job Seeker Dashboard
        </div>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/seeker/profile"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seeker/swipe"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
              Swipe Jobs
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/seeker/saved-jobs"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faBookmark} className="mr-2" />
              Saved Jobs
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/seeker/history"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              Application History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seeker/messages"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              Messages
            </NavLink>
          </li>
        </ul>
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
