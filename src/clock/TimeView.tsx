import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, RotateCcw, Plus, Minus } from 'lucide-react';
import { SubCategory } from '../types';

interface TimeViewProps {
  subCategory: SubCategory;
  time: Date;
  timerSeconds: number;
  isTimerRunning: boolean;
  onTimerStart: () => void;
  onTimerPause: () => void;
  onTimerReset: () => void;
  onTimerAdjust: (amount: number) => void;
  onTimerSet: (seconds: number) => void;
  isDarkMode: boolean;
}

export const TimeView: React.FC<TimeViewProps> = ({
  subCategory,
  time,
  timerSeconds,
  isTimerRunning,
  onTimerStart,
  onTimerPause,
  onTimerReset,
  onTimerAdjust,
  onTimerSet,
  isDarkMode,
}) => {
  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {(subCategory === 'timer' || subCategory === 'focus') && (
          <motion.div
            key={subCategory}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="flex flex-col items-center w-full"
          >
            {/* Skeuomorphic Container - Unified Size */}
            <div className={`relative ${subCategory === 'focus' ? 'mb-16' : 'mb-20'} p-12 rounded-[5rem] ${isDarkMode ? 'bg-slate-800 shadow-[inset_0_4px_8px_rgba(255,255,255,0.05),0_40px_80px_rgba(0,0,0,0.6)]' : 'bg-slate-100 shadow-[inset_0_4px_8px_rgba(0,0,0,0.05),0_40px_80px_rgba(0,0,0,0.2)]'} flex items-center justify-center group`}>
              
              {/* Mechanical Crown / Knob - Unified Size */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center gap-5">
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ x: 2 }}
                  onClick={isTimerRunning ? onTimerPause : onTimerStart}
                  className={`w-10 h-24 rounded-r-2xl border-y-2 border-r-2 shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-2 ${
                    isDarkMode ? 'bg-slate-700 border-white/10 text-slate-400' : 'bg-slate-200 border-black/10 text-slate-600'
                  }`}
                >
                  {isTimerRunning ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  <div className="flex flex-col gap-1 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`w-5 h-[2px] rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
                    ))}
                  </div>
                </motion.button>
              </div>

              {/* Reset Button - Integrated Top Button */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ y: 3 }}
                  whileTap={{ y: 6 }}
                  onClick={onTimerReset}
                  className={`w-12 h-6 rounded-t-2xl border-x-2 border-t-2 shadow-lg ${
                    isDarkMode ? 'bg-slate-700 border-white/10' : 'bg-slate-200 border-black/10'
                  }`}
                />
              </div>
              
              {/* Timer/Focus Specific Skeuomorphic Decor */}
              {subCategory === 'focus' && (
                <>
                  <motion.div 
                    animate={isTimerRunning ? { rotate: [-5, 5, -5] } : {}}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="absolute -top-10 left-1/4 w-16 h-16 bg-indigo-500/20 rounded-full blur-md" 
                  />
                  <motion.div 
                    animate={isTimerRunning ? { rotate: [5, -5, 5] } : {}}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="absolute -top-10 right-1/4 w-16 h-16 bg-indigo-500/20 rounded-full blur-md" 
                  />
                </>
              )}

              {/* Inner Face - Unified Size */}
              <div className={`w-72 h-72 rounded-[4rem] relative ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-inner flex flex-col items-center justify-center overflow-hidden border-[10px] ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 p-5">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
                    strokeWidth="14"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={subCategory === 'focus' ? '#6366F1' : '#06B6D4'}
                    strokeWidth="14"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: subCategory === 'focus' ? (1500 - timerSeconds) / 1500 : (timerSeconds % 60) / 60 }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    animate={isTimerRunning ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                  >
                    {formatSeconds(timerSeconds)}
                  </motion.div>
                  <div className={`text-[10px] font-black tracking-[0.2em] uppercase mt-2 opacity-40 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {subCategory === 'focus' ? 'Focus Session' : 'Timer'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tips Section - Simplified */}
            <div className="w-full space-y-6">
              <div className="w-full">
                {subCategory === 'timer' ? (
                  <div className="w-full space-y-3">
                    {!isTimerRunning && timerSeconds === 0 ? (
                      <div className={`p-6 rounded-[2.5rem] border flex flex-col items-center gap-2 transition-all ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>语音启动提示</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">“嘿 Aether，开始 5 分钟学习计时”</p>
                      </div>
                    ) : (
                      <div className={`p-6 rounded-[2.5rem] border flex items-center justify-between transition-all ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'
                      }`}>
                        <div className="flex flex-col">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-cyan-500' : 'text-cyan-600'}`}>正在计时</p>
                          <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>日常学习</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                            {isTimerRunning ? '计时中' : '已暂停'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full">
                    {!isTimerRunning ? (
                      <div className="flex justify-center gap-3 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onTimerSet(1800)}
                          className={`flex-1 text-[11px] font-black py-4 rounded-[1.5rem] border transition-all ${
                            isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm'
                          }`}
                        >
                          30分钟学习
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onTimerSet(1500)}
                          className={`flex-1 text-[11px] font-black py-4 rounded-[1.5rem] border transition-all ${
                            isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm'
                          }`}
                        >
                          25分钟编码
                        </motion.button>
                      </div>
                    ) : (
                      <div className={`p-6 rounded-[2.5rem] border flex items-center justify-between transition-all ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'
                      }`}>
                        <div className="flex flex-col">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>正在专注</p>
                          <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>保持高效</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                            {isTimerRunning ? '专注中' : '已暂停'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
