import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xl';
}

export default function Container({ 
  children, 
  className = '',
  padding = 'medium'
}: ContainerProps) {
  const paddingClasses = {
    none: '',
    small: 'pb-1',
    medium: 'pb-4',
    large: 'pb-6',
    xl: 'pb-16'
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
