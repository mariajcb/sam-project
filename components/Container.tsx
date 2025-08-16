import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Container({ 
  children, 
  className = '',
  padding = 'medium'
}: ContainerProps) {
  const paddingClasses = {
    none: '',
    small: 'py-1',
    medium: 'py-4',
    large: 'py-6'
  };

  return (
    <div className={`
      container 
      mx-auto 
      px-4 
      sm:px-6 
      lg:px-8 
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
}
