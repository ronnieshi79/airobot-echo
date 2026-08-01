import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, MessageSquare } from 'lucide-react';
import { MainCategory } from '../types';

interface SkeuomorphicDialProps {
  activeCategory: MainCategory;
  onChange: (category: MainCategory) => void;
  isDark: boolean;
}

export const SkeuomorphicDial: React.FC<SkeuomorphicDialProps> = ({ activeCategory, onChange, isDark }) => {
  const categories: MainCategory[] = ['echo', 'time', 'calendar'];
  const currentIndex = categories.indexOf(activeCategory);
  
  const [rotation, setRotation] = useState(currentIndex * 120);

  useEffect(() => {
    const targetMod = (currentIndex * 120) % 360;
    const currentMod = rotation % 360;
    const currentModPositive = currentMod >= 0 ? currentMod : currentMod + 360;
    
    if (targetMod !== currentModPositive) {
      let diff = targetMod - currentModPositive;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      setRotation(r => r + diff);
    }
  }, [currentIndex]);

  const handleCenterClick = () => {
    const nextIndex = (currentIndex + 1) % categories.length;
    onChange(categories[nextIndex]);
  };

  const handleIconClick = (index: number) => {
    onChange(categories[index]);
  };

  const getIconStyle = (index: number) => {
    const angle = index * 120;
    return {
      transform: `rotate(${angle}deg) translateY(-85px) rotate(-${angle}deg)`
    };
  };

  return (
    <div className="relative flex items-center justify-center w-[216px] h-[216px] -ml-8">
      
      {/* Outer Glass Track (Shrunk, no border lines) */}
      <div className={`absolute w-[171px] h-[171px] rounded-full z-10 pointer-events-none ${
        isDark 
          ? 'bg-slate-800/40 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)]' 
          : 'bg-white/40 shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),0_10px_20px_rgba(0,0,0,0.1)]'
      } backdrop-blur-md`} />

      {/* Dial Base (Under the knob) */}
      <div className={`absolute w-[117px] h-[117px] rounded-full z-20 flex items-center justify-center transition-all duration-500 ${
        isDark 
          ? 'bg-slate-800 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),0_8px_16px_rgba(255,255,255,0.05)]' 
          : 'bg-slate-200 shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.1)]'
      }`} />

      {/* Inner Knob (Rotates) */}
      <motion.div 
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={handleCenterClick}
        className={`absolute w-[90px] h-[90px] rounded-full z-30 flex items-center justify-center cursor-pointer ${
          isDark 
            ? 'bg-slate-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.5)]' 
            : 'bg-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.15)]'
        }`}
      >
        {/* Indicator Dot */}
        <div className="absolute top-2 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8),inset_0_1px_2px_rgba(255,255,255,0.5)]" />
        
        {/* Grip Lines */}
        <div className="absolute inset-1.5 rounded-full border-[4px] border-dashed opacity-20 border-slate-500 pointer-events-none" />
        
        {/* Center metallic highlight */}
        <div className={`absolute w-12 h-12 rounded-full ${
          isDark ? 'bg-gradient-to-br from-slate-600 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-200'
        } shadow-inner pointer-events-none`} />
      </motion.div>

      {/* Labels/Icons around the dial (z-40 to be on top of everything) */}
      <div className="absolute w-full h-full flex items-center justify-center z-40 pointer-events-none">
        {/* Echo */}
        <div 
          className={`absolute flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer transition-all duration-300 ${
            activeCategory === 'echo' 
              ? 'text-orange-500 scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' 
              : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
          }`}
          style={getIconStyle(0)}
          onClick={() => handleIconClick(0)}
        >
          <MessageSquare size={22} />
          <span className="text-[10px] font-black tracking-widest">AI回响</span>
        </div>

        {/* Time / Clock */}
        <div 
          className={`absolute flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer transition-all duration-300 ${
            activeCategory === 'time' 
              ? 'text-orange-500 scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' 
              : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
          }`}
          style={getIconStyle(1)}
          onClick={() => handleIconClick(1)}
        >
          <Clock size={22} />
          <span className="text-[10px] font-black tracking-widest">AI时钟</span>
        </div>

        {/* Calendar */}
        <div 
          className={`absolute flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer transition-all duration-300 ${
            activeCategory === 'calendar' 
              ? 'text-orange-500 scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' 
              : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
          }`}
          style={getIconStyle(2)}
          onClick={() => handleIconClick(2)}
        >
          <Calendar size={22} />
          <span className="text-[10px] font-black tracking-widest">AI日程</span>
        </div>
      </div>
    </div>
  );
};
