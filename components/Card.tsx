import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      backdrop-blur-md 
      bg-white/10 
      border border-white/20 
      rounded-lg 
      shadow-lg 
      hover:border-theme-pink/30 
      transition-all 
      duration-300
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card; 