import React from 'react';
import { motion } from 'motion/react';
import { SkeuomorphicClock } from '../clock';
import { RecommendationStrip } from './RecommendationStrip';
import { MainCategory, SubCategory, ScheduleItem, AlarmItem } from '../types';
import { getTodayInfo } from '../constants';

interface HomeMenuProps {
  isDarkMode: boolean;
  time: Date;
  schedules: ScheduleItem[];
  focusTime: number;
  isFocusRunning: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
  alarms: AlarmItem[];
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onFocusClick: () => void;
  onTimerClick: () => void;
  onAlarmClick: () => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({
  isDarkMode,
  time,
  schedules,
  focusTime,
  isFocusRunning,
  timerSeconds,
  isTimerRunning,
  alarms,
  onNavigate,
  onFocusClick,
  onTimerClick,
  onAlarmClick
}) => {
  const todayInfo = getTodayInfo(time);
  const alarmCount = alarms.length;

  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-6 relative">
      {/* Top Section: Main Clock */}
      <div className="flex flex-col items-center justify-center flex-1 mt-4">
        <SkeuomorphicClock 
          time={time} 
          isDarkMode={isDarkMode} 
          size="lg" 
          focusTime={focusTime}
          isFocusRunning={isFocusRunning}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          alarms={alarms}
          onFocusClick={onFocusClick}
          onTimerClick={onTimerClick}
          onAlarmClick={onAlarmClick}
        />
      </div>

      {/* Bottom Section: Context-Aware Recommendations */}
      <div className="w-full">
        <RecommendationStrip
          isDarkMode={isDarkMode}
          time={time}
          schedules={schedules}
          todayInfo={todayInfo}
          onNavigate={onNavigate}
          isFocusRunning={isFocusRunning}
          isTimerRunning={isTimerRunning}
          alarmCount={alarmCount}
        />
      </div>
    </div>
  );
};
