import React from 'react';
import { Music } from 'lucide-react';

/**
 * LoadingSpinner
 *
 * Props:
 *  - size: 'small' | 'medium' | 'large'  (default: 'medium')
 *  - text: string | false  — label shown below the spinner.
 *          Pass false or '' to suppress it entirely.  (default: '')
 *  - inline: bool  — renders just the bare spinning icon with no wrapper div.
 *            Safe to embed inside <button> elements without breaking layout.
 *  - className: extra classes on the wrapper (ignored in inline mode)
 */
const LoadingSpinner = ({
  size = 'medium',
  text = '',
  inline = false,
  className = '',
}) => {
  const sizeClasses = {
    small:  'w-4 h-4',
    medium: 'w-6 h-6',
    large:  'w-12 h-12',
  };

  const textSizeClasses = {
    small:  'text-sm',
    medium: 'text-base',
    large:  'text-lg',
  };

  const paddingClasses = {
    small:  '',
    medium: 'p-4',
    large:  'p-8',
  };

  // Inline mode: just the icon, no wrapper — safe inside <button>
  if (inline) {
    return (
      <Music className={`${sizeClasses[size]} text-current animate-spin ${className}`} />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${paddingClasses[size]} ${className}`}>
      <Music className={`${sizeClasses[size]} text-green-500 animate-spin`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-400 mt-4 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;