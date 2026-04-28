require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const anshumanPrompt = require('./prompts/anshuman');
const abhimanyuPrompt = require('./prompts/abhimanyu');
const kshitijPrompt = require('./prompts/kshitij');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// map persona names to their system prompts
const prompts = {
  anshuman: anshumanPrompt,
  abhimanyu: abhimanyuPrompt,
  kshitij: kshitijPrompt
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { persona, messages } = req.body;

    if (!persona || !prompts[persona]) {
      return res.status(400).json({ error: 'Invalid persona. Choose anshuman, abhimanyu, or kshitij.' });
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemPrompt = prompts[persona];
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: { parts: [{ text: systemPrompt }] }
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error.message);

    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ error: 'API key is missing or invalid. Check server config.' });
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'Rate limit hit. Wait a bit and try again.' });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
