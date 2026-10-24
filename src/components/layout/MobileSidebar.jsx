import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, BookOpen, Bot, Target, HelpCircle, Settings, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
  { name: 'AI Tutor', href: '/tutor', icon: Bot },
  { name: 'Flashcards', href: '/flashcards', icon: BookOpen },
  { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
  { name: 'Study Plans', href: '/plans', icon: Target },
];

export function MobileSidebar({ open, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href) => location.pathname === href;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold gradient-text">
                  <Bot className="w-8 h-8" />
                  <span>StudyAI</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5 mr-3" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 mr-3" />
                      Dark Mode
                    </>
                  )}
                </Button>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>

                <button
                  onClick={() => logout()}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}