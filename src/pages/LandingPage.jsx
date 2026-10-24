import { Link } from 'react-router-dom';
import { 
  Bot, 
  BookOpen, 
  Target, 
  Zap, 
  Brain, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

const features = [
  {
    icon: Bot,
    title: 'AI Tutor',
    description: 'Chat with an AI tutor that explains concepts, answers questions, and helps you understand difficult topics.',
    color: 'primary',
  },
  {
    icon: BookOpen,
    title: 'Smart Flashcards',
    description: 'Create and review flashcards with spaced repetition algorithm for optimal retention.',
    color: 'accent',
  },
  {
    icon: Target,
    title: 'Personalized Quizzes',
    description: 'Generate custom quizzes based on your study material with instant feedback and explanations.',
    color: 'success',
  },
  {
    icon: Zap,
    title: 'Study Plans',
    description: 'AI-generated study schedules tailored to your goals, timeline, and learning style.',
    color: 'warning',
  },
  {
    icon: Brain,
    title: 'Progress Tracking',
    description: 'Detailed analytics and insights to monitor your learning progress and identify weak areas.',
    color: 'info',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Share study materials, compete with friends, and learn together in study groups.',
    color: 'danger',
  },
];

const stats = [
  { value: '10K+', label: 'Active Students' },
  { value: '50K+', label: 'Study Sessions' },
  { value: '95%', label: 'Success Rate' },
  { value: '24/7', label: 'AI Availability' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Medical Student',
    content: 'StudyAI completely transformed how I prepare for exams. The AI tutor explains complex concepts in simple terms.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Engineering Student',
    content: 'The spaced repetition flashcards helped me retain information long-term. My grades improved significantly.',
    avatar: 'MJ',
  },
  {
    name: 'Emily Rodriguez',
    role: 'High School Senior',
    content: 'Personalized study plans kept me on track for college applications. The AI adapts to my learning pace perfectly.',
    avatar: 'ER',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" size="lg" className="mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              New: AI-Powered Study Assistant v2.0
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Study Smarter,{' '}
              <span className="gradient-text">Not Harder</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Your personal AI study companion. Get instant explanations, generate flashcards, create quizzes, 
              and build personalized study plans — all powered by advanced AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/auth">
                <Button size="lg" leftIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Free
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful AI tools designed to make studying efficient and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} hover className="group">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', `bg-${feature.color}-100 dark:bg-${feature.color}-900/30`)}>
                    <Icon className={cn('w-6 h-6', `text-${feature.color}-600 dark:text-${feature.color}-400`)} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account in seconds. No credit card required.' },
              { step: '02', title: 'Set Your Goals', desc: 'Tell us what you want to learn and your timeline.' },
              { step: '03', title: 'Start Learning', desc: 'AI generates your personalized study materials instantly.' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                {index < 2 && (
                  <div className="absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Students Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} hover className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-10 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already studying smarter with AI. Start your free trial today.
            </p>
            <Link to="/auth">
              <Button size="xl" variant="secondary" leftIcon={<ArrowRight className="w-6 h-6" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold gradient-text mb-4">
                <Bot className="w-8 h-8" />
                StudyAI
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your AI-powered study companion for smarter learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/tutor" className="hover:text-primary-600 dark:hover:text-primary-400">AI Tutor</Link></li>
                <li><Link to="/flashcards" className="hover:text-primary-600 dark:hover:text-primary-400">Flashcards</Link></li>
                <li><Link to="/quizzes" className="hover:text-primary-600 dark:hover:text-primary-400">Quizzes</Link></li>
                <li><Link to="/plans" className="hover:text-primary-600 dark:hover:text-primary-400">Study Plans</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">About</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <img 
                src="/keerthana-profile.jpg" 
                alt="Keerthana" 
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-500/20"
              />
              <div>
                <p>© 2024 StudyAI. All rights reserved.</p>
                <p className="mt-2">
                  <span className="font-medium text-primary-600 dark:text-primary-400">Created by Keerthana</span> 
                  <span className="text-gray-500 dark:text-gray-400 mx-2">|</span>
                  <span className="font-medium text-accent-600 dark:text-accent-400">Deployed by Gowtham</span>
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">College: Kumaraguru College of Technology</p>
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <a href="mailto:keerselva595@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    kavyavelmurugan05@gmail.com
                  </a>
                  <a href="mailto:gowthamgo1745@gmail.com" className="text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    gowthamgo1745@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}