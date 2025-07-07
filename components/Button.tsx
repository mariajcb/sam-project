import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = "px-4 py-2 rounded-lg transition-all duration-300";
  
  const variants = {
    primary: "bg-theme-purple hover:bg-theme-purple-dark text-white",
    secondary: "bg-theme-pink hover:bg-theme-pink-dark text-white",
    outline: "border-2 border-theme-purple text-theme-purple hover:bg-theme-purple hover:text-white"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 