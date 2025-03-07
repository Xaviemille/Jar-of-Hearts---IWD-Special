function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(`${sectionId}Section`).classList.remove('hidden');
    // Update button states
    document.getElementById('homeBtn').classList.remove('text-primary');
    document.getElementById('shareBtn').classList.remove('text-primary');
    document.getElementById(`${sectionId}Btn`).classList.add('text-primary');
    // Show/hide jar image
    const jarImage = document.getElementById('jarImage');
    jarImage.style.visibility = sectionId === 'home' ? 'visible' : 'hidden';
  }
  
  const messages = [
    { id: 1, name: "Emma Thompson", message: "Empowered women empower women. Let's celebrate our achievements together! 🌟", likes: 42 },
    { id: 2, name: "Sarah Mitchell", message: "Every day is a chance to make a difference. Keep shining bright! ✨", likes: 38 },
    { id: 3, name: "Isabella Garcia", message: "Here's to strong women: may we know them, may we be them, may we raise them! 💪", likes: 56 },
    { id: 4, name: "Olivia Wilson", message: "Your potential is limitless. Dream big and achieve bigger! 🚀", likes: 29 },
    { id: 5, name: "Sophie Anderson", message: "Together we can create a world of equal opportunities. Keep pushing forward! 🌈", likes: 45 },
    { id: 6, name: "Charlotte Davis", message: "You are stronger than you know. Never doubt your capabilities! ❤️", likes: 33 }
  ];
  
  function renderMessages() {
    messages.sort((a, b) => b.likes - a.likes);
    const container = document.getElementById('messageContainer');
    container.innerHTML = messages.map(msg => `
      <div class="relative w-full aspect-square">
        <div class="absolute inset-0 transform hover:-translate-y-1 transition-transform animate__animated animate__fadeIn">
          <div class="message-heart h-full">
            <div class="absolute inset-0 flex flex-col p-6 z-10">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <i class="ri-user-smile-line text-lg"></i>
                </div>
                <div class="ml-2">
                  <h4 class="font-semibold text-sm">${msg.name}</h4>
                </div>
              </div>
              <p class="text-gray-600 text-sm flex-grow overflow-y-auto">${msg.message}</p>
              <div class="flex items-center justify-between mt-2">
                <button onclick="likeMessage(${msg.id})" class="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                  <i class="ri-heart-line"></i>
                  <span class="text-sm">${msg.likes}</span>
                </button>
                <span class="text-xs text-gray-400">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  function likeMessage(id) {
    const message = messages.find(m => m.id === id);
    if (message) {
      message.likes++;
      const heartIcon = event.target.closest('button').querySelector('i');
      heartIcon.classList.remove('ri-heart-line');
      heartIcon.classList.add('ri-heart-fill', 'text-primary');
      gsap.to(heartIcon, {
        scale: 1.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      setTimeout(() => renderMessages(), 500);
    }
  }
  
  function addMessage() {
    const messageInput = document.getElementById('messageInput');
    const authorInput = document.getElementById('authorInput');
    if (messageInput.value.trim()) {
      messages.unshift({
        id: messages.length + 1,
        name: authorInput.value.trim() || "Anonymous",
        message: messageInput.value,
        likes: 0
      });
      messageInput.value = '';
      authorInput.value = '';
      renderMessages();
      gsap.from("#messageContainer > div:first-child", {
        duration: 0.5,
        y: -50,
        opacity: 0,
        ease: "back.out"
      });
    }
  }
  
  function updateCountdown() {
    const target = new Date('2025-03-08T00:00:00');
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
  
  renderMessages();
  setInterval(updateCountdown, 1000);
  updateCountdown();
  
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
  document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('show', () => {
      gsap.from(section.children, {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  });
  