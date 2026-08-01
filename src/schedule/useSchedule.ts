import { useState } from 'react';
import { ScheduleItem } from '../types';

export const useSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(new Date().getDay());
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: '1', time: '08:00', task: '晨读时光', completed: true, dayOfWeek: new Date().getDay() },
    { id: '2', time: '14:00', task: 'AI 编程学习', completed: false, dayOfWeek: new Date().getDay() },
    { id: '3', time: '19:00', task: '体能锻炼', completed: false, dayOfWeek: new Date().getDay() },
    { id: '4', time: '10:00', task: '周一例会', completed: false, dayOfWeek: 1 },
    { id: '5', time: '15:00', task: '图书馆自习', completed: false, dayOfWeek: 3 },
    { id: '6', time: '09:00', task: '周末大扫除', completed: false, dayOfWeek: 6 },
  ]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const addSchedule = (task: string, time: string, dayOfWeek: number) => {
    const newSchedule: ScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      task,
      time,
      completed: false,
      dayOfWeek
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedScheduleDay,
    setSelectedScheduleDay,
    schedules,
    setSchedules,
    isAddingSchedule,
    setIsAddingSchedule,
    newTask,
    setNewTask,
    newTime,
    setNewTime,
    addSchedule,
    toggleSchedule,
    deleteSchedule
  };
};
