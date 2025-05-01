import React, { useState, useEffect } from "react";
import { FaCommentDots } from "react-icons/fa";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm CareerBot 🤖. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 3000);

    const autoHide = setTimeout(() => {
      setShowWelcome(false);
    }, 9000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoHide);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:4000/api/openai/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops! Something went wrong." }
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
          >
            <FaCommentDots size={24} />
          </button>
          {showWelcome && (
            <div className="absolute bottom-16 right-0 bg-white border border-gray-300 text-sm text-gray-800 px-4 py-2 rounded shadow-md w-64 animate-fade-in">
              👋 Hi, I’m CareerBot! Need help with your career?
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
          <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
            <span>CareerBot</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-xs ${
                  msg.from === "user" ? "bg-indigo-100 self-end ml-auto" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded-l px-2 py-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
