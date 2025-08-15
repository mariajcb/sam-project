import React from 'react';

const Background: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 animate-gradient-slow"
      style={{
        background: 'var(--gradient-background, linear-gradient(45deg, rgba(255, 105, 180, 0.8), rgba(147, 112, 219, 0.8)))',
        backgroundSize: '200% 200%'
      }}
    >
    </div>
  );
};

export default Background; 