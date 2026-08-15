import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Sunset, 
  Book, 
  Heart, 
  ListTodo, 
  Brain, 
  PenLine, 
  ChevronRight, 
  Radio, 
  Headphones,
  CloudSun,
  Zap,
  ArrowRight,
  Coffee,
  Compass,
  Film,
  UtensilsCrossed,
  Palmtree,
  Laptop
} from 'lucide-react';
import { SubCategory } from '../types';
import { HistorySummary } from './useEcho';

export type ContextType = 'auto' | 'night' | 'morning' | 'afternoon' | 'evening';
export type DayTypeMode = 'auto' | 'workday' | 'weekend';

interface EchoHomeViewProps {
  isDarkMode: boolean;
  subCategory: SubCategory;
  historySummaries: HistorySummary[];
  onSendMessage: (text: string) => void;
  onStartSession: (type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily' | 'podcast', content?: string) => void;
  onViewHistory: () => void;
  time: Date;
  contextMode?: ContextType;
  onContextModeChange?: (mode: ContextType) => void;
  dayTypeMode?: DayTypeMode;
  isWeekend?: boolean;
}

interface ServiceCard {
  id: string;
  type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily' | 'podcast';
  title: string;
  subtitle: string;
  recommendBadge: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
  initialPrompt: string;
}

interface ContextTheme {
  bgGradientLight: string;
  bgGradientDark: string;
  glowColor1: string;
  glowColor2: string;
  cardBgLight: string;
  cardBgDark: string;
  cardBorderLight: string;
  cardBorderDark: string;
  cardHoverLight: string;
  cardHoverDark: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeTextLight: string;
  badgeTextDark: string;
  actionBtnBgLight: string;
  actionBtnBgDark: string;
  actionBtnTextLight: string;
  actionBtnTextDark: string;
  iconBgLight: string;
  iconBgDark: string;
  accentTitleColorLight: string;
  accentTitleColorDark: string;
}

interface ContextProfile {
  id: 'night' | 'morning' | 'afternoon' | 'evening';
  label: string;
  timeRange: string;
  badgeIcon: React.ReactNode;
  metaphorSymbol: string;
  weatherText: string;
  aiQuote: string;
  theme: ContextTheme;
  cards: ServiceCard[];
}

export const EchoHomeView: React.FC<EchoHomeViewProps> = ({
  isDarkMode,
  subCategory,
  historySummaries,
  onSendMessage,
  onStartSession,
  onViewHistory,
  time,
  contextMode,
  onContextModeChange,
  dayTypeMode = 'auto',
  isWeekend: propIsWeekend
}) => {
  const [internalContext, setInternalContext] = useState<ContextType>('auto');

  const selectedContext = contextMode !== undefined ? contextMode : internalContext;
  const setSelectedContext = onContextModeChange || setInternalContext;

  const currentHour = time.getHours();
  const currentMinutes = time.getMinutes();
  const timeValue = currentHour + currentMinutes / 60;
  const dayOfWeek = time.getDay();

  // Effective Weekend calculation
  const isWeekend = useMemo(() => {
    if (propIsWeekend !== undefined) return propIsWeekend;
    if (dayTypeMode === 'weekend') return true;
    if (dayTypeMode === 'workday') return false;
    return dayOfWeek === 0 || dayOfWeek === 6;
  }, [propIsWeekend, dayTypeMode, dayOfWeek]);

  // Determine current active context automatically based on time if set to 'auto'
  const activeContextKey = useMemo(() => {
    if (selectedContext !== 'auto') return selectedContext;
    if (timeValue >= 5 && timeValue < 11) return 'morning';
    if (timeValue >= 11 && timeValue < 17.5) return 'afternoon';
    if (timeValue >= 17.5 && timeValue < 21.5) return 'evening';
    return 'night';
  }, [selectedContext, timeValue]);

  // Workday Profiles (工作日情境配置 - 针对上班族/程序员节奏)
  const workdayProfiles: Record<'night' | 'morning' | 'afternoon' | 'evening', ContextProfile> = {
    night: {
      id: 'night',
      label: '深夜静谧',
      timeRange: '21:30 - 05:00',
      badgeIcon: <Moon size={14} className="text-indigo-400" />,
      metaphorSymbol: '🌙',
      weatherText: '终端沉静 · 极客随笔与星空助眠',
      aiQuote: '夜深了，终端归于沉静。记录今天的心得感悟，在星辰白噪音中安心入眠。',
      theme: {
        bgGradientLight: 'from-indigo-100/70 via-slate-100/50 to-purple-100/60',
        bgGradientDark: 'from-slate-950 via-indigo-950/60 to-purple-950/50',
        glowColor1: 'rgba(99, 102, 241, 0.35)',
        glowColor2: 'rgba(168, 85, 247, 0.25)',
        cardBgLight: 'bg-indigo-50/80 backdrop-blur-md',
        cardBgDark: 'bg-indigo-950/40 backdrop-blur-md',
        cardBorderLight: 'border-indigo-200/90 hover:border-indigo-400/80 shadow-[0_10px_30px_rgba(99,102,241,0.08)]',
        cardBorderDark: 'border-indigo-500/30 hover:border-indigo-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-indigo-100/80',
        cardHoverDark: 'hover:bg-indigo-900/50',
        badgeBgLight: 'bg-indigo-100/90 border-indigo-300',
        badgeBgDark: 'bg-indigo-500/20 border-indigo-500/40',
        badgeTextLight: 'text-indigo-700',
        badgeTextDark: 'text-indigo-300',
        actionBtnBgLight: 'bg-indigo-600 hover:bg-indigo-700',
        actionBtnBgDark: 'bg-indigo-500 hover:bg-indigo-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-white',
        iconBgLight: 'bg-indigo-200/80 text-indigo-700',
        iconBgDark: 'bg-indigo-500/30 text-indigo-300',
        accentTitleColorLight: 'text-indigo-950',
        accentTitleColorDark: 'text-indigo-100',
      },
      cards: [
        {
          id: 'w_n1',
          type: 'story',
          title: '睡前沉浸奇幻故事',
          subtitle: '声优伴播 · 自然助眠',
          recommendBadge: '✨ 助眠首选',
          tag: '睡前助眠',
          desc: '倾诉星空、古老森林与极客传说，抚平大脑的高速运转与思绪焦虑。',
          icon: <Book size={22} className="text-indigo-500 dark:text-indigo-300" />,
          initialPrompt: '请为我讲一个关于星空与古老森林的睡前舒缓奇幻故事，伴我入眠。'
        },
        {
          id: 'w_n2',
          type: 'daily',
          title: '开发者随笔与灵感星图',
          subtitle: '灵感归档 · 生活小确幸',
          recommendBadge: '💡 沉淀记录',
          tag: '心得沉淀',
          desc: '记录今日攻克技术难题的心得、闪光点子与生活小确幸。',
          icon: <Heart size={22} className="text-purple-500 dark:text-purple-300" />,
          initialPrompt: '我想记录今天解决的一个技术难点心得与生活中的小确幸。'
        }
      ]
    },
    morning: {
      id: 'morning',
      label: '晨光通勤',
      timeRange: '05:00 - 11:00',
      badgeIcon: <CloudSun size={14} className="text-amber-500" />,
      metaphorSymbol: '🌅',
      weatherText: '晨光拂晓 · 站会排期与通勤早报',
      aiQuote: '晨光破晓，元气上线。已为你梳理今日 Standup 站会重点、待提 PR 与晨间通勤伴听。',
      theme: {
        bgGradientLight: 'from-amber-100/70 via-orange-50/50 to-yellow-100/60',
        bgGradientDark: 'from-slate-950 via-amber-950/60 to-orange-950/40',
        glowColor1: 'rgba(245, 158, 11, 0.35)',
        glowColor2: 'rgba(251, 146, 60, 0.25)',
        cardBgLight: 'bg-amber-50/80 backdrop-blur-md',
        cardBgDark: 'bg-amber-950/40 backdrop-blur-md',
        cardBorderLight: 'border-amber-200/90 hover:border-amber-400/80 shadow-[0_10px_30px_rgba(245,158,11,0.08)]',
        cardBorderDark: 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-amber-100/80',
        cardHoverDark: 'hover:bg-amber-900/50',
        badgeBgLight: 'bg-amber-100/90 border-amber-300',
        badgeBgDark: 'bg-amber-500/20 border-amber-500/40',
        badgeTextLight: 'text-amber-800',
        badgeTextDark: 'text-amber-300',
        actionBtnBgLight: 'bg-amber-600 hover:bg-amber-700',
        actionBtnBgDark: 'bg-amber-500 hover:bg-amber-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-slate-950',
        iconBgLight: 'bg-amber-200/80 text-amber-800',
        iconBgDark: 'bg-amber-500/30 text-amber-300',
        accentTitleColorLight: 'text-amber-950',
        accentTitleColorDark: 'text-amber-100',
      },
      cards: [
        {
          id: 'w_m1',
          type: 'task',
          title: '晨间 Standup & 今日焦点',
          subtitle: '智能提炼 · 任务排期',
          recommendBadge: '✨ 晨起首选',
          tag: '站会备忘',
          desc: '快速梳理今日核心开发任务、会议排期与代码评审优先级。',
          icon: <Radio size={22} className="text-amber-600 dark:text-amber-300" />,
          initialPrompt: '请帮我梳理今天的 Standup 站会要点与核心开发任务清单。'
        },
        {
          id: 'w_m2',
          type: 'podcast',
          title: '通勤极客轻播客',
          subtitle: '科技速递 · 轻松伴听',
          recommendBadge: '🎧 伴听推荐',
          tag: '通勤伴听',
          desc: '随身声优讲述科技前沿快讯与轻快故事，元气开启通勤路。',
          icon: <PenLine size={22} className="text-orange-600 dark:text-orange-300" />,
          initialPrompt: '请播放一段适合上班通勤听的技术快讯与能量轻播客。'
        }
      ]
    },
    afternoon: {
      id: 'afternoon',
      label: '深度工作',
      timeRange: '11:00 - 17:30',
      badgeIcon: <Sun size={14} className="text-teal-500" />,
      metaphorSymbol: '☀️',
      weatherText: '心流编码 · 架构设计与灵感突破',
      aiQuote: '午后阳光正好，心流模式就绪。有什么架构难题、重构思路或闪光灵感需要我协助突破吗？',
      theme: {
        bgGradientLight: 'from-emerald-100/70 via-teal-50/50 to-sky-100/60',
        bgGradientDark: 'from-slate-950 via-teal-950/60 to-emerald-950/40',
        glowColor1: 'rgba(16, 185, 129, 0.35)',
        glowColor2: 'rgba(14, 165, 233, 0.25)',
        cardBgLight: 'bg-teal-50/80 backdrop-blur-md',
        cardBgDark: 'bg-teal-950/40 backdrop-blur-md',
        cardBorderLight: 'border-teal-200/90 hover:border-teal-400/80 shadow-[0_10px_30px_rgba(20,184,166,0.08)]',
        cardBorderDark: 'border-teal-500/30 hover:border-teal-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-teal-100/80',
        cardHoverDark: 'hover:bg-teal-900/50',
        badgeBgLight: 'bg-teal-100/90 border-teal-300',
        badgeBgDark: 'bg-teal-500/20 border-teal-500/40',
        badgeTextLight: 'text-teal-800',
        badgeTextDark: 'text-teal-300',
        actionBtnBgLight: 'bg-teal-600 hover:bg-teal-700',
        actionBtnBgDark: 'bg-teal-500 hover:bg-teal-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-slate-950',
        iconBgLight: 'bg-teal-200/80 text-teal-800',
        iconBgDark: 'bg-teal-500/30 text-teal-300',
        accentTitleColorLight: 'text-teal-950',
        accentTitleColorDark: 'text-teal-100',
      },
      cards: [
        {
          id: 'w_a1',
          type: 'inspiration',
          title: '架构设计与灵感风暴',
          subtitle: 'AI 灵感合伙人 · 方案拆解',
          recommendBadge: '✨ 灵感首选',
          tag: '架构拆解',
          desc: '遇到技术选型或重构瓶颈？快速拆解逻辑，碰撞出优雅的架构方案。',
          icon: <Brain size={22} className="text-sky-600 dark:text-sky-300" />,
          initialPrompt: '我正在设计一个技术方案，想和你一起做个架构拆解与头脑风暴。'
        },
        {
          id: 'w_a2',
          type: 'task',
          title: 'Debug 树洞与专注清单',
          subtitle: '疑难排查 · 专注心流',
          recommendBadge: '⚡ 效率推荐',
          tag: 'Debug排查',
          desc: '理清复杂 Bug 排查步骤与根因假设，开启沉浸专注开发。',
          icon: <ListTodo size={22} className="text-emerald-600 dark:text-emerald-300" />,
          initialPrompt: '帮我理清这个代码 Bug 的排查路线，并开启一段专注心流。'
        }
      ]
    },
    evening: {
      id: 'evening',
      label: '暮色下班',
      timeRange: '17:30 - 21:30',
      badgeIcon: <Sunset size={14} className="text-rose-400" />,
      metaphorSymbol: '🌆',
      weatherText: '落日余晖 · 告别工单与卸压复盘',
      aiQuote: '辛苦了一天，合上电脑。把工作委屈与繁琐工单交给AI树洞，开启晚间放松。',
      theme: {
        bgGradientLight: 'from-rose-100/70 via-pink-50/50 to-orange-100/60',
        bgGradientDark: 'from-slate-950 via-rose-950/60 to-pink-950/40',
        glowColor1: 'rgba(244, 63, 94, 0.35)',
        glowColor2: 'rgba(217, 70, 239, 0.25)',
        cardBgLight: 'bg-rose-50/80 backdrop-blur-md',
        cardBgDark: 'bg-rose-950/40 backdrop-blur-md',
        cardBorderLight: 'border-rose-200/90 hover:border-rose-400/80 shadow-[0_10px_30px_rgba(244,63,94,0.08)]',
        cardBorderDark: 'border-rose-500/30 hover:border-rose-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-rose-100/80',
        cardHoverDark: 'hover:bg-rose-900/50',
        badgeBgLight: 'bg-rose-100/90 border-rose-300',
        badgeBgDark: 'bg-rose-500/20 border-rose-500/40',
        badgeTextLight: 'text-rose-800',
        badgeTextDark: 'text-rose-300',
        actionBtnBgLight: 'bg-rose-600 hover:bg-rose-700',
        actionBtnBgDark: 'bg-rose-500 hover:bg-rose-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-white',
        iconBgLight: 'bg-rose-200/80 text-rose-800',
        iconBgDark: 'bg-rose-500/30 text-rose-300',
        accentTitleColorLight: 'text-rose-950',
        accentTitleColorDark: 'text-rose-100',
      },
      cards: [
        {
          id: 'w_e1',
          type: 'confide',
          title: '下班心理卸压树洞',
          subtitle: '情绪疏导 · 治愈陪伴',
          recommendBadge: '✨ 卸压首选',
          tag: '情绪安全',
          desc: '把代码改动与需求催促进度中的疲惫说出来，享受无压力的温柔回应。',
          icon: <Heart size={22} className="text-rose-600 dark:text-rose-300" />,
          initialPrompt: '终于下班了，今天写代码改需求好心累，想和你聊聊卸卸压。'
        },
        {
          id: 'w_e2',
          type: 'podcast',
          title: '暮色治愈轻播客',
          subtitle: '声优解压 · 轻松随想',
          recommendBadge: '🎧 伴听推荐',
          tag: '晚间放松',
          desc: '随身声优讲述治愈系旅行与生活纪事，带走一整天的脑力沉重。',
          icon: <Headphones size={22} className="text-purple-600 dark:text-purple-300" />,
          initialPrompt: '请给我放一段轻松惬意的晚间播客故事。'
        }
      ]
    }
  };

  // Weekend Profiles (周末/非工作日情境配置 - 针对休息放松/慢生活/兴趣创作)
  const weekendProfiles: Record<'night' | 'morning' | 'afternoon' | 'evening', ContextProfile> = {
    night: {
      id: 'night',
      label: '假日深夜',
      timeRange: '21:30 - 05:00',
      badgeIcon: <Moon size={14} className="text-indigo-400" />,
      metaphorSymbol: '🌙',
      weatherText: '星空静谧 · 纯粹自由时光与甜梦电台',
      aiQuote: '周末深夜是属于你自己的纯粹自由时刻。放下所有待办与琐事，在温柔星光中安心好眠。',
      theme: {
        bgGradientLight: 'from-purple-100/70 via-indigo-50/50 to-pink-100/60',
        bgGradientDark: 'from-slate-950 via-purple-950/60 to-indigo-950/50',
        glowColor1: 'rgba(168, 85, 247, 0.35)',
        glowColor2: 'rgba(99, 102, 241, 0.25)',
        cardBgLight: 'bg-purple-50/80 backdrop-blur-md',
        cardBgDark: 'bg-purple-950/40 backdrop-blur-md',
        cardBorderLight: 'border-purple-200/90 hover:border-purple-400/80 shadow-[0_10px_30px_rgba(168,85,247,0.08)]',
        cardBorderDark: 'border-purple-500/30 hover:border-purple-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-purple-100/80',
        cardHoverDark: 'hover:bg-purple-900/50',
        badgeBgLight: 'bg-purple-100/90 border-purple-300',
        badgeBgDark: 'bg-purple-500/20 border-purple-500/40',
        badgeTextLight: 'text-purple-700',
        badgeTextDark: 'text-purple-300',
        actionBtnBgLight: 'bg-purple-600 hover:bg-purple-700',
        actionBtnBgDark: 'bg-purple-500 hover:bg-purple-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-white',
        iconBgLight: 'bg-purple-200/80 text-purple-700',
        iconBgDark: 'bg-purple-500/30 text-purple-300',
        accentTitleColorLight: 'text-purple-950',
        accentTitleColorDark: 'text-purple-100',
      },
      cards: [
        {
          id: 'wk_n1',
          type: 'story',
          title: '周末自由声优助眠电台',
          subtitle: '奇幻星河 · 沉浸伴播',
          recommendBadge: '✨ 甜梦首选',
          tag: '声优助眠',
          desc: '倾听温柔安宁的星际列车与云端岛屿故事，卸下心绪甜美入梦。',
          icon: <Book size={22} className="text-purple-500 dark:text-purple-300" />,
          initialPrompt: '请为我讲一个关于星际列车与云端岛屿的治愈睡前故事，伴我甜梦入眠。'
        },
        {
          id: 'wk_n2',
          type: 'daily',
          title: '周末闪光记录与愿望账本',
          subtitle: '小确幸归档 · 蓄满能量',
          recommendBadge: '⭐ 确幸归档',
          tag: '周末记录',
          desc: '记录本周最快乐的 3 个瞬间与周末小确幸，蓄满元气期待下周。',
          icon: <Heart size={22} className="text-pink-500 dark:text-pink-300" />,
          initialPrompt: '我想梳理记录一下这周和周末让我开心的闪光瞬间，留作生活小确幸回忆。'
        }
      ]
    },
    morning: {
      id: 'morning',
      label: '晨光悠闲',
      timeRange: '05:00 - 11:00',
      badgeIcon: <Coffee size={14} className="text-amber-500" />,
      metaphorSymbol: '☕',
      weatherText: '阳光微风 · 自然醒与慢调晨报',
      aiQuote: '周末愉快！今天没有早班站会与闹钟催促。为您精选了慢调周末早报、惬意散步与咖啡轻播客。',
      theme: {
        bgGradientLight: 'from-amber-100/70 via-yellow-50/50 to-orange-100/60',
        bgGradientDark: 'from-slate-950 via-amber-950/60 to-yellow-950/40',
        glowColor1: 'rgba(245, 158, 11, 0.35)',
        glowColor2: 'rgba(234, 179, 8, 0.25)',
        cardBgLight: 'bg-amber-50/80 backdrop-blur-md',
        cardBgDark: 'bg-amber-950/40 backdrop-blur-md',
        cardBorderLight: 'border-amber-200/90 hover:border-amber-400/80 shadow-[0_10px_30px_rgba(245,158,11,0.08)]',
        cardBorderDark: 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-amber-100/80',
        cardHoverDark: 'hover:bg-amber-900/50',
        badgeBgLight: 'bg-amber-100/90 border-amber-300',
        badgeBgDark: 'bg-amber-500/20 border-amber-500/40',
        badgeTextLight: 'text-amber-800',
        badgeTextDark: 'text-amber-300',
        actionBtnBgLight: 'bg-amber-600 hover:bg-amber-700',
        actionBtnBgDark: 'bg-amber-500 hover:bg-amber-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-slate-950',
        iconBgLight: 'bg-amber-200/80 text-amber-800',
        iconBgDark: 'bg-amber-500/30 text-amber-300',
        accentTitleColorLight: 'text-amber-950',
        accentTitleColorDark: 'text-amber-100',
      },
      cards: [
        {
          id: 'wk_m1',
          type: 'task',
          title: '周末慢调阳光速递',
          subtitle: '周末天气 · 休闲指南',
          recommendBadge: '✨ 假日首选',
          tag: '周末早报',
          desc: '精选轻松趣味资讯、周末适宜户外指数与悠闲晨光建议。',
          icon: <Sun size={22} className="text-amber-500 dark:text-amber-300" />,
          initialPrompt: '早上好！今天不用上班，请为我生成一份轻松惬意的周末慢生活晨报与户外休闲建议。'
        },
        {
          id: 'wk_m2',
          type: 'podcast',
          title: '慢享咖啡与治愈轻播客',
          subtitle: '伴听音乐 · 慢调时光',
          recommendBadge: '☕ 慢调伴听',
          tag: '咖啡时光',
          desc: '随身声优陪伴慢享咖啡时光，讲述轻松旅行随想与治愈小故事。',
          icon: <Coffee size={22} className="text-orange-500 dark:text-orange-300" />,
          initialPrompt: '请为我放一段适合周末早晨边喝咖啡边听的治愈轻播客故事。'
        }
      ]
    },
    afternoon: {
      id: 'afternoon',
      label: '假日午后',
      timeRange: '11:00 - 17:30',
      badgeIcon: <Compass size={14} className="text-teal-500" />,
      metaphorSymbol: '🧭',
      weatherText: '阳光漫游 · 户外探店与兴趣工坊',
      aiQuote: '午后阳光正好，把工作暂时抛在脑后。去探索城市街角、读本闲书，或把玩有趣的灵感创作。',
      theme: {
        bgGradientLight: 'from-teal-100/70 via-emerald-50/50 to-sky-100/60',
        bgGradientDark: 'from-slate-950 via-teal-950/60 to-sky-950/40',
        glowColor1: 'rgba(20, 184, 166, 0.35)',
        glowColor2: 'rgba(56, 189, 248, 0.25)',
        cardBgLight: 'bg-teal-50/80 backdrop-blur-md',
        cardBgDark: 'bg-teal-950/40 backdrop-blur-md',
        cardBorderLight: 'border-teal-200/90 hover:border-teal-400/80 shadow-[0_10px_30px_rgba(20,184,166,0.08)]',
        cardBorderDark: 'border-teal-500/30 hover:border-teal-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-teal-100/80',
        cardHoverDark: 'hover:bg-teal-900/50',
        badgeBgLight: 'bg-teal-100/90 border-teal-300',
        badgeBgDark: 'bg-teal-500/20 border-teal-500/40',
        badgeTextLight: 'text-teal-800',
        badgeTextDark: 'text-teal-300',
        actionBtnBgLight: 'bg-teal-600 hover:bg-teal-700',
        actionBtnBgDark: 'bg-teal-500 hover:bg-teal-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-slate-950',
        iconBgLight: 'bg-teal-200/80 text-teal-800',
        iconBgDark: 'bg-teal-500/30 text-teal-300',
        accentTitleColorLight: 'text-teal-950',
        accentTitleColorDark: 'text-teal-100',
      },
      cards: [
        {
          id: 'wk_a1',
          type: 'inspiration',
          title: '周末探店与灵感漫游',
          subtitle: 'Citywalk · 空间探索',
          recommendBadge: '✨ 漫游首选',
          tag: '城市漫步',
          desc: '寻找城市宝藏咖啡馆、艺术展览或公园散步路线，发现生活惊喜。',
          icon: <Compass size={22} className="text-teal-600 dark:text-teal-300" />,
          initialPrompt: '我想在周末下午出门走走，请为我推荐几个惬意的 Citywalk 漫游思路或探店灵感。'
        },
        {
          id: 'wk_a2',
          type: 'task',
          title: '极客灵感工坊 / 兴趣创造',
          subtitle: 'Side Project · 自由点子',
          recommendBadge: '💡 灵感创作',
          tag: '兴趣折腾',
          desc: '不受排期限制，自由碰撞好玩的个人 Side Project 创意或生活手作。',
          icon: <Brain size={22} className="text-sky-600 dark:text-sky-300" />,
          initialPrompt: '趁着周末下午有空，我想折腾一个好玩有趣的个人小项目/灵感点子，我们来聊聊。'
        }
      ]
    },
    evening: {
      id: 'evening',
      label: '惬意黄昏',
      timeRange: '17:30 - 21:30',
      badgeIcon: <UtensilsCrossed size={14} className="text-rose-400" />,
      metaphorSymbol: '🌆',
      weatherText: '晚霞温柔 · 美食欢聚与电影之夜',
      aiQuote: '暮色渐浓，今夜无需为明天早起担忧。去享用一顿治愈美食，或开启一部期待已久的周末电影。',
      theme: {
        bgGradientLight: 'from-orange-100/70 via-rose-50/50 to-pink-100/60',
        bgGradientDark: 'from-slate-950 via-orange-950/60 to-rose-950/40',
        glowColor1: 'rgba(251, 146, 60, 0.35)',
        glowColor2: 'rgba(244, 63, 94, 0.25)',
        cardBgLight: 'bg-rose-50/80 backdrop-blur-md',
        cardBgDark: 'bg-rose-950/40 backdrop-blur-md',
        cardBorderLight: 'border-rose-200/90 hover:border-rose-400/80 shadow-[0_10px_30px_rgba(244,63,94,0.08)]',
        cardBorderDark: 'border-rose-500/30 hover:border-rose-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        cardHoverLight: 'hover:bg-rose-100/80',
        cardHoverDark: 'hover:bg-rose-900/50',
        badgeBgLight: 'bg-rose-100/90 border-rose-300',
        badgeBgDark: 'bg-rose-500/20 border-rose-500/40',
        badgeTextLight: 'text-rose-800',
        badgeTextDark: 'text-rose-300',
        actionBtnBgLight: 'bg-rose-600 hover:bg-rose-700',
        actionBtnBgDark: 'bg-rose-500 hover:bg-rose-600',
        actionBtnTextLight: 'text-white',
        actionBtnTextDark: 'text-white',
        iconBgLight: 'bg-rose-200/80 text-rose-800',
        iconBgDark: 'bg-rose-500/30 text-rose-300',
        accentTitleColorLight: 'text-rose-950',
        accentTitleColorDark: 'text-rose-100',
      },
      cards: [
        {
          id: 'wk_e1',
          type: 'inspiration',
          title: '周末治愈晚餐与特调灵感',
          subtitle: '美食品鉴 · 犒劳自己',
          recommendBadge: '✨ 美食首选',
          tag: '周末大餐',
          desc: '推荐适合周末犒劳自己的治愈食谱、探店美食或微醺特调搭配。',
          icon: <UtensilsCrossed size={22} className="text-rose-600 dark:text-rose-300" />,
          initialPrompt: '周末晚上想吃点好吃的犒劳一下自己，请为我推荐一些治愈系晚餐或轻松特调点子。'
        },
        {
          id: 'wk_e2',
          type: 'podcast',
          title: '晚风影音与微醺树洞',
          subtitle: '高分片单 · 轻松闲聊',
          recommendBadge: '🎬 影音陪伴',
          tag: '周末放空',
          desc: '为你推荐高分治愈电影/动画片单，或陪你聊聊一周生活趣事。',
          icon: <Film size={22} className="text-pink-600 dark:text-pink-300" />,
          initialPrompt: '今晚想窝在沙发上看部电影，请为我推荐几部适合周末晚上看的治愈高分电影或剧集。'
        }
      ]
    }
  };

  const contextProfiles = isWeekend ? weekendProfiles : workdayProfiles;
  const activeProfile = contextProfiles[activeContextKey];
  const activeTheme = activeProfile.theme;

  return (
    <div className="relative w-full h-full flex flex-col justify-between">

      {/* Ambient Glow Background Effect Circles */}
      <div className="absolute -inset-7 sm:-inset-8 pointer-events-none -z-0">
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.6, 0.35]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-[90px]"
          style={{ backgroundColor: activeTheme.glowColor1 }}
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[380px] h-[380px] rounded-full blur-[80px]"
          style={{ backgroundColor: activeTheme.glowColor2 }}
        />
      </div>

      {/* 1. Header Section - Clean Brand & Celestial Perception Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2 shrink-0 pt-1 w-full">
        
        {/* Left: Brand Title & Perception Subtag */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
            isDarkMode ? activeTheme.iconBgDark : activeTheme.iconBgLight
          }`}>
            <Sparkles size={18} className="animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-base font-black tracking-tight ${
                isDarkMode ? activeTheme.accentTitleColorDark : activeTheme.accentTitleColorLight
              }`}>
                AI 回响
              </span>
              
              {/* Day Mode Badge (周末休假 vs 工作极客) */}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 border ${
                isWeekend 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/30' 
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30'
              }`}>
                {isWeekend ? <Palmtree size={11} /> : <Laptop size={11} />}
                <span>{isWeekend ? '周末休闲' : '极客工作'}</span>
              </span>

              {/* Time Slot Badge */}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 shrink-0 border transition-all ${
                isDarkMode 
                  ? `${activeTheme.badgeBgDark} ${activeTheme.badgeTextDark}` 
                  : `${activeTheme.badgeBgLight} ${activeTheme.badgeTextLight}`
              }`}>
                {activeProfile.badgeIcon}
                {activeProfile.label}
              </span>
            </div>
            <p className={`text-[11px] font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeProfile.weatherText}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: AI Quote & Spacious Recommendation Service Bars */}
      <div className="relative z-10 my-auto py-4 w-full flex flex-col items-center">
        
        {/* Scenario AI Quote */}
        <motion.div 
          key={`${isWeekend ? 'wk' : 'wd'}-${activeProfile.id}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-center max-w-lg px-2"
        >
          <p className={`text-xs sm:text-sm font-bold leading-relaxed italic ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            "{activeProfile.aiQuote}"
          </p>
        </motion.div>

        {/* Vertical Stacked Horizontal Service Bars (舒展排列 + 情境色彩无缝融入) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`cards-${isWeekend ? 'wk' : 'wd'}-${activeProfile.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-5 w-full"
          >
            {activeProfile.cards.map((card, index) => {
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  whileHover={{ x: 3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onStartSession(card.type, card.initialPrompt)}
                  className={`relative cursor-pointer p-5 sm:p-6 rounded-3xl flex items-center justify-between gap-4 transition-all duration-300 border ${
                    isDarkMode 
                      ? 'bg-transparent border-transparent hover:bg-white/5' 
                      : 'bg-transparent border-transparent hover:bg-black/5'
                  }`}
                >
                  {/* Left Icon Avatar */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                    isDarkMode ? activeTheme.iconBgDark : activeTheme.iconBgLight
                  }`}>
                    {card.icon}
                  </div>

                  {/* Middle Information Stack */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className={`text-base font-black tracking-tight truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {card.title}
                      </h3>

                      {/* Recommendation Indicator Badge */}
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border shrink-0 flex items-center gap-1 transition-all ${
                        isDarkMode 
                          ? `${activeTheme.badgeBgDark} ${activeTheme.badgeTextDark}` 
                          : `${activeTheme.badgeBgLight} ${activeTheme.badgeTextLight}`
                      }`}>
                        {card.recommendBadge}
                      </span>
                    </div>

                    <p className={`text-xs font-bold opacity-85 truncate ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {card.subtitle}
                    </p>

                    <p className={`text-[11px] font-medium leading-relaxed line-clamp-1 opacity-70 mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Right Action Trigger Pill */}
                  <div className="shrink-0 flex items-center">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                      isDarkMode 
                        ? `${activeTheme.actionBtnBgDark} ${activeTheme.actionBtnTextDark}` 
                        : `${activeTheme.actionBtnBgLight} ${activeTheme.actionBtnTextLight}`
                    }`}>
                      <span>体验</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* 3. Bottom Direct Voice Trigger Bar */}
      <div className="relative z-10 shrink-0 mt-auto pt-2">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            const defaultPrompt = activeProfile.cards[0]?.initialPrompt || '你好，AETHER';
            onSendMessage(defaultPrompt);
          }}
          className={`w-full p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3.5 border ${
            isDarkMode 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-black/5 border-black/5 hover:bg-black/10'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
            isDarkMode ? activeTheme.actionBtnBgDark : activeTheme.actionBtnBgLight
          } text-white`}>
            <Sparkles size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[10px] font-black tracking-wider uppercase ${
                isDarkMode ? activeTheme.badgeTextDark : activeTheme.badgeTextLight
              }`}>
                AETHER 情境语音助手
              </span>
            </div>
            <p className={`text-xs font-bold truncate ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              "{activeProfile.cards[0]?.initialPrompt || '开启语音沟通'}"
            </p>
          </div>

          <div className={`flex items-center gap-1 shrink-0 text-xs font-bold ${
            isDarkMode ? activeTheme.badgeTextDark : activeTheme.badgeTextLight
          }`}>
            <span>语音开启</span>
            <ChevronRight size={16} />
          </div>
        </motion.div>
      </div>

    </div>
  );
};
