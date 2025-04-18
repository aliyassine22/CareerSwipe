import React from 'react';
import Input from '../AuthComponents/Input';
import SubmitButton from '../AuthComponents/SubmitButton';

const SeekerProfileForm = ({ profile, onInputChange, onSubmit, onAddSkill, onRemoveSkill, newSkill, setNewSkill, cvFileName, onCvUpload, onCvDownload, onCvDelete, error, successMessage }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          id="name"
          name="name"
          value={profile.name}
          onChange={onInputChange}
          required
        />
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={profile.email}
          onChange={onInputChange}
          required
        />
        <Input
          label="Phone Number"
          id="phone_number"
          name="phone_number"
          value={profile.phone_number}
          onChange={onInputChange}
          required
        />
        <Input
          label="Date of Birth"
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={profile.date_of_birth ? profile.date_of_birth.split('T')[0] : ''}
          onChange={onInputChange}
          required
        />
        <Input
          label="Desired Job Title"
          id="desiredJobTitle"
          name="desiredJobTitle"
          value={profile.desiredJobTitle}
          onChange={onInputChange}
          required
        />
        <Input
          label="Experience Level"
          id="experienceLevel"
          name="experienceLevel"
          value={profile.experienceLevel}
          onChange={onInputChange}
          required
        />
        <div className="md:col-span-2">
          <Input
            label="Education"
            id="education"
            name="education"
            value={profile.education}
            onChange={onInputChange}
            required
          />
        </div>

        {/* Skills Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-4">
            <div className="flex-grow">
              <Input
                label="Add Skill"
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onAddSkill}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CV Upload Section */}
        <div className="md:col-span-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center space-y-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={onCvUpload}
                  className="hidden"
                />
                <div className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                  Upload CV (PDF)
                </div>
              </label>

              {cvFileName && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{cvFileName}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onCvDownload}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={onCvDelete}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {(error || successMessage) && (
        <div className={`p-4 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {error || successMessage}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <SubmitButton text="Save Changes" />
      </div>
    </form>
  );
};

export default SeekerProfileForm;
