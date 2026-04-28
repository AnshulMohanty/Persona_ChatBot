import { personas } from './personas.js';

// state
let currentPersona = 'anshuman';
let conversationHistory = [];
let isLoading = false;

// dom elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const headerAvatar = document.getElementById('header-avatar');
const headerName = document.getElementById('header-name');
const headerRole = document.getElementById('header-role');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const personaBtns = document.querySelectorAll('.persona-btn');

const API_URL = '/api/chat';

function init() {
  renderWelcome();
  bindEvents();
}

function bindEvents() {
  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const persona = btn.dataset.persona;
      if (persona === currentPersona) return;
      switchPersona(persona);
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

  // mobile sidebar toggle
  menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  });
  sidebarOverlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

function switchPersona(personaId) {
  currentPersona = personaId;
  conversationHistory = [];

  // highlight active btn
  personaBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.persona === personaId);
  });

  // update header with new persona info
  const p = personas[personaId];
  headerAvatar.textContent = p.initials;
  headerAvatar.style.background = p.color;
  headerName.textContent = p.name;
  headerRole.textContent = p.role;

  renderWelcome();
  closeSidebar();
}

function renderWelcome() {
  const p = personas[currentPersona];

  chatMessages.innerHTML = `
    <div class="welcome-message">
      <div class="welcome-avatar" style="background:${p.color};">${p.initials}</div>
      <div class="welcome-name">${p.name}</div>
      <div class="welcome-role">${p.role}</div>
      <div class="welcome-text">${p.welcome}</div>
    </div>
    <div class="suggestion-chips" id="suggestion-chips">
      ${p.suggestions.map(s => `<button class="chip">${s}</button>`).join('')}
    </div>
  `;

  // clicking a chip sends it as a message
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

  // get rid of suggestion chips after first msg
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

  const avatarInitials = role === 'user' ? 'You' : p.initials;
  const avatarBg = role === 'user' ? '' : `style="background:${p.color};"`;

  div.innerHTML = `
    <div class="msg-avatar" ${avatarBg}>${avatarInitials}</div>
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
    <div class="msg-avatar" style="background:${p.color};">${p.initials}</div>
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
