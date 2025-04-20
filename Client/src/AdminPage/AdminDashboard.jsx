// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faUsers,
  faBriefcase,
  faClipboardList,
  faGraduationCap,
  faChartPie,
  faMapMarkerAlt,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';



const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const [uRes, cRes, jRes] = await Promise.all([
          axios.get('http://localhost:4000/seeker/total-users', config),
          axios.get('http://localhost:4000/company/stats', config),
          axios.get('http://localhost:4000/company/jobs/total-jobs', config)
        ]);

        setUserStats(uRes.data.data);
        setCompanyStats(cRes.data.data);
        setJobStats(jRes.data.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl">Loading dashboard…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  // handy renderers
  const renderStatCard = (icon, label, value, bg = 'bg-white') => (
    <div className={`${bg} p-4 rounded-lg shadow flex items-center`}>
      <div className="p-3 bg-indigo-50 rounded-full mr-4">
        <FontAwesomeIcon icon={icon} className="text-indigo-600" />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );

  const renderListStats = (dataArray, labelKey = '_id', valueKey = 'count') => (
    <ul className="list-disc list-inside space-y-1">
      {dataArray.map((item, i) => (
        <li key={i}>
          <strong>{item[labelKey] ?? '—'}:</strong> {item[valueKey]}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
          <nav className="space-y-4">
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center text-gray-700 hover:text-indigo-600"
            >
              <FontAwesomeIcon icon={faChartPie} className="mr-3" />
              Overview
            </button>
            <button
              onClick={() => document.getElementById('users').scrollIntoView()}
              className="flex items-center text-gray-700 hover:text-indigo-600"
            >
              <FontAwesomeIcon icon={faUsers} className="mr-3" />
              Users
            </button>
            <button
              onClick={() => document.getElementById('companies').scrollIntoView()}
              className="flex items-center text-gray-700 hover:text-indigo-600"
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-3" />
              Companies
            </button>
            <button
              onClick={() => document.getElementById('jobs').scrollIntoView()}
              className="flex items-center text-gray-700 hover:text-indigo-600"
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
              Jobs
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-700 mt-8"
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Summary */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderStatCard(faUsers,      'Total Users',            userStats.totalUsers)}
            {renderStatCard(faBriefcase,  'Total Companies',        companyStats.totalCompanies)}
            {renderStatCard(faClipboardList, 'Total Jobs',           jobStats.totalJobs)}
            {renderStatCard(faChartBar,   'Active Jobs',            jobStats.activeJobs, 'bg-yellow-50')}
            {renderStatCard(faChartPie,   'Closed Jobs',            jobStats.closedJobs, 'bg-red-50')}
            {renderStatCard(faUser,       'Avg Interactions/User',  userStats.avgInteractionsPerUser)}
            {renderStatCard(faBriefcase,  'Avg Jobs/Company',       companyStats.avgJobsPerCompany)}
          </div>
        </section>

        {/* User Stats */}
        <section id="users" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">User Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Education Levels
              </h4>
              {renderListStats(userStats.educationStats)}
            </div>
            {/* Experience Breakdown Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Experience Breakdown
              </h4>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={userStats.experienceStats}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Locations
              </h4>
              {renderListStats(userStats.locationStats)}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                Job Preferences
              </h4>
              {renderListStats(userStats.jobPreferenceStats)}
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section id="companies" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Company Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
   {/* Industry Breakdown Chart */}
<div className="bg-white p-6 rounded-lg shadow">
  <h4 className="font-medium mb-2 flex items-center">
    <FontAwesomeIcon icon={faChartBar} className="mr-2" />
    Industry Breakdown
  </h4>

  <ResponsiveContainer width="100%" height={250}>
    <BarChart
      data={companyStats.industryStats}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" name="Companies" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
</div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                Company Sizes
              </h4>
              {renderListStats(companyStats.sizeStats)}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Employment Types
              </h4>
              {renderListStats(companyStats.employmentTypeStats, '_id')}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Locations
              </h4>
              {renderListStats(companyStats.locationStats)}
            </div>
          </div>
        </section>

        {/* Job Stats */}
        <section id="jobs" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Job Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Type Breakdown Chart */}
<div className="bg-white p-6 rounded-lg shadow">
  <h4 className="font-medium mb-2 flex items-center">
    <FontAwesomeIcon icon={faChartBar} className="mr-2" />
    Job Types
  </h4>

  <ResponsiveContainer width="100%" height={250}>
    <BarChart
      data={jobStats.employmentTypeStats}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" name="Jobs" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
</div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                Experience Levels
              </h4>
              {renderListStats(jobStats.experienceLevelStats)}
            </div>
          </div>
        </section> 
      </main>
    </div>
  );
};

export default AdminDashboard;
