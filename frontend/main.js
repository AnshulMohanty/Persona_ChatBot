import { personas } from './personas.js';

let currentPersona = null;
let conversationHistory = [];
let isLoading = false;

const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const headerAvatarImg = document.getElementById('header-avatar-img');
const headerName = document.getElementById('header-name');
const headerRole = document.getElementById('header-role');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const personaBtns = document.querySelectorAll('.persona-btn');
const landingScreen = document.getElementById('landing-screen');
const chatMain = document.getElementById('chat-main');
const landingCards = document.querySelectorAll('.landing-persona-card');

// vite build ke time VITE_API_URL set karna, warna local proxy use hoga
const API_BASE = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE}/api/chat`;

function init() {
  chatMain.style.display = 'none';
  sidebar.style.display = 'none';
  bindEvents();
}

function bindEvents() {
  landingCards.forEach(card => {
    card.addEventListener('click', () => {
      enterChat(card.dataset.persona);
    });
  });

  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.persona === currentPersona) return;
      switchPersona(btn.dataset.persona);
    });
  });

  sendBtn.addEventListener('click', handleSend);

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  messageInput.addEventListener('input', autoResize);

  menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  });

  sidebarOverlay.addEventListener('click', closeSidebar);
}

// landing se chat mein jaana
function enterChat(personaId) {
  currentPersona = personaId;
  conversationHistory = [];

  landingScreen.classList.add('hidden');
  setTimeout(() => {
    landingScreen.style.display = 'none';
    sidebar.style.display = 'flex';
    chatMain.style.display = 'flex';
  }, 350);

  personaBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.persona === personaId);
  });

  updateHeader(personaId);
  renderWelcome();
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

function switchPersona(personaId) {
  currentPersona = personaId;
  conversationHistory = [];

  personaBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.persona === personaId);
  });

  updateHeader(personaId);
  renderWelcome();
  closeSidebar();
}

function updateHeader(personaId) {
  const p = personas[personaId];
  headerAvatarImg.src = p.image;
  headerAvatarImg.alt = p.name;
  headerName.textContent = p.name;
  headerRole.textContent = p.role;
}

function renderWelcome() {
  const p = personas[currentPersona];

  chatMessages.innerHTML = `
    <div class="welcome-message">
      <div class="welcome-img-wrap">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="welcome-name">${p.name}</div>
      <div class="welcome-role">${p.role}</div>
      <div class="welcome-text">${p.welcome}</div>
    </div>
    <div class="suggestion-chips" id="suggestion-chips">
      ${p.suggestions.map(s => `<button class="chip">${s}</button>`).join('')}
    </div>
  `;

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      messageInput.value = chip.textContent;
      handleSend();
    });
  });
}

async function handleSend() {
  const text = messageInput.value.trim();
  if (!text || isLoading) return;

  const chips = document.getElementById('suggestion-chips');
  if (chips) chips.remove();

  conversationHistory.push({ role: 'user', content: text });
  appendMessage('user', text);

  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;
  isLoading = true;
  showTypingIndicator();

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        persona: currentPersona,
        messages: conversationHistory
      })
    });

    const data = await res.json();
    hideTypingIndicator();

    if (!res.ok) {
      appendMessage('bot', data.error || 'Something went wrong. Please try again.', true);
    } else {
      conversationHistory.push({ role: 'model', content: data.reply });
      appendMessage('bot', data.reply);
    }
  } catch (err) {
    hideTypingIndicator();
    appendMessage('bot', 'Unable to reach the server. Check your connection and try again.', true);
  }

  isLoading = false;
  sendBtn.disabled = false;
  messageInput.focus();
}

function appendMessage(role, text, isError = false) {
  const p = personas[currentPersona];
  const div = document.createElement('div');
  div.className = `message ${role}`;

  let avatarHtml;
  if (role === 'user') {
    avatarHtml = `<div class="msg-avatar">You</div>`;
  } else {
    avatarHtml = `<div class="msg-avatar"><img src="${p.image}" alt="${p.name}"></div>`;
  }

  div.innerHTML = `
    ${avatarHtml}
    <div class="msg-bubble ${isError ? 'error-bubble' : ''}">${escapeHtml(text)}</div>
  `;

  chatMessages.appendChild(div);
  scrollToBottom();
}

function showTypingIndicator() {
  const p = personas[currentPersona];
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="msg-avatar"><img src="${p.image}" alt="${p.name}"></div>
    <div class="typing-dots"><span></span><span></span><span></span></div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function hideTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function autoResize() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

init();
