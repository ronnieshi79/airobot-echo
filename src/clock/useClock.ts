import { useState, useEffect, useRef } from 'react';
import { AlarmItem } from '../types';

export const useClock = (onTimerEnd?: (msg: string) => void) => {
  const [time, setTime] = useState(new Date());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: '1', time: '07:00', label: '早起', enabled: true, days: [1, 2, 3, 4, 5] },
    { id: '2', time: '09:00', label: '晨会', enabled: false, days: [1, 2, 3, 4, 5] },
    { id: '3', time: '10:30', label: '周六瑜伽', enabled: true, days: [6] },
    { id: '4', time: '23:00', label: '睡前冥想', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
    { id: '5', time: '14:00', label: '一次性提醒', enabled: false, days: [] },
  ]);
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const focusInterval = useRef<NodeJS.Timeout | null>(null);

  // Clock update and alarm check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Check alarms
      const currentTimeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const currentDay = now.getDay();
      
      const ringing = alarms.find(a => 
        a.enabled && 
        a.time === currentTimeStr && 
        a.days.includes(currentDay)
      );
      
      if (ringing) {
        if (ringingAlarmId !== ringing.id) {
          setRingingAlarmId(ringing.id);
          // Optional: trigger sound here if needed, but UI will handle animation
        }
      } else {
        setRingingAlarmId(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarmId]);

  // Timer logic (Stopwatch)
  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [isTimerRunning]);

  // Focus logic
  useEffect(() => {
    if (isFocusRunning && focusTime > 0) {
      focusInterval.current = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            setIsFocusRunning(false);
            onTimerEnd?.("专注时间结束！休息一下吧。");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (focusInterval.current) clearInterval(focusInterval.current);
    }
    return () => { if (focusInterval.current) clearInterval(focusInterval.current); };
  }, [isFocusRunning, focusTime, onTimerEnd]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => {
      if (prev.length <= 1) return prev; // Don't delete last alarm
      return prev.filter(a => a.id !== id);
    });
  };

  const addAlarm = () => {
    const newAlarm: AlarmItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: '08:00',
      label: '新闹钟',
      enabled: true,
      days: [0, 1, 2, 3, 4, 5, 6]
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  return {
    time,
    timerSeconds,
    setTimerSeconds,
    isTimerRunning,
    setIsTimerRunning,
    focusTime,
    setFocusTime,
    isFocusRunning,
    setIsFocusRunning,
    alarms,
    setAlarms,
    toggleAlarm,
    deleteAlarm,
    addAlarm,
    ringingAlarmId
  };
};
