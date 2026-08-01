import React from 'react';
import { motion } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Sunset, 
  CloudSun, 
  Zap
} from 'lucide-react';

export type ContextType = 'auto' | 'morning' | 'afternoon' | 'evening' | 'night';

interface ThemeContextSelectorProps {
  contextMode: ContextType;
  onContextModeChange: (mode: ContextType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeContext: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface ContextOption {
  id: ContextType;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  activeGlowLight: string;
  activeGlowDark: string;
  activeBgLight: string;
  activeBgDark: string;
}

export const ThemeContextSelector: React.FC<ThemeContextSelectorProps> = ({
  contextMode,
  onContextModeChange,
  isDarkMode,
  onToggleDarkMode,
  activeContext
}) => {
  const options: ContextOption[] = [
    {
      id: 'auto',
      name: '智能感知',
      symbol: '⚡',
      icon: <Zap size={14} className="text-amber-400" />,
      activeGlowLight: 'shadow-[0_0_10px_rgba(245,158,11,0.4)] border-amber-400',
      activeGlowDark: 'shadow-[0_0_12px_rgba(245,158,11,0.5)] border-amber-400',
      activeBgLight: 'bg-gradient-to-br from-amber-400 to-indigo-500 text-white',
      activeBgDark: 'bg-gradient-to-br from-amber-500 to-indigo-600 text-white'
    },
    {
      id: 'morning',
      name: '晨光拂晓',
      symbol: '🌅',
      icon: <CloudSun size={14} className="text-amber-500" />,
      activeGlowLight: 'shadow-[0_0_10px_rgba(245,158,11,0.3)] border-amber-400',
      activeGlowDark: 'shadow-[0_0_12px_rgba(245,158,11,0.4)] border-amber-400',
      activeBgLight: 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950',
      activeBgDark: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
    },
    {
      id: 'afternoon',
      name: '午后沉浸',
      symbol: '☀️',
      icon: <Sun size={14} className="text-emerald-500" />,
      activeGlowLight: 'shadow-[0_0_10px_rgba(16,185,129,0.3)] border-emerald-400',
      activeGlowDark: 'shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-400',
      activeBgLight: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950',
      activeBgDark: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
    },
    {
      id: 'evening',
      name: '暮色余晖',
      symbol: '🌆',
      icon: <Sunset size={14} className="text-rose-400" />,
      activeGlowLight: 'shadow-[0_0_10px_rgba(244,63,94,0.3)] border-rose-400',
      activeGlowDark: 'shadow-[0_0_12px_rgba(244,63,94,0.4)] border-rose-400',
      activeBgLight: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white',
      activeBgDark: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white'
    },
    {
      id: 'night',
      name: '深夜静谧',
      symbol: '🌙',
      icon: <Moon size={14} className="text-indigo-400" />,
      activeGlowLight: 'shadow-[0_0_10px_rgba(99,102,241,0.3)] border-indigo-400',
      activeGlowDark: 'shadow-[0_0_12px_rgba(99,102,241,0.4)] border-indigo-400',
      activeBgLight: 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white',
      activeBgDark: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-30 flex flex-col items-center">
      {/* Skeuomorphic Metaphorical Vertical Control Strip (竖排精简拟物化情境切换栏) */}
      <motion.div 
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-1.5 rounded-2xl flex flex-col items-center gap-1.5 shadow-xl backdrop-blur-xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/85 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]' 
            : 'bg-white/85 border-black/10 shadow-[0_15px_35px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Metaphor Icon Column */}
        {options.map((opt) => {
          const isSelected = contextMode === opt.id;
          const isCurrentAutoMatch = contextMode === 'auto' && activeContext === opt.id;

          return (
            <div key={opt.id} className="relative group flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onContextModeChange(opt.id)}
                className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 border ${
                  isSelected
                    ? (isDarkMode 
                        ? `${opt.activeBgDark} ${opt.activeGlowDark} scale-105 z-10` 
                        : `${opt.activeBgLight} ${opt.activeGlowLight} scale-105 z-10`)
                    : (isDarkMode 
                        ? 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10' 
                        : 'bg-black/5 border-transparent text-slate-700 hover:bg-black/10')
                }`}
              >
                {/* Symbol Emoji / Metaphor */}
                <span>{opt.symbol}</span>

                {/* Auto Pulse Indicator */}
                {isCurrentAutoMatch && !isSelected && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </motion.button>

              {/* Hover Tooltip - Floating To The Right */}
              <div className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-black shadow-lg backdrop-blur-md border flex items-center gap-1.5 ${
                  isDarkMode 
                    ? 'bg-slate-900/95 border-white/20 text-white' 
                    : 'bg-slate-900/90 border-slate-800 text-white'
                }`}>
                  <span>{opt.name}</span>
                  {opt.id === 'auto' && (
                    <span className="text-[8px] px-1 bg-amber-500 text-slate-950 font-black rounded uppercase">AUTO</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className={`w-5 h-[1px] my-0.5 ${isDarkMode ? 'bg-white/15' : 'bg-black/10'}`} />

        {/* Bottom Dark / Light Mode Toggle */}
        <div className="relative group flex items-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleDarkMode}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border ${
              isDarkMode 
                ? 'bg-white/10 border-white/10 text-amber-300 hover:bg-white/20' 
                : 'bg-slate-100 border-black/5 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
          </motion.button>

          {/* Tooltip for Dark Mode */}
          <div className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
            <div className={`px-2.5 py-1 rounded-lg text-[11px] font-black shadow-lg backdrop-blur-md border ${
              isDarkMode 
                ? 'bg-slate-900/95 border-white/20 text-white' 
                : 'bg-slate-900/90 border-slate-800 text-white'
            }`}>
              <span>{isDarkMode ? '切换明亮模式' : '切换暗黑模式'}</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
