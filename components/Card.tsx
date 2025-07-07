import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hover = true 
}) => {
  return (
    <div className={`
      relative
      backdrop-blur-md 
      bg-white/10 
      border 
      border-white/20 
      rounded-lg 
      shadow-lg 
      transition-all 
      duration-300
      overflow-hidden
      ${hover ? 'hover:border-theme-pink/30 hover:shadow-xl hover:scale-[1.02]' : ''}
      ${className}
    `}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card; 