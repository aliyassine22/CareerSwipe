import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  // Format salary to display nicely
  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-indigo-700">{job.title}</h2>
          <p className="text-gray-600 mt-1">{job.location}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          {job.employmentType}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 line-clamp-3">{job.description}</p>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {job.requiredSkills.map((skill, index) => (
          <span 
            key={index} 
            className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-gray-700 font-medium">
            {formatSalary(job.salary.min, job.salary.max)}
          </p>
          <p className="text-gray-500 text-sm">
            {job.experienceLevel} • {job.educationRequired}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-500 text-sm">
            Posted: {formatDate(job.createdAt)}
          </p>
          <Link 
            to={`/job/${job._id}`} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
