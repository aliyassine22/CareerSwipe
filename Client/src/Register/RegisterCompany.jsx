import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom Components
import Input from '../Components/Input';
import SubmitButton from '../Components/SubmitButton';

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    companyWebsite: '',
    companySize: '',
    headOfficeLocation: '',
    companyLogo: null,
    rolesHiringFor: '',
    employmentTypes: [],
    businessLicenseNumber: '',
    linkedInProfile: '',
    agreeToTerms: false,
  });

////////////////////////////////////////////////////////////
// the functions here are not completed yet
  function handleInputChange(event) {
    const { id, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleFileChange(event) {
    setFormData((prev) => ({
      ...prev,
      companyLogo: event.target.files[0],
    }));
  }

  function register(ev) {
    ev.preventDefault();

    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }

    axios
      .post('/RegisterJobSeeker', dataToSend, { withCredentials: true })
      .then((res) => {
        console.log('Response:', res.data);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Error:', err.response ? err.response.data : err.message);
      });
  }

//////////////////////////////////////////////////////////////

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Register Your Company
        </h1>
        <form onSubmit={register} className="space-y-6">
          <Input
            label="Your Name"
            id="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Work Email"
            id="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Phone Number"
            id="phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Input
            label="Company Name"
            id="companyName"
            placeholder="Acme Corp"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Industry"
            id="industry"
            placeholder="Technology, Retail, etc."
            value={formData.industry}
            onChange={handleInputChange}
          />
          <Input
            label="Company Website"
            id="companyWebsite"
            type="url"
            placeholder="https://www.example.com"
            value={formData.companyWebsite}
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
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          {/* Company Logo Upload */}
          <div>
            <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Company Logo
            </label>
            <input
              type="file"
              id="companyLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <SubmitButton text="Register" />
          </div>

          {/* Login Link */}
          <div className="text-center py-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 underline hover:text-indigo-800">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
