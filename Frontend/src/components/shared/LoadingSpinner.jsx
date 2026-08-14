import React from 'react';
import { Music } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Inline-friendly: small size gets no padding so it won't inflate buttons
  const paddingClasses = {
    small: '',
    medium: 'p-4',
    large: 'p-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${paddingClasses[size]} ${className}`}>
      <div className="relative">
        <Music className={`${sizeClasses[size]} text-green-500 animate-spin`} />
      </div>
      {text && size !== 'small' && (
        <p className={`${textSizeClasses[size]} text-gray-400 mt-4 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;