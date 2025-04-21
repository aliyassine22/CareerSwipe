import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Chat() {
  const { applicantId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    fetchConversation();
  }, []);

  const fetchConversation = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/company/messages/${applicantId}`,
        { withCredentials: true }
      );
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load chat:', error);
      toast.error('Failed to load chat');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      const { data } = await axios.post(
        `http://localhost:4000/company/messages/${applicantId}`,
        { content: newMsg },
        { withCredentials: true }
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMsg('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Chat with Applicant</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 flex flex-col">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-md p-3 rounded-lg ${
              msg.sender === 'Company' ? 'bg-indigo-100 self-end' : 'bg-gray-200 self-start'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray-500 text-right">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
