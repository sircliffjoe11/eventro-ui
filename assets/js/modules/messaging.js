// Messaging functionality for vendor-organizer communication
import { showToast } from './toast.js';

let currentThread = [];
let currentUser = {
  id: 1,
  name: "SoundWave Productions",
  avatar: "../assets/img/placeholders/avatar-01.jpg",
  type: "vendor"
};

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('order.html')) {
    initializeMessaging();
  }
});

function initializeMessaging() {
  loadMessageThread();
  setupMessageEventListeners();
  renderMessages();
}

function loadMessageThread() {
  // Load existing thread from localStorage or use sample data
  const savedThread = localStorage.getItem('eventro-message-thread-001234');
  
  if (savedThread) {
    try {
      currentThread = JSON.parse(savedThread);
    } catch (error) {
      console.error('Error loading message thread:', error);
      loadSampleMessages();
    }
  } else {
    loadSampleMessages();
  }
}

function loadSampleMessages() {
  currentThread = [
    {
      id: 1,
      senderId: 2,
      senderName: "Sarah Johnson",
      senderAvatar: "../assets/img/placeholders/avatar-02.jpg",
      message: "Hi! I'm excited about booking your sound system for my wedding. Do you have experience with outdoor events?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      type: "received"
    },
    {
      id: 2,
      senderId: 1,
      senderName: "SoundWave Productions",
      senderAvatar: "../assets/img/placeholders/avatar-01.jpg",
      message: "Yes! We specialize in outdoor weddings. Our equipment is weather-resistant and we always bring backup gear.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      type: "sent"
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Sarah Johnson",
      senderAvatar: "../assets/img/placeholders/avatar-02.jpg",
      message: "That's great to hear! What's included in the setup service? Will you handle the sound check before guests arrive?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      type: "received"
    }
  ];
  
  saveMessageThread();
}

function saveMessageThread() {
  localStorage.setItem('eventro-message-thread-001234', JSON.stringify(currentThread));
}

function renderMessages() {
  const container = document.querySelector('#messages-container');
  if (!container) return;

  container.innerHTML = currentThread.map(message => renderMessage(message)).join('');
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function renderMessage(message) {
  const isOwn = message.type === 'sent';
  const timeAgo = getTimeAgo(message.timestamp);
  
  return `
    <div class="mb-3">
      <div class="d-flex align-items-start ${isOwn ? 'flex-row-reverse' : ''}">
        <img src="${message.senderAvatar}" alt="${message.senderName}" class="rounded-circle ${isOwn ? 'ms-2' : 'me-2'}" style="width: 30px; height: 30px; object-fit: cover;">
        <div class="flex-grow-1 ${isOwn ? 'text-end' : ''}">
          <div class="message-bubble ${isOwn ? 'sent' : 'received'}">
            <p class="mb-1">${message.message}</p>
          </div>
          <small class="text-muted">${message.senderName} • ${timeAgo}</small>
        </div>
      </div>
    </div>
  `;
}

function setupMessageEventListeners() {
  const messageForm = document.querySelector('#message-form');
  const messageInput = document.querySelector('#message-input');

  if (messageForm && messageInput) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const messageText = messageInput.value.trim();
      if (messageText) {
        sendMessage(messageText);
        messageInput.value = '';
      }
    });

    // Send on Enter key (but allow Shift+Enter for new lines)
    messageInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        messageForm.dispatchEvent(new Event('submit'));
      }
    });
  }
}

function sendMessage(messageText) {
  const newMessage = {
    id: currentThread.length + 1,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatar,
    message: messageText,
    timestamp: new Date().toISOString(),
    type: "sent"
  };

  currentThread.push(newMessage);
  saveMessageThread();
  renderMessages();
  
  // Simulate typing indicator and response (for demo)
  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      simulateResponse();
    }, 2000);
  }, 500);
}

function simulateResponse() {
  const responses = [
    "Thank you for your message! I'll get back to you shortly with more details.",
    "That's a great question. Let me check our availability and get back to you.",
    "I appreciate your interest in our services. I'll send you a detailed quote soon.",
    "Thanks for reaching out! I'll review your requirements and respond within the hour."
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  const responseMessage = {
    id: currentThread.length + 1,
    senderId: 2,
    senderName: "Sarah Johnson",
    senderAvatar: "../assets/img/placeholders/avatar-02.jpg",
    message: randomResponse,
    timestamp: new Date().toISOString(),
    type: "received"
  };

  currentThread.push(responseMessage);
  saveMessageThread();
  renderMessages();
}

function showTypingIndicator() {
  const container = document.querySelector('#messages-container');
  if (!container) return;

  const typingIndicator = document.createElement('div');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.className = 'mb-3';
  typingIndicator.innerHTML = `
    <div class="d-flex align-items-start">
      <img src="../assets/img/placeholders/avatar-02.jpg" alt="Sarah" class="rounded-circle me-2" style="width: 30px; height: 30px; object-fit: cover;">
      <div class="bg-light rounded-3 p-2">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;

  container.appendChild(typingIndicator);
  container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.querySelector('#typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

// Utility function
function formatPrice(priceInCents) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInCents);
}

// CSS for typing indicator (add to styles.css)
const typingStyles = `
.typing-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #6c757d;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.message-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
}

.message-bubble.sent {
  background-color: var(--bs-success);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 0.25rem;
}

.message-bubble.received {
  background-color: #f8f9fa;
  color: #212529;
  border-bottom-left-radius: 0.25rem;
}
`;

// Inject styles if not already present
if (!document.querySelector('#messaging-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'messaging-styles';
  styleSheet.textContent = typingStyles;
  document.head.appendChild(styleSheet);
}

// Export functions
export { sendMessage, loadMessageThread, renderMessages };