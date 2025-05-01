import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const navigate = useNavigate(); // Hook to navigate programmatically
    
    // Check authentication status on component mount (once)
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Check for auth status in localStorage first (faster)
                const storedUserId = localStorage.getItem('userId');
                const storedUserType = localStorage.getItem('userType');
                
                if (storedUserId && storedUserType) {
                    setIsLoggedIn(true);
                    setUserType(storedUserType);
                    return; // Exit early if we have valid localStorage data
                }
                
                // Fall back to server check
                const response = await fetch('http://localhost:4000/auth/status', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                const data = await response.json();
                
                if (response.ok && data.authenticated) {
                    setIsLoggedIn(true);
                    setUserType(data.userType);
                    // Update localStorage if needed
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('userType', data.userType);
                } else {
                    // Ensure we're logged out if server says we're not authenticated
                    setIsLoggedIn(false);
                    setUserType('');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userType');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsLoggedIn(false);
                setUserType('');
            }
        };
        
        // Run the check immediately
        checkAuthStatus();
    }, []); // Only run on mount
    
    // Handle navigating to dashboard
    const goToDashboard = () => {
        if (userType === 'seeker') {
            navigate('/seeker/profile');
        } else {
            navigate('/company/profile');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state before submitting

        try {
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include', //to include cookies
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                // Check for specific error messages
                if (response.status === 403 && result.message && result.message.includes('already logged in')) {
                    setError('This account is already logged in from another device. Please log out from other sessions first.');
                } else if (result.message) {
                    setError(result.message);
                } else {
                    setError('Invalid email or password');
                }
                return;
            }

            const { userType, userId } = result;
            // Store user ID and type in localStorage
            localStorage.setItem('userId', userId);
            localStorage.setItem('userType', userType);
            
            // Redirect based on user type
            if (userType === 'seeker') {
                navigate('/seeker/profile');
            } else {
                navigate('/company/profile');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                    {isLoggedIn ? 'Already Logged In' : 'Login to Your Account'}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="youremail@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={goToDashboard}
                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-200"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200"
                        >
                            Login
                        </button>
                    )}
                    {!isLoggedIn && (
                        <div className="text-center py-4 text-gray-600">
                            Don&apos;t have an account?{' '}
                            <a href="/register" className="text-indigo-600 underline hover:text-indigo-800">
                                Sign Up Now
                            </a>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
