import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Bell, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlarmItem } from '../types';

interface AlarmViewProps {
  isDarkMode: boolean;
  alarms: AlarmItem[];
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  onAddAlarm: () => void;
  ringingAlarmId: string | null;
}

export const AlarmView: React.FC<AlarmViewProps> = ({
  isDarkMode,
  alarms,
  onToggleAlarm,
  onDeleteAlarm,
  onAddAlarm,
  ringingAlarmId
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const days = ['日', '一', '二', '三', '四', '五', '六'];

  // Ensure currentIndex is valid if alarms are deleted
  React.useEffect(() => {
    if (currentIndex >= alarms.length && alarms.length > 0) {
      setCurrentIndex(alarms.length - 1);
    }
  }, [alarms.length, currentIndex]);

  const nextAlarm = () => {
    setCurrentIndex((prev) => (prev + 1) % alarms.length);
  };

  const prevAlarm = () => {
    setCurrentIndex((prev) => (prev - 1 + alarms.length) % alarms.length);
  };

  const currentAlarm = alarms[currentIndex];
  const isRinging = ringingAlarmId !== null;

  const getTimeInterval = (timeStr: string) => {
    const [hour] = timeStr.split(':').map(Number);
    if (hour >= 5 && hour < 9) return '清晨';
    if (hour >= 9 && hour < 12) return '上午';
    if (hour >= 12 && hour < 14) return '中午';
    if (hour >= 14 && hour < 18) return '下午';
    if (hour >= 18 && hour < 22) return '晚上';
    return '深夜';
  };

  const getDayDescription = (alarmDays: number[]) => {
    if (alarmDays.length === 0) return '一次性';
    if (alarmDays.length === 7) return '每天';
    if (alarmDays.length === 5 && !alarmDays.includes(0) && !alarmDays.includes(6)) return '工作日';
    if (alarmDays.length === 2 && alarmDays.includes(0) && alarmDays.includes(6)) return '周末';
    return alarmDays.map(d => days[d]).join('、');
  };

  const handleButtonClick = () => {
    if (currentAlarm) {
      onToggleAlarm(currentAlarm.id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Skeuomorphic Alarm Design - Enlarged & Integrated Controls */}
      <div className="flex-none h-[460px] flex items-center justify-center pt-16">
        <div className="relative group">
          {/* Single Right Side Button - Simplified Toggle */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center gap-5 z-20">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ x: 2 }}
              onClick={handleButtonClick}
              className={`w-10 h-24 rounded-r-2xl border-y-2 border-r-2 shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-2 ${
                isDarkMode ? 'bg-slate-700 border-white/10 text-slate-400' : 'bg-slate-200 border-black/10 text-slate-600'
              }`}
            >
              <AnimatePresence mode="wait">
                {currentAlarm?.enabled ? (
                  <motion.div
                    key="cancel"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Square size={20} fill="currentColor" className="text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="activate"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Play size={20} fill="currentColor" className="text-orange-500" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-5 h-[2px] rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
                ))}
              </div>
            </motion.button>
          </div>

          <motion.div 
            animate={isRinging ? { rotate: [0, -2, 2, -2, 2, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className={`relative p-12 rounded-[5rem] ${isDarkMode ? 'bg-slate-800 shadow-[inset_0_4px_8px_rgba(255,255,255,0.05),0_40px_80px_rgba(0,0,0,0.6)]' : 'bg-slate-100 shadow-[inset_0_4px_8px_rgba(0,0,0,0.05),0_40px_80px_rgba(0,0,0,0.2)]'} flex items-center justify-center`}
          >
            {/* Bells with Animation - Only when ringing */}
            <motion.div 
              animate={isRinging ? { rotate: [-20, 20, -20] } : {}}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute -top-10 left-10 w-24 h-16 rounded-t-full bg-slate-400 shadow-lg origin-bottom" 
            />
            <motion.div 
              animate={isRinging ? { rotate: [20, -20, 20] } : {}}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute -top-10 right-10 w-24 h-16 rounded-t-full bg-slate-400 shadow-lg origin-bottom" 
            />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-10 bg-slate-500 rounded-full" />
            
            {/* Clock Face */}
            <div className={`w-72 h-72 rounded-[4rem] relative ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-inner flex flex-col items-center justify-center overflow-hidden border-[10px] ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className={`text-[12px] font-black uppercase tracking-[0.3em] mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isRinging ? '正在响铃' : (currentAlarm?.enabled ? '已开启' : '已关闭')}
              </div>
              <div className={`text-7xl font-black tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentAlarm ? currentAlarm.time : '--:--'}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    animate={isRinging ? { 
                      height: [8, 32, 8],
                      opacity: [0.4, 1, 0.4]
                    } : { height: 8, opacity: 0.1 }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-2 rounded-full bg-orange-500"
                  />
                ))}
              </div>
              {currentAlarm && (
                <div className={`mt-4 text-[11px] font-black uppercase tracking-widest ${currentAlarm.enabled ? 'text-orange-500 bg-orange-500/10' : 'text-slate-500 bg-slate-500/10'} px-4 py-1.5 rounded-full`}>
                  {currentAlarm.label || '闹钟'}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-10 relative flex flex-col items-center justify-start mt-10">
        <div className="w-full max-w-[760px] relative flex items-center justify-center">
          {alarms.length > 1 && (
            <>
              <button 
                onClick={prevAlarm}
                className={`absolute -left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextAlarm}
                className={`absolute -right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="w-full overflow-hidden px-4">
            <AnimatePresence mode="wait">
              {alarms.length > 0 && (
                <motion.div
                  key={alarms[currentIndex].id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className={`w-full h-24 px-8 rounded-[2.5rem] flex items-center justify-between transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800/60 border border-white/5 shadow-lg' 
                      : 'bg-white shadow-md border border-slate-50'
                  }`}
                >
                  {/* Structured Description */}
                  <div className="flex flex-col justify-center gap-0.5">
                    <div className={`text-[15px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} ${!alarms[currentIndex].enabled && 'opacity-40'}`}>
                      {alarms[currentIndex].time}：{getTimeInterval(alarms[currentIndex].time)} {alarms[currentIndex].label || '日常闹钟'}
                    </div>
                    <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>{getDayDescription(alarms[currentIndex].days)}</span>
                      <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      <span className={alarms[currentIndex].enabled ? 'text-orange-500' : ''}>
                        {alarms[currentIndex].enabled ? '运行中' : '已暂停'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onToggleAlarm(alarms[currentIndex].id)}
                      className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${alarms[currentIndex].enabled ? 'bg-orange-500' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')}`}
                    >
                      <motion.div 
                        animate={{ x: alarms[currentIndex].enabled ? 26 : 4 }}
                        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                      />
                    </button>
                    {alarms.length > 1 && (
                      <button 
                        onClick={() => onDeleteAlarm(alarms[currentIndex].id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 text-slate-500 hover:text-red-400' : 'bg-slate-50 text-slate-300 hover:text-red-500'}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {alarms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Clock size={64} className="mb-4" />
            <p className="font-bold">暂无闹钟</p>
          </div>
        )}
      </div>
    </div>
  );
};
