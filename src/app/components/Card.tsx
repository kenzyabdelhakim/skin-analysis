import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = false,
  hoverable = false
}) => {
  const baseStyles = 'rounded-3xl border border-border transition-all duration-300';
  const glassStyles = glass ? 'bg-glass-bg border-glass-border backdrop-blur-lg shadow-lg' : 'bg-card shadow-md';
  const hoverStyles = hoverable ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
