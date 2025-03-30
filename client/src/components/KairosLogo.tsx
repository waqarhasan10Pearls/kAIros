import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const KairosLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circular background */}
      <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
      
      {/* Outer circular border */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" />
      
      {/* Inner design - hourglass/infinity symbol representing the opportune moment */}
      <path 
        d="M50 28C42 28 38 38 38 38C38 38 42 48 50 48C58 48 62 38 62 38C62 38 58 28 50 28Z" 
        fill="currentColor" 
      />
      <path 
        d="M50 72C42 72 38 62 38 62C38 62 42 52 50 52C58 52 62 62 62 62C62 62 58 72 50 72Z" 
        fill="currentColor" 
      />
      
      {/* Central line connecting the circles */}
      <line x1="50" y1="28" x2="50" y2="72" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
      
      {/* Small dot at the center representing the "moment" */}
      <circle cx="50" cy="50" r="5" fill="currentColor" />
      
      {/* Arrow symbols around the edge representing time's fleeting nature */}
      <path d="M72 50L80 50L76 45L72 50Z" fill="currentColor" />
      <path d="M28 50L20 50L24 55L28 50Z" fill="currentColor" />
      <path d="M50 28L50 20L45 24L50 28Z" fill="currentColor" />
      <path d="M50 72L50 80L55 76L50 72Z" fill="currentColor" />
    </svg>
  );
};

export default KairosLogo;