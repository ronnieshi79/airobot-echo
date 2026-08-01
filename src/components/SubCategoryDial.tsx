import React from 'react';
import { motion } from 'motion/react';
import { Bell, Timer, Brain, Sparkles, ListTodo, Calendar, MessageSquare, Heart, Book, Home } from 'lucide-react';
import { MainCategory, SubCategory } from '../types';

interface SubCategoryDialProps {
  mainCategory: MainCategory;
  subCategory: SubCategory;
  setSubCategory: (s: SubCategory) => void;
  isDark: boolean;
}

export const SubCategoryDial: React.FC<SubCategoryDialProps> = ({ 
  mainCategory, 
  subCategory, 
  setSubCategory, 
  isDark 
}) => {
  const options: { id: SubCategory, label: string, icon: React.ReactNode }[] = [];
  
  if (mainCategory === 'time') {
    options.push({ id: 'home', label: '主页', icon: <Home size={14} /> });
    options.push({ id: 'alarm', label: '闹钟', icon: <Bell size={14} /> });
    options.push({ id: 'timer', label: '计时', icon: <Timer size={14} /> });
    options.push({ id: 'focus', label: '专注', icon: <Brain size={14} /> });
  } else if (mainCategory === 'calendar') {
    options.push({ id: 'today', label: '今日', icon: <Sparkles size={14} /> });
    options.push({ id: 'weekly', label: '本周', icon: <ListTodo size={14} /> });
    options.push({ id: 'calendar-view', label: '月度', icon: <Calendar size={14} /> });
  }

  if (options.length === 0) return null;

  return (
    <div className="flex items-center justify-center">
      {/* Physical Housing */}
      <div className={`
        flex items-center gap-1 p-1.5 rounded-full shadow-2xl border
        ${isDark 
          ? 'bg-slate-800 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
          : 'bg-white border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)]'}
      `}>
        {options.map((option) => {
          const isActive = subCategory === option.id;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSubCategory(option.id)}
              className={`
                relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
                ${isActive 
                  ? (isDark 
                      ? 'bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)]' 
                      : 'bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]')
                  : (isDark 
                      ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100')
                }
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-sub-bg"
                  className="absolute inset-0 rounded-full bg-orange-500 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`relative z-10 ${isActive ? 'drop-shadow-md' : ''}`}>
                {option.icon}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
