import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartBar, faUsers, faNewspaper, faCog } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch statistics
        const [usersRes, companiesRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:4000/seeker/total-users', config),
          axios.get('http://localhost:4000/company/total-companies', config),
          axios.get('http://localhost:4000/company/total-jobs', config)
        ]);

        setStats({
          totalUsers: usersRes.data.total,
          totalCompanies: companiesRes.data.total,
          totalJobs: jobsRes.data.total,
          activeJobs: jobsRes.data.active
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
              <FontAwesomeIcon icon={faChartBar} className="mr-3" />
              Dashboard
            </a>
            <a href="#users" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
              <FontAwesomeIcon icon={faUsers} className="mr-3" />
              Users
            </a>
            <a href="#companies" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
              <FontAwesomeIcon icon={faBriefcase} className="mr-3" />
              Companies
            </a>
            <a href="#jobs" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
              <FontAwesomeIcon icon={faNewspaper} className="mr-3" />
              Jobs
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-red-500 hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faCog} className="mr-3" />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <FontAwesomeIcon icon={faUser} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Companies</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalCompanies}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FontAwesomeIcon icon={faBriefcase} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FontAwesomeIcon icon={faNewspaper} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.activeJobs}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FontAwesomeIcon icon={faChartBar} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add recent activity cards here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
