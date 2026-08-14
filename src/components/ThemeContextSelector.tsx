import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Sunset, 
  CloudSun, 
  Zap,
  ChevronUp,
  X,
  Sparkles,
  Check,
  Laptop
} from 'lucide-react';

export type ContextType = 'auto' | 'morning' | 'afternoon' | 'evening' | 'night';

interface ThemeContextSelectorProps {
  contextMode: ContextType;
  onContextModeChange: (mode: ContextType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeContext: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface ContextOption {
  id: ContextType;
  name: string;
  subname: string;
  timeRange?: string;
  symbol: string;
  icon: React.ReactNode;
  desc: string;
  tag: string;
  activeGlowLight: string;
  activeGlowDark: string;
  activeBgLight: string;
  activeBgDark: string;
}

export const ThemeContextSelector: React.FC<ThemeContextSelectorProps> = ({
  contextMode,
  onContextModeChange,
  isDarkMode,
  onToggleDarkMode,
  activeContext
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: ContextOption[] = [
    {
      id: 'auto',
      name: '智能感知',
      subname: '时间与环境联动',
      symbol: '⚡',
      icon: <Zap size={15} className="text-amber-400" />,
      desc: '根据当前时间自动切换程序员一日工作与生活情境',
      tag: '自动感知',
      activeGlowLight: 'shadow-[0_0_12px_rgba(245,158,11,0.4)] border-amber-400',
      activeGlowDark: 'shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-400',
      activeBgLight: 'bg-gradient-to-br from-amber-400 to-indigo-500 text-white',
      activeBgDark: 'bg-gradient-to-br from-amber-500 to-indigo-600 text-white'
    },
    {
      id: 'morning',
      name: '晨光通勤',
      subname: '站会要点 · 晨报速递',
      timeRange: '05:00 - 11:00',
      symbol: '🌅',
      icon: <CloudSun size={15} className="text-amber-500" />,
      desc: '整理今日 Standup 站会要点、待提 PR 任务与晨间通勤伴听',
      tag: '元气启航',
      activeGlowLight: 'shadow-[0_0_12px_rgba(245,158,11,0.3)] border-amber-400',
      activeGlowDark: 'shadow-[0_0_15px_rgba(245,158,11,0.4)] border-amber-400',
      activeBgLight: 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950',
      activeBgDark: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
    },
    {
      id: 'afternoon',
      name: '深度工作',
      subname: '极客心流 · 架构灵感',
      timeRange: '11:00 - 17:30',
      symbol: '☀️',
      icon: <Sun size={15} className="text-emerald-500" />,
      desc: '沉浸 Coding 心流、架构设计拆解与疑难 Bug 排查',
      tag: '专注心流',
      activeGlowLight: 'shadow-[0_0_12px_rgba(16,185,129,0.3)] border-emerald-400',
      activeGlowDark: 'shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-400',
      activeBgLight: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950',
      activeBgDark: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
    },
    {
      id: 'evening',
      name: '暮色下班',
      subname: '卸压复盘 · 治愈轻听',
      timeRange: '17:30 - 21:30',
      symbol: '🌆',
      icon: <Sunset size={15} className="text-rose-400" />,
      desc: '合上电脑告别工单，把工作烦恼交给树洞，享受治愈晚风',
      tag: '告别疲惫',
      activeGlowLight: 'shadow-[0_0_12px_rgba(244,63,94,0.3)] border-rose-400',
      activeGlowDark: 'shadow-[0_0_15px_rgba(244,63,94,0.4)] border-rose-400',
      activeBgLight: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white',
      activeBgDark: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white'
    },
    {
      id: 'night',
      name: '深夜静谧',
      subname: '极客随笔 · 助眠故事',
      timeRange: '21:30 - 05:00',
      symbol: '🌙',
      icon: <Moon size={15} className="text-indigo-400" />,
      desc: '记录今日开发心得与生活确幸，声优故事陪伴安然入睡',
      tag: '沉淀助眠',
      activeGlowLight: 'shadow-[0_0_12px_rgba(99,102,241,0.3)] border-indigo-400',
      activeGlowDark: 'shadow-[0_0_15px_rgba(99,102,241,0.4)] border-indigo-400',
      activeBgLight: 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white',
      activeBgDark: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
    }
  ];

  // Current active option metadata
  const currentSelectedOption = options.find(o => o.id === contextMode) || options[0];
  const currentActiveOption = options.find(o => o.id === activeContext) || options[1];

  return (
    <div ref={popoverRef} className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      {/* 1. Popout Context Selection Modal/Sheet (点击才弹出的情境选择面板) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`mb-3 w-[340px] sm:w-[380px] p-5 rounded-[2rem] shadow-2xl border backdrop-blur-2xl transition-colors duration-300 ${
              isDarkMode
                ? 'bg-slate-900/95 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-slate-100'
                : 'bg-white/95 border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-tight">情境感知中枢</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-0.5">
                      <Laptop size={9} />
                      上班族/极客模式
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">结合全天工作与生活节奏智能感知</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
                }`}
              >
                <X size={15} />
              </button>
            </div>

            {/* Context Options List */}
            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-0.5 custom-scrollbar">
              {options.map((opt) => {
                const isSelected = contextMode === opt.id;
                const isCurrentAutoMatch = contextMode === 'auto' && activeContext === opt.id;

                return (
                  <motion.div
                    key={opt.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onContextModeChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center justify-between gap-3 ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-white/10 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : 'bg-amber-500/10 border-amber-500/40 shadow-[0_4px_15px_rgba(245,158,11,0.1)]'
                        : isDarkMode
                          ? 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                          : 'bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Left Symbol & Text */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base shadow-sm ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : isDarkMode ? 'bg-white/10' : 'bg-white'
                      }`}>
                        {opt.symbol}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            isSelected ? 'text-amber-500 dark:text-amber-400' : ''
                          }`}>
                            {opt.name}
                          </span>
                          {opt.timeRange && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {opt.timeRange}
                            </span>
                          )}
                          {isCurrentAutoMatch && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold">
                              当前匹配
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right check / badge */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                          isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-black/5 text-slate-500'
                        }`}>
                          {opt.tag}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Quick Control Bar */}
            <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">界面视觉模式</span>
              <button
                onClick={onToggleDarkMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                  isDarkMode
                    ? 'bg-white/10 border-white/15 text-amber-300 hover:bg-white/20'
                    : 'bg-slate-100 border-black/5 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? <Moon size={13} /> : <Sun size={13} />}
                <span>{isDarkMode ? '暗黑夜间' : '明亮浅色'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Compact Skeuomorphic Floating Capsule Trigger (常态精简拟物悬浮胶囊，点击弹出) */}
      <motion.div 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className={`flex items-center gap-2 p-1.5 pr-3.5 rounded-full cursor-pointer shadow-lg backdrop-blur-xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/90 border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-slate-100 hover:border-amber-400/40' 
            : 'bg-white/90 border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-slate-800 hover:border-amber-500/40'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Glowing Active Icon Capsule */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm relative transition-all ${
          contextMode === 'auto'
            ? 'bg-gradient-to-br from-amber-400 to-indigo-500 text-white'
            : isDarkMode ? 'bg-white/15 text-amber-300' : 'bg-amber-100 text-amber-800'
        }`}>
          <span>{contextMode === 'auto' ? currentActiveOption.symbol : currentSelectedOption.symbol}</span>
          
          {/* Subtle live radar ping if in auto mode */}
          {contextMode === 'auto' && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </div>

        {/* Current State Info */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-tight">
              {contextMode === 'auto' ? '智能感知' : currentSelectedOption.name}
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
              contextMode === 'auto'
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : 'bg-slate-500/10 text-slate-400'
            }`}>
              {contextMode === 'auto' ? currentActiveOption.name : '已锁定'}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium">点击切换情境</span>
        </div>

        {/* Arrow Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1 text-slate-400"
        >
          <ChevronUp size={14} />
        </motion.div>
      </motion.div>
    </div>
  );
};
