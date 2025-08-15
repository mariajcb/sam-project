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
      {/* Optional subtle pattern overlay - removed missing image reference */}
    </div>
  );
};

export default Background; 