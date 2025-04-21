import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Chats() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:4000/seeker/messages',
          { withCredentials: true }
        );
        if (data.success) setCompanies(data.companies);
      } catch (error) {
        console.error('Error fetching chat threads:', error);
        toast.error('Failed to load chats');
      }
    };
    fetchThreads();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Conversations</h2>
      {companies.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {companies.map((c) => (
            <div
              key={c._id}
              className="cursor-pointer p-4 bg-white shadow rounded hover:bg-gray-100 transition-colors"
              onClick={() => navigate(`/seeker/messages/${c._id}`)}
            >
              {c.fullName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
