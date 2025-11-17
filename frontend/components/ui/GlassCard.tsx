'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  variant = 'primary',
}) => {
  const baseStyles =
    'backdrop-blur-md bg-white/5 border rounded-xl overflow-hidden transition-all duration-300';

  const variantStyles = {
    primary: 'border-neon-turquoise/20 hover:border-neon-turquoise/50 hover:shadow-lg hover:shadow-neon-turquoise/20',
    secondary: 'border-neon-purple/20 hover:border-neon-purple/50 hover:shadow-lg hover:shadow-neon-purple/20',
    danger: 'border-red-500/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20',
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-turquoise/0 to-neon-purple/0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
