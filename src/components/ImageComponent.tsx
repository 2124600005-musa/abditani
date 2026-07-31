'use client';
import { useState } from 'react';

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function ImageComponent({ src, alt, className = '', fallback }: ImageComponentProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600`}>
        <span className="text-4xl">🌱</span>
        <span className="text-sm font-bold mt-1">AbdiTani</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
