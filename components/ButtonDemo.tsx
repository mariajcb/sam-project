import React, { useState } from 'react';

import Button from './Button';

const ButtonDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Button Component Demo</h1>
        <p className="text-lg text-gray-600">Showcasing all button variants with pink and purple gradients</p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✅ All buttons now meet WCAG AA accessibility standards</p>
          <p className="text-green-700 text-sm">Contrast ratios: Normal text ≥4.5:1, Large text ≥3:1</p>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="gradient" size="sm">Small</Button>
          <Button variant="gradient" size="md">Medium</Button>
          <Button variant="gradient" size="lg">Large</Button>
          <Button variant="gradient" size="xl">Extra Large</Button>
        </div>
      </div>

      {/* Gradient Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Gradient Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient" onClick={handleClick}>
            Gradient Button
          </Button>
          <Button variant="gradient-outline" onClick={handleClick}>
            Gradient Outline
          </Button>
          <Button variant="gradient-text" onClick={handleClick}>
            Gradient Text
          </Button>
        </div>
      </div>

      {/* Original Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Original Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={handleClick}>
            Primary
          </Button>
          <Button variant="secondary" onClick={handleClick}>
            Secondary
          </Button>
          <Button variant="outline" onClick={handleClick}>
            Outline
          </Button>
        </div>
      </div>

      {/* Loading States */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient" loading={loading} onClick={handleClick}>
            Loading Gradient
          </Button>
          <Button variant="gradient-outline" loading={loading} onClick={handleClick}>
            Loading Outline
          </Button>
        </div>
      </div>

      {/* Accessibility Improvements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility Improvements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Before (Failed AA)</h3>
            <p className="text-red-700 text-sm mb-3">White text on #ff69b4: ~2.8:1 contrast ratio</p>
            <div className="inline-block px-4 py-2 bg-[#ff69b4] text-white rounded-lg font-medium">
              Secondary Button
            </div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">After (Passes AA)</h3>
            <p className="text-green-700 text-sm mb-3">White text on #b91c5c: ~4.7:1 contrast ratio</p>
            <Button variant="secondary">
              Secondary Button
            </Button>
          </div>
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient" disabled>
            Disabled Gradient
          </Button>
          <Button variant="gradient-outline" disabled>
            Disabled Outline
          </Button>
        </div>
      </div>

      {/* Enhanced Mouseover Effects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Enhanced Mouseover Effects</h2>
        <p className="text-gray-600 mb-4">Hover over buttons to see the improved responsive effects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold mb-3">Gradient Button</h3>
            <Button variant="gradient" size="lg" className="w-full">
              Hover Me
            </Button>
            <p className="text-sm text-gray-600 mt-2">Scale + Lift + Glow</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-3">Gradient Outline</h3>
            <Button variant="gradient-outline" size="lg" className="w-full">
              Hover Me
            </Button>
            <p className="text-sm text-gray-600 mt-2">Border Animation + Glow</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-3">Gradient Text</h3>
            <Button variant="gradient-text" size="lg" className="w-full">
              Hover Me
            </Button>
            <p className="text-sm text-gray-600 mt-2">Background Fade + Lift</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-3">Primary Button</h3>
            <Button variant="primary" size="lg" className="w-full">
              Hover Me
            </Button>
            <p className="text-sm text-gray-600 mt-2">Lift + Shadow</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-3">Secondary Button</h3>
            <Button variant="secondary" size="lg" className="w-full">
              Hover Me
            </Button>
            <p className="text-sm text-gray-600 mt-2">Lift + Shadow</p>
          </div>
        </div>
      </div>

      {/* Focus State Testing */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Focus State Testing</h2>
        <p className="text-gray-600 mb-4">Use Tab key to navigate and see the enhanced focus states</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient" size="lg">
            Gradient (Tab to focus)
          </Button>
          <Button variant="gradient-outline" size="lg">
            Gradient Outline (Tab to focus)
          </Button>
          <Button variant="gradient-text" size="lg">
            Gradient Text (Tab to focus)
          </Button>
          <Button variant="primary" size="lg">
            Primary (Tab to focus)
          </Button>
          <Button variant="secondary" size="lg">
            Secondary (Tab to focus)
          </Button>
          <Button variant="outline" size="lg">
            Outline (Tab to focus)
          </Button>
        </div>
      </div>

      {/* All Variants Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="gradient" size="lg">
            Gradient
          </Button>
          <Button variant="gradient-outline" size="lg">
            Gradient Outline
          </Button>
          <Button variant="gradient-text" size="lg">
            Gradient Text
          </Button>
          <Button variant="primary" size="lg">
            Primary
          </Button>
          <Button variant="secondary" size="lg">
            Secondary
          </Button>
          <Button variant="outline" size="lg">
            Outline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo; 