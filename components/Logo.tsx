import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'white' | 'dark' | 'solid';
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default', 
  animated = true, 
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-16 sm:h-16',
    xl: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  const innerSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    lg: 'w-4 h-4 sm:w-6 sm:h-6',
    xl: 'w-6 h-6 sm:w-8 sm:h-8'
  };

  const borderWidthClasses = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-[3px] sm:border-4',
    lg: 'border-4 sm:border-[5px]',
    xl: 'border-[5px] sm:border-[6px]'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return {
          outer: `bg-transparent ${borderWidthClasses[size]} border-primary`,
          inner: 'bg-primary',
          glow: 'shadow-lg shadow-primary/20'
        };
      case 'white':
        return {
          outer: `bg-white/5 ${borderWidthClasses[size]} border-white/40`,
          inner: 'bg-white',
          glow: 'shadow-lg shadow-white/20'
        };
      case 'dark':
        return {
          outer: `bg-gray-900 ${borderWidthClasses[size]} border-gray-600`,
          inner: 'bg-gray-400',
          glow: 'shadow-lg shadow-gray-500/20'
        };
      case 'solid':
        return {
          outer: `bg-primary ${borderWidthClasses[size]} border-primary`,
          inner: 'bg-background',
          glow: 'shadow-xl shadow-primary/30'
        };
      default:
        return {
          outer: `bg-primary/8 ${borderWidthClasses[size]} border-primary/60`,
          inner: 'bg-primary',
          glow: 'shadow-lg shadow-primary/25'
        };
    }
  };

  const variantClasses = getVariantClasses();

  const LogoContent = (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${variantClasses.outer} 
        ${variantClasses.glow}
        rounded-xl sm:rounded-2xl 
        flex items-center justify-center 
        relative
        transition-all duration-300
        ${className}
      `}
    >
      <div className={`${innerSizeClasses[size]} ${variantClasses.inner} rounded-sm transition-all duration-300`} />
      
      {animated && (
        <>
          {/* Pulse ring exterior */}
          <motion.div
            className={`absolute inset-0 ${borderWidthClasses[size]} border-primary/30 rounded-xl sm:rounded-2xl`}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Brillo interno sutil */}
          <motion.div
            className={`absolute inset-2 bg-primary/10 rounded-lg`}
            animate={{ 
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ 
          scale: 1.05, 
          rotate: 3,
          filter: 'brightness(1.1)'
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {LogoContent}
      </motion.div>
    );
  }

  return LogoContent;
};

// Componente SVG para exportar con bordes gruesos
export const LogoSVG: React.FC<{ 
  width?: number; 
  height?: number; 
  primaryColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
}> = ({ 
  width = 44, 
  height = 44, 
  primaryColor = '#40d9ac',
  backgroundColor = 'rgba(64, 217, 172, 0.08)',
  strokeWidth = 4
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 44 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Sombra/glow exterior */}
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    </defs>
    
    {/* Contenedor exterior con borde grueso */}
    <rect 
      x={strokeWidth/2} 
      y={strokeWidth/2} 
      width={44 - strokeWidth} 
      height={44 - strokeWidth} 
      rx="8" 
      fill={backgroundColor} 
      stroke={primaryColor} 
      strokeWidth={strokeWidth}
      filter="url(#glow)"
    />
    
    {/* Cuadrado interno sólido */}
    <rect 
      x="15" 
      y="15" 
      width="14" 
      height="14" 
      rx="1" 
      fill={primaryColor}
    />
  </svg>
);

export default Logo;