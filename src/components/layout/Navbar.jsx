import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  Menu as MenuIcon, 
  X, 
  Sun, 
  Moon, 
  User, 
  Settings,
  BookOpen,
  Bot,
  Target,
  HelpCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
  { name: 'AI Tutor', href: '/tutor', icon: Bot },
  { name: 'Flashcards', href: '/flashcards', icon: BookOpen },
  { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
  { name: 'Study Plans', href: '/plans', icon: Target },
];

export function Navbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold gradient-text">
            <Bot className="w-8 h-8" />
            <span className="hidden sm:block">StudyAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
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
          </div>

          {/* Creator credits stay visible in the top bar on desktop and mobile */}
          <div className="ml-auto flex shrink-0 items-center gap-1 rounded-xl border border-indigo-200 bg-white/90 px-1.5 py-1 shadow-sm dark:border-indigo-800 dark:bg-gray-900/90 sm:gap-2 sm:px-3 sm:py-1.5"><div className="flex items-center gap-1"><img src="/AI-Study-Assistant-Question-Generator/KAVYA%20PROFILE%20PIC.jpeg" alt="Kavya, creator" className="h-7 w-7 rounded-full border-2 border-indigo-500 object-cover sm:h-9 sm:w-9" /><img src="/AI-Study-Assistant-Question-Generator/GOWTHAM_PROFILE.jpg" alt="Gowtham A, developer" className="-ml-2 h-7 w-7 rounded-full border-2 border-violet-500 object-cover sm:h-9 sm:w-9" /></div><div className="leading-tight"><p className="whitespace-nowrap text-[8px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 sm:text-[9px]">Creator · Developer</p><p className="whitespace-nowrap text-[10px] font-extrabold text-gray-950 dark:text-white sm:text-xs">Kavya · Gowtham A</p></div></div>
          {/* Right Side Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Avatar 
                  src={user?.photoURL} 
                  name={user?.displayName} 
                  size="sm" 
                  alt={user?.displayName}
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.displayName || 'User'}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-gray-100 dark:ring-gray-800 focus:outline-none p-1">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.displayName}</p>
                  </div>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors',
                          active ? 'bg-gray-100 dark:bg-gray-800' : ''
                        )}
                      >
                        <Settings className="w-5 h-5 text-gray-400" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>

                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}