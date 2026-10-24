import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Play, 
  Edit, 
  Trash2,
  Trophy,
  Clock,
  Target,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Sparkles,
  Brain,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useStudy } from '../context/StudyContext';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';

const sampleQuestions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    explanation: 'Paris has been the capital of France since 987 AD.'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    explanation: 'Mars appears red due to iron oxide (rust) on its surface.'
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    explanation: 'Basic addition: 2 + 2 = 4.'
  },
];

export function Quizzes() {
  const { quizzes, addQuiz, updateQuiz, deleteQuiz, recordQuizAttempt } = useStudy();
  const toast = useToast();
  
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    questions: [...sampleQuestions],
  });

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (formData.questions.length === 0) {
      toast.error('At least one question is required');
      return;
    }

    if (editingQuiz) {
      updateQuiz(editingQuiz.id, formData);
      toast.success('Quiz updated!');
    } else {
      addQuiz(formData);
      toast.success('Quiz created!');
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      questions: quiz.questions.map(q => ({ ...q })),
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this quiz?')) {
      deleteQuiz(id);
      toast.success('Quiz deleted');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', subject: '', questions: [] });
    setEditingQuiz(null);
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowQuizModal(true);
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
      // Calculate score
      let correct = 0;
      currentQuiz.questions.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) correct++;
      });
      const score = Math.round((correct / currentQuiz.questions.length) * 100);
      recordQuizAttempt(currentQuiz.id, score);
      toast.success(`Quiz completed! Score: ${score}%`);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQ = currentQuiz?.questions[currentQuestion];

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              Quizzes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {quizzes.length} quizzes • Test your knowledge
            </p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }} leftIcon={<Plus className="w-5 h-5" />}>
            Create Quiz
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredQuizzes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {quizzes.length === 0 ? 'No quizzes yet' : 'No matching quizzes'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {quizzes.length === 0 
                  ? 'Create your first quiz to test your knowledge!' 
                  : 'Try adjusting your search'}
              </p>
              {quizzes.length === 0 && (
                <Button onClick={() => { resetForm(); setShowModal(true); }} leftIcon={<Plus className="w-5 h-5" />}>
                  Create Quiz
                </Button>
              )}
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onPlay={() => startQuiz(quiz)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Quiz Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Quiz Title *"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Biology Chapter 1"
              required
            />
            <Input
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Biology"
            />
          </div>
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of what this quiz covers"
            multiline
            rows={2}
          />

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Questions ({formData.questions.length})</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion()} leftIcon={<Plus className="w-4 h-4" />}>
              Add Question
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {formData.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No questions yet. Click "Add Question" to start.</p>
              </div>
            ) : (
              formData.questions.map((question, qIndex) => (
                <QuestionEditor
                  key={qIndex}
                  question={question}
                  index={qIndex}
                  onUpdate={(updated) => updateQuestion(qIndex, updated)}
                  onDelete={() => removeQuestion(qIndex)}
                />
              ))
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" leftIcon={<Sparkles className="w-5 h-5" />}>
              {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quiz Taking Modal */}
      <Modal
        isOpen={showQuizModal}
        onClose={() => { setShowQuizModal(false); setCurrentQuiz(null); }}
        title={currentQuiz?.title}
        size="xl"
      >
        {currentQuiz && !showResults ? (
          <QuizPlayer
            quiz={currentQuiz}
            currentQuestion={currentQuestion}
            totalQuestions={currentQuiz.questions.length}
            currentQ={currentQ}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={answers[currentQuestion] !== undefined}
          />
        ) : currentQuiz && showResults ? (
          <QuizResults
            quiz={currentQuiz}
            answers={answers}
            onClose={() => { setShowQuizModal(false); setCurrentQuiz(null); }}
            onRestart={() => { setCurrentQuestion(0); setAnswers({}); setShowResults(false); }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function QuizCard({ quiz, onPlay, onEdit, onDelete }) {
  const questionCount = quiz.questions?.length || 0;
  
  return (
    <Card className="group flex flex-col h-full">
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {quiz.subject && (
              <Badge variant="accent" size="xs" className="mb-2">{quiz.subject}</Badge>
            )}
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{quiz.title}</h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(quiz)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20" aria-label="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(quiz.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {quiz.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{quiz.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {questionCount} Qs</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~{Math.ceil(questionCount * 0.5)} min</span>
          {quiz.bestScore > 0 && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
              <Trophy className="w-4 h-4" /> Best: {quiz.bestScore}%
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button className="w-full" leftIcon={<Play className="w-5 h-5" />} onClick={onPlay}>
            Start Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionEditor({ question, index, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Question {index + 1}</h4>
          <div className="flex gap-1">
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button onClick={onDelete} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete question">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3">
            <Input
              label="Question"
              value={question.question}
              onChange={(e) => onUpdate({ ...question, question: e.target.value })}
              placeholder="Enter your question"
              required
            />
            <div className="grid gap-2">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct_${index}`}
                    checked={question.correctAnswer === oIndex}
                    onChange={() => onUpdate({ ...question, correctAnswer: oIndex })}
                    className="text-primary-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[oIndex] = e.target.value;
                      onUpdate({ ...question, options: newOptions });
                    }}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              ))}
            </div>
            <Input
              label="Explanation (optional)"
              value={question.explanation}
              onChange={(e) => onUpdate({ ...question, explanation: e.target.value })}
              placeholder="Why is this the correct answer?"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuizPlayer({ quiz, currentQuestion, totalQuestions, currentQ, answers, onAnswer, onNext, onPrev, canGoNext }) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{currentQ.question}</p>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === index;
            return (
              <button
                key={index}
                onClick={() => onAnswer(currentQuestion, index)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <span className="flex items-center gap-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'
                  )}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span>{option}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrev} disabled={currentQuestion === 0} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!canGoNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
          {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

function QuizResults({ quiz, answers, onClose, onRestart }) {
  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) correct++;
  });
  const score = Math.round((correct / quiz.questions.length) * 100);
  const passed = score >= 70;

  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center flex-col bg-gradient-to-br from-primary-500 to-accent-500">
        <span className="text-3xl font-bold text-white">{score}%</span>
        <span className="text-xs text-white/80">Score</span>
      </div>

      <div className={cn('px-6 py-3 rounded-xl font-medium', passed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300')}>
        {passed ? '🎉 Excellent! You passed!' : '📚 Keep practicing!'}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correct}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{quiz.questions.length - correct}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Incorrect</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{quiz.questions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
        </div>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto text-left">
        {quiz.questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-sm font-medium', isCorrect ? 'text-green-600' : 'text-red-600')}>
                  {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">Q{i + 1}: {q.question}</span>
              </div>
              {!isCorrect && (
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">
                  Correct: {q.options[q.correctAnswer]}
                  {q.explanation && ` — ${q.explanation}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" className="flex-1" onClick={onRestart} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Retry Quiz
        </Button>
        <Button className="flex-1" onClick={onClose} leftIcon={<Brain className="w-4 h-4" />}>
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}

function addQuestion() {
  // This will be handled by the parent component
}

function updateQuestion(index, updated) {
  // This will be handled by the parent component
}

function removeQuestion(index) {
  // This will be handled by the parent component
}