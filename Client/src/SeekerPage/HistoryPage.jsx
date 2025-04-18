import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faClock } from '@fortawesome/free-solid-svg-icons';

const HistoryPage = () => {
  const [history, setHistory] = useState({ likes: [], passes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:4000/seeker/history/${userId}`);
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load your interaction history. Please try again later.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading your interaction history...</div>
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

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">Interaction History</h1>

      {/* Likes Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faThumbsUp} className="mr-2 text-green-500" />
          Liked Jobs
        </h2>
        {history.likes.length > 0 ? (
          <div className="space-y-4">
            {history.likes.map((interaction, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {interaction.jobId.title}
                    </h3>
                    <p className="text-gray-600">{interaction.jobId.company}</p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faThumbsUp} className="text-green-500 mr-2" />
                    <span className="text-gray-600">Liked</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  {interaction.jobId.description.substring(0, 150)}...
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/job/${interaction.jobId._id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon={faClock} className="text-4xl mb-4 text-gray-300" />
            <p>No liked jobs yet</p>
          </div>
        )}
      </div>

      {/* Passes Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faThumbsDown} className="mr-2 text-red-500" />
          Passed Jobs
        </h2>
        {history.passes.length > 0 ? (
          <div className="space-y-4">
            {history.passes.map((interaction, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {interaction.jobId.title}
                    </h3>
                    <p className="text-gray-600">{interaction.jobId.company}</p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 mr-2" />
                    <span className="text-gray-600">Passed</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  {interaction.jobId.description.substring(0, 150)}...
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon={faClock} className="text-4xl mb-4 text-gray-300" />
            <p>No passed jobs yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
