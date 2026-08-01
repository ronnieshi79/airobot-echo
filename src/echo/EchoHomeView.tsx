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

interface EchoHomeViewProps {
  isDarkMode: boolean;
  subCategory: SubCategory;
  historySummaries: HistorySummary[];
  onSendMessage: (text: string) => void;
  onStartSession: (type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily', content?: string) => void;
  onViewHistory: () => void;
  time: Date;
}

export type ContextType = 'auto' | 'night' | 'morning' | 'afternoon' | 'evening';

interface ServiceCard {
  id: string;
  type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily';
  title: string;
  subtitle: string;
  recommendBadge: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: 'orange' | 'pink' | 'emerald' | 'indigo' | 'amber' | 'purple' | 'cyan';
  initialPrompt: string;
}

interface ContextProfile {
  id: 'night' | 'morning' | 'afternoon' | 'evening';
  label: string;
  timeRange: string;
  badgeIcon: React.ReactNode;
  metaphorSymbol: string;
  weatherText: string;
  aiQuote: string;
  glowColor: string;
  cards: ServiceCard[];
}

export const EchoHomeView: React.FC<EchoHomeViewProps> = ({
  isDarkMode,
  subCategory,
  historySummaries,
  onSendMessage,
  onStartSession,
  onViewHistory,
  time
}) => {
  const [selectedContext, setSelectedContext] = useState<ContextType>('auto');

  const currentHour = time.getHours();

  // Determine current active context automatically based on time if set to 'auto'
  const activeContextKey = useMemo(() => {
    if (selectedContext !== 'auto') return selectedContext;
    if (currentHour >= 5 && currentHour < 11) return 'morning';
    if (currentHour >= 11 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 21) return 'evening';
    return 'night';
  }, [selectedContext, currentHour]);

  // Context Perception Profiles - Strictly relevant services per context
  const contextProfiles: Record<'night' | 'morning' | 'afternoon' | 'evening', ContextProfile> = {
    night: {
      id: 'night',
      label: '深夜静谧',
      timeRange: '21:00 - 05:00',
      badgeIcon: <Moon size={14} className="text-indigo-400" />,
      metaphorSymbol: '🌙',
      weatherText: '听雨夜星 · 沉浸助眠',
      aiQuote: '夜深了，风里带着星辰的沉静。为您挑选今夜最温柔的声优故事与安心树洞。',
      glowColor: 'rgba(99, 102, 241, 0.18)',
      cards: [
        {
          id: 'n1',
          type: 'story',
          title: '睡前沉浸奇幻故事',
          subtitle: '声优伴播 · 自然助眠',
          recommendBadge: '✨ 夜间首选',
          tag: '睡前助眠',
          desc: '倾诉奇幻森林与星河传说，抚平夜间的思绪焦躁。',
          icon: <Book size={22} className="text-amber-400" />,
          accentColor: 'amber',
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
          icon: <Heart size={22} className="text-pink-400" />,
          accentColor: 'pink',
          initialPrompt: '夜深了有些睡不着，心里有些小情绪，想和你聊聊。'
        }
      ]
    },
    morning: {
      id: 'morning',
      label: '晨光拂晓',
      timeRange: '05:00 - 11:00',
      badgeIcon: <CloudSun size={14} className="text-amber-400" />,
      metaphorSymbol: '🌅',
      weatherText: '晨阳清爽 · 能量唤醒',
      aiQuote: '晨光微熹，充满希望的一天开始了。为您梳理今日最核心的能量与焦点。',
      glowColor: 'rgba(245, 158, 11, 0.18)',
      cards: [
        {
          id: 'm1',
          type: 'task',
          title: '晨间 AI 3分钟速递',
          subtitle: '智能提炼 · 今日焦点',
          recommendBadge: '✨ 晨起首选',
          tag: '高效晨报',
          desc: '快速梳理今天的工作重心、天气提示与关键行程重点。',
          icon: <Radio size={22} className="text-amber-500" />,
          accentColor: 'amber',
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
          icon: <PenLine size={22} className="text-emerald-500" />,
          accentColor: 'emerald',
          initialPrompt: '早安！我想记录今天最想完成的三件事情。'
        }
      ]
    },
    afternoon: {
      id: 'afternoon',
      label: '午后沉浸',
      timeRange: '11:00 - 17:00',
      badgeIcon: <Sun size={14} className="text-amber-500" />,
      metaphorSymbol: '☀️',
      weatherText: '阳光清朗 · 高效专注',
      aiQuote: '午后阳光正好，有什么突发的闪光灵感或难题需要我协助突破吗？',
      glowColor: 'rgba(16, 185, 129, 0.18)',
      cards: [
        {
          id: 'a1',
          type: 'inspiration',
          title: '创意突破头脑风暴',
          subtitle: 'AI 灵感合伙人 · 方案拆解',
          recommendBadge: '✨ 灵感首选',
          tag: '创意加速',
          desc: '遇到策划瓶颈？快速拆解难题，碰撞出出彩的创意点子。',
          icon: <Brain size={22} className="text-indigo-400" />,
          accentColor: 'indigo',
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
          icon: <ListTodo size={22} className="text-emerald-400" />,
          accentColor: 'emerald',
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
      glowColor: 'rgba(244, 63, 94, 0.18)',
      cards: [
        {
          id: 'e1',
          type: 'confide',
          title: '下班心理卸压树洞',
          subtitle: '情绪疏导 · 治愈陪伴',
          recommendBadge: '✨ 卸压首选',
          tag: '情绪安全',
          desc: '把工作中的委屈与疲惫说出来，享受无压力的温柔回应。',
          icon: <Heart size={22} className="text-rose-400" />,
          accentColor: 'pink',
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
          icon: <Headphones size={22} className="text-purple-400" />,
          accentColor: 'purple',
          initialPrompt: '请给我放一段轻松惬意的晚间播客故事。'
        }
      ]
    }
  };

  const activeProfile = contextProfiles[activeContextKey];

  const badgeThemeMap = {
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    pink: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
  };

  const iconBgMap = {
    orange: isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-600',
    pink: isDarkMode ? 'bg-pink-500/20 text-pink-300' : 'bg-pink-100 text-pink-600',
    emerald: isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600',
    indigo: isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600',
    amber: isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-600',
    purple: isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600',
    cyan: isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-600'
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">

      {/* Ambient Glow Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-16 w-[360px] h-[360px] rounded-full blur-[80px]"
          style={{ backgroundColor: activeProfile.glowColor }}
        />
      </div>

      {/* 1. Header Section - Clean Brand & Celestial Perception Tuner */}
      <div className="flex items-center justify-between gap-2 shrink-0 pt-1 w-full">
        
        {/* Left: Brand Title & Perception Subtag */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
          }`}>
            <Sparkles size={18} className="animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                AI 回响
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 shrink-0 ${
                isDarkMode 
                  ? 'bg-indigo-500/20 text-indigo-300' 
                  : 'bg-indigo-50 text-indigo-700'
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

        {/* Right: Celestial Tuner Icons & History */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSelectedContext('auto')}
            title="实时感知"
            className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
              selectedContext === 'auto'
                ? (isDarkMode ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-100 text-amber-800')
                : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
            }`}
          >
            <Zap size={11} className={selectedContext === 'auto' ? 'text-amber-400' : ''} />
            <span>感知</span>
          </button>

          {(Object.keys(contextProfiles) as Array<'night' | 'morning' | 'afternoon' | 'evening'>).map((key) => {
            const prof = contextProfiles[key];
            const isSelected = selectedContext === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedContext(key)}
                title={prof.label}
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-all ${
                  isSelected
                    ? (isDarkMode ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-600 text-white shadow-sm')
                    : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800')
                }`}
              >
                {prof.metaphorSymbol}
              </button>
            );
          })}

          {/* History Button */}
          <button
            onClick={onViewHistory}
            className={`ml-1 p-1.5 rounded-xl transition-all ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="对话痕迹"
          >
            <History size={16} />
          </button>
        </div>
      </div>

      {/* 2. Middle Section: AI Quote & Spacious Recommendation Service Bars */}
      <div className="my-auto py-4 w-full flex flex-col items-center">
        
        {/* Scenario AI Quote */}
        <motion.div 
          key={activeProfile.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-center max-w-lg px-2"
        >
          <p className={`text-xs sm:text-sm font-bold leading-relaxed italic ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            "{activeProfile.aiQuote}"
          </p>
        </motion.div>

        {/* Vertical Stacked Horizontal Service Bars (稀疏舒展设计 + 推荐指示标记) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`cards-${activeProfile.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5 w-full"
          >
            {activeProfile.cards.map((card, index) => {
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  whileHover={{ x: 3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onStartSession(card.type, card.initialPrompt)}
                  className={`relative cursor-pointer p-5 sm:p-6 rounded-[1.75rem] flex items-center justify-between gap-4 transition-all duration-300 border ${
                    isDarkMode 
                      ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-amber-400/40' 
                      : 'bg-black/[0.025] border-black/5 hover:bg-black/[0.05] hover:border-amber-400/50 shadow-sm'
                  }`}
                >
                  {/* Left Icon Avatar */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    iconBgMap[card.accentColor]
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
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border shrink-0 flex items-center gap-1 ${
                        badgeThemeMap[card.accentColor]
                      }`}>
                        {card.recommendBadge}
                      </span>
                    </div>

                    <p className={`text-xs font-bold opacity-85 truncate ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {card.subtitle}
                    </p>

                    <p className={`text-[11px] font-medium leading-relaxed line-clamp-1 opacity-65 mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Right Action Trigger Pill */}
                  <div className="shrink-0 flex items-center">
                    <span className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      isDarkMode 
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
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
      <div className="shrink-0 mt-auto pt-2">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            const defaultPrompt = activeProfile.cards[0]?.initialPrompt || '你好，AETHER';
            onSendMessage(defaultPrompt);
          }}
          className={`w-full p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3.5 border ${
            isDarkMode 
              ? 'bg-white/[0.04] border-white/10 hover:border-amber-400/40' 
              : 'bg-black/[0.025] border-black/5 hover:border-amber-400/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-white shrink-0 shadow-sm">
            <Sparkles size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-amber-500">
                AETHER 情境语音助手
              </span>
            </div>
            <p className={`text-xs font-bold truncate ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              "{activeProfile.cards[0]?.initialPrompt || '开启语音沟通'}"
            </p>
          </div>

          <div className="flex items-center gap-1 text-amber-500 shrink-0 text-xs font-bold">
            <span>语音开启</span>
            <ChevronRight size={16} />
          </div>
        </motion.div>
      </div>

    </div>
  );
};
