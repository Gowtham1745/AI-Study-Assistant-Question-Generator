import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BookOpen, ArrowRight } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { StudyProvider } from './context/StudyContext';
import { Navbar } from './components/layout/Navbar';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AITutor } from './pages/AITutor';
import { Flashcards } from './pages/Flashcards';
import { Quizzes } from './pages/Quizzes';
import { StudyPlans } from './pages/StudyPlans';
import { Settings } from './pages/Settings';
import { Button } from './components/ui/Button';
import './index.css';

function NameGate() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    await updateProfile({ displayName: name.trim() });
    navigate('/dashboard');
  };

  if (user?.displayName) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"><BookOpen className="h-9 w-9" /></div>
        <p className="mb-3 text-lg font-bold gradient-text">StudyAI</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Your study space. No account needed.</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">What should we call you? Your name is saved only in this browser.</p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-4">
          <input value={name} onChange={(event) => { setName(event.target.value); setError(''); }} placeholder="Enter your name" aria-label="Your name" autoComplete="given-name" maxLength={60} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white" autoFocus />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" rightIcon={<ArrowRight className="h-5 w-5" />}>Start studying</Button>
        </form>
        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">Free to use · No login · No password · No email required</p>
      </div>
    </div>
  );
}

function MainLayout() {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950"><Navbar /><MobileSidebar /><main className="pb-16"><Outlet /></main></div>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <HashRouter>
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
            <Routes>
              <Route path="/" element={<NameGate />} />
              <Route path="/home" element={<LandingPage />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tutor" element={<AITutor />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/plans" element={<StudyPlans />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
