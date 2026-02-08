# Alex Smart AI - English Learning App for Grade 5

Interactive English learning application with AI-powered conversation practice for Vietnamese students.

## 🎯 Features

- **2 Learning Modes:**
  - **Alex Asks Mode**: AI asks questions, student answers (20 units from textbook)
  - **Student Asks Mode**: Student asks questions, AI (Alex) answers

- **AI-Powered Features:**
  - Smart answer checking using OpenAI GPT-4o-mini
  - Natural conversation flow
  - Error correction with feedback
  - Encouraging responses

- **Learning Tools:**
  - ⭐ Star rewards for correct answers
  - 🎵 Audio feedback (success/error sounds)
  - 📝 Wrong answer tracking (click to hear pronunciation)
  - 🥇 Certificate upon completion
  - 🎤 Voice input (browser SpeechRecognition)
  - 🔊 Voice output (browser SpeechSynthesis)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Configure OpenAI API Key

Edit `.env.local` and add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server
```bash
yarn dev
```

Open http://localhost:3000 in your browser (Chrome or Edge recommended for speech recognition)

### 4. Build for Production
```bash
yarn build
yarn start
```

## 📚 Usage Guide

1. **Enter Student Info**: Name and Class (optional)
2. **Select Mode**:
   - Alex Asks (Alex hỏi) - For practice mode
   - Student Asks (Alex trả lời) - For Q&A mode
3. **Choose Unit**: Select from 20 units (All about me, Our homes, etc.)
4. **Click START SPEAKING**: Speak in English when prompted
5. **Review Mistakes**: Click on wrong answers to hear correct pronunciation
6. **Get Certificate**: Complete all questions to receive certificate

## 🎨 UI Design

- **Blue Theme**: Professional educational design (#0d47a1, #1976d2)
- **Orange Error Box**: Clickable error correction (#ff6d00)
- **Gold Certificate**: Achievement recognition with signatures
- **Responsive Layout**: Works on desktop and tablet

## 🔧 Technical Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: OpenAI GPT-4o-mini API
- **Fonts**: Lexend (main), Dancing Script (certificate)
- **Audio**: Web Audio API, SpeechSynthesis, SpeechRecognition

## 📂 Project Structure

```
english-win/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main UI component
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Tailwind styles
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts      # OpenAI API handler
│   └── lib/
│       └── data.ts               # 20 units data
├── .env.local                     # OpenAI API key (YOU NEED TO ADD THIS!)
└── package.json
```

## 🎓 20 Units Content

1. All about me!
2. Our homes
3. My foreign friends
4. Our free-time activities
5. My future job
6. Our school rooms
7. Our favourite school activities
8. In our classroom
9. Our outdoor activities
10. Our school trip
11. Family time
12. Our Tet holiday
13. Our special days
14. Staying healthy
15. Our health
16. Seasons and the weather
17. Stories for children
18. Means of transport
19. Places of interest
20. Our summer holidays

## ⚙️ OpenAI Configuration

The app uses GPT-4o-mini with two different prompts:

### Mode 1 (Alex Asks - Check Answer):
- Evaluates student answers for correctness
- Provides encouraging feedback
- Returns corrected answer if wrong
- Tolerates grammar mistakes if meaning is clear

### Mode 2 (Student Asks - AI Answers):
- Answers questions about current unit
- Maintains Alex's persona (10-year-old, class 5/1)
- Uses unit context to provide accurate answers
- Simple and friendly responses

## 🌐 Browser Support

**Recommended**: Chrome, Edge (full speech recognition support)
**Limited**: Firefox, Safari (may not support speech recognition)

## 💡 Tips for Teachers

- Ensure students use Chrome or Edge browser
- Test microphone permissions before starting
- Encourage students to speak clearly
- Review wrong answers section after each session
- Use certificates as motivation

## 🐛 Troubleshooting

**"Speech recognition not supported"**: Use Chrome or Edge browser

**"OpenAI API key not configured"**: Check `.env.local` file has correct API key

**Microphone not working**: Check browser permissions for microphone access

**No sound**: Check browser volume and text-to-speech settings

## 📝 Notes

- API costs approximately $0.001-0.002 per conversation (very cheap!)
- All 20 units data included from grade 5 textbook
- Supports both Vietnamese and English interfaces
- Optimized for educational use

---

Made with ❤️ for Vietnamese students learning English
