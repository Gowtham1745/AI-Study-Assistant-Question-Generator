import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Brain, 
  RotateCcw,
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useStudy } from '../context/StudyContext';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
};

export function Flashcards() {
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, reviewFlashcard } = useStudy();
  const toast = useToast();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showReview, setShowReview] = useState(false);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    subject: '',
    tags: '',
    difficulty: 'medium',
  });

  // Filter and sort flashcards
  const filteredCards = flashcards
    .filter(card => {
      const matchesSearch = card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = filterDifficulty === 'all' || card.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'difficulty': return { hard: 0, medium: 1, easy: 2 }[a.difficulty] - { hard: 0, medium: 1, easy: 2 }[b.difficulty];
        case 'reviews': return b.reviewCount - a.reviewCount;
        default: return 0;
      }
    });

  const dueCards = flashcards.filter(card => {
    if (card.reviewCount === 0) return true;
    const lastReviewed = new Date(card.lastReviewed);
    const daysSince = (Date.now() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 1;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }

    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingCard) {
      updateFlashcard(editingCard.id, { ...formData, tags });
      toast.success('Flashcard updated!');
    } else {
      addFlashcard({ ...formData, tags });
      toast.success('Flashcard created!');
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      question: card.question,
      answer: card.answer,
      subject: card.subject,
      tags: card.tags?.join(', ') || '',
      difficulty: card.difficulty,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this flashcard?')) {
      deleteFlashcard(id);
      toast.success('Flashcard deleted');
    }
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', subject: '', tags: '', difficulty: 'medium' });
    setEditingCard(null);
  };

  const startReview = () => {
    if (dueCards.length === 0) {
      toast.info('No cards due for review!');
      return;
    }
    setReviewQueue(dueCards);
    setCurrentReviewIndex(0);
    setShowAnswer(false);
    setShowReview(true);
  };

  const handleReviewGrade = (quality) => {
    const card = reviewQueue[currentReviewIndex];
    reviewFlashcard(card.id, quality);
    
    if (currentReviewIndex < reviewQueue.length - 1) {
      setCurrentReviewIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setShowReview(false);
      toast.success('Review session complete! 🎉');
    }
  };

  const currentReviewCard = reviewQueue[currentReviewIndex];

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              Flashcards
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {flashcards.length} cards • {dueCards.length} due for review
            </p>
          </div>
          <div className="flex gap-3">
            {dueCards.length > 0 && (
              <Button 
                variant="accent" 
                leftIcon={<RotateCcw className="w-5 h-5" />}
                onClick={startReview}
              >
                Review ({dueCards.length})
              </Button>
            )}
            <Button onClick={() => { resetForm(); setShowModal(true); }} leftIcon={<Plus className="w-5 h-5" />}>
              Add Card
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="difficulty">By Difficulty</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
                <Button variant="ghost" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                  {viewMode === 'grid' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flashcards Grid/List */}
        <div className={cn(viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-3')}>
          {filteredCards.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {flashcards.length === 0 ? 'No flashcards yet' : 'No matching flashcards'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {flashcards.length === 0 
                  ? 'Create your first flashcard to start learning!' 
                  : 'Try adjusting your search or filters'}
              </p>
              {flashcards.length === 0 && (
                <Button onClick={() => { resetForm(); setShowModal(true); }} leftIcon={<Plus className="w-5 h-5" />}>
                  Create Flashcard
                </Button>
              )}
            </div>
          ) : (
            filteredCards.map((card) => (
              <FlashcardCard
                key={card.id}
                card={card}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Stats */}
        {flashcards.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <StatItem label="Total Cards" value={flashcards.length} icon={Brain} color="primary" />
                <StatItem label="Due for Review" value={dueCards.length} icon={RotateCcw} color="warning" />
                <StatItem label="Mastered" value={flashcards.filter(c => c.difficulty === 'easy' && c.reviewCount > 3).length} icon={Sparkles} color="success" />
                <StatItem label="Total Reviews" value={flashcards.reduce((sum, c) => sum + c.reviewCount, 0)} icon={RotateCcw} color="accent" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingCard ? 'Edit Flashcard' : 'Create Flashcard'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Question *"
            name="question"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            placeholder="What is the capital of France?"
            required
            multiline
            rows={3}
          />
          <Input
            label="Answer *"
            name="answer"
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            placeholder="Paris"
            required
            multiline
            rows={3}
          />
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Geography, Biology, etc."
          />
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="capital, europe, france"
            helperText="Separate tags with commas"
          />
          <div>
            <label className="label">Difficulty</label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={formData.difficulty === level ? 'primary' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" leftIcon={<Sparkles className="w-5 h-5" />}>
              {editingCard ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        title="Review Session"
        size="lg"
      >
        {currentReviewCard ? (
          <div className="text-center space-y-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Card {currentReviewIndex + 1} of {reviewQueue.length}</span>
              <Badge variant={difficultyColors[currentReviewCard.difficulty]} size="sm">
                {currentReviewCard.difficulty}
              </Badge>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 min-h-[200px] flex items-center justify-center">
              <div className="w-full max-w-xl text-center">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Question</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{currentReviewCard.question}</p>
                
                {!showAnswer ? (
                  <Button onClick={() => setShowAnswer(true)} size="lg" className="w-full">
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Answer</p>
                      <p className="text-xl text-gray-900 dark:text-white whitespace-pre-wrap">{currentReviewCard.answer}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400">How well did you know this?</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="danger" onClick={() => handleReviewGrade(0)} className="py-3">
                        Again
                      </Button>
                      <Button variant="warning" onClick={() => handleReviewGrade(3)} className="py-3">
                        Hard
                      </Button>
                      <Button variant="primary" onClick={() => handleReviewGrade(5)} className="py-3">
                        Good
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Session Complete!</h3>
            <p className="text-gray-500 dark:text-gray-400">Great job reviewing your flashcards.</p>
            <Button onClick={() => setShowReview(false)} className="mt-4">Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function FlashcardCard({ card, viewMode, onEdit, onDelete }) {
  return (
    <Card className={cn('group', viewMode === 'list' ? 'flex' : 'flex flex-col')}>
      <CardContent className={cn('p-4 flex-1 flex flex-col', viewMode === 'list' ? 'flex-row items-center' : '')}>
        <div className={cn('flex-1', viewMode === 'list' ? 'pr-4' : '')}>
          <div className="flex items-start justify-between gap-2 mb-3">
            {card.subject && (
              <Badge variant="primary" size="xs">{card.subject}</Badge>
            )}
            <div className="flex items-center gap-1">
              <Badge 
                variant={difficultyColors[card.difficulty]} 
                size="xs"
                dot
              >
                {card.difficulty}
              </Badge>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(card)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20" aria-label="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(card.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <p className={cn('font-medium text-gray-900 dark:text-white', viewMode === 'list' ? 'text-lg' : 'text-base')}>
            {card.question}
          </p>
          
          {viewMode === 'grid' && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{card.answer}</p>
            </div>
          )}
        </div>

        {viewMode === 'list' && (
          <div className="flex flex-col items-end gap-2 pl-4 border-l border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md line-clamp-1">{card.answer}</p>
            <div className="flex gap-1 text-xs text-gray-400">
              <span>{card.reviewCount} reviews</span>
              {card.lastReviewed && (
                <span>• Last: {new Date(card.lastReviewed).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>{card.reviewCount} reviews</span>
            {card.lastReviewed && (
              <span>Reviewed {new Date(card.lastReviewed).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value, icon: Icon, color }) {
  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="w-10 h-10 rounded-xl bg-{color}-100 dark:bg-{color}-900/30 flex items-center justify-center mx-auto mb-2">
        <Icon className="w-5 h-5 text-{color}-600 dark:text-{color}-400" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}