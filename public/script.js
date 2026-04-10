const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const statusIndicator = document.getElementById('status-indicator');
const moodIndicator = document.getElementById('mood-indicator');
const AgentName = 'Coach Naga';

let conversation = [];
let currentBotMessage = null;
let currentMood = 'neutral';
let conversationCount = 0;
let moodUnlocked = false;
let lastMessageDate = null;

// Mood configurations
const moodConfig = {
    happy: { emoji: '😊', label: 'Happy', color: '#fbbf24' },
    excited: { emoji: '🤗', label: 'Excited', color: '#10b981' },
    neutral: { emoji: '😐', label: 'Neutral', color: '#6b7280' },
    focused: { emoji: '🤨', label: 'Focused', color: '#8b5cf6' },
    confused: { emoji: '🤔', label: 'Confused', color: '#f59e0b' },
    sad: { emoji: '😢', label: 'Sad', color: '#3b82f6' },
    angry: { emoji: '😠', label: 'Angry', color: '#ef4444' },
    annoyed: { emoji: '😤', label: 'Annoyed', color: '#f97316' }
};

// Status messages and configurations
const statusConfig = {
    online: { text: 'Online • Personal Trainer & Fitnes Coach Profesional.', class: 'online' },
    thinking: { text: 'Thinking • Personal Trainer & Fitnes Coach Profesional.', class: 'thinking' },
    quota_exhausted: { text: 'Offline • Sedang istirahat, kembali lagi besok!', class: 'offline' },
    busy: { text: 'Busy • Sedang sibuk, silakan coba lagi nanti.', class: 'busy' },
    offline: { text: 'Offline • Akan segera kembali!', class: 'offline' },
    error: { text: 'Online • Akan segera kembali!', class: 'error' }
};

// Configure marked to treat single newlines as <br>
marked.setOptions({ breaks: true });

// Format time for messages (HH:MM)
function formatTime(date) {
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

// Format date for headers/separators
function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    }
}

// Check if we need a date separator
function shouldAddDateSeparator(messageDate) {
    if (!lastMessageDate) return true;
    return messageDate.toDateString() !== lastMessageDate.toDateString();
}

// Add date separator/header
function addDateSeparator(date) {
    const dateStr = formatDate(date);
    const separatorDiv = document.createElement('div');
    separatorDiv.className = 'date-separator';
    separatorDiv.innerHTML = `<span>${dateStr}</span>`;
    chatBox.appendChild(separatorDiv);
    lastMessageDate = date;
}

let currentStatus = 'online'; // Track current status

// Update coach status
function setStatus(statusType) {
    const config = statusConfig[statusType] || statusConfig.online;
    
    // If status hasn't changed, just update without animation
    if (currentStatus === statusType) {
        statusIndicator.textContent = config.text;
        statusIndicator.className = `profile-status ${config.class}`;
        return;
    }
    
    // Status changed, do animation
    currentStatus = statusType;
    
    // Add float out animation
    statusIndicator.classList.add('status-changing');
    
    // Wait for float out, then change text and float in
    setTimeout(() => {
        statusIndicator.textContent = config.text;
        statusIndicator.className = `profile-status ${config.class} status-entering`;
        
        // Remove entering class after animation
        setTimeout(() => {
            statusIndicator.classList.remove('status-entering');
        }, 500);
    }, 300);
}

// Detect mood from response text
function detectMood(text) {
    const lowerText = text.toLowerCase();
    
    // Check for mood keywords/patterns
    if (lowerText.match(/\b(semangat|mantap|luar biasa|hebat|amazing|keren|gas|wow)\b/i)) {
        return 'excited';
    } else if (lowerText.match(/\b(senang|happy|bahagia|gembira|luar biasa)\b/i)) {
        return 'happy';
    } else if (lowerText.match(/\b(sedih|sad|berduka|prihatin|khawatir)\b/i)) {
        return 'sad';
    } else if (lowerText.match(/\b(marah|angry|kesal|benci|tidak|jangan)\b/i)) {
        return 'angry';
    } else if (lowerText.match(/\b(sebal|annoyed|kesal|irritated)\b/i)) {
        return 'annoyed';
    } else if (lowerText.match(/\b(fokus|focus|concentrate|latih|training|program|teknik)\b/i)) {
        return 'focused';
    } else if (lowerText.match(/\b(bigunung|bingung|confused|tidak yakin|gimana|mungkin|cobacoba)\b/i)) {
        return 'confused';
    }
    
    return 'neutral';
}

// Update mood display
function setMood(moodType) {
    if (!moodConfig[moodType]) moodType = 'neutral';
    
    currentMood = moodType;
    
    // Only show mood after 4 conversations
    if (!moodUnlocked) return;
    
    const mood = moodConfig[moodType];
    
    moodIndicator.className = `mood-indicator ${moodType}`;
    moodIndicator.style.animation = 'none';
    
    // Trigger animation
    setTimeout(() => {
        moodIndicator.style.animation = 'fadeIn 0.4s ease';
    }, 10);
}

// Unlock mood feature after 4 conversations
function checkMoodUnlock() {
    if (conversationCount >= 4 && !moodUnlocked) {
        moodUnlocked = true;
        unlockMoodFeature();
    }
}

// Animate mood feature unlock
function unlockMoodFeature() {
    moodIndicator.style.display = 'flex';
    moodIndicator.style.animation = 'moodUnlock 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // Add a subtle notification effect
    setTimeout(() => {
        moodIndicator.style.animation = 'moodPulse 2s ease-in-out infinite';
    }, 800);
}

// Add ripple effect on button click
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;

    const messageTime = new Date();
    conversation.push({ role: 'user', text: userText });
    
    // Add user message with timestamp
    const userMessageElement = addMessage('user', userText, messageTime, 'sent');
    
    input.value = '';

    setStatus('thinking');
    addThinkingMessage();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversation })
        });

        if (!response.ok) {
            // Handle specific error codes
            if (response.status === 429) {
                try {
                    const errorData = await response.json();
                    if (errorData.type === 'QUOTA_LIMIT') {
                        setStatus('quota_exhausted');
                        updateBotMessage(errorData.message || AgentName + " sudah sangat lelah. Tunggu besok atau hubungi admin untuk info lebih lanjut.",);
                    } else if (errorData.type === 'TOO_MANY_REQUESTS') {
                        setStatus('online'); // Keep online status for rate limiting
                        updateBotMessage(errorData.message || "Kamu mengetik terlalu cepat. Pelan-pelan ya karena " + AgentName + " juga butuh waktu untuk berpikir.",);
                    } else {
                        // Fallback for unknown 429 types
                        setStatus('online'); // Keep online for unknown rate limit types
                        updateBotMessage('Too many requests. Please wait a moment before trying again.');
                    }
                } catch (parseError) {
                    // If we can't parse the response, use generic 429 handling
                    setStatus('online'); // Keep online for parse errors on rate limits
                    updateBotMessage('Too many requests. Please wait a moment before trying again.');
                }
            } else if (response.status === 503) {
                setStatus('busy');
                updateBotMessage("Sebentar, " + AgentName + " sedang sibuk. Coba lagi nanti ya.");
            } else {
                setStatus('error');
                updateBotMessage("Duh maaf, " + AgentName + " lagi ada masalah nih. Coba lagi nanti ya.");
            }
            return;
        }

        const data = await response.json();
        const aiText = data.result || 'Sorry, no response received.';
        
        // Detect mood from response
        const detectedMood = detectMood(aiText);
        if (moodUnlocked) setMood(detectedMood);
        
        updateBotMessage(aiText);
        setStatus('online');
        conversation.push({ role: 'model', text: aiText });
        
        conversationCount++;
        checkMoodUnlock();
        
        // Mark user message as read (since bot responded)
        setTimeout(() => {
            updateMessageStatus(userMessageElement, 'read');
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
        setStatus('offline');
        updateBotMessage('Failed to connect to server. Please check your connection.');
    }
});

// Auto-focus input on page load
window.addEventListener('load', () => {
    setStatus('online');
    moodIndicator.style.display = 'none'; // Hide mood initially
    
    // Add initial date separator
    const now = new Date();
    addDateSeparator(now);
    
    input.focus();
});

function addMessage(role, text, timestamp = new Date(), status = 'sent') {
    const messageDate = new Date(timestamp);
    
    // Add date separator if needed
    if (shouldAddDateSeparator(messageDate)) {
        addDateSeparator(messageDate);
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = marked.parse(text);
    
    // Add timestamp and status
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.innerHTML = `
        <span class="time">${formatTime(messageDate)}</span>
        ${role === 'user' ? `<span class="message-status ${status}">${getStatusIcon(status)}</span>` : ''}
    `;
    messageDiv.appendChild(timeDiv);
    
    chatBox.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);
    
    return messageDiv;
}

// Get status icon for messages
function getStatusIcon(status) {
    switch(status) {
        case 'sent': return '✓';
        case 'delivered': return '✓✓';
        case 'read': return '✓✓';
        default: return '';
    }
}

// Update message status
function updateMessageStatus(messageElement, newStatus) {
    const statusElement = messageElement.querySelector('.message-status');
    if (statusElement) {
        statusElement.className = `message-status ${newStatus}`;
        statusElement.textContent = getStatusIcon(newStatus);
    }
}

function addThinkingMessage() {
    currentBotMessage = document.createElement('div');
    currentBotMessage.className = 'message bot thinking';
    
    // Create animated typing dots
    currentBotMessage.innerHTML = 'Thinking<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    
    chatBox.appendChild(currentBotMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updateBotMessage(text) {
    if (currentBotMessage) {
        const botTime = new Date();
        
        // Add date separator if needed
        if (shouldAddDateSeparator(botTime)) {
            addDateSeparator(botTime);
        }
        
        currentBotMessage.innerHTML = marked.parse(text);
        
        // Add timestamp to bot message
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.innerHTML = `<span class="time">${formatTime(botTime)}</span>`;
        currentBotMessage.appendChild(timeDiv);
        
        currentBotMessage.classList.remove('thinking');
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
