import { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Target, 
  CheckCircle, 
  Circle,
  Edit, 
  Trash2,
  Play,
  Pause,
  Flag,
  Clock,
  BookOpen,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useStudy } from '../context/StudyContext';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science', 'Languages', 'Other'];

export function StudyPlans() {
  const { studyPlans, addStudyPlan, updateStudyPlan, deleteStudyPlan } = useStudy();
  const toast = useToast();
  
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [activePlanId, setActivePlanId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    targetDate: '',
    dailyHours: 1,
    topics: [''],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const topics = formData.topics.filter(t => t.trim()).map(t => ({ title: t.trim(), completed: false }));

    if (editingPlan) {
      updateStudyPlan(editingPlan.id, { ...formData, topics });
      toast.success('Study plan updated!');
    } else {
      addStudyPlan({ ...formData, topics });
      toast.success('Study plan created!');
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      subject: plan.subject,
      description: plan.description,
      targetDate: plan.targetDate || '',
      dailyHours: plan.dailyHours || 1,
      topics: plan.topics?.map(t => t.title) || [''],
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this study plan?')) {
      deleteStudyPlan(id);
      toast.success('Study plan deleted');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subject: '', description: '', targetDate: '', dailyHours: 1, topics: [''] });
    setEditingPlan(null);
  };

  const addTopic = () => {
    setFormData(prev => ({ ...prev, topics: [...prev.topics, ''] }));
  };

  const removeTopic = (index) => {
    if (formData.topics.length > 1) {
      setFormData(prev => ({ ...prev, topics: prev.topics.filter((_, i) => i !== index) }));
    }
  };

  const updateTopic = (index, value) => {
    setFormData(prev => {
      const newTopics = [...prev.topics];
      newTopics[index] = value;
      return { ...prev, topics: newTopics };
    });
  };

  const toggleTopicComplete = (planId, topicIndex) => {
    const plan = studyPlans.find(p => p.id === planId);
    if (!plan) return;
    
    const updatedTopics = plan.topics.map((t, i) => 
      i === topicIndex ? { ...t, completed: !t.completed } : t
    );
    
    const completedCount = updatedTopics.filter(t => t.completed).length;
    const progress = Math.round((completedCount / updatedTopics.length) * 100);
    
    updateStudyPlan(planId, { 
      topics: updatedTopics, 
      progress,
      completed: progress === 100 
    });
  };

  const startPlan = (plan) => {
    setActivePlanId(activePlanId === plan.id ? null : plan.id);
  };

  const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const activePlans = studyPlans.filter(p => !p.completed);
  const completedPlans = studyPlans.filter(p => p.completed);

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              Study Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {studyPlans.length} plans • {activePlans.length} active • {completedPlans.length} completed
            </p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }} leftIcon={<Plus className="w-5 h-5" />}>
            Create Plan
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Active Plans" 
            value={activePlans.length} 
            icon={Target} 
            color="primary" 
            subtitle={`${activePlans.reduce((sum, p) => sum + (p.dailyHours || 0), 0)} hrs/day total`}
          />
          <StatCard 
            title="Completed" 
            value={completedPlans.length} 
            icon={CheckCircle} 
            color="success" 
            subtitle="Well done!"
          />
          <StatCard 
            title="Avg Progress" 
            value={`${studyPlans.length > 0 ? Math.round(studyPlans.reduce((sum, p) => sum + (p.progress || 0), 0) / studyPlans.length) : 0}%`} 
            icon={TrendingUp} 
            color="warning" 
            subtitle="Overall completion"
          />
          <StatCard 
            title="Total Hours" 
            value={studyPlans.reduce((sum, p) => sum + (p.dailyHours || 0) * 30, 0)} 
            icon={Clock} 
            color="accent" 
            subtitle="Estimated this month"
          />
        </div>

        {/* Active Plans */}
        {activePlans.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary-600" />
              Active Plans
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activePlans.map((plan) => (
                <StudyPlanCard
                  key={plan.id}
                  plan={plan}
                  daysRemaining={getDaysRemaining(plan.targetDate)}
                  isActive={activePlanId === plan.id}
                  onToggleTopic={(topicIndex) => toggleTopicComplete(plan.id, topicIndex)}
                  onStart={() => startPlan(plan)}
                  onEdit={() => handleEdit(plan)}
                  onDelete={() => handleDelete(plan.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed Plans */}
        {completedPlans.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Plans
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedPlans.map((plan) => (
                <StudyPlanCard
                  key={plan.id}
                  plan={plan}
                  daysRemaining={null}
                  isActive={false}
                  onToggleTopic={() => {}}
                  onStart={() => {}}
                  onEdit={() => handleEdit(plan)}
                  onDelete={() => handleDelete(plan.id)}
                  completed
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {studyPlans.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No study plans yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first study plan to organize your learning journey</p>
            <Button onClick={() => { resetForm(); setShowModal(true); }} leftIcon={<Plus className="w-5 h-5" />}>
              Create Study Plan
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingPlan ? 'Edit Study Plan' : 'Create Study Plan'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Plan Title *"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Calculus Final Exam Prep"
              required
            />
            <select
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="input"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="What's the goal of this study plan?"
            multiline
            rows={2}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Target Date"
              name="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
            />
            <div>
              <label className="label">Daily Study Hours</label>
              <select
                value={formData.dailyHours}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyHours: parseInt(e.target.value) }))}
                className="input"
              >
                {[0.5, 1, 1.5, 2, 2.5, 3, 4].map(h => (
                  <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Study Topics</h3>
              <Button type="button" variant="ghost" size="sm" onClick={addTopic} leftIcon={<Plus className="w-4 h-4" />}>
                Add Topic
              </Button>
            </div>
            <div className="space-y-2">
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    placeholder={`Topic ${index + 1}`}
                    className="flex-1 input"
                  />
                  {formData.topics.length > 1 && (
                    <button type="button" onClick={() => removeTopic(index)} className="p-2 text-gray-400 hover:text-red-600" aria-label="Remove topic">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" leftIcon={<Sparkles className="w-5 h-5" />}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StudyPlanCard({ plan, daysRemaining, isActive, onToggleTopic, onStart, onEdit, onDelete, completed }) {
  const completedTopics = plan.topics?.filter(t => t.completed).length || 0;
  const totalTopics = plan.topics?.length || 0;
  const progress = plan.progress || (totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0);

  return (
    <Card className={cn('group', completed && 'opacity-75')}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {plan.subject && <Badge variant="accent" size="xs">{plan.subject}</Badge>}
              {completed && <Badge variant="success" size="xs" dot><CheckCircle className="w-3 h-3" /> Completed</Badge>}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{plan.title}</h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20" aria-label="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {plan.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{plan.description}</p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', 
                completed ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-accent-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{completedTopics}/{totalTopics} topics</span>
            {daysRemaining !== null && (
              <span className={cn('font-medium', daysRemaining < 0 ? 'text-red-500' : daysRemaining <= 3 ? 'text-yellow-500' : 'text-green-500')}>
                {daysRemaining < 0 ? 'Overdue' : daysRemaining === 0 ? 'Due today' : `${daysRemaining} days left`}
              </span>
            )}
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
          {plan.topics?.map((topic, index) => (
            <button
              key={index}
              onClick={() => !completed && onToggleTopic(index)}
              className={cn(
                'w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors',
                completed || topic.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
              )}
              disabled={completed}
            >
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                topic.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300 dark:border-gray-600'
              )}>
                {topic.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={cn('text-sm flex-1 truncate', topic.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300')}>
                {topic.title}
              </span>
              {!completed && !topic.completed && (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!completed && (
            <>
              <Button 
                variant={isActive ? "primary" : "outline"} 
                className="flex-1" 
                onClick={onStart}
                leftIcon={isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              >
                {isActive ? 'Active' : 'Start'}
              </Button>
            </>
          )}
          {completed && (
            <Button variant="ghost" className="flex-1" disabled>
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', `bg-${color}-100 dark:bg-${color}-900/30`)}>
            <Icon className={cn('w-6 h-6', `text-${color}-600 dark:text-${color}-400`)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}