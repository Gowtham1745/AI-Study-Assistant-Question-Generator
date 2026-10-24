import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun,
  Globe,
  Download,
  LogOut,
  Mail,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';

export function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme, setLightTheme, setDarkTheme } = useTheme();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    studyReminders: true,
    weeklyReport: true,
    newFeatures: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data', icon: Download },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateProfile({ displayName: formData.displayName });
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Password changed successfully!');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setSaving(false);
  };

  const handleExportData = () => {
    toast.success('Data export started. You\'ll receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      toast.success('Account deleted');
    }
  };

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <Avatar src={user?.photoURL} name={user?.displayName} size="lg" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user?.displayName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Account</h4>
                <Button variant="danger" className="w-full" onClick={handleDeleteAccount} leftIcon={<LogOut className="w-4 h-4" />}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar src={user?.photoURL} name={user?.displayName} size="2xl" />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Profile picture</p>
                        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                          Change Photo
                        </Button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Display Name"
                        name="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Your name"
                        required
                        leftIcon={<User className="w-5 h-5" />}
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@example.com"
                        leftIcon={<Mail className="w-5 h-5" />}
                        disabled
                        helperText="Email cannot be changed in demo mode"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Button type="submit" isLoading={saving} rightIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Theme</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'light', label: 'Light', icon: Sun, action: setLightTheme },
                        { id: 'dark', label: 'Dark', icon: Moon, action: setDarkTheme },
                        { id: 'system', label: 'System', icon: Globe, action: toggleTheme },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={option.action}
                          className={cn(
                            'p-4 rounded-xl border-2 text-center transition-all',
                            theme === option.id || (option.id === 'system' && theme !== 'light' && theme !== 'dark')
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                        >
                          <option.icon className={cn('w-6 h-6 mx-auto mb-2', theme === option.id ? 'text-primary-600' : 'text-gray-400')} />
                          <p className={cn('font-medium', theme === option.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300')}>
                            {option.label}
                          </p>
                          {theme === option.id && <CheckCircle className="w-5 h-5 text-primary-500 mx-auto mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Primary Button</span>
                        <Button size="sm">Primary</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Secondary Button</span>
                        <Button variant="secondary" size="sm">Secondary</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Input Field</span>
                        <Input value="" placeholder="Sample input" className="w-48" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Badge</span>
                        <Badge variant="primary">Primary</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'emailReminders', label: 'Email Reminders', desc: 'Receive email reminders for due flashcards and upcoming quizzes' },
                    { key: 'studyReminders', label: 'Study Reminders', desc: 'Get notified when it\'s time for your scheduled study sessions' },
                    { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Receive a weekly summary of your learning progress' },
                    { key: 'newFeatures', label: 'New Features', desc: 'Be the first to know about new features and updates' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
                    <Input
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                      leftIcon={<Key className="w-5 h-5" />}
                    />
                    <Input
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="••••••••"
                      leftIcon={<Key className="w-5 h-5" />}
                    />
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      leftIcon={<Key className="w-5 h-5" />}
                    />
                    <Button type="submit" isLoading={saving} rightIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>
                      Update Password
                    </Button>
                  </form>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Current Session</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Chrome on Windows • Active now</p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm" dot>Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Export Data</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Download all your study data including flashcards, quizzes, study plans, and chat history.</p>
                    <Button onClick={handleExportData} leftIcon={<Download className="w-4 h-4" />}>
                      Export All Data
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Import Data</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Import previously exported study data.</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".json"
                        className="flex-1 text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <Button variant="outline">Import</Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Storage Usage</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Flashcards', size: '2.4 MB', icon: BookOpen },
                        { name: 'Quizzes', size: '1.1 MB', icon: HelpCircle },
                        { name: 'Study Plans', size: '500 KB', icon: Target },
                        { name: 'Chat History', size: '3.2 MB', icon: Mail },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{item.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
                    <img 
                      src="/KAVYA PROFILE PIC.jpeg" 
                      alt="Kavya" 
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-500/20 mx-auto mb-3"
                    />
                    <p className="font-medium text-primary-600 dark:text-primary-400">Created by Kavya</p>
                    <p className="font-medium text-accent-600 dark:text-accent-400 mt-1">Deployed by Gowtham</p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">College: Kumaraguru College of Technology</p>
                    <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                      <a href="mailto:kavyavelmurugan05@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"/></svg>
                        kavyavelmurugan05@gmail.com
                      </a>
                      <a href="mailto:gowthamgo1745@gmail.com" className="text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"/></svg>
                        gowthamgo1745@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}