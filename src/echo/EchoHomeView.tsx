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
  History, 
  Radio, 
  Headphones,
  CloudSun,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SubCategory } from '../types';
import { HistorySummary } from './useEcho';

export type ContextType = 'auto' | 'night' | 'morning' | 'afternoon' | 'evening';

interface EchoHomeViewProps {
  isDarkMode: boolean;
  subCategory: SubCategory;
  historySummaries: HistorySummary[];
  onSendMessage: (text: string) => void;
  onStartSession: (type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily', content?: string) => void;
  onViewHistory: () => void;
  time: Date;
  contextMode?: ContextType;
  onContextModeChange?: (mode: ContextType) => void;
}

interface ServiceCard {
  id: string;
  type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily';
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
  onContextModeChange
}) => {
  const [internalContext, setInternalContext] = useState<ContextType>('auto');

  const selectedContext = contextMode !== undefined ? contextMode : internalContext;
  const setSelectedContext = onContextModeChange || setInternalContext;

  const currentHour = time.getHours();

  // Determine current active context automatically based on time if set to 'auto'
  const activeContextKey = useMemo(() => {
    if (selectedContext !== 'auto') return selectedContext;
    if (currentHour >= 5 && currentHour < 11) return 'morning';
    if (currentHour >= 11 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 21) return 'evening';
    return 'night';
  }, [selectedContext, currentHour]);

  // Context Profiles with strongly distinctive visual theme configurations
  const contextProfiles: Record<'night' | 'morning' | 'afternoon' | 'evening', ContextProfile> = {
    night: {
      id: 'night',
      label: '深夜静谧',
      timeRange: '21:00 - 05:00',
      badgeIcon: <Moon size={14} className="text-indigo-400" />,
      metaphorSymbol: '🌙',
      weatherText: '听雨夜星 · 沉浸助眠',
      aiQuote: '夜深了，风里带着星辰的沉静。为您挑选今夜最温柔的声优故事与安心树洞。',
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
          id: 'n1',
          type: 'story',
          title: '睡前沉浸奇幻故事',
          subtitle: '声优伴播 · 自然助眠',
          recommendBadge: '✨ 夜间首选',
          tag: '睡前助眠',
          desc: '倾诉奇幻森林与星河传说，抚平夜间的思绪焦躁。',
          icon: <Book size={22} className="text-indigo-500 dark:text-indigo-300" />,
          initialPrompt: '请为我讲一个关于星空与古老森林的睡前舒缓奇幻故事，语气温柔安宁。'
        },
        {
          id: 'n2',
          type: 'confide',
          title: '深夜安心解压树洞',
          subtitle: '情绪安全港 · 温暖倾听',
          recommendBadge: '💡 治愈推荐',
          tag: '情绪倾诉',
          desc: '卸下一步不敢表露的压力，把难言心事悄悄告诉懂你的AI。',
          icon: <Heart size={22} className="text-purple-500 dark:text-purple-300" />,
          initialPrompt: '夜深了有些睡不着，心里有些小情绪，想和你聊聊。'
        }
      ]
    },
    morning: {
      id: 'morning',
      label: '晨光拂晓',
      timeRange: '05:00 - 11:00',
      badgeIcon: <CloudSun size={14} className="text-amber-500" />,
      metaphorSymbol: '🌅',
      weatherText: '晨阳清爽 · 能量唤醒',
      aiQuote: '晨光微熹，充满希望的一天开始了。为您梳理今日最核心的能量与焦点。',
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
          id: 'm1',
          type: 'task',
          title: '晨间 AI 3分钟速递',
          subtitle: '智能提炼 · 今日焦点',
          recommendBadge: '✨ 晨起首选',
          tag: '高效晨报',
          desc: '快速梳理今天的工作重心、天气提示与关键行程重点。',
          icon: <Radio size={22} className="text-amber-600 dark:text-amber-300" />,
          initialPrompt: '请帮我梳理今天早晨的焦点计划与晨间提醒。'
        },
        {
          id: 'm2',
          type: 'daily',
          title: '早安愿景微卡片',
          subtitle: '立下锚点 · 元气开启',
          recommendBadge: '🎯 目标锚点',
          tag: '元气立意',
          desc: '写下今天最期待完成的小目标，用好心情迎接全新挑战。',
          icon: <PenLine size={22} className="text-orange-600 dark:text-orange-300" />,
          initialPrompt: '早安！我想记录今天最想完成的三件事情。'
        }
      ]
    },
    afternoon: {
      id: 'afternoon',
      label: '午后沉浸',
      timeRange: '11:00 - 17:00',
      badgeIcon: <Sun size={14} className="text-teal-500" />,
      metaphorSymbol: '☀️',
      weatherText: '阳光清朗 · 高效专注',
      aiQuote: '午后阳光正好，有什么突发的闪光灵感或难题需要我协助突破吗？',
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
          id: 'a1',
          type: 'inspiration',
          title: '创意突破头脑风暴',
          subtitle: 'AI 灵感合伙人 · 方案拆解',
          recommendBadge: '✨ 灵感首选',
          tag: '创意加速',
          desc: '遇到策划瓶颈？快速拆解难题，碰撞出出彩的创意点子。',
          icon: <Brain size={22} className="text-sky-600 dark:text-sky-300" />,
          initialPrompt: '我目前遇到一个设计/策划瓶颈，想和你一起头脑风暴一下。'
        },
        {
          id: 'a2',
          type: 'task',
          title: '脑力续航与待办整理',
          subtitle: '纪要归档 · 待办跟进',
          recommendBadge: '⚡ 效率推荐',
          tag: '高效整理',
          desc: '一句话整理下午会议纪要与事项优先级跟进。',
          icon: <ListTodo size={22} className="text-emerald-600 dark:text-emerald-300" />,
          initialPrompt: '帮我整理一下下午要跟进的重点事项与会议纪要。'
        }
      ]
    },
    evening: {
      id: 'evening',
      label: '暮色余晖',
      timeRange: '17:00 - 21:00',
      badgeIcon: <Sunset size={14} className="text-rose-400" />,
      metaphorSymbol: '🌆',
      weatherText: '落日温存 · 卸压治愈',
      aiQuote: '辛苦了一天，卸下疲惫。把工作烦恼交给AI树洞，倾听晚间放松。',
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
          id: 'e1',
          type: 'confide',
          title: '下班心理卸压树洞',
          subtitle: '情绪疏导 · 治愈陪伴',
          recommendBadge: '✨ 卸压首选',
          tag: '情绪安全',
          desc: '把工作中的委屈与疲惫说出来，享受无压力的温柔回应。',
          icon: <Heart size={22} className="text-rose-600 dark:text-rose-300" />,
          initialPrompt: '终于下班了，感觉今天好累，想和你吐槽倾诉一下。'
        },
        {
          id: 'e2',
          type: 'story',
          title: '暮色治愈轻播客',
          subtitle: '声优解压 · 轻松随想',
          recommendBadge: '🎧 伴听推荐',
          tag: '晚间陪伴',
          desc: '随身声优讲述治愈系旅行与生活纪事，带走一天沉重。',
          icon: <Headphones size={22} className="text-purple-600 dark:text-purple-300" />,
          initialPrompt: '请给我放一段轻松惬意的晚间播客故事。'
        }
      ]
    }
  };

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
          key={activeProfile.id}
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
            key={`cards-${activeProfile.id}`}
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
