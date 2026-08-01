export type MainCategory = 'echo' | 'time' | 'calendar';
export type SubCategory = 'home' | 'clock' | 'timer' | 'focus' | 'today' | 'calendar-view' | 'weekly' | 'echo-home' | 'echo-history' | 'alarm';

export interface Message {
  role: 'user' | 'bot';
  text: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  completed: boolean;
  dayOfWeek: number; // 0-6
  category?: string;
  title?: string; // For backward compatibility with constants.ts
}

export interface WeatherInfo {
  temp: string;
  condition: string;
  icon: string;
  advice: string;
}

export interface CardState {
  type: 'knowledge' | 'story' | 'info';
  title: string;
  content: string;
  image: string | null;
}

export type ActiveCard = CardState;

export type ConversationState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: number[]; // 0-6
}
