import React from 'react';

interface SpinnerProps {
  size?: number;
  className?: string;
  thickness?: number;
}

export function Spinner({ size = 28, className = '', thickness = 3 }: SpinnerProps) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderWidth: thickness,
  };
  return (
    <span
      aria-label="Loading"
      className={`inline-block rounded-full border-current border-t-transparent animate-spin ${className}`}
      style={style}
    />
  );
}
