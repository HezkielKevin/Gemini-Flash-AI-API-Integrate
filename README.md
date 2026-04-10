# 🏋️‍♂️ NagaFit Coach - AI Personal Trainer Chatbot

<div align="center">
  <img src="public/profilepictbot.jpg" alt="NagaFit Coach" width="200" height="200" style="border-radius: 50%; object-fit: cover; border: 4px solid #667eea;" />

  <h1>Meet Your AI Personal Trainer</h1>
  <p><strong>Coach Naga</strong> - Legendary Fitness Coach with 100+ Years of Experience</p>

  ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
  ![Express](https://img.shields.io/badge/Express-4.18+-blue?style=for-the-badge&logo=express)
  ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.0-orange?style=for-the-badge&logo=google)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
  ![CSS3](https://img.shields.io/badge/CSS3-Modern-blue?style=for-the-badge&logo=css3)
</div>

## ✨ What is NagaFit Coach?

NagaFit Coach is an intelligent AI-powered chatbot that serves as your personal fitness trainer. Built with Google's Gemini AI, it combines decades of fitness knowledge with modern conversational AI to provide personalized workout advice, nutrition guidance, and motivational support.

### 🎯 Key Features

- **🤖 AI-Powered Conversations**: Advanced Gemini AI integration for natural, contextual responses
- **🏆 Expert Knowledge**: 100+ years of combined fitness expertise across multiple disciplines
- **💪 Comprehensive Training**: Support for strength training, cardio, functional fitness, combat sports, and more
- **🌍 Multilingual Support**: Indonesian and English with regional dialect recognition
- **📱 Mobile-First Design**: Responsive UI optimized for all devices
- **🎨 Beautiful Interface**: Modern chat interface with status indicators and mood detection
- **⚡ Real-time Status**: Live status updates with elegant animations
- **🔒 Secure & Private**: All conversations stay on your device

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nagafit-coach.git
   cd nagafit-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. **Add profile picture** (optional)
   ```bash
   # Place your coach profile image as:
   public/profilepictbot.jpg
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **@google/genai** - Google Gemini AI integration

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Modern styling with animations
- **Marked.js** - Markdown rendering
- **Responsive Design** - Mobile-first approach

### AI & Data
- **Google Gemini 1.0** - Advanced AI model
- **Custom Personality** - Specialized fitness coach persona
- **Contextual Memory** - Conversation history tracking

## 📖 Usage

### Basic Chat
1. Open the app in your browser
2. Type your fitness question or goal
3. Coach Naga will respond with personalized advice

### Example Conversations
```
You: "Saya mau naikkan massa otot, program apa yang cocok?"

Coach: "Mantap jiwa! Kita mulai dengan program bulking yang balanced.
Pertama-tama, nutrisi harus on point..."
```

### Supported Topics
- 🏋️ Strength & Powerlifting
- 🏃 Cardio & Endurance
- 🥊 Combat Sports (Boxing, Muay Thai, BJJ)
- 🧘 Functional Training & Mobility
- 🍎 Nutrition & Diet Planning
- 🎯 Goal Setting & Motivation
- 📊 Progress Tracking

## ⚙️ Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### AI Personality Customization
Edit `config/agent-personality.js` to modify:
- Coach personality and background
- Response style and language
- Supported sports and expertise
- Conversation guidelines

### UI Customization
Modify `public/style.css` for:
- Color schemes
- Animations
- Layout adjustments
- Mobile responsiveness

## 🏗️ Project Structure

```
nagafit-coach/
├── config/
│   └── agent-personality.js    # AI personality & prompts
├── public/
│   ├── index.html             # Main UI
│   ├── script.js              # Frontend logic
│   ├── style.css              # Styling & animations
│   └── profilepictbot.jpg     # Coach profile image
├── index.js                   # Express server
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🎨 Features Showcase

### Mobile-Responsive Design
- Optimized for phones and tablets
- Touch-friendly interface
- Adaptive layouts

### Status System
- **Online**: Ready for training
- **Thinking**: Processing your request
- **Busy**: Server maintenance
- **Resting**: Daily quota reached

### Mood Detection
Coach Naga can detect and respond to your mood:
- 😊 Happy - Motivates with enthusiasm
- 😢 Sad - Provides gentle encouragement
- 😤 Annoyed - Offers calming advice
- 🤔 Confused - Gives clear explanations

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Contribution
- 🆕 New training programs
- 🌐 Additional language support
- 🎨 UI/UX improvements
- 📚 Educational content
- 🐛 Bug fixes

### Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Respect the coach's personality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the conversations
- **Fitness Community** for inspiration and knowledge
- **Open Source Community** for tools and libraries

## �‍💻 About Developer

**Hezkiel Kevin**

Passionate about creating innovative AI-powered applications that make a difference. Specializing in modern web technologies, machine learning integration, and user-centric design.

### Connect with me:
- 🔗 [LinkedIn](https://www.linkedin.com/in/hezwell/)
- 💻 [GitHub](https://github.com/hezkiel-kevin)
- 📧 Email: kevin.hezwell@gmail.com


---

<div align="center">
  <p><strong>Built with ❤️ for fitness enthusiasts worldwide</strong></p>
  <p>Transform your fitness journey with AI-powered guidance</p>
</div>
