import React, { useState } from 'react';
import CompanyDetails from './CompanyDetails';
import CreateJobPosting from './CreateJobPosting';
import ManageJobPostings from './ManageJobPostings';

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Company Details' },
    { id: 'createJob', label: 'Create Job Posting' },
    { id: 'manageJobs', label: 'Manage Job Postings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'details' && <CompanyDetails />}
        {activeTab === 'createJob' && <CreateJobPosting />}
        {activeTab === 'manageJobs' && <ManageJobPostings />}
      </div>
    </div>
  );
}
