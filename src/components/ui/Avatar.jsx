import { cn } from '../../lib/utils';

export function Avatar({ src, alt, name, size = 'md', className, fallbackColor }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const colors = [
    'bg-primary-500',
    'bg-accent-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-teal-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];

  const getColorFromName = (str) => {
    if (!str) return colors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (str) => {
    if (!str) return '?';
    return str
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = name ? getInitials(name) : '?';
  const bgColor = fallbackColor || getColorFromName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn('rounded-full object-cover ring-2 ring-white dark:ring-gray-800', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white ring-2 ring-white dark:ring-gray-800',
        sizes[size],
        bgColor,
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {initials}
    </div>
  );
}

export function AvatarGroup({ avatars = [], max = 5, size = 'md', className }) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizes = {
    xs: '-space-x-1',
    sm: '-space-x-1.5',
    md: '-space-x-2',
    lg: '-space-x-2.5',
    xl: '-space-x-3',
  };

  return (
    <div className={cn('flex', sizes[size], className)} aria-label={`${avatars.length} users`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={avatar.id || index}
          src={avatar.src}
          alt={avatar.alt}
          name={avatar.name}
          size={size}
          className="border-2 border-white dark:border-gray-900"
          fallbackColor={avatar.color}
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          'rounded-full flex items-center justify-center font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900',
          sizes[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}