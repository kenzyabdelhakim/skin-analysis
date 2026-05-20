import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95';

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground shadow-lg shadow-pink-glow hover:shadow-2xl hover:shadow-pink-glow backdrop-blur-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-black-light backdrop-blur-sm',
    ghost: 'bg-transparent text-foreground hover:bg-glass-pink border border-border backdrop-blur-sm'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
