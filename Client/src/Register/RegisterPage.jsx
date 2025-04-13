import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-3">
          Welcome!
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Choose the type of user you&apos;d like to be
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          {/* Seller Button */}
          <Link
            to="/Register/RegisterCompany"
            className="block w-full py-2 text-base font-medium text-center text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition duration-200"
          >
            Sign Up as Company
          </Link>
          {/* Buyer Button */}
          <Link
            to="/Register/RegisterJobSeeker"
            className="block w-full py-2 text-base font-medium text-center text-white bg-purple-500 rounded-lg shadow hover:bg-purple-600 transition duration-200"
          >
            Sign Up as Job Seeker
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-3 text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:text-blue-600 transition duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
