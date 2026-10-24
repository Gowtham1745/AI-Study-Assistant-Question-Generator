import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Bot, 
  Target, 
  HelpCircle, 
  TrendingUp, 
  Clock,
  Flame,
  Award,
  Plus,
  ArrowRight,
  CheckCircle,
  Brain
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

const quickActions = [
  { name: 'AI Tutor', href: '/tutor', icon: Bot, color: 'primary', desc: 'Chat with AI tutor' },
  { name: 'Flashcards', href: '/flashcards', icon: BookOpen, color: 'accent', desc: 'Review flashcards' },
  { name: 'Quizzes', href: '/quizzes', icon: HelpCircle, color: 'success', desc: 'Take a quiz' },
  { name: 'Study Plans', href: '/plans', icon: Target, color: 'warning', desc: 'Create a plan' },
];

export function Dashboard() {
  const { user } = useAuth();
  const { getStats, flashcards, quizzes, studyPlans } = useStudy();
  const { theme } = useTheme();
  const [recentActivity, setRecentActivity] = useState([]);

  const stats = getStats();
  const dueFlashcards = flashcards.filter(c => {
    if (c.reviewCount === 0) return true;
    const lastReviewed = new Date(c.lastReviewed);
    const daysSince = (Date.now() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 1;
  }).length;

  const statCards = [
    {
      title: 'Flashcards',
      value: stats.totalFlashcards,
      subtitle: `${dueFlashcards} due for review`,
      icon: BookOpen,
      color: 'primary',
      href: '/flashcards',
    },
    {
      title: 'Quizzes',
      value: stats.totalQuizzes,
      subtitle: `${stats.completedQuizzes} completed`,
      icon: HelpCircle,
      color: 'accent',
      href: '/quizzes',
    },
    {
      title: 'Study Plans',
      value: stats.totalPlans,
      subtitle: `${stats.completedPlans} completed`,
      icon: Target,
      color: 'success',
      href: '/plans',
    },
    {
      title: 'Avg Score',
      value: `${stats.avgQuizScore}%`,
      subtitle: 'Quiz performance',
      icon: TrendingUp,
      color: 'warning',
      href: '/quizzes',
    },
  ];

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's your learning progress overview
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/flashcards">
              <Button leftIcon={<Plus className="w-5 h-5" />}>Add Flashcard</Button>
            </Link>
            <Link to="/tutor">
              <Button variant="outline" leftIcon={<Bot className="w-5 h-5" />}>AI Tutor</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.href} className="card-hover group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', `bg-${stat.color}-100 dark:bg-${stat.color}-900/30`)}>
                    <stat.icon className={cn('w-6 h-6', `text-${stat.color}-600 dark:text-${stat.color}-400`)} />
                  </div>
                </div>
                <ArrowRight className={cn('w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors absolute bottom-4 right-4')} />
              </CardContent>
            </Link>
          ))}
        </div>

        {/* Quick Actions & Progress */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Link key={action.name} to={action.href} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', `bg-${action.color}-100 dark:bg-${action.color}-900/30`)}>
                        <action.icon className={cn('w-5 h-5', `text-${action.color}-600 dark:text-${action.color}-400`)} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{action.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
                      </div>
                      <ArrowRight className={cn('w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors')} />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">7 days</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: '70%' }} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Keep it up! 3 more days for a new badge.</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h2>
                  <Badge variant="primary" size="sm">This Week</Badge>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Mon', value: 45, max: 60 },
                    { label: 'Tue', value: 60, max: 60 },
                    { label: 'Wed', value: 30, max: 60 },
                    { label: 'Thu', value: 50, max: 60 },
                    { label: 'Fri', value: 55, max: 60 },
                    { label: 'Sat', value: 20, max: 60 },
                    { label: 'Sun', value: 10, max: 60 },
                  ].map((day) => (
                    <div key={day.label} className="flex items-center gap-4">
                      <span className="w-10 text-sm font-medium text-gray-500 dark:text-gray-400">{day.label}</span>
                      <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                          style={{ width: `${(day.value / day.max) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm text-right text-gray-600 dark:text-gray-400">{day.value}min</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Due Flashcards */}
            {dueFlashcards > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Due for Review</h2>
                    <Link to="/flashcards" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View all {dueFlashcards}
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {flashcards.filter(c => c.reviewCount === 0 || (c.lastReviewed && (Date.now() - new Date(c.lastReviewed).getTime()) / (1000 * 60 * 60 * 24) >= 1)).slice(0, 3).map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{card.question}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {card.reviewCount === 0 ? 'New card' : 'Due for review'}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={card.difficulty === 'easy' ? 'success' : card.difficulty === 'hard' ? 'danger' : 'warning'} 
                          size="sm"
                        >
                          {card.difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Quizzes */}
            {quizzes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Quizzes</h2>
                    <Link to="/quizzes" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {quizzes.slice(0, 3).map((quiz) => (
                      <Link key={quiz.id} to={`/quizzes/${quiz.id}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{quiz.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.questions?.length || 0} questions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {quiz.bestScore > 0 ? `${quiz.bestScore}%` : 'Not attempted'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{quiz.attempts} attempts</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Award, label: 'First Quiz', earned: stats.completedQuizzes > 0, color: 'warning' },
                    { icon: BookOpen, label: 'Card Master', earned: stats.reviewedFlashcards >= 10, color: 'primary' },
                    { icon: Target, label: 'Planner', earned: stats.completedPlans > 0, color: 'success' },
                    { icon: Flame, label: 'Week Streak', earned: true, color: 'danger' },
                  ].map((achievement) => (
                    <div 
                      key={achievement.label}
                      className={cn(
                        'p-4 rounded-xl text-center transition-all',
                        achievement.earned 
                          ? `bg-${achievement.color}-50 dark:bg-${achievement.color}-900/20 border border-${achievement.color}-200 dark:border-${achievement.color}-800`
                          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-50'
                      )}
                    >
                      <div className={cn('w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center', 
                        achievement.earned 
                          ? `bg-${achievement.color}-100 dark:bg-${achievement.color}-900/30`
                          : 'bg-gray-100 dark:bg-gray-700'
                      )}>
                        <achievement.icon className={cn('w-6 h-6', 
                          achievement.earned 
                            ? `text-${achievement.color}-600 dark:text-${achievement.color}-400`
                            : 'text-gray-400 dark:text-gray-500'
                        )} />
                      </div>
                      <p className={cn('text-sm font-medium', 
                        achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                      )}>{achievement.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}