import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`
      container 
      mx-auto 
      px-4 
      sm:px-6 
      lg:px-8 
      py-8
      backdrop-blur-sm
      bg-white/5
      rounded-2xl
      border 
      border-white/10
      shadow-xl
      ${className}
    `}>
      {children}
    </div>
  );
}
