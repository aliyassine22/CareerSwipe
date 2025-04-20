import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const AdminInitializer = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const initializeAdmin = async () => {
    try {
      setLoading(true);
      setMessage('');
      setStatus('');

      const response = await axios.post('http://localhost:4000/admin/initialize', {});
      
      if (response.data.message === 'Admin initialization completed') {
        setStatus('success');
        setMessage('Admin user created successfully!');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Failed to create admin user');
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faUserShield} 
            className="mx-auto h-12 w-12 text-indigo-600"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Initialize Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create the initial admin account for the system
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            status === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <div className="flex items-center">
              <FontAwesomeIcon 
                icon={status === 'success' ? faCheckCircle : faExclamationCircle} 
                className={`mr-3 ${
                  status === 'success' ? 'text-green-600' : 'text-red-600'
                }`} 
              />
              <span>{message}</span>
            </div>
          </div>
        )}

        <button
          onClick={initializeAdmin}
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
            loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Initializing...' : 'Create Admin Account'}
        </button>
      </div>
    </div>
  );
};

export default AdminInitializer;
