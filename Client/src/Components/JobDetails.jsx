import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBriefcase, faGraduationCap, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import Map from './Map/Map';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/company/job/${id}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details. Please try again later.');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading job details...</div>
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

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Job not found
      </div>
    );
  }

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with company info */}
        <div className="flex items-center mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
              <span className="font-medium">{job.companyId.name}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <span className="text-gray-600">{job.location}</span>
          </div>
        </div>
        {job.location && (
          <div className="mb-8 h-64 border rounded-lg overflow-hidden">
            <Map
              center={job.location.split(',').map(Number)}
              markers={[job.location.split(',').map(Number)]}
              zoom={13}
            />
          </div>
        )}
        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 mb-2">Experience Level</h3>
                <p className="font-medium text-gray-800">{job.experienceLevel}</p>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">Education Required</h3>
                <p className="font-medium text-gray-800">{job.educationRequired}</p>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">Employment Type</h3>
                <p className="font-medium text-gray-800">{job.employmentType}</p>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">Salary Range</h3>
                <p className="font-medium text-gray-800">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                  {formatSalary(job.salary.min, job.salary.max)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-8 flex justify-end">
          
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to job list
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
