// Replace with your actual Web App URL from your Apps Script deployment
const API_URL = 'https://script.google.com/macros/s/AKfycbwrdeC82-JppPNefQMDG42XZMVWWQwq942S1Zwob-di_0BqWLY-pSB46xeVsEFmFa8E/exec';

document.addEventListener('DOMContentLoaded', () => {

  // Fetch messages from the GET endpoint
  async function fetchMessages() {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwrdeC82-JppPNefQMDG42XZMVWWQwq942S1Zwob-di_0BqWLY-pSB46xeVsEFmFa8E/exec');
      const messages = await response.json();
      console.log("Fetched messages:", messages);
      renderMessages(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }

  // Render messages into the message container.
  // Each message is expected to include a 'row' property (its sheet row number).
  function renderMessages(messages) {
    // Sort messages by date descending (newest first)
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('messageContainer');
    container.innerHTML = messages.map(msg => {
      return `
      <div class="relative w-full aspect-square">
        <div class="absolute inset-0 transform hover:-translate-y-1 transition-transform animate__animated animate__fadeIn">
          <div class="message-heart h-full">
            <div class="absolute inset-0 flex flex-col p-6 z-10">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <i class="ri-user-smile-line text-lg"></i>
                </div>
                <div class="ml-2">
                  <h4 class="font-semibold text-sm text-primary">${msg.name}</h4>
                </div>
              </div>
              <p class="text-gray-600 text-sm flex-grow overflow-y-auto">${msg.message}</p>
              <div class="flex items-center justify-between mt-2">
                <!-- Pass the current button element and the row number to the likeMessage function -->
                <button onclick="likeMessage(this, ${msg.row})" class="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                  <i class="ri-heart-line"></i>
                  <span class="text-sm text-primary">${msg.likes}</span>
                </button>
                <span class="text-xs text-gray-400">${new Date(msg.date).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  // Post a new message using URL-encoded form data
  async function addMessage() {
    const messageInput = document.getElementById('messageInput');
    const authorInput = document.getElementById('authorInput');
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    const formData = new URLSearchParams();
    formData.append('Message', messageText);
    formData.append('Name', authorInput.value.trim() || "Anonymous");

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwrdeC82-JppPNefQMDG42XZMVWWQwq942S1Zwob-di_0BqWLY-pSB46xeVsEFmFa8E/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formData.toString()
      });
      const result = await response.json();
      console.log("POST result:", result);
      if (result.result === "success") {
        messageInput.value = '';
        authorInput.value = '';
        fetchMessages();
        gsap.from("#messageContainer > div:first-child", {
          duration: 0.5,
          y: -50,
          opacity: 0,
          ease: "back.out"
        });
      } else {
        console.error("Error adding message:", result.error);
      }
    } catch (err) {
      console.error("Error in addMessage:", err);
    }
  }

  // Like a message with optimistic UI update
  async function likeMessage(el, row) {
    const span = el.querySelector('span');
    let currentLikes = parseInt(span.textContent) || 0;
    // Immediately update the UI
    span.textContent = currentLikes + 1;
    try {
      const response = await fetch(API_URL + "?action=like&row=" + row);
      const result = await response.json();
      console.log("Like result:", result);
      if (result.status === "success") {
        span.textContent = result.likes;
      } else {
        console.error("Error liking message:", result.message);
        span.textContent = currentLikes;
      }
    } catch (err) {
      console.error("Error in likeMessage:", err);
      span.textContent = currentLikes;
    }
  }

  // Toggle sections (Home and Share)
  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    const activeSection = document.getElementById(sectionId + "Section");
    if (activeSection) activeSection.classList.remove('hidden');
    document.getElementById('homeBtn').classList.remove('text-primary');
    document.getElementById('shareBtn').classList.remove('text-primary');
    document.getElementById(sectionId + "Btn").classList.add('text-primary');
    const jarImage = document.getElementById('jarImage');
    jarImage.style.visibility = sectionId === 'home' ? 'visible' : 'hidden';
  }

  // Update the countdown timer until the end of March 2025
  function updateCountdown() {
    // Set target to March 31, 2025 at 23:59:59
    const target = new Date('2025-03-31T23:59:59');
    const now = new Date();
    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
  }

  // Initialize the app
  fetchMessages();
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Initial GSAP animations
  gsap.from("#homeSection header", {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: "power2.out"
  });
  gsap.from("#countdown > div", {
    duration: 0.8,
    scale: 0,
    opacity: 0,
    stagger: 0.2,
    ease: "back.out(1.7)"
  });

  // Expose functions to the global scope for inline HTML event handlers
  window.showSection = showSection;
  window.addMessage = addMessage;
  window.likeMessage = likeMessage;
});
