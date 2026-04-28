# Persona-Based AI Chatbot

Chat with AI versions of three Scaler/InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each persona has a carefully crafted system prompt with few-shot examples, chain-of-thought instructions, and output constraints.

Built as a prompt engineering project for Scaler Academy.

**Live Demo:** _[deployed link here]_

## Screenshots

_[will add after deployment]_

## Tech Stack

- **Frontend:** Vanilla JS, Vite
- **Backend:** Node.js, Express
- **LLM:** Google Gemini API (gemini-2.5-flash)

## Project Structure

```
frontend/
  index.html, style.css, main.js, personas.js
  vite.config.js, package.json

backend/
  server.js
  prompts/
    anshuman.js, abhimanyu.js, kshitij.js
  .env.example, package.json

prompts.md        — all 3 system prompts, annotated
reflection.md     — project reflection (300-500 words)
README.md
```

## How to Run Locally

You need Node.js (v18+) and a Gemini API key.

**Dev mode** (two terminals):
```bash
# terminal 1 — backend
cd backend
npm install
cp .env.example .env
# add your API key to .env
npm start

# terminal 2 — frontend
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

**Production mode** (single server):
```bash
cd frontend && npm install && npm run build
cd ../backend && npm install
# set GEMINI_API_KEY in .env
npm start
```
Open `http://localhost:3000` — Express serves both the API and the built frontend.

## Deployment

Deployed on **Render** as a single web service. The Express backend serves the Vite production build as static files, so everything runs on one URL.

To deploy yourself:
1. Push to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set build command: `cd frontend && npm install && npm run build && cd ../backend && npm install`
4. Set start command: `cd backend && node server.js`
5. Add `GEMINI_API_KEY` as an environment variable in Render dashboard

## What It Does

- Three distinct persona chatbots, each with their own system prompt
- Switch between personas using the sidebar — chat resets on switch
- Suggestion chips give you quick starter questions for each persona
- Typing indicator shows while waiting for the API
- Handles API errors without crashing
- Works on mobile (responsive sidebar)
- API key stays on the server, never exposed to the client

## Docs

- [prompts.md](./prompts.md) — annotated system prompts
- [reflection.md](./reflection.md) — what I learned building this
