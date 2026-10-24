import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_MODE } from '../lib/firebase';
import { useAuth } from './AuthContext';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage in demo mode
  useEffect(() => {
    if (DEMO_MODE && user) {
      const storedFlashcards = localStorage.getItem(`flashcards_${user.uid}`);
      const storedQuizzes = localStorage.getItem(`quizzes_${user.uid}`);
      const storedPlans = localStorage.getItem(`studyPlans_${user.uid}`);
      const storedChat = localStorage.getItem(`chatHistory_${user.uid}`);

      if (storedFlashcards) setFlashcards(JSON.parse(storedFlashcards));
      if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
      if (storedPlans) setStudyPlans(JSON.parse(storedPlans));
      if (storedChat) setChatHistory(JSON.parse(storedChat));
    }
    setLoading(false);
  }, [user]);

  // Save data to localStorage
  useEffect(() => {
    if (DEMO_MODE && user) {
      localStorage.setItem(`flashcards_${user.uid}`, JSON.stringify(flashcards));
    }
  }, [flashcards, user]);

  useEffect(() => {
    if (DEMO_MODE && user) {
      localStorage.setItem(`quizzes_${user.uid}`, JSON.stringify(quizzes));
    }
  }, [quizzes, user]);

  useEffect(() => {
    if (DEMO_MODE && user) {
      localStorage.setItem(`studyPlans_${user.uid}`, JSON.stringify(studyPlans));
    }
  }, [studyPlans, user]);

  useEffect(() => {
    if (DEMO_MODE && user) {
      localStorage.setItem(`chatHistory_${user.uid}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, user]);

  // Flashcard functions
  const addFlashcard = useCallback((flashcard) => {
    const newCard = {
      id: Date.now().toString(),
      ...flashcard,
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      lastReviewed: null,
      difficulty: 'medium',
    };
    setFlashcards(prev => [newCard, ...prev]);
    return newCard;
  }, []);

  const updateFlashcard = useCallback((id, updates) => {
    setFlashcards(prev => prev.map(card => card.id === id ? { ...card, ...updates } : card));
  }, []);

  const deleteFlashcard = useCallback((id) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  }, []);

  const reviewFlashcard = useCallback((id, quality) => {
    setFlashcards(prev => prev.map(card => {
      if (card.id !== id) return card;
      const newReviewCount = card.reviewCount + 1;
      let newDifficulty = card.difficulty;
      if (quality >= 4) newDifficulty = 'easy';
      else if (quality <= 2) newDifficulty = 'hard';
      return {
        ...card,
        reviewCount: newReviewCount,
        lastReviewed: new Date().toISOString(),
        difficulty: newDifficulty,
      };
    }));
  }, []);

  // Quiz functions
  const addQuiz = useCallback((quiz) => {
    const newQuiz = {
      id: Date.now().toString(),
      ...quiz,
      createdAt: new Date().toISOString(),
      attempts: 0,
      bestScore: 0,
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    return newQuiz;
  }, []);

  const updateQuiz = useCallback((id, updates) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  }, []);

  const deleteQuiz = useCallback((id) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
  }, []);

  const recordQuizAttempt = useCallback((id, score) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id !== id) return q;
      const newAttempts = q.attempts + 1;
      const newBestScore = Math.max(q.bestScore, score);
      return { ...q, attempts: newAttempts, bestScore: newBestScore };
    }));
  }, []);

  // Study Plan functions
  const addStudyPlan = useCallback((plan) => {
    const newPlan = {
      id: Date.now().toString(),
      ...plan,
      createdAt: new Date().toISOString(),
      completed: false,
      progress: 0,
    };
    setStudyPlans(prev => [newPlan, ...prev]);
    return newPlan;
  }, []);

  const updateStudyPlan = useCallback((id, updates) => {
    setStudyPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteStudyPlan = useCallback((id) => {
    setStudyPlans(prev => prev.filter(p => p.id !== id));
  }, []);

  // Chat functions
  const addChatMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  // Stats
  const getStats = useCallback(() => {
    const totalFlashcards = flashcards.length;
    const reviewedFlashcards = flashcards.filter(c => c.reviewCount > 0).length;
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizzes.filter(q => q.attempts > 0).length;
    const totalPlans = studyPlans.length;
    const completedPlans = studyPlans.filter(p => p.completed).length;
    const avgQuizScore = quizzes.length > 0 
      ? quizzes.reduce((sum, q) => sum + q.bestScore, 0) / quizzes.length 
      : 0;

    return {
      totalFlashcards,
      reviewedFlashcards,
      totalQuizzes,
      completedQuizzes,
      totalPlans,
      completedPlans,
      avgQuizScore: Math.round(avgQuizScore),
    };
  }, [flashcards, quizzes, studyPlans]);

  const value = {
    flashcards,
    quizzes,
    studyPlans,
    chatHistory,
    loading,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    recordQuizAttempt,
    addStudyPlan,
    updateStudyPlan,
    deleteStudyPlan,
    addChatMessage,
    clearChatHistory,
    getStats,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}