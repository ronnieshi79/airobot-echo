import React from 'react';
import { motion } from 'motion/react';

interface FunctionalModulePlateProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  isDarkMode: boolean;
  className?: string;
}

export const FunctionalModulePlate: React.FC<FunctionalModulePlateProps> = ({ 
  children, 
  footer,
  isDarkMode,
  className = ""
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`w-full max-w-[640px] h-[725px] p-7 sm:p-8 rounded-[3.5rem] overflow-hidden transition-all duration-500 relative border ${
        isDarkMode 
          ? 'bg-slate-900/85 border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)]' 
          : 'bg-white/90 border-black/5 shadow-[0_30px_90px_rgba(0,0,0,0.08)]'
      } backdrop-blur-xl ${className}`}
    >
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 -mr-20 -mt-20 ${isDarkMode ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>

      {footer && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-[100]">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
