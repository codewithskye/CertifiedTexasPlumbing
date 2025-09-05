/**
 * chatbot.js - Mini Chatbot for Certified Texas Plumbing
 * A simple rule-based chatbot that can answer common questions
 */

document.addEventListener('DOMContentLoaded', function() {
  initChatbot();
});

/**
 * Initialize the mini chatbot
 */
function initChatbot() {
  // Create chatbot elements if they don't exist
  createChatbotElements();
  
  const chatbotToggle = document.querySelector('.chatbot-toggle');
  const chatbotContainer = document.querySelector('.chatbot-container');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotForm = document.querySelector('.chatbot-form');
  const chatbotInput = document.querySelector('.chatbot-input');
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const quickReplies = document.querySelectorAll('.quick-reply');
  
  // Load chat history from localStorage
  loadChatHistory();
  
  // Toggle chatbot visibility
  chatbotToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('active');
    chatbotToggle.classList.toggle('active');
    
    // If opening the chatbot and no messages, show welcome message
    if (chatbotContainer.classList.contains('active') && chatbotMessages.children.length === 0) {
      addBotMessage('👋 Hi there! How can I help you today?');
      
      // Add quick replies after a short delay
      setTimeout(() => {
        addQuickReplies();
      }, 500);
    }
  });
  
  // Close chatbot
  chatbotClose.addEventListener('click', function() {
    chatbotContainer.classList.remove('active');
    chatbotToggle.classList.remove('active');
  });
  
  // Handle form submission
  chatbotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = chatbotInput.value.trim();
    if (message) {
      // Add user message to chat
      addUserMessage(message);
      
      // Clear input
      chatbotInput.value = '';
      
      // Process message and get response after a short delay
      setTimeout(() => {
        const response = processMessage(message);
        addBotMessage(response);
        
        // Save chat history
        saveChatHistory();
        
        // Add quick replies after bot response
        setTimeout(() => {
          addQuickReplies();
        }, 500);
      }, 500);
    }
  });
  
  // Handle quick replies
  quickReplies.forEach(reply => {
    reply.addEventListener('click', function() {
      const message = this.textContent;
      
      // Add user message to chat
      addUserMessage(message);
      
      // Process message and get response after a short delay
      setTimeout(() => {
        const response = processMessage(message);
        addBotMessage(response);
        
        // Save chat history
        saveChatHistory();
        
        // Add quick replies after bot response
        setTimeout(() => {
          addQuickReplies();
        }, 500);
      }, 500);
    });
  });
}

/**
 * Create chatbot elements and append to body
 */
function createChatbotElements() {
  // Check if chatbot elements already exist
  if (document.querySelector('.chatbot-toggle')) {
    return;
  }
  
  // Create chatbot toggle button
  const chatbotToggle = document.createElement('button');
  chatbotToggle.className = 'chatbot-toggle';
  chatbotToggle.innerHTML = '<i class="bx bxs-message-dots"></i>';
  chatbotToggle.setAttribute('aria-label', 'Open chat assistant');
  
  // Create chatbot container
  const chatbotContainer = document.createElement('div');
  chatbotContainer.className = 'chatbot-container';
  
  // Create chatbot header
  const chatbotHeader = document.createElement('div');
  chatbotHeader.className = 'chatbot-header';
  chatbotHeader.innerHTML = `
    <div class="chatbot-title">
      <i class="bx bxs-message-dots"></i>
      <span>CTP Assistant</span>
    </div>
    <button class="chatbot-close" aria-label="Close chat assistant">
      <i class="bx bx-x"></i>
    </button>
  `;
  
  // Create chatbot body
  const chatbotBody = document.createElement('div');
  chatbotBody.className = 'chatbot-body';
  
  // Create chatbot messages container
  const chatbotMessages = document.createElement('div');
  chatbotMessages.className = 'chatbot-messages';
  
  // Create chatbot quick replies
  const chatbotQuickReplies = document.createElement('div');
  chatbotQuickReplies.className = 'chatbot-quick-replies';
  chatbotQuickReplies.innerHTML = `
    <button class="quick-reply">What services do you offer?</button>
    <button class="quick-reply">How do I book a quote?</button>
    <button class="quick-reply">Where are you located?</button>
    <button class="quick-reply">Call me</button>
  `;
  
  // Create chatbot footer
  const chatbotFooter = document.createElement('div');
  chatbotFooter.className = 'chatbot-footer';
  
  // Create chatbot form
  const chatbotForm = document.createElement('form');
  chatbotForm.className = 'chatbot-form';
  chatbotForm.innerHTML = `
    <input type="text" class="chatbot-input" placeholder="Type your message..." aria-label="Type your message">
    <button type="submit" class="chatbot-send" aria-label="Send message">
      <i class="bx bxs-send"></i>
    </button>
  `;
  
  // Append elements
  chatbotBody.appendChild(chatbotMessages);
  chatbotBody.appendChild(chatbotQuickReplies);
  chatbotFooter.appendChild(chatbotForm);
  
  chatbotContainer.appendChild(chatbotHeader);
  chatbotContainer.appendChild(chatbotBody);
  chatbotContainer.appendChild(chatbotFooter);
  
  // Append to body
  document.body.appendChild(chatbotToggle);
  document.body.appendChild(chatbotContainer);
  
  // Add styles
  addChatbotStyles();
}

/**
 * Add chatbot styles to the document
 */
function addChatbotStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .chatbot-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--accent-earth);
      color: white;
      border: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: all 0.3s ease;
    }
    
    .chatbot-toggle:hover {
      transform: scale(1.1);
      background-color: var(--muted-stone);
    }
    
    .chatbot-toggle.active {
      transform: scale(0);
      opacity: 0;
    }
    
    .chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0);
      opacity: 0;
      transition: all 0.3s ease;
      transform-origin: bottom right;
    }
    
    .chatbot-container.active {
      transform: scale(1);
      opacity: 1;
    }
    
    .chatbot-header {
      background-color: var(--accent-earth);
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chatbot-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }
    
    .chatbot-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    
    .chatbot-body {
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    
    .chatbot-messages {
      flex-grow: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .chatbot-message {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 15px;
      margin-bottom: 5px;
      word-break: break-word;
    }
    
    .chatbot-message.bot {
      align-self: flex-start;
      background-color: var(--offwhite);
      border-bottom-left-radius: 5px;
    }
    
    .chatbot-message.user {
      align-self: flex-end;
      background-color: var(--accent-earth);
      color: white;
      border-bottom-right-radius: 5px;
    }
    
    .chatbot-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    
    .quick-reply {
      background-color: var(--offwhite);
      border: 1px solid var(--brand-gray);
      border-radius: 15px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .quick-reply:hover {
      background-color: var(--accent-earth);
      color: white;
      border-color: var(--accent-earth);
    }
    
    .chatbot-footer {
      padding: 15px;
      border-top: 1px solid var(--offwhite);
    }
    
    .chatbot-form {
      display: flex;
      gap: 10px;
    }
    
    .chatbot-input {
      flex-grow: 1;
      padding: 10px 15px;
      border: 1px solid var(--brand-gray);
      border-radius: 20px;
      outline: none;
    }
    
    .chatbot-input:focus {
      border-color: var(--accent-earth);
    }
    
    .chatbot-send {
      background-color: var(--accent-earth);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .chatbot-send:hover {
      background-color: var(--muted-stone);
    }
    
    @media (max-width: 768px) {
      .chatbot-container {
        width: calc(100% - 40px);
        height: 60vh;
        bottom: 80px;
      }
      
      .chatbot-toggle {
        bottom: 15px;
        right: 15px;
        width: 50px;
        height: 50px;
        font-size: 20px;
      }
      
      .chatbot-quick-replies {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .quick-reply {
        font-size: 12px;
        padding: 6px 10px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Add a bot message to the chat
 * @param {string} message - The message to add
 */
function addBotMessage(message) {
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'chatbot-message bot';
  messageElement.innerHTML = message;
  
  chatbotMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Add a user message to the chat
 * @param {string} message - The message to add
 */
function addUserMessage(message) {
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'chatbot-message user';
  messageElement.textContent = message;
  
  chatbotMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Add quick replies to the chat
 */
function addQuickReplies() {
  const chatbotQuickReplies = document.querySelector('.chatbot-quick-replies');
  
  // Clear existing quick replies
  chatbotQuickReplies.innerHTML = '';
  
  // Add new quick replies
  const quickReplies = [
    'What services do you offer?',
    'How do I book a quote?',
    'Where are you located?',
    'Call me'
  ];
  
  quickReplies.forEach(reply => {
    const button = document.createElement('button');
    button.className = 'quick-reply';
    button.textContent = reply;
    
    button.addEventListener('click', function() {
      const message = this.textContent;
      
      // Add user message to chat
      addUserMessage(message);
      
      // Process message and get response after a short delay
      setTimeout(() => {
        const response = processMessage(message);
        addBotMessage(response);
        
        // Save chat history
        saveChatHistory();
        
        // Add quick replies after bot response
        setTimeout(() => {
          addQuickReplies();
        }, 500);
      }, 500);
    });
    
    chatbotQuickReplies.appendChild(button);
  });
}

/**
 * Process a message and return a response
 * @param {string} message - The message to process
 * @returns {string} - The response
 */
function processMessage(message) {
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Check for service-related questions
  if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide') || lowerMessage.includes('do you do')) {
    return `
      <strong>Our Services:</strong><br>
      • New construction plumbing<br>
      • Remodel construction plumbing<br>
      • Underground services<br>
      • Gas installation<br>
      • Service & repairs (drains, leaks, water heaters)<br>
      • Fast quotes & easy billing<br><br>
      <a href="services.html" class="chatbot-link">View all services</a>
    `;
  }
  
  // Check for quote-related questions
  if (lowerMessage.includes('quote') || lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return `
      <strong>Getting a Quote:</strong><br>
      You can request a quote by:<br>
      1. Filling out our <a href="contact.html" class="chatbot-link">contact form</a><br>
      2. Calling us directly at <a href="tel:2103365115" class="chatbot-link">(210) 336-5115</a><br>
      3. Emailing us at <a href="mailto:office@ctxplumber.com" class="chatbot-link">office@ctxplumber.com</a><br><br>
      We'll get back to you as soon as possible with a detailed quote.
    `;
  }
  
  // Check for location-related questions
  if (lowerMessage.includes('located') || lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    return `
      <strong>Our Location:</strong><br>
      Certified Texas Plumbing is based in Bandera, TX.<br>
      Mailing Address: P.O. Box 399, Bandera, TX 78003<br><br>
      We serve the entire Texas Hill Country area.<br><br>
      <a href="https://maps.google.com/?q=Bandera,TX" target="_blank" class="chatbot-link">View on Google Maps</a>
    `;
  }
  
  // Check for call-related questions
  if (lowerMessage.includes('call') || lowerMessage.includes('phone') || lowerMessage.includes('talk')) {
    return `
      <strong>Contact Us:</strong><br>
      You can call us directly at:<br>
      <a href="tel:2103365115" class="chatbot-link">(210) 336-5115</a><br><br>
      Our office hours are Monday-Friday, 8am-5pm.
    `;
  }
  
  // Check for pricing-related questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('how much')) {
    return `
      <strong>Pricing Information:</strong><br>
      Our pricing varies depending on the specific project requirements. We provide detailed, transparent quotes before beginning any work.<br><br>
      For a personalized quote, please <a href="contact.html" class="chatbot-link">contact us</a> with details about your project.
    `;
  }
  
  // Check for emergency-related questions
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('leak') || lowerMessage.includes('flooding')) {
    return `
      <strong>Emergency Service:</strong><br>
      For plumbing emergencies, please call us immediately at:<br>
      <a href="tel:2103365115" class="chatbot-link">(210) 336-5115</a><br><br>
      We understand that plumbing emergencies can't wait and will respond as quickly as possible.
    `;
  }
  
  // Check for license-related questions
  if (lowerMessage.includes('license') || lowerMessage.includes('certified') || lowerMessage.includes('insured')) {
    return `
      <strong>Licensing & Insurance:</strong><br>
      Certified Texas Plumbing is fully licensed and insured.<br>
      License Number: M41194<br><br>
      We maintain all required certifications and insurance to ensure your project is completed safely and to code.
    `;
  }
  
  // Default response for unrecognized questions
  return `
    I'm not sure I understand your question. Here are some topics I can help with:<br><br>
    • Our services<br>
    • Getting a quote<br>
    • Our location<br>
    • Contact information<br>
    • Pricing information<br>
    • Emergency service<br>
    • Licensing information<br><br>
    Or you can call us directly at <a href="tel:2103365115" class="chatbot-link">(210) 336-5115</a>.
  `;
}

/**
 * Save chat history to localStorage
 */
function saveChatHistory() {
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const messages = chatbotMessages.innerHTML;
  
  localStorage.setItem('ctpChatHistory', messages);
}

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const savedMessages = localStorage.getItem('ctpChatHistory');
  
  if (savedMessages) {
    chatbotMessages.innerHTML = savedMessages;
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}