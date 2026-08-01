import React from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, Music, Timer, Brain, Bell, ChevronRight } from 'lucide-react';
import { ScheduleItem, AlarmItem, SubCategory } from '../types';
import { SkeuomorphicClock } from './SkeuomorphicClock';

interface ClockHomeViewProps {
  isDarkMode: boolean;
  time: Date;
  schedules: ScheduleItem[];
  focusTime: number;
  isFocusRunning: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
  alarms: AlarmItem[];
  onNavigate: (sub: SubCategory) => void;
}

export const ClockHomeView: React.FC<ClockHomeViewProps> = ({
  isDarkMode,
  time,
  schedules,
  focusTime,
  isFocusRunning,
  timerSeconds,
  isTimerRunning,
  alarms,
  onNavigate
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeAlarms = alarms.filter(a => a.enabled);
  const nextAlarm = activeAlarms.length > 0 ? activeAlarms[0].time : '无';

  const today = new Date().getDay();
  const todaySchedules = schedules.filter(s => s.dayOfWeek === today && !s.completed);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 relative z-10">
      {/* Main Clock Display */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <SkeuomorphicClock 
          time={time} 
          isDarkMode={isDarkMode} 
          size="md"
          focusTime={focusTime}
          isFocusRunning={isFocusRunning}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          alarms={alarms}
          onFocusClick={() => onNavigate('focus')}
          onTimerClick={() => onNavigate('timer')}
          onAlarmClick={() => onNavigate('alarm')}
        />
      </motion.div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('alarm')}
          className={`p-5 rounded-3xl cursor-pointer flex flex-col gap-2 transition-all ${isDarkMode ? 'bg-slate-800/80 border border-white/10 hover:bg-slate-700' : 'bg-white/80 border border-black/5 hover:bg-white shadow-lg'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-500">
              <Bell size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">下一个闹钟</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
          <div className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {nextAlarm}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('focus')}
          className={`p-5 rounded-3xl cursor-pointer flex flex-col gap-2 transition-all ${isDarkMode ? 'bg-slate-800/80 border border-white/10 hover:bg-slate-700' : 'bg-white/80 border border-black/5 hover:bg-white shadow-lg'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-500">
              <Brain size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">专注状态</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
          <div className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {isFocusRunning ? formatTime(focusTime) : '未开启'}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('timer')}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'}`}
        >
          <Timer size={18} />
          <span>快速计时</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('alarm')}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
        >
          <Bell size={18} />
          <span>添加闹钟</span>
        </motion.button>
      </div>
    </div>
  );
};
