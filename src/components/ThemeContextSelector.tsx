import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Laptop,
  Palmtree,
  Coffee,
  Compass,
  Calendar
} from 'lucide-react';

export type ContextType = 'auto' | 'morning' | 'afternoon' | 'evening' | 'night';
export type DayTypeMode = 'auto' | 'workday' | 'weekend';

interface ThemeContextSelectorProps {
  contextMode: ContextType;
  onContextModeChange: (mode: ContextType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeContext: 'morning' | 'afternoon' | 'evening' | 'night';
  dayTypeMode?: DayTypeMode;
  onDayTypeModeChange?: (mode: DayTypeMode) => void;
  isWeekend?: boolean;
  time?: Date;
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
}

export const ThemeContextSelector: React.FC<ThemeContextSelectorProps> = ({
  contextMode,
  onContextModeChange,
  isDarkMode,
  onToggleDarkMode,
  activeContext,
  dayTypeMode = 'auto',
  onDayTypeModeChange,
  isWeekend: propIsWeekend,
  time = new Date()
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const dayOfWeek = time.getDay();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayName = dayNames[dayOfWeek];

  const effectiveIsWeekend = useMemo(() => {
    if (propIsWeekend !== undefined) return propIsWeekend;
    if (dayTypeMode === 'weekend') return true;
    if (dayTypeMode === 'workday') return false;
    return dayOfWeek === 0 || dayOfWeek === 6;
  }, [propIsWeekend, dayTypeMode, dayOfWeek]);

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

  // Workday options
  const workdayOptions: ContextOption[] = [
    {
      id: 'auto',
      name: '智能感知',
      subname: '时间与节奏联动',
      symbol: '⚡',
      icon: <Zap size={15} className="text-amber-400" />,
      desc: '根据当前时间自动切换工作日 Standup、深度心流与下班卸压情境',
      tag: '自动感知'
    },
    {
      id: 'morning',
      name: '晨光通勤',
      subname: '站会要点 · 晨报速递',
      timeRange: '05:00 - 11:00',
      symbol: '🌅',
      icon: <CloudSun size={15} className="text-amber-500" />,
      desc: '整理今日 Standup 站会要点、待提 PR 任务与晨间通勤伴听',
      tag: '元气启航'
    },
    {
      id: 'afternoon',
      name: '深度工作',
      subname: '极客心流 · 架构灵感',
      timeRange: '11:00 - 17:30',
      symbol: '☀️',
      icon: <Sun size={15} className="text-emerald-500" />,
      desc: '沉浸 Coding 心流、架构设计拆解与疑难 Bug 排查',
      tag: '专注心流'
    },
    {
      id: 'evening',
      name: '暮色下班',
      subname: '卸压复盘 · 治愈轻听',
      timeRange: '17:30 - 21:30',
      symbol: '🌆',
      icon: <Sunset size={15} className="text-rose-400" />,
      desc: '合上电脑告别工单，把工作烦恼交给树洞，享受治愈晚风',
      tag: '告别疲惫'
    },
    {
      id: 'night',
      name: '深夜静谧',
      subname: '极客随笔 · 助眠故事',
      timeRange: '21:30 - 05:00',
      symbol: '🌙',
      icon: <Moon size={15} className="text-indigo-400" />,
      desc: '记录今日开发心得与生活确幸，声优故事陪伴安然入睡',
      tag: '沉淀助眠'
    }
  ];

  // Weekend options
  const weekendOptions: ContextOption[] = [
    {
      id: 'auto',
      name: '智能感知',
      subname: '假日时光与休闲联动',
      symbol: '⚡',
      icon: <Zap size={15} className="text-teal-400" />,
      desc: '自动感知周末节律：自然醒慢晨报、假日探店漫游与微醺电影之夜',
      tag: '周末感知'
    },
    {
      id: 'morning',
      name: '晨光悠闲',
      subname: '自然醒 · 慢享咖啡',
      timeRange: '05:00 - 11:00',
      symbol: '☕',
      icon: <Coffee size={15} className="text-amber-500" />,
      desc: '无闹钟与早会催促，享受慢调阳光早报、户外散步与咖啡轻播客',
      tag: '慢调清晨'
    },
    {
      id: 'afternoon',
      name: '假日午后',
      subname: '探店漫游 · 兴趣创作',
      timeRange: '11:00 - 17:30',
      symbol: '🧭',
      icon: <Compass size={15} className="text-teal-500" />,
      desc: '走出房间漫步城市、探访宝藏小店，或自由折腾 Side-Project 灵感',
      tag: '漫步创作'
    },
    {
      id: 'evening',
      name: '惬意黄昏',
      subname: '美食欢聚 · 电影之夜',
      timeRange: '17:30 - 21:30',
      symbol: '🌆',
      icon: <Sunset size={15} className="text-rose-400" />,
      desc: '享受治愈周末晚餐特调、好友欢聚畅聊或沉浸高分电影之夜',
      tag: '欢聚微醺'
    },
    {
      id: 'night',
      name: '假日深夜',
      subname: '自由放空 · 甜梦助眠',
      timeRange: '21:30 - 05:00',
      symbol: '🌙',
      icon: <Moon size={15} className="text-purple-400" />,
      desc: '纯粹属于自己的自由时光，伴着声优奇幻星际故事甜美入梦',
      tag: '纯粹自由'
    }
  ];

  const options = effectiveIsWeekend ? weekendOptions : workdayOptions;
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
            className={`mb-3 w-[350px] sm:w-[390px] p-5 rounded-[2rem] shadow-2xl border backdrop-blur-2xl transition-colors duration-300 ${
              isDarkMode
                ? 'bg-slate-900/95 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-slate-100'
                : 'bg-white/95 border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                  effectiveIsWeekend 
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-500' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                }`}>
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-tight">情境感知中枢</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 border ${
                      effectiveIsWeekend
                        ? 'bg-teal-500/10 text-teal-500 border-teal-500/20'
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {effectiveIsWeekend ? <Palmtree size={9} /> : <Laptop size={9} />}
                      {effectiveIsWeekend ? '周末休闲模式' : '极客工作模式'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    今天是{dayName} · {effectiveIsWeekend ? '非工作日/休息日' : '常规工作日'}
                  </p>
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

            {/* Day Type Selector (工作日 vs 休息日 / 智能自动识别) */}
            <div className="mb-3 p-1 rounded-xl bg-black/5 dark:bg-white/5 flex items-center gap-1">
              <button
                onClick={() => onDayTypeModeChange && onDayTypeModeChange('auto')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
                  dayTypeMode === 'auto'
                    ? isDarkMode 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Zap size={11} className={dayTypeMode === 'auto' ? 'text-amber-400' : ''} />
                <span>自动 ({dayName})</span>
              </button>

              <button
                onClick={() => onDayTypeModeChange && onDayTypeModeChange('workday')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
                  dayTypeMode === 'workday'
                    ? isDarkMode 
                      ? 'bg-blue-600/80 text-white shadow-sm' 
                      : 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Laptop size={11} />
                <span>工作日</span>
              </button>

              <button
                onClick={() => onDayTypeModeChange && onDayTypeModeChange('weekend')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
                  dayTypeMode === 'weekend'
                    ? isDarkMode 
                      ? 'bg-teal-600/80 text-white shadow-sm' 
                      : 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Palmtree size={11} />
                <span>休息日</span>
              </button>
            </div>

            {/* Context Options List */}
            <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-0.5 custom-scrollbar">
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
                          ? effectiveIsWeekend 
                            ? 'bg-teal-500/15 border-teal-400/60 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                            : 'bg-white/10 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : effectiveIsWeekend
                            ? 'bg-teal-500/10 border-teal-500/40 shadow-[0_4px_15px_rgba(20,184,166,0.1)]'
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
                          ? effectiveIsWeekend ? 'bg-teal-500 text-white' : 'bg-amber-500 text-white'
                          : isDarkMode ? 'bg-white/10' : 'bg-white'
                      }`}>
                        {opt.symbol}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            isSelected 
                              ? effectiveIsWeekend ? 'text-teal-500 dark:text-teal-400' : 'text-amber-500 dark:text-amber-400' 
                              : ''
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
                        <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center ${
                          effectiveIsWeekend ? 'bg-teal-500' : 'bg-amber-500'
                        }`}>
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
            ? effectiveIsWeekend 
              ? 'bg-gradient-to-br from-teal-400 to-sky-500 text-white'
              : 'bg-gradient-to-br from-amber-400 to-indigo-500 text-white'
            : isDarkMode ? 'bg-white/15 text-amber-300' : 'bg-amber-100 text-amber-800'
        }`}>
          <span>{contextMode === 'auto' ? currentActiveOption.symbol : currentSelectedOption.symbol}</span>
          
          {/* Subtle live radar ping if in auto mode */}
          {contextMode === 'auto' && (
            <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping ${
              effectiveIsWeekend ? 'bg-teal-400' : 'bg-amber-400'
            }`} />
          )}
        </div>

        {/* Current State Info */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-tight">
              {contextMode === 'auto' 
                ? (effectiveIsWeekend ? '周末感知' : '智能感知') 
                : currentSelectedOption.name
              }
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
              contextMode === 'auto'
                ? effectiveIsWeekend 
                  ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                  : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : 'bg-slate-500/10 text-slate-400'
            }`}>
              {contextMode === 'auto' ? currentActiveOption.name : '已锁定'}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium">
            {effectiveIsWeekend ? `🏖️ ${dayName}·休息日` : `💼 ${dayName}·工作日`} · 点击切换
          </span>
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
