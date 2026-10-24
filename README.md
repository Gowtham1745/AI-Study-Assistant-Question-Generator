# StudyAI - AI-Powered Study Assistant

A modern, feature-rich study application built with React, Vite, Tailwind CSS, and Firebase. Study smarter with AI-powered flashcards, quizzes, study plans, and an intelligent AI tutor.

## Features

### 🤖 AI Tutor
- Chat with an AI tutor for instant explanations
- Generate study materials on-demand
- Get personalized learning recommendations

### 📇 Smart Flashcards
- Create and organize flashcards by subject
- Spaced repetition algorithm for optimal retention
- Review sessions with difficulty tracking
- Tag-based organization

### 📝 Interactive Quizzes
- Create custom quizzes with multiple choice questions
- Instant feedback with explanations
- Track scores and attempts
- Timed quiz sessions

### 📅 Study Plans
- Build personalized study schedules
- Set daily study goals
- Track progress with visual indicators
- Topic-based organization with completion tracking

### 📊 Progress Analytics
- Dashboard with learning statistics
- Weekly progress charts
- Streak tracking
- Achievement badges

### 🎨 Modern UI/UX
- Dark/Light mode with system preference detection
- Smooth animations and transitions
- Fully responsive design
- Accessible components

### 🔐 Authentication
- Email/password authentication
- User profiles with avatars
- Secure session management
- Demo mode (works without Firebase)

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Firebase Auth (with demo mode fallback)
- **UI Components**: Headless UI + Lucide Icons
- **Animations**: Framer Motion / CSS Animations
- **Notifications**: React Hot Toast
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-study-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional - for Firebase):
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Demo Mode

The app works out-of-the-box without any backend configuration! It uses localStorage for data persistence and simulates authentication. Just sign up with any email/password to get started.

### Firebase Setup (Optional)

For production use with real authentication:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication > Email/Password
3. Copy your config from Project Settings > General > Your apps
4. Add the config to your `.env` file
5. Restart the dev server

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Avatar.jsx
│   │   └── Badge.jsx
│   └── layout/       # Layout components
│       ├── Navbar.jsx
│       └── MobileSidebar.jsx
├── context/          # React Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── StudyContext.jsx
├── hooks/            # Custom hooks
│   └── useToast.js
├── lib/              # Utilities
│   ├── utils.js
│   └── firebase.js
├── pages/            # Page components
│   ├── LandingPage.jsx
│   ├── AuthPage.jsx
│   ├── Dashboard.jsx
│   ├── AITutor.jsx
│   ├── Flashcards.jsx
│   ├── Quizzes.jsx
│   ├── StudyPlans.jsx
│   └── Settings.jsx
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global styles + Tailwind
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Theming

Edit `tailwind.config.js` to customize:
- Color palette
- Animations
- Spacing
- Typography

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/layout/Navbar.jsx`

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for students everywhere. Happy studying!