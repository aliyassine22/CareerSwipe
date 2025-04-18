import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function ManageJobPostings() {
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await fetch('http://localhost:4000/company/jobs/company', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch job postings');
      }

      const data = await response.json();
      if (data.success) {
        setJobPostings(data.jobPostings);
      }
    } catch (error) {
      console.error('Error fetching job postings:', error);
      toast.error('Failed to load job postings');
    }
  };

  const closeJobPosting = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:4000/company/jobs/${jobId}/close`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to close job posting');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Job posting closed successfully');
        // Update the local state
        setJobPostings(prevPostings =>
          prevPostings.map(posting =>
            posting._id === jobId
              ? { ...posting, status: 'closed' }
              : posting
          )
        );
      }
    } catch (error) {
      console.error('Error closing job posting:', error);
      toast.error('Failed to close job posting');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Your Job Postings</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {jobPostings.map(job => (
            <div key={job._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' :
                      job.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p><span className="font-medium">Location:</span> {job.location}</p>
                    <p><span className="font-medium">Experience:</span> {job.experienceLevel}</p>
                    <p><span className="font-medium">Employment Type:</span> {job.employmentType}</p>
                    <p><span className="font-medium">Salary Range:</span> ${job.salary.min} - ${job.salary.max}</p>
                    <p><span className="font-medium">Posted:</span> {formatDate(job.createdAt)}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => setSelectedJob(selectedJob?._id === job._id ? null : job)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      {selectedJob?._id === job._id ? 'Hide Details' : 'View Details'}
                    </button>
                    {job.status === 'active' && (
                      <button
                        onClick={() => closeJobPosting(job._id)}
                        className="ml-4 text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Close Posting
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {selectedJob?._id === job._id && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Job Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{job.description}</p>
                  
                  <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">Education Required</h4>
                  <p className="text-sm text-gray-600">{job.educationRequired}</p>
                </div>
              )}
            </div>
          ))}

          {jobPostings.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No job postings found. Create your first job posting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
