import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { StudyProvider } from './context/StudyContext';
import { Navbar } from './components/layout/Navbar';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AITutor } from './pages/AITutor';
import { Flashcards } from './pages/Flashcards';
import { Quizzes } from './pages/Quizzes';
import { StudyPlans } from './pages/StudyPlans';
import { Settings } from './pages/Settings';
import './index.css';

// Protected Route Wrapper
function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}

// Public Route Wrapper (redirect if logged in)
function PublicRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

// Main Layout with Navbar
function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <MobileSidebar />
      <main className="pb-16">
        <Outlet />
      </main>
    </div>
  );
}

// Landing Layout (no navbar)
function LandingLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <HashRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              {/* Public Routes */}
              <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tutor" element={<AITutor />} />
                  <Route path="/flashcards" element={<Flashcards />} />
                  <Route path="/quizzes" element={<Quizzes />} />
                  <Route path="/plans" element={<StudyPlans />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;