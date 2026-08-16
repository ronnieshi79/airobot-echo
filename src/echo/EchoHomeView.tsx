import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Sunset, 
  Book, 
  Radio, 
  Headphones,
  CloudSun,
  Coffee,
  Compass,
  Film,
  UtensilsCrossed,
  Palmtree,
  Laptop,
  Mic,
  Timer,
  CalendarCheck,
  CalendarClock,
  Music,
  Activity,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Brain
} from 'lucide-react';
import { SubCategory } from '../types';
import { HistorySummary } from './useEcho';

export type ContextType = 'auto' | 'night' | 'morning' | 'afternoon' | 'evening';
export type DayTypeMode = 'auto' | 'workday' | 'weekend';

export interface ServiceCard {
  id: string;
  type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily' | 'podcast';
  serviceCategory: 'podcast' | 'focus' | 'schedule'; // 音乐/资讯播客 | AI计时专注 | 日程规划
  categoryBadge: string;
  title: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
  initialPrompt: string;
  recommendedDuration?: string;
  bgVisual: {
    lightOverlay: string;
    darkOverlay: string;
    ambientTint: string;
    patternType: 'stars' | 'coffee' | 'waves' | 'grid' | 'sunset' | 'code';
  };
}

interface ContextTheme {
  bgGradientLight: string;
  bgGradientDark: string;
  glowColor1: string;
  glowColor2: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeTextLight: string;
  badgeTextDark: string;
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

// Workday Profiles (针对职场与办公知识人群优化)
const WORKDAY_PROFILES: Record<'night' | 'morning' | 'afternoon' | 'evening', ContextProfile> = {
  night: {
    id: 'night',
    label: '深夜静谧',
    timeRange: '21:30 - 05:00',
    badgeIcon: <Moon size={13} className="text-indigo-400" />,
    metaphorSymbol: '🌙',
    weatherText: '终端沉静 · 睡眠沉淀',
    aiQuote: '夜深了。整理今日心得，在舒缓白噪音中安然入眠。',
    theme: {
      bgGradientLight: 'from-indigo-100/70 via-slate-100/50 to-purple-100/60',
      bgGradientDark: 'from-slate-950 via-indigo-950/60 to-purple-950/50',
      glowColor1: 'rgba(99, 102, 241, 0.25)',
      glowColor2: 'rgba(168, 85, 247, 0.18)',
      badgeBgLight: 'bg-indigo-50 border-indigo-200/80',
      badgeBgDark: 'bg-indigo-500/15 border-indigo-500/30',
      badgeTextLight: 'text-indigo-700',
      badgeTextDark: 'text-indigo-300',
      iconBgLight: 'bg-indigo-100 text-indigo-700',
      iconBgDark: 'bg-indigo-500/20 text-indigo-300',
      accentTitleColorLight: 'text-indigo-950',
      accentTitleColorDark: 'text-indigo-100',
    },
    cards: [
      {
        id: 'w_n_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '音乐播客',
        title: '深夜助眠白噪音与声景',
        tag: '声景轻听',
        desc: '深空低频、夜雨壁炉与轻柔旋律，抚平大脑运转与思绪',
        icon: <Headphones size={20} />,
        initialPrompt: '播放一段适合深夜放松助眠的雨声壁炉白噪音与舒缓轻音乐。',
        recommendedDuration: '30 min',
        bgVisual: {
          lightOverlay: 'from-indigo-50/90 via-slate-100/80 to-purple-100/70',
          darkOverlay: 'from-indigo-950/90 via-slate-950/85 to-purple-950/80',
          ambientTint: 'rgba(99, 102, 241, 0.18)',
          patternType: 'stars'
        }
      },
      {
        id: 'w_n_focus',
        type: 'daily',
        serviceCategory: 'focus',
        categoryBadge: '专注冥想',
        title: '睡前 10 分钟正念冥想与呼吸',
        tag: '助眠计时',
        desc: '引导规律深呼吸，放松紧绷的神经与颈椎，促进深度睡眠',
        icon: <Timer size={20} />,
        initialPrompt: '开启一段 10 分钟的睡前正念呼吸与冥想引导计时。',
        recommendedDuration: '10 min',
        bgVisual: {
          lightOverlay: 'from-purple-50/90 via-indigo-50/80 to-blue-100/70',
          darkOverlay: 'from-purple-950/90 via-slate-950/85 to-indigo-950/80',
          ambientTint: 'rgba(168, 85, 247, 0.18)',
          patternType: 'waves'
        }
      },
      {
        id: 'w_n_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '明日待办备忘与心愿速记',
        tag: '卸压备忘',
        desc: '随手记录闪光点子与明晨要务，卸下心理负担安心好眠',
        icon: <CalendarClock size={20} />,
        initialPrompt: '帮我快速记录明天一早需要跟进的 2 项关键事务并设定提醒。',
        bgVisual: {
          lightOverlay: 'from-slate-100/90 via-blue-50/80 to-indigo-50/70',
          darkOverlay: 'from-slate-900/90 via-indigo-950/85 to-slate-950/80',
          ambientTint: 'rgba(59, 130, 246, 0.18)',
          patternType: 'grid'
        }
      }
    ]
  },
  morning: {
    id: 'morning',
    label: '晨光通勤',
    timeRange: '05:00 - 11:00',
    badgeIcon: <CloudSun size={13} className="text-amber-500" />,
    metaphorSymbol: '🌅',
    weatherText: '晨光拂晓 · 站会排期',
    aiQuote: '晨光破晓。已梳理今日站会焦点与通勤能量伴听。',
    theme: {
      bgGradientLight: 'from-amber-100/70 via-orange-50/50 to-yellow-100/60',
      bgGradientDark: 'from-slate-950 via-amber-950/60 to-orange-950/40',
      glowColor1: 'rgba(245, 158, 11, 0.25)',
      glowColor2: 'rgba(251, 146, 60, 0.18)',
      badgeBgLight: 'bg-amber-50 border-amber-200/80',
      badgeBgDark: 'bg-amber-500/15 border-amber-500/30',
      badgeTextLight: 'text-amber-800',
      badgeTextDark: 'text-amber-300',
      iconBgLight: 'bg-amber-100 text-amber-800',
      iconBgDark: 'bg-amber-500/20 text-amber-300',
      accentTitleColorLight: 'text-amber-950',
      accentTitleColorDark: 'text-amber-100',
    },
    cards: [
      {
        id: 'w_m_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: 'Standup 站会与今日日程规划',
        tag: '站会排期',
        desc: '梳理今日核心开发任务、跨团队会议与重点事项优先级',
        icon: <CalendarCheck size={20} />,
        initialPrompt: '帮我规划今天的 Standup 站会要点与核心日程清单。',
        bgVisual: {
          lightOverlay: 'from-amber-50/90 via-orange-50/80 to-yellow-100/70',
          darkOverlay: 'from-amber-950/90 via-slate-950/85 to-orange-950/80',
          ambientTint: 'rgba(245, 158, 11, 0.2)',
          patternType: 'sunset'
        }
      },
      {
        id: 'w_m_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '资讯播客',
        title: '通勤极客科技与早间资讯',
        tag: '通勤伴听',
        desc: '科技前沿要闻速递与元气轻播客，轻松开启通勤路',
        icon: <Radio size={20} />,
        initialPrompt: '播放一段适合上班通勤听的科技快讯与早间能量轻播客。',
        recommendedDuration: '15 min',
        bgVisual: {
          lightOverlay: 'from-orange-50/90 via-amber-50/80 to-blue-50/70',
          darkOverlay: 'from-slate-900/90 via-amber-950/85 to-slate-950/80',
          ambientTint: 'rgba(251, 146, 60, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'w_m_focus',
        type: 'inspiration',
        serviceCategory: 'focus',
        categoryBadge: '专注计时',
        title: '手冲咖啡与晨间唤醒专注',
        tag: '手冲计时',
        desc: '3分钟手冲注水与闷蒸节奏，开启清醒高效的工作状态',
        icon: <Coffee size={20} />,
        initialPrompt: '开启一段 3 分钟的手冲咖啡注水与晨间唤醒专注计时。',
        recommendedDuration: '3 min',
        bgVisual: {
          lightOverlay: 'from-amber-100/90 via-orange-100/70 to-yellow-50/80',
          darkOverlay: 'from-amber-950/90 via-yellow-950/80 to-slate-950/85',
          ambientTint: 'rgba(217, 119, 6, 0.22)',
          patternType: 'coffee'
        }
      }
    ]
  },
  afternoon: {
    id: 'afternoon',
    label: '深度工作',
    timeRange: '11:00 - 17:30',
    badgeIcon: <Sun size={13} className="text-teal-500" />,
    metaphorSymbol: '☀️',
    weatherText: '专注当下 · 架构心流',
    aiQuote: '专注当下。随时为你开启心流番茄钟与架构拆解思路。',
    theme: {
      bgGradientLight: 'from-emerald-100/70 via-teal-50/50 to-sky-100/60',
      bgGradientDark: 'from-slate-950 via-teal-950/60 to-emerald-950/40',
      glowColor1: 'rgba(16, 185, 129, 0.25)',
      glowColor2: 'rgba(14, 165, 233, 0.18)',
      badgeBgLight: 'bg-teal-50 border-teal-200/80',
      badgeBgDark: 'bg-teal-500/15 border-teal-500/30',
      badgeTextLight: 'text-teal-800',
      badgeTextDark: 'text-teal-300',
      iconBgLight: 'bg-teal-100 text-teal-800',
      iconBgDark: 'bg-teal-500/20 text-teal-300',
      accentTitleColorLight: 'text-teal-950',
      accentTitleColorDark: 'text-teal-100',
    },
    cards: [
      {
        id: 'w_a_focus1',
        type: 'inspiration',
        serviceCategory: 'focus',
        categoryBadge: '专注计时',
        title: '深度编码与番茄工作法心流',
        tag: '心流番茄',
        desc: '45分钟沉浸编码与架构推演，屏蔽打扰阻断上下文切换',
        icon: <Timer size={20} />,
        initialPrompt: '帮我开启一段 45 分钟的深度编码番茄钟与心流计时。',
        recommendedDuration: '45 min',
        bgVisual: {
          lightOverlay: 'from-emerald-50/90 via-teal-50/80 to-sky-100/70',
          darkOverlay: 'from-emerald-950/90 via-slate-950/85 to-teal-950/80',
          ambientTint: 'rgba(16, 185, 129, 0.2)',
          patternType: 'code'
        }
      },
      {
        id: 'w_a_focus2',
        type: 'daily',
        serviceCategory: 'focus',
        categoryBadge: '专注拉伸',
        title: '工位肩颈拉伸与 5 分钟微冥想',
        tag: '办公拉伸',
        desc: '久坐舒缓、眼部放松与桌前微瑜伽，快速恢复大脑精力',
        icon: <Activity size={20} />,
        initialPrompt: '开启 5 分钟办公室工位肩颈拉伸与正念放松计时。',
        recommendedDuration: '5 min',
        bgVisual: {
          lightOverlay: 'from-teal-50/90 via-cyan-50/80 to-emerald-100/70',
          darkOverlay: 'from-teal-950/90 via-slate-950/85 to-cyan-950/80',
          ambientTint: 'rgba(20, 184, 166, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'w_a_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '音乐播客',
        title: '极客心流伴奏 Lo-Fi 音乐',
        tag: '办公伴奏',
        desc: '低频心流节奏与极简旋律，屏蔽办公室噪音专注产出',
        icon: <Music size={20} />,
        initialPrompt: '播放一段适合写代码和深度思考的 Lo-Fi 心流音乐。',
        recommendedDuration: '60 min',
        bgVisual: {
          lightOverlay: 'from-cyan-50/90 via-sky-50/80 to-indigo-50/70',
          darkOverlay: 'from-sky-950/90 via-slate-950/85 to-indigo-950/80',
          ambientTint: 'rgba(14, 165, 233, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'w_a_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '下午评审会议与待办提醒',
        tag: '会议提醒',
        desc: '理清评审重点与交付进度，设置准时会议提醒',
        icon: <CalendarClock size={20} />,
        initialPrompt: '帮我规划下午的技术评审日程并设置提前 10 分钟提醒。',
        bgVisual: {
          lightOverlay: 'from-blue-50/90 via-indigo-50/80 to-teal-50/70',
          darkOverlay: 'from-slate-900/90 via-blue-950/85 to-slate-950/80',
          ambientTint: 'rgba(59, 130, 246, 0.2)',
          patternType: 'grid'
        }
      }
    ]
  },
  evening: {
    id: 'evening',
    label: '暮色下班',
    timeRange: '17:30 - 21:30',
    badgeIcon: <Sunset size={13} className="text-rose-400" />,
    metaphorSymbol: '🌆',
    weatherText: '落日余晖 · 卸压放松',
    aiQuote: '合上电脑，告别工单。复盘今日成果，享受美好晚风。',
    theme: {
      bgGradientLight: 'from-rose-100/70 via-pink-50/50 to-orange-100/60',
      bgGradientDark: 'from-slate-950 via-rose-950/60 to-pink-950/40',
      glowColor1: 'rgba(244, 63, 94, 0.25)',
      glowColor2: 'rgba(217, 70, 239, 0.18)',
      badgeBgLight: 'bg-rose-50 border-rose-200/80',
      badgeBgDark: 'bg-rose-500/15 border-rose-500/30',
      badgeTextLight: 'text-rose-800',
      badgeTextDark: 'text-rose-300',
      iconBgLight: 'bg-rose-100 text-rose-800',
      iconBgDark: 'bg-rose-500/20 text-rose-300',
      accentTitleColorLight: 'text-rose-950',
      accentTitleColorDark: 'text-rose-100',
    },
    cards: [
      {
        id: 'w_e_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '今日工单复盘与明日待办归档',
        tag: '下班复盘',
        desc: '5分钟梳理今日完成的代码成果，轻装开启下班美好生活',
        icon: <CheckCircle2 size={20} />,
        initialPrompt: '帮我快速总结一下今天完成的代码成果并规划明日待办事项。',
        bgVisual: {
          lightOverlay: 'from-rose-50/90 via-pink-50/80 to-orange-50/70',
          darkOverlay: 'from-rose-950/90 via-slate-950/85 to-pink-950/80',
          ambientTint: 'rgba(244, 63, 94, 0.2)',
          patternType: 'sunset'
        }
      },
      {
        id: 'w_e_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '音乐播客',
        title: '晚风卸压与治愈生活轻播客',
        tag: '晚风伴听',
        desc: '下班通勤路上倾听治愈系旅行与生活纪事，带走脑力疲惫',
        icon: <Headphones size={20} />,
        initialPrompt: '播放一段轻松惬意的下班晚间播客与解压音乐。',
        recommendedDuration: '20 min',
        bgVisual: {
          lightOverlay: 'from-orange-50/90 via-rose-50/80 to-purple-50/70',
          darkOverlay: 'from-orange-950/90 via-slate-950/85 to-purple-950/80',
          ambientTint: 'rgba(251, 146, 60, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'w_e_focus',
        type: 'confide',
        serviceCategory: 'focus',
        categoryBadge: '专注瑜伽',
        title: '晚间全身瑜伽舒展与冥想',
        tag: '瑜伽拉伸',
        desc: '15分钟拉伸肌肉、释放压力，回归身体舒适与身心平衡',
        icon: <Activity size={20} />,
        initialPrompt: '开启一段 15 分钟的晚间全身瑜伽拉伸与舒缓计时。',
        recommendedDuration: '15 min',
        bgVisual: {
          lightOverlay: 'from-pink-50/90 via-purple-50/80 to-rose-50/70',
          darkOverlay: 'from-purple-950/90 via-slate-950/85 to-rose-950/80',
          ambientTint: 'rgba(217, 70, 239, 0.2)',
          patternType: 'waves'
        }
      }
    ]
  }
};

// Weekend Profiles (针对办公人群周末休闲与充能优化)
const WEEKEND_PROFILES: Record<'night' | 'morning' | 'afternoon' | 'evening', ContextProfile> = {
  night: {
    id: 'night',
    label: '假日深夜',
    timeRange: '21:30 - 05:00',
    badgeIcon: <Moon size={13} className="text-indigo-400" />,
    metaphorSymbol: '🌙',
    weatherText: '星空静谧 · 纯粹自由',
    aiQuote: '周末深夜属于你自己。放下琐事，在星光中安心好眠。',
    theme: {
      bgGradientLight: 'from-purple-100/70 via-indigo-50/50 to-pink-100/60',
      bgGradientDark: 'from-slate-950 via-purple-950/60 to-indigo-950/50',
      glowColor1: 'rgba(168, 85, 247, 0.25)',
      glowColor2: 'rgba(99, 102, 241, 0.18)',
      badgeBgLight: 'bg-purple-50 border-purple-200/80',
      badgeBgDark: 'bg-purple-500/15 border-purple-500/30',
      badgeTextLight: 'text-purple-700',
      badgeTextDark: 'text-purple-300',
      iconBgLight: 'bg-purple-100 text-purple-700',
      iconBgDark: 'bg-purple-500/20 text-purple-300',
      accentTitleColorLight: 'text-purple-950',
      accentTitleColorDark: 'text-purple-100',
    },
    cards: [
      {
        id: 'wk_n_podcast',
        type: 'story',
        serviceCategory: 'podcast',
        categoryBadge: '音乐播客',
        title: '星河声优助眠电台与故事',
        tag: '声优助眠',
        desc: '星际列车与云端岛屿故事，伴你甜美入梦，远离工作喧嚣',
        icon: <Book size={20} />,
        initialPrompt: '请为我讲一个关于星际列车与云端岛屿的治愈睡前故事，伴我甜梦入眠。',
        recommendedDuration: '30 min',
        bgVisual: {
          lightOverlay: 'from-purple-50/90 via-indigo-50/80 to-slate-100/70',
          darkOverlay: 'from-purple-950/90 via-slate-950/85 to-indigo-950/80',
          ambientTint: 'rgba(168, 85, 247, 0.22)',
          patternType: 'stars'
        }
      },
      {
        id: 'wk_n_focus',
        type: 'daily',
        serviceCategory: 'focus',
        categoryBadge: '专注冥想',
        title: '身心扫描与睡前深度冥想',
        tag: '深度冥想',
        desc: '10分钟引导式放松，释放整周积攒的压力与疲惫',
        icon: <Timer size={20} />,
        initialPrompt: '开启一段 10 分钟周末睡前深度冥想与身心扫描计时。',
        recommendedDuration: '10 min',
        bgVisual: {
          lightOverlay: 'from-indigo-50/90 via-purple-50/80 to-blue-50/70',
          darkOverlay: 'from-indigo-950/90 via-slate-950/85 to-purple-950/80',
          ambientTint: 'rgba(99, 102, 241, 0.22)',
          patternType: 'waves'
        }
      },
      {
        id: 'wk_n_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '下周愿景与心愿备忘规划',
        tag: '心愿规划',
        desc: '随手记录下周期待与闪光心愿，轻装安睡',
        icon: <CalendarCheck size={20} />,
        initialPrompt: '帮我记录下周生活心愿与重点日程规划。',
        bgVisual: {
          lightOverlay: 'from-blue-50/90 via-purple-50/80 to-slate-100/70',
          darkOverlay: 'from-blue-950/90 via-slate-950/85 to-indigo-950/80',
          ambientTint: 'rgba(59, 130, 246, 0.2)',
          patternType: 'grid'
        }
      }
    ]
  },
  morning: {
    id: 'morning',
    label: '晨光悠闲',
    timeRange: '05:00 - 11:00',
    badgeIcon: <Coffee size={13} className="text-amber-500" />,
    metaphorSymbol: '☕',
    weatherText: '阳光微风 · 慢享周末',
    aiQuote: '周末愉快。没有闹钟与早会，慢享手冲咖啡与晨间轻播客。',
    theme: {
      bgGradientLight: 'from-amber-100/70 via-yellow-50/50 to-orange-100/60',
      bgGradientDark: 'from-slate-950 via-amber-950/60 to-yellow-950/40',
      glowColor1: 'rgba(245, 158, 11, 0.25)',
      glowColor2: 'rgba(234, 179, 8, 0.18)',
      badgeBgLight: 'bg-amber-50 border-amber-200/80',
      badgeBgDark: 'bg-amber-500/15 border-amber-500/30',
      badgeTextLight: 'text-amber-800',
      badgeTextDark: 'text-amber-300',
      iconBgLight: 'bg-amber-100 text-amber-800',
      iconBgDark: 'bg-amber-500/20 text-amber-300',
      accentTitleColorLight: 'text-amber-950',
      accentTitleColorDark: 'text-amber-100',
    },
    cards: [
      {
        id: 'wk_m_focus',
        type: 'inspiration',
        serviceCategory: 'focus',
        categoryBadge: '专注咖啡',
        title: '慢调手冲咖啡与晨读专注',
        tag: '咖啡晨读',
        desc: '手冲注水计时 + 30分钟无压力沉浸阅读，享受慢生活时光',
        icon: <Coffee size={20} />,
        initialPrompt: '开启一段手冲咖啡注水与 30 分钟周末晨读专注计时。',
        recommendedDuration: '30 min',
        bgVisual: {
          lightOverlay: 'from-amber-100/90 via-yellow-50/80 to-orange-100/70',
          darkOverlay: 'from-amber-950/90 via-slate-950/85 to-yellow-950/80',
          ambientTint: 'rgba(245, 158, 11, 0.22)',
          patternType: 'coffee'
        }
      },
      {
        id: 'wk_m_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '周末休闲与 Citywalk 日程计划',
        tag: '休闲计划',
        desc: '轻松规划漫步路线、探店小店与户外灵感，自由设定提醒',
        icon: <CalendarCheck size={20} />,
        initialPrompt: '请为我规划一份轻松惬意的周末户外漫游与休闲活动日程。',
        bgVisual: {
          lightOverlay: 'from-yellow-50/90 via-amber-50/80 to-emerald-50/70',
          darkOverlay: 'from-yellow-950/90 via-slate-950/85 to-emerald-950/80',
          ambientTint: 'rgba(234, 179, 8, 0.2)',
          patternType: 'sunset'
        }
      },
      {
        id: 'wk_m_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '资讯播客',
        title: '慢享周末咖啡馆轻播客',
        tag: '咖啡时光',
        desc: '轻松文化、生活美学与假日音乐伴听，慢享周末阳光',
        icon: <Radio size={20} />,
        initialPrompt: '播放一段适合周末早晨喝咖啡时听的治愈轻播客。',
        recommendedDuration: '25 min',
        bgVisual: {
          lightOverlay: 'from-amber-50/90 via-orange-50/80 to-yellow-50/70',
          darkOverlay: 'from-amber-950/90 via-slate-950/85 to-orange-950/80',
          ambientTint: 'rgba(217, 119, 6, 0.2)',
          patternType: 'coffee'
        }
      }
    ]
  },
  afternoon: {
    id: 'afternoon',
    label: '假日午后',
    timeRange: '11:00 - 17:30',
    badgeIcon: <Compass size={13} className="text-teal-500" />,
    metaphorSymbol: '🧭',
    weatherText: '漫步探店 · 兴趣创作',
    aiQuote: '午后阳光正好。去探索街角小店，或把玩有趣的自由灵感。',
    theme: {
      bgGradientLight: 'from-teal-100/70 via-emerald-50/50 to-sky-100/60',
      bgGradientDark: 'from-slate-950 via-teal-950/60 to-sky-950/40',
      glowColor1: 'rgba(20, 184, 166, 0.25)',
      glowColor2: 'rgba(56, 189, 248, 0.18)',
      badgeBgLight: 'bg-teal-50 border-teal-200/80',
      badgeBgDark: 'bg-teal-500/15 border-teal-500/30',
      badgeTextLight: 'text-teal-800',
      badgeTextDark: 'text-teal-300',
      iconBgLight: 'bg-teal-100 text-teal-800',
      iconBgDark: 'bg-teal-500/20 text-teal-300',
      accentTitleColorLight: 'text-teal-950',
      accentTitleColorDark: 'text-teal-100',
    },
    cards: [
      {
        id: 'wk_a_focus1',
        type: 'daily',
        serviceCategory: 'focus',
        categoryBadge: '专注小憩',
        title: '午间能量小憩与颂钵微冥想',
        tag: '午间小憩',
        desc: '20分钟 Power Nap 唤醒 + 颂钵轻音，让身心重获充沛活力',
        icon: <Timer size={20} />,
        initialPrompt: '开启一段 20 分钟的午间小憩与颂钵微冥想唤醒计时。',
        recommendedDuration: '20 min',
        bgVisual: {
          lightOverlay: 'from-teal-50/90 via-emerald-50/80 to-sky-50/70',
          darkOverlay: 'from-teal-950/90 via-slate-950/85 to-emerald-950/80',
          ambientTint: 'rgba(20, 184, 166, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'wk_a_focus2',
        type: 'inspiration',
        serviceCategory: 'focus',
        categoryBadge: '专注创作',
        title: 'Side Project 灵感与技能学习',
        tag: '兴趣学习',
        desc: '无排期压力的 45 分钟自由心流，尽情探索个人兴趣与代码小品',
        icon: <Brain size={20} />,
        initialPrompt: '开启一段 45 分钟的个人兴趣项目探索与学习心流计时。',
        recommendedDuration: '45 min',
        bgVisual: {
          lightOverlay: 'from-sky-50/90 via-teal-50/80 to-cyan-100/70',
          darkOverlay: 'from-sky-950/90 via-slate-950/85 to-teal-950/80',
          ambientTint: 'rgba(56, 189, 248, 0.2)',
          patternType: 'code'
        }
      },
      {
        id: 'wk_a_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '音乐播客',
        title: '阳光露台 Lo-Fi 悠闲伴奏',
        tag: '悠闲伴听',
        desc: '惬意小调伴着午后微风，度过从容悠闲的周末午后',
        icon: <Music size={20} />,
        initialPrompt: '播放一段适合周末午后发呆、看书或小憩的舒适轻音乐。',
        recommendedDuration: '40 min',
        bgVisual: {
          lightOverlay: 'from-emerald-50/90 via-teal-50/80 to-sky-50/70',
          darkOverlay: 'from-emerald-950/90 via-slate-950/85 to-teal-950/80',
          ambientTint: 'rgba(16, 185, 129, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'wk_a_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '下午探店与展览行程提醒',
        tag: '探店日程',
        desc: '合理规划艺术展与咖啡馆探店路线，不错过精彩打卡',
        icon: <Compass size={20} />,
        initialPrompt: '帮我规划下午的 Citywalk 探店路线与行程时间安排。',
        bgVisual: {
          lightOverlay: 'from-cyan-50/90 via-teal-50/80 to-indigo-50/70',
          darkOverlay: 'from-cyan-950/90 via-slate-950/85 to-teal-950/80',
          ambientTint: 'rgba(6, 182, 212, 0.2)',
          patternType: 'grid'
        }
      }
    ]
  },
  evening: {
    id: 'evening',
    label: '惬意黄昏',
    timeRange: '17:30 - 21:30',
    badgeIcon: <UtensilsCrossed size={13} className="text-rose-400" />,
    metaphorSymbol: '🌆',
    weatherText: '晚霞温柔 · 美食电影',
    aiQuote: '暮色渐浓。享用一顿治愈美食，或开启一部期待已久的电影。',
    theme: {
      bgGradientLight: 'from-orange-100/70 via-rose-50/50 to-pink-100/60',
      bgGradientDark: 'from-slate-950 via-orange-950/60 to-rose-950/40',
      glowColor1: 'rgba(251, 146, 60, 0.25)',
      glowColor2: 'rgba(244, 63, 94, 0.18)',
      badgeBgLight: 'bg-rose-50 border-rose-200/80',
      badgeBgDark: 'bg-rose-500/15 border-rose-500/30',
      badgeTextLight: 'text-rose-800',
      badgeTextDark: 'text-rose-300',
      iconBgLight: 'bg-rose-100 text-rose-800',
      iconBgDark: 'bg-rose-500/20 text-rose-300',
      accentTitleColorLight: 'text-rose-950',
      accentTitleColorDark: 'text-rose-100',
    },
    cards: [
      {
        id: 'wk_e_podcast',
        type: 'podcast',
        serviceCategory: 'podcast',
        categoryBadge: '资讯播客',
        title: '晚风影音与治愈电影赏析',
        tag: '影音伴聊',
        desc: '高分治愈电影片单伴播与影评闲聊，度过微醺夜晚',
        icon: <Film size={20} />,
        initialPrompt: '推荐几部适合周末晚上看的高分治愈电影并聊聊剧情亮点。',
        recommendedDuration: '30 min',
        bgVisual: {
          lightOverlay: 'from-orange-50/90 via-rose-50/80 to-purple-50/70',
          darkOverlay: 'from-orange-950/90 via-slate-950/85 to-rose-950/80',
          ambientTint: 'rgba(251, 146, 60, 0.2)',
          patternType: 'sunset'
        }
      },
      {
        id: 'wk_e_focus',
        type: 'inspiration',
        serviceCategory: 'focus',
        categoryBadge: '专注瑜伽',
        title: '假日瑜伽与全身深度舒展',
        tag: '深度瑜伽',
        desc: '20分钟全身柔韧拉伸，释放肩背紧绷，唤醒身体轻盈感',
        icon: <Activity size={20} />,
        initialPrompt: '开启一段 20 分钟的全身深度瑜伽与柔韧拉伸计时。',
        recommendedDuration: '20 min',
        bgVisual: {
          lightOverlay: 'from-rose-50/90 via-pink-50/80 to-purple-50/70',
          darkOverlay: 'from-rose-950/90 via-slate-950/85 to-purple-950/80',
          ambientTint: 'rgba(244, 63, 94, 0.2)',
          patternType: 'waves'
        }
      },
      {
        id: 'wk_e_schedule',
        type: 'task',
        serviceCategory: 'schedule',
        categoryBadge: '日程规划',
        title: '周末聚会与晚餐日程提醒',
        tag: '聚会规划',
        desc: '记录朋友聚会时间与精选食谱计划，准时出门赴约',
        icon: <CalendarCheck size={20} />,
        initialPrompt: '帮我记录今晚的朋友聚会时间与治愈晚餐计划。',
        bgVisual: {
          lightOverlay: 'from-pink-50/90 via-orange-50/80 to-yellow-50/70',
          darkOverlay: 'from-pink-950/90 via-slate-950/85 to-orange-950/80',
          ambientTint: 'rgba(236, 72, 153, 0.2)',
          patternType: 'sunset'
        }
      }
    ]
  }
};

// Subtle atmospheric ambient patterns
const renderPatternSvg = (patternType: string, isDarkMode: boolean) => {
  const strokeColor = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
  const accentColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';

  switch (patternType) {
    case 'stars':
      return (
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20%" cy="30%" r="1.5" fill={accentColor} />
          <circle cx="75%" cy="25%" r="2" fill={accentColor} />
          <circle cx="85%" cy="70%" r="1" fill={accentColor} />
          <circle cx="40%" cy="80%" r="1.5" fill={accentColor} />
          <circle cx="60%" cy="50%" r="1" fill={accentColor} />
          <path d="M 0,40 Q 50,20 100,50 T 200,30" stroke={strokeColor} fill="none" strokeWidth="1" />
        </svg>
      );
    case 'coffee':
      return (
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <circle cx="85%" cy="50%" r="40" stroke={strokeColor} fill="none" strokeWidth="1.5" />
          <circle cx="85%" cy="50%" r="60" stroke={strokeColor} fill="none" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 10,80 Q 30,40 20,10" stroke={accentColor} fill="none" strokeWidth="1.5" />
          <path d="M 25,80 Q 45,45 35,15" stroke={strokeColor} fill="none" strokeWidth="1" />
        </svg>
      );
    case 'code':
      return (
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 20 L200 20 M0 45 L200 45 M0 70 L200 70 M0 95 L200 95" stroke={strokeColor} strokeWidth="0.8" />
          <path d="M30 0 L30 120 M70 0 L70 120 M120 0 L120 120" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="75" y="25" width="40" height="15" rx="3" fill={accentColor} opacity="0.3" />
        </svg>
      );
    case 'sunset':
      return (
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80%" cy="80%" r="50" stroke={strokeColor} fill="none" strokeWidth="1.5" />
          <path d="M 0,90 Q 60,70 120,90 T 240,85" stroke={accentColor} fill="none" strokeWidth="1.5" />
          <path d="M 0,105 Q 80,90 160,105 T 320,100" stroke={strokeColor} fill="none" strokeWidth="1" />
        </svg>
      );
    case 'grid':
      return (
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      );
    case 'waves':
    default:
      return (
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,35 Q 50,15 100,35 T 200,35 T 300,35" stroke={strokeColor} fill="none" strokeWidth="1.5" />
          <path d="M 0,65 Q 60,45 120,65 T 240,65 T 360,65" stroke={accentColor} fill="none" strokeWidth="1.2" />
        </svg>
      );
  }
};

interface EchoHomeViewProps {
  isDarkMode: boolean;
  subCategory: SubCategory;
  historySummaries: HistorySummary[];
  onSendMessage: (text: string) => void;
  onStartSession: (type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily' | 'podcast', content?: string) => void;
  onViewHistory: () => void;
  time?: Date;
  contextMode?: ContextType;
  onContextModeChange?: (mode: ContextType) => void;
  dayTypeMode?: DayTypeMode;
  isWeekend?: boolean;
  onActiveCardChange?: (card: ServiceCard) => void;
}

export const EchoHomeView: React.FC<EchoHomeViewProps> = ({
  isDarkMode,
  subCategory,
  historySummaries,
  onSendMessage,
  onStartSession,
  onViewHistory,
  time = new Date(),
  contextMode,
  onContextModeChange,
  dayTypeMode = 'auto',
  isWeekend: propIsWeekend,
  onActiveCardChange,
}) => {
  const [internalContext, setInternalContext] = useState<ContextType>('auto');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('down');
  const [isHovered, setIsHovered] = useState(false);
  const lastNotifiedCardIdRef = useRef<string | null>(null);

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

  const contextProfiles = isWeekend ? WEEKEND_PROFILES : WORKDAY_PROFILES;
  const activeProfile = contextProfiles[activeContextKey];
  const activeTheme = activeProfile.theme;
  const cards = activeProfile.cards;

  // Reset index when profile changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeContextKey, isWeekend]);

  const currentCard = cards[currentIndex] || cards[0];

  // Notify parent safely without infinite render loops
  useEffect(() => {
    if (onActiveCardChange && currentCard && lastNotifiedCardIdRef.current !== currentCard.id) {
      lastNotifiedCardIdRef.current = currentCard.id;
      onActiveCardChange(currentCard);
    }
  }, [currentCard, onActiveCardChange]);

  const handleNext = useCallback(() => {
    setSlideDirection('down');
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setSlideDirection('up');
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }, [cards.length]);

  // Gentle auto-rotation when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 7500);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  // Mouse wheel scroll handler on the card area
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 25) {
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  }, [handleNext, handlePrev]);

  // Vertical transition animation variants
  const verticalVariants = {
    initial: (direction: 'up' | 'down') => ({
      opacity: 0,
      y: direction === 'down' ? 24 : -24,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        y: { type: 'spring', stiffness: 380, damping: 30 },
        opacity: { duration: 0.24 },
        scale: { duration: 0.24 }
      }
    },
    exit: (direction: 'up' | 'down') => ({
      opacity: 0,
      y: direction === 'down' ? -24 : 24,
      scale: 0.98,
      transition: {
        y: { duration: 0.2 },
        opacity: { duration: 0.18 }
      }
    })
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none p-1 sm:p-2">

      {/* 1. Deep Ambient Aura Lights */}
      <div className="absolute -inset-6 pointer-events-none -z-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -left-12 w-88 h-88 rounded-full blur-[85px]"
          style={{ backgroundColor: activeTheme.glowColor1 }}
        />
        <motion.div 
          animate={{
            scale: [1.15, 1, 1.15],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-12 -right-12 w-88 h-88 rounded-full blur-[75px]"
          style={{ backgroundColor: activeTheme.glowColor2 }}
        />
      </div>

      {/* 2. Header: Fixed Brand AI Echo & Slogan with Context Badges */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 pt-1 w-full border-b border-black/5 dark:border-white/5 pb-2.5">
        {/* Left: Fixed App Brand Logo, Name & Slogan */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-400/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
              : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/80 text-indigo-600 shadow-[0_2px_10px_rgba(99,102,241,0.08)]'
          }`}>
            <Sparkles size={19} className="animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-base sm:text-lg font-black tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                AI Echo
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider border ${
                isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                Agentic
              </span>
            </div>
            
            <p className={`text-xs font-medium tracking-wide ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              你的每次需求，皆有温暖回响
            </p>
          </div>
        </div>

        {/* Right: Preserved Dynamic Context Badges */}
        <div className="flex items-center flex-wrap gap-1.5 self-start sm:self-auto">
          {/* Day Mode Badge */}
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shrink-0 border transition-all ${
            isWeekend 
              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/30 shadow-xs' 
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30 shadow-xs'
          }`}>
            {isWeekend ? <Palmtree size={12} /> : <Laptop size={12} />}
            <span>{isWeekend ? '周末休闲' : '职场办公'}</span>
          </span>

          {/* Time Context Badge */}
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shrink-0 border transition-all ${
            isDarkMode 
              ? `${activeTheme.badgeBgDark} ${activeTheme.badgeTextDark}` 
              : `${activeTheme.badgeBgLight} ${activeTheme.badgeTextLight}`
          }`}>
            {activeProfile.badgeIcon}
            <span>{activeProfile.label}</span>
          </span>

          {/* Time range snippet */}
          <span className={`text-[10px] font-mono px-2 py-0.8 rounded-md border hidden md:inline-block ${
            isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200/80 text-slate-500'
          }`}>
            {activeProfile.timeRange}
          </span>
        </div>
      </div>

      {/* 3. Center Atmospheric Section: Portrait-Oriented Vertical Rectangular Widget */}
      <div 
        className="relative z-10 my-auto py-2 w-full flex flex-col items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
      >
        {/* Centered Portrait Widget + Right Vertical Indicator Bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">

          {/* Portrait-Oriented Service Widget Card (Vertical Rectangle) */}
          <div className="relative w-[300px] sm:w-[325px] h-[370px] sm:h-[390px] rounded-[2rem] overflow-hidden shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] border border-black/[0.04] dark:border-white/[0.08] transition-all duration-300">
            <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
              <motion.div
                key={currentCard.id}
                custom={slideDirection}
                variants={verticalVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`group absolute inset-0 cursor-pointer p-5 sm:p-6 rounded-[2rem] flex flex-col justify-between transition-all duration-300 select-none ${
                  isDarkMode 
                    ? 'bg-slate-900/90 hover:bg-slate-900/95' 
                    : 'bg-white/95 hover:bg-white'
                }`}
                onClick={() => onStartSession(currentCard.type, currentCard.initialPrompt)}
              >
                {/* 3.1 Atmospheric Scenery Background Texture & Ambient Glow */}
                <div 
                  className={`absolute inset-0 rounded-[2rem] pointer-events-none overflow-hidden bg-gradient-to-b ${
                    isDarkMode ? currentCard.bgVisual.darkOverlay : currentCard.bgVisual.lightOverlay
                  }`}
                >
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                    {renderPatternSvg(currentCard.bgVisual.patternType, isDarkMode)}
                  </div>
                  {/* Radial Ambient Glow */}
                  <div 
                    className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-[45px] pointer-events-none"
                    style={{ backgroundColor: currentCard.bgVisual.ambientTint }}
                  />
                  <div 
                    className="absolute -left-8 -top-8 w-36 h-36 rounded-full blur-[40px] pointer-events-none"
                    style={{ backgroundColor: currentCard.bgVisual.ambientTint }}
                  />
                </div>

                {/* 1) Top Bar: Category Badges & Ambient Status */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.8 rounded-lg text-xs font-bold border shrink-0 ${
                      currentCard.serviceCategory === 'focus'
                        ? (isDarkMode ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80')
                        : currentCard.serviceCategory === 'schedule'
                        ? (isDarkMode ? 'bg-blue-500/15 text-blue-300 border-blue-500/25' : 'bg-blue-50 text-blue-700 border-blue-200/80')
                        : (isDarkMode ? 'bg-purple-500/15 text-purple-300 border-purple-500/25' : 'bg-purple-50 text-purple-700 border-purple-200/80')
                    }`}>
                      {currentCard.categoryBadge}
                    </span>

                    <span className={`px-2 py-0.8 rounded-lg text-xs font-medium border shrink-0 ${
                      isDarkMode 
                        ? `${activeTheme.badgeBgDark} ${activeTheme.badgeTextDark}` 
                        : `${activeTheme.badgeBgLight} ${activeTheme.badgeTextLight}`
                    }`}>
                      {currentCard.tag}
                    </span>
                  </div>

                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    isDarkMode ? 'text-slate-400 bg-white/5' : 'text-slate-400 bg-black/[0.03]'
                  }`}>
                    点击直达
                  </span>
                </div>

                {/* 2) Inspiring Mood Sentence / Quote */}
                <div className={`relative z-10 text-xs font-medium leading-relaxed italic px-1 pt-1 ${
                  isDarkMode ? 'text-slate-300/90' : 'text-slate-600'
                }`}>
                  "{activeProfile.aiQuote}"
                </div>

                {/* 3) Portrait Center Body: Prominent Art Icon + Title + Description */}
                <div className="relative z-10 flex flex-col items-center text-center my-auto py-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs mb-3 transition-transform duration-300 group-hover:scale-105 ${
                    isDarkMode ? activeTheme.iconBgDark : activeTheme.iconBgLight
                  }`}>
                    {React.cloneElement(currentCard.icon as React.ReactElement, { size: 30 })}
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold tracking-tight leading-snug px-1 line-clamp-2 ${
                    isDarkMode ? 'text-white group-hover:text-indigo-200' : 'text-slate-900 group-hover:text-indigo-950'
                  }`}>
                    {currentCard.title}
                  </h3>

                  <p className={`text-xs font-normal leading-relaxed mt-1.5 px-2 line-clamp-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {currentCard.desc}
                  </p>
                </div>

                {/* 4) Bottom Information Bar: Recommended Duration / Context Metadata, Live Waveform, and Voice Mic */}
                <div className="relative z-10 flex items-center justify-between gap-2 pt-3 border-t border-black/[0.04] dark:border-white/[0.06]">
                  {/* Service Duration & Context Info */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/5 text-slate-300' 
                        : 'bg-slate-50 border-slate-100 text-slate-600'
                    }`}>
                      <Timer size={13} className="text-indigo-500 opacity-85 shrink-0" />
                      <span className="text-[11px] opacity-75">建议时长</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {currentCard.recommendedDuration || '20 min'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Live Waveform Indicator */}
                    <div className={`flex items-end gap-0.8 h-4 px-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-400'
                    }`}>
                      <motion.span 
                        animate={{ height: ['35%', '95%', '35%'] }} 
                        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="w-0.5 bg-current rounded-full" 
                      />
                      <motion.span 
                        animate={{ height: ['65%', '100%', '65%'] }} 
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="w-0.5 bg-current rounded-full" 
                      />
                      <motion.span 
                        animate={{ height: ['40%', '85%', '40%'] }} 
                        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="w-0.5 bg-current rounded-full" 
                      />
                    </div>

                    {/* Mic Quick Voice Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage(currentCard.initialPrompt);
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                        isDarkMode 
                          ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' 
                          : 'bg-black/5 hover:bg-black/10 border-black/5 text-slate-800'
                      }`}
                      title="语音呼唤"
                    >
                      <Mic size={14} />
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Minimalist Ambient Pagination Indicator (Fully integrated with atmosphere) */}
        <div className="flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full bg-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all duration-300">
          <button
            onClick={handlePrev}
            className={`p-0.5 rounded-full opacity-40 hover:opacity-100 transition-opacity cursor-pointer ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
            title="上一项服务"
            aria-label="上一项服务"
          >
            <ChevronLeft size={13} />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {cards.map((card, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setSlideDirection(idx > currentIndex ? 'down' : 'up');
                    setCurrentIndex(idx);
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? isDarkMode
                        ? 'w-4 h-1 bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                        : 'w-4 h-1 bg-slate-700/80'
                      : isDarkMode
                        ? 'w-1 h-1 bg-white/20 hover:bg-white/40'
                        : 'w-1 h-1 bg-slate-400/35 hover:bg-slate-400/60'
                  }`}
                  aria-label={`切换到推荐服务 ${idx + 1}`}
                />
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className={`p-0.5 rounded-full opacity-40 hover:opacity-100 transition-opacity cursor-pointer ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
            title="下一项服务"
            aria-label="下一项服务"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 4. Minimalist Bottom 3 Pillars Context Summary */}
      <div className="relative z-10 shrink-0 flex items-center justify-center gap-4 text-center pb-1">
        <span className={`text-[10px] font-medium tracking-wide flex items-center gap-1 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <Radio size={10} className="text-purple-400" />
          音乐/资讯播客
        </span>
        <span className="text-[10px] opacity-30">·</span>
        <span className={`text-[10px] font-medium tracking-wide flex items-center gap-1 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <Timer size={10} className="text-emerald-400" />
          AI 计时/专注服务
        </span>
        <span className="text-[10px] opacity-30">·</span>
        <span className={`text-[10px] font-medium tracking-wide flex items-center gap-1 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <CalendarCheck size={10} className="text-blue-400" />
          日程规划与提醒
        </span>
      </div>

    </div>
  );
};
