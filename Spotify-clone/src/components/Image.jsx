// components/common/Image.jsx
import React from 'react';
import { assets } from '../../assets/frontend-assets/assets';

const Image = ({ src, alt, className, fallback }) => {
  const handleError = (e) => {
    e.target.src = fallback || assets.defaultImage || '';
    // OR to hide broken images:
    // e.target.style.display = 'none';
  };

  return (
    <img
      src={src || fallback || null}
      alt={alt || ''}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default Image;