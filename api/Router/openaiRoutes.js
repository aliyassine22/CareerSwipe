// openaiRoutes.js
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// 🔐 WARNING: This is your actual secret key.
// NEVER expose this key publicly in production code or client-side apps.
const openai = new OpenAI({
  apiKey: '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', // replace this with the full valid key
});

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
