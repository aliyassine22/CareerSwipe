import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function CreateJobPosting() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    experienceLevel: 'Entry Level',
    educationRequired: '',
    location: '',
    salary: {
      min: '',
      max: ''
    },
    employmentType: 'Full Time',
  });

  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const employmentTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salaryMin' || name === 'salaryMax') {
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [name === 'salaryMin' ? 'min' : 'max']: value
        }
      }));
    } else if (name === 'requiredSkills') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(skill => skill.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/company/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          requiredSkills: typeof formData.requiredSkills === 'string' 
            ? formData.requiredSkills.split(',').map(skill => skill.trim())
            : formData.requiredSkills
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create job posting');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Job posting created successfully');
        // Reset form
        setFormData({
          title: '',
          description: '',
          requiredSkills: '',
          experienceLevel: 'Entry Level',
          educationRequired: '',
          location: '',
          salary: {
            min: '',
            max: ''
          },
          employmentType: 'Full Time',
        });
      } else {
        toast.error(data.message || 'Failed to create job posting');
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      toast.error('Failed to create job posting');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Job Posting</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Salary</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salary.min}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Salary</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salary.max}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Required Skills</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleInputChange}
                placeholder="Separate skills with commas"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Education Required</label>
              <input
                type="text"
                name="educationRequired"
                value={formData.educationRequired}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Create Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
