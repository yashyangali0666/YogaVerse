import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'earth' | 'cream' | 'blue' | 'amber' | 'emerald' | 'rose' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    sage: 'bg-sage-100 text-sage-800 border-sage-200',
    earth: 'bg-earth-100 text-earth-800 border-earth-200',
    cream: 'bg-cream-200 text-stone-800 border-cream-300',
    blue: 'bg-sky-100 text-sky-800 border-sky-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    default: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
