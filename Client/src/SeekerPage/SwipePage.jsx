import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SwipePage = () => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/company/jobs');
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Touch event handlers
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const rotate = diff / 10; // slight rotation
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;

    if (diff > 50) {
      setSwipeDirection('right');
    } else if (diff < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!cardRef.current) return;
    const diff = cardRef.current.getBoundingClientRect().x - startX;

    if (diff > 100) {
      handleLike();
    } else if (diff < -100) {
      handlePass();
    } else {
      resetCardPosition();
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    const rotate = diff / 10;
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;

    if (diff > 50) {
      setSwipeDirection('right');
    } else if (diff < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = (e) => {
    if (!cardRef.current) return;
    const diff = e.clientX - startX;

    if (diff > 100) {
      handleLike();
    } else if (diff < -100) {
      handlePass();
    } else {
      resetCardPosition();
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Reset card position
  const resetCardPosition = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.3s ease';
    cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
    setSwipeDirection(null);

    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = '';
      }
    }, 300);
  };

  // Handle like/pass & saving interaction
  const saveInteraction = async (jobId, interactionType) => {
    try {
      await axios.post(
        'http://localhost:4000/seeker/interactions',
        { jobId, interactionType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    } catch (err) {
      console.error('Error saving interaction:', err);
    }
  };

  const moveToNextCard = () => {
    setSwipeDirection(null);
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setJobs([]);
    }
  };

  const handleLike = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.5s ease';
    cardRef.current.style.transform = 'translateX(1000px) rotate(45deg)';
    const jobId = jobs[currentIndex]._id;
    saveInteraction(jobId, 'like');

    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = 'none';
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      }
      moveToNextCard();
    }, 500);
  };

  const handlePass = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.5s ease';
    cardRef.current.style.transform = 'translateX(-1000px) rotate(-45deg)';
    const jobId = jobs[currentIndex]._1d;
    saveInteraction(jobId, 'pass');

    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = 'none';
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      }
      moveToNextCard();
    }, 500);
  };

  // Button handlers
  const handleLikeClick = () => {
    handleLike();
  };

  const handlePassClick = () => {
    handlePass();
  };

  const handleViewDetails = () => {
    if (jobs.length > 0 && currentIndex < jobs.length) {
      navigate(`/job/${jobs[currentIndex]._id}`);
    }
  };

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading job cards...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No more jobs to show
        </h2>
        <p className="text-gray-600 mb-6">
          You've gone through all available job postings.
        </p>
        <button
          onClick={() => navigate('/seeker/profile')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  const currentJob = jobs[currentIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">
          Find Your Next Job
        </h1>

        {/* Simple Card */}
        <div className="w-full max-w-md">
          <div
            ref={cardRef}
            className={`w-full bg-white rounded-xl shadow-xl overflow-hidden 
              ${
                swipeDirection === 'right'
                  ? 'border-4 border-green-400'
                  : ''
              } ${
              swipeDirection === 'left'
                ? 'border-4 border-red-400'
                : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            {/* Overlay indicators */}
            {swipeDirection === 'right' && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full transform rotate-12 z-10 font-bold text-xl">
                LIKE
              </div>
            )}
            {swipeDirection === 'left' && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full transform -rotate-12 z-10 font-bold text-xl">
                PASS
              </div>
            )}

            {/* Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {currentJob.title}
                  </h2>
                  <p className="text-gray-600">{currentJob.location}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentJob.employmentType}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">
                  {currentJob.description.substring(0, 200)}...
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Required Skills:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 font-medium">
                  {formatSalary(
                    currentJob.salary.min,
                    currentJob.salary.max
                  )}
                </p>
                <p className="text-gray-600">
                  {currentJob.experienceLevel} •{' '}
                  {currentJob.educationRequired}
                </p>
              </div>

              <button
                onClick={handleViewDetails}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 mt-8">
          <button
            onClick={handlePassClick}
            className="bg-white text-red-500 border-2 border-red-500 w-16 h-16 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            onClick={handleLikeClick}
            className="bg-white text-green-500 border-2 border-green-500 w-16 h-16 rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>

        {/* Card Counter */}
        <div className="mt-4 text-gray-500">
          {currentIndex + 1} of {jobs.length}
        </div>
      </div>
    </div>
  );
};

export default SwipePage;
