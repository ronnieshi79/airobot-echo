import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Sparkles, Cloud, ChevronRight, Brain, Timer, Bell, MessageSquare } from 'lucide-react';
import { MainCategory, SubCategory, ScheduleItem, WeatherInfo } from '../types';

interface Recommendation {
  title: string;
  icon: React.ReactNode;
  content: string;
  prompt: string;
  category: MainCategory;
  subCategory: SubCategory;
  color: string;
}

interface RecommendationStripProps {
  isDarkMode: boolean;
  time: Date;
  schedules: ScheduleItem[];
  todayInfo: any;
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  isFocusRunning: boolean;
  isTimerRunning: boolean;
  alarmCount: number;
}

export const RecommendationStrip: React.FC<RecommendationStripProps> = ({
  isDarkMode,
  time,
  schedules,
  todayInfo,
  onNavigate,
  isFocusRunning,
  isTimerRunning,
  alarmCount
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const todaySchedules = schedules.filter(s => s.dayOfWeek === time.getDay());
  const pendingSchedules = todaySchedules.filter(s => !s.completed);

  // Context-aware recommendations - Dynamic List
  const getDynamicRecommendations = (): Recommendation[] => {
    const recs: Recommendation[] = [];

    // 1. Focus State
    if (isFocusRunning) {
      recs.push({
        title: '专注模式',
        icon: <Brain />,
        content: '你正在深度专注中。AETHER 建议：保持当前节奏，我会为你屏蔽不必要的干扰。',
        prompt: '如何进入更深层次的专注？',
        category: 'time',
        subCategory: 'focus',
        color: 'text-indigo-500'
      });
    }

    // 2. Timer (Stopwatch) State
    if (isTimerRunning) {
      recs.push({
        title: '秒表计时',
        icon: <Timer />,
        content: '正在记录你的努力。AETHER 提醒：适时休息能让接下来的计时更高效。',
        prompt: '帮我分析这段时间的产出',
        category: 'time',
        subCategory: 'timer',
        color: 'text-cyan-500'
      });
    }

    // 3. Schedule State (Today)
    if (pendingSchedules.length > 0) {
      recs.push({
        title: '今日日程',
        icon: <Calendar />,
        content: `下一项任务是“${pendingSchedules[0].task}”。AETHER 建议：提前 5 分钟做准备。`,
        prompt: '帮我准备这项任务的资料',
        category: 'calendar',
        subCategory: 'today',
        color: 'text-emerald-500'
      });
    }

    // 4. Weekly Schedule
    const weeklyPending = schedules.filter(s => !s.completed && s.dayOfWeek > time.getDay());
    if (weeklyPending.length > 0) {
      recs.push({
        title: '本周展望',
        icon: <Sparkles />,
        content: `本周还有 ${weeklyPending.length} 项重要安排。AETHER 建议：合理分配精力，避免周末堆积。`,
        prompt: '帮我预览本周的重点日程',
        category: 'calendar',
        subCategory: 'calendar-view',
        color: 'text-purple-500'
      });
    }

    // 5. AI Chat / Conversation
    recs.push({
      title: 'AI 回响',
      icon: <MessageSquare />,
      content: '想听个故事或者聊聊心事吗？AETHER 随时待命。建议：试试“心事倾诉”模式，让我倾听你的声音。',
      prompt: '我今天有点不开心',
      category: 'echo',
      subCategory: 'echo-home',
      color: 'text-pink-500'
    });

    // 6. Environment / Knowledge
    recs.push({
      title: '灵感时刻',
      icon: <Brain />,
      content: `当前天气${todayInfo.weather.condition}。AETHER 建议：${todayInfo.weather.condition.includes('雨') ? '带把伞，心情也会变晴朗' : '是个出门散步的好时机'}。`,
      prompt: '根据天气推荐一些活动',
      category: 'echo',
      subCategory: 'echo-home',
      color: 'text-blue-500'
    });

    return recs;
  };

  const recommendations = getDynamicRecommendations();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % recommendations.length);
    }, 25000); // 25 seconds auto-scroll
    return () => clearInterval(interval);
  }, [recommendations.length]);

  const current = recommendations[currentIndex];

  return (
    <div className="w-full px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={() => onNavigate(current.category, current.subCategory)}
          className={`w-full p-5 rounded-[3rem] cursor-pointer transition-all flex items-center gap-5 relative overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-800/60 border border-white/5 shadow-xl' 
              : 'bg-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-100'
          }`}
        >
          <div className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center ${current.color} bg-opacity-10 shrink-0 shadow-inner`}>
            {React.cloneElement(current.icon as React.ReactElement, { size: 28 })}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                AI 智能提醒 · {current.title}
              </span>
              <Sparkles size={12} className="text-orange-500 animate-pulse" />
            </div>
            <p className={`text-base font-medium leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {current.content}
            </p>
          </div>

          {/* Dynamic Update Visual */}
          <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={24} className="text-orange-500 animate-bounce-x" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>

          {/* Decorative Background Element */}
          <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-10 ${current.color.replace('text-', 'bg-')}`} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
