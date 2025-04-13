import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../Components/Input';
import SubmitButton from '../Components/SubmitButton';

export default function RegisterJobSeeker() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    desiredJobTitle: '',
    experienceLevel: '',
    education: '',
    skills: '',
    password: '',
    cvFile: null,
  });
///////////////////////////////////////////////////////////
// those functions are not finsished yet
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      cvFile: event.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }

      const response = await axios.post(
        'http://localhost:4000/Register/RegisterJobSeeker',
        dataToSend,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert(response.data.message);
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error.response || error.message);
      setError(
        error.response?.data?.message || 'An error occurred during registration.'
      );
    }
  };
/////////////////////////////////////////////////////////////////
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Register as Job Seeker
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            id="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Email Address"
            id="email"
            type="email"
            placeholder="youremail@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Phone Number"
            id="phone_number"
            placeholder="Your Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Date of Birth"
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Desired Job Title"
            id="desiredJobTitle"
            placeholder="e.g., Software Developer"
            value={formData.desiredJobTitle}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Experience Level"
            id="experienceLevel"
            placeholder="e.g., Entry, Mid, Senior"
            value={formData.experienceLevel}
            onChange={handleInputChange}
          />
          <Input
            label="Highest Education"
            id="education"
            placeholder="e.g., B.Sc. in Computer Science"
            value={formData.education}
            onChange={handleInputChange}
          />
          <Input
            label="Key Skills"
            id="skills"
            placeholder="e.g., React, Python, SQL"
            value={formData.skills}
            onChange={handleInputChange}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {/* File Upload */}
          <div>
            <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-2">
              Upload CV
            </label>
            <input
              type="file"
              id="cvFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Submit Button */}
          <div className="text-center">
            <SubmitButton text="Register" />
          </div>

          {/* Login Link */}
          <div className="text-center py-4 text-gray-600">
            Already a member?{' '}
            <Link to="/login" className="text-indigo-600 underline hover:text-indigo-800">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
