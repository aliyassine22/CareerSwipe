// openaiRoutes.js
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; // Importing the path module
import path from 'path'; // Import path to use in the dotenv config

const router = express.Router();

// 🔐 WARNING: This is your actual secret key.
// NEVER expose this key publicly in production code or client-side apps.

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '.env'), // Ensure the .env file is loaded from the correct path
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load the API key from the .env file
});

// Use the 'openai' object as needed

router.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are CareerBot, a friendly career guidance assistant.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: 'Failed to get response from CareerBot' });
  }
});

export default router;
