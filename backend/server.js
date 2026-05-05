require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const anshumanPrompt = require('./prompts/anshuman');
const abhimanyuPrompt = require('./prompts/abhimanyu');
const kshitijPrompt = require('./prompts/kshitij');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_TIMEOUT_MS = 20000;
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());

// production mein frontend build serve karna hai
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const hasFrontendDist = fs.existsSync(path.join(distPath, 'index.html'));

if (hasFrontendDist) {
  app.use(express.static(distPath));
}

const prompts = {
  anshuman: anshumanPrompt,
  abhimanyu: abhimanyuPrompt,
  kshitij: kshitijPrompt
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getRuntimePrompt(prompt) {
  return prompt.replace(
    /\n=== FEW-SHOT EXAMPLES ===[\s\S]*?(?=\n=== CHAIN-OF-THOUGHT INSTRUCTION ===)/,
    ''
  );
}

function getFallbackReply(persona, message) {
  const normalizedMessage = message.toLowerCase();

  if (persona === 'anshuman') {
    if (normalizedMessage.includes('faang') || normalizedMessage.includes('interview')) {
      return "The biggest thing is to prepare around fundamentals, not just problem count. Build strong DSA patterns, practice explaining your thinking out loud, and add mock interviews early so you get feedback before the real interview. System design also matters once you move beyond entry-level roles, so treat it as a separate skill rather than an afterthought. What part feels hardest right now: DSA, system design, or interview communication?";
    }

    return "In my experience, progress comes from picking one important gap and attacking it consistently. Don't optimize for looking busy; optimize for better fundamentals, better feedback loops, and better problem selection. Start with a small plan you can repeat every day, then review what is actually improving. What are you trying to get better at right now?";
  }

  if (persona === 'abhimanyu') {
    return "The way I think about it, you need to separate the problem from the current solution. First clarify what outcome you want, then identify which part of the system is blocking it: people, process, incentives, or clarity. Once that is visible, the answer is usually less emotional and more structural. What is the real constraint you are dealing with right now?";
  }

  if (persona === 'kshitij') {
    return "Let's think about it step by step. First identify the concept being tested, then solve a very small example by hand before jumping into code. Once the pattern is clear, write the solution and test it on edge cases. Which part should we trace together first?";
  }

  return "I hit a temporary model issue, but we can keep going. Could you rephrase that once?";
}

async function sendMessageWithRetry(chat, message) {
  const attempts = 2;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await chat.sendMessage(message, { timeout: GEMINI_TIMEOUT_MS });
    } catch (error) {
      const isLastAttempt = attempt === attempts;
      const isRetryable =
        error.message?.includes('fetch') ||
        error.message?.includes('[500') ||
        error.message?.includes('[503');

      if (isLastAttempt || !isRetryable) {
        throw error;
      }
    }
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { persona, messages } = req.body;

    if (!persona || !prompts[persona]) {
      return res.status(400).json({ error: 'Invalid persona. Choose anshuman, abhimanyu, or kshitij.' });
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemPrompt = getRuntimePrompt(prompts[persona]);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 350
      }
    });

    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: { parts: [{ text: systemPrompt }] }
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await sendMessageWithRetry(chat, lastMessage);
    const reply = result.response.text();

    res.json({ reply: reply || getFallbackReply(persona, lastMessage) });
  } catch (error) {
    console.error('Chat API error:', error.message);
    const { persona, messages } = req.body || {};
    const lastMessage = Array.isArray(messages) && messages.length > 0
      ? messages[messages.length - 1].content || ''
      : '';

    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ error: 'API key is missing or invalid. Check server config.' });
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'Rate limit hit. Wait a bit and try again.' });
    }
    if (error.message?.includes('RECITATION')) {
      return res.json({ reply: getFallbackReply(persona, lastMessage) });
    }
    if (error.message?.includes('SAFETY')) {
      return res.status(422).json({ error: 'That prompt was blocked by the model. Try rephrasing it.' });
    }
    if (error.name === 'AbortError' || error.message?.includes('timed out')) {
      return res.json({ reply: getFallbackReply(persona, lastMessage) });
    }

    if (persona && prompts[persona]) {
      return res.json({ reply: getFallbackReply(persona, lastMessage) });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback — koi bhi unknown route pe index.html bhejo
if (hasFrontendDist) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'persona-chatbot-backend',
      frontend: 'deploy separately as a static site'
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found.' });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
