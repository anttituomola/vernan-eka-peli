import React from 'react';
import { GameButtonProps } from '../types';

const GameButton: React.FC<GameButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  size = 'lg',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20 text-lg',
    md: 'w-24 h-24 text-xl',
    lg: 'w-32 h-32 text-2xl',
    xl: 'w-40 h-40 text-3xl'
  };

  const variantClasses = {
    primary: 'kid-button-primary',
    secondary: 'kid-button-secondary',
    accent: 'kid-button-accent',
    warning: 'kid-button-warning'
  };

  return (
    <button
      onClick={onClick}
      className={`
        kid-button ${variantClasses[variant]} ${sizeClasses[size]}
        flex flex-col items-center justify-center gap-2 p-4
        ${className}
      `}
      type="button"
    >
      <div className="text-4xl mb-1">{icon}</div>
      <div className="font-kid font-bold text-center leading-tight">
        {label}
      </div>
    </button>
  );
};

export default GameButton;