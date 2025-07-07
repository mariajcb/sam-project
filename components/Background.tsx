import React from 'react';

const Background: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 animate-gradient-shift"
      style={{
        background: 'var(--gradient-primary)',
        backgroundSize: '200% 200%'
      }}
    >
      {/* Optional subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5" />
    </div>
  );
};

export default Background; 