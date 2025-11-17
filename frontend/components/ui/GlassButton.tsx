'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const baseStyles = 'font-medium transition-all duration-300 backdrop-blur-md border';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-neon-turquoise/10 to-neon-blue/10 border-neon-turquoise/30 text-neon-turquoise hover:shadow-lg hover:shadow-neon-turquoise/50',
    secondary: 'bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 border-neon-purple/30 text-neon-purple hover:shadow-lg hover:shadow-neon-purple/50',
    danger: 'bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30 text-red-400 hover:shadow-lg hover:shadow-red-500/50',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        rounded-lg
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
    >
      {children}
    </motion.button>
  );
};

export default GlassButton;
