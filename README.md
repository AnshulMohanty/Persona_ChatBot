# Persona-Based AI Chatbot

Chat with AI versions of three Scaler/InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each persona has a carefully crafted system prompt with few-shot examples, chain-of-thought instructions, and output constraints.

**Live Demo:** [persona-chatbot-1-3bpy.onrender.com](https://persona-chatbot-1-3bpy.onrender.com/)

## Screenshots

_Screenshots will be added here after final deployment._

## Tech Stack

- **Frontend:** Vanilla JS, Vite
- **Backend:** Node.js, Express
- **LLM:** Google Gemini API (gemini-2.5-flash)

## Project Structure

```
frontend/
  index.html, style.css, main.js, personas.js
  images/          — persona profile photos
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

Deployed on **Render** with frontend and backend as separate services.

**Backend** — Web Service:
- Build: `cd backend && npm install`
- Start: `node server.js`
- Env: `GEMINI_API_KEY`

**Frontend** — Static Site:
- Build: `cd frontend && npm install && npm run build`
- Publish dir: `frontend/dist`
- Env: `VITE_API_URL=https://your-backend-url.onrender.com`

The `VITE_API_URL` environment variable tells the frontend where the backend is. Set it to your backend Render URL (without trailing slash).

## What It Does

- Three distinct persona chatbots, each with their own system prompt
- Landing page with persona selection — pick who you want to talk to
- Switch between personas using the sidebar — chat resets on switch
- Suggestion chips give you quick starter questions for each persona
- Typing indicator shows while waiting for the API
- Handles API errors without crashing
- Works on mobile (responsive sidebar)
- API key stays on the server, never exposed to the client

## Docs

- [prompts.md](./prompts.md) — annotated system prompts
- [reflection.md](./reflection.md) — what I learned building this
