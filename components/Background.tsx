import React from 'react';

/**
 * Background Component
 * 
 * Provides the animated gradient background for the entire application.
 * Creates a smooth pink-to-purple gradient shift animation that runs continuously.
 * 
 * FEATURES:
 * - Fixed positioning covers entire viewport
 * - Slow 45-second gradient animation for subtle effect
 * - Fallback background color if CSS variables fail
 * - Optimized for performance with hardware acceleration
 * 
 * USAGE:
 * - Import and use in layout components
 * - Positioned behind all other content
 * - No props required - self-contained component
 * 
 * TECHNICAL DETAILS:
 * - Uses CSS custom properties for gradient colors
 * - Implements graceful degradation with fallback colors
 * - Animation class: animate-gradient-slow (45s duration)
 * - Background size: 200% 200% for proper gradient shifting
 * 
 * ACCESSIBILITY:
 * - Non-interactive background element
 * - Does not interfere with screen readers
 * - Animation can be disabled via user preferences
 */
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