import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:4000/company/applicants',
          { withCredentials: true }
        );
        console.log('Applicants API response:', data);
        if (data.success) {
          setApplicants(data.applicants);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast.error('Failed to load applicants');
      }
    };

    fetchApplicants();
  }, []);

  const viewCV = async (applicant) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/seeker/cv/${applicant.userId._id}`,
        { withCredentials: true, responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${applicant.userId._id}-cv.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Applicants</h2>
      {applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((app) => (
            <div key={app._id} className="bg-white shadow-md rounded-lg p-5 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-500 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-4">
                  {app.userId.firstName.charAt(0)}{app.userId.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{app.userId.firstName} {app.userId.lastName}</h3>
                  <p className="text-sm text-gray-500">{app.userId.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600"><span className="font-semibold">Position:</span> {app.jobTitle}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Applied On:</span> {new Date(app.applicationDate).toLocaleDateString()}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{app.status}</span>
              </div>
              <button
                onClick={() => viewCV(app)}
                className="mt-auto inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download CV
              </button>
              <button
                onClick={() => navigate(`/company/chat/${app.userId._id}`)}
                className="mt-2 inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-100 transition-colors text-sm font-medium"
              >
                <FontAwesomeIcon icon={faCommentDots} className="mr-2" /> Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
