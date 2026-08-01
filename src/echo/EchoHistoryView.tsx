import React, { useState } from 'react';
import { motion } from 'motion/react';
import { History, ArrowLeft, Book, Heart, ListTodo, Brain, ChevronDown, PenLine, Headphones } from 'lucide-react';
import { HistorySummary } from './useEcho';

interface EchoHistoryViewProps {
  isDarkMode: boolean;
  historySummaries: HistorySummary[];
  onBack: () => void;
}

export const EchoHistoryView: React.FC<EchoHistoryViewProps> = ({ isDarkMode, historySummaries, onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'confide' | 'task' | 'inspiration' | 'daily' | 'podcast'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'story': return <Book size={14} className="text-orange-500" />;
      case 'confide': return <Heart size={14} className="text-pink-500" />;
      case 'task': return <ListTodo size={14} className="text-emerald-500" />;
      case 'inspiration': return <Brain size={14} className="text-indigo-500" />;
      case 'daily': return <PenLine size={14} className="text-amber-500" />;
      case 'podcast': return <Headphones size={14} className="text-purple-500" />;
      default: return <History size={14} className="text-blue-500" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'story': return '故事';
      case 'confide': return '倾诉';
      case 'task': return '事务';
      case 'inspiration': return '灵感';
      case 'daily': return '日记';
      case 'podcast': return '播客';
      default: return '对话';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'story': return 'bg-orange-500';
      case 'confide': return 'bg-pink-500';
      case 'task': return 'bg-emerald-500';
      case 'inspiration': return 'bg-indigo-500';
      case 'daily': return 'bg-amber-500';
      case 'podcast': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const filteredHistory = historySummaries.filter(item => activeFilter === 'all' || item.type === activeFilter);

  // Spiral rings
  const rings = Array.from({ length: 18 });

  return (
    <div className={`w-full h-full flex flex-col p-4 overflow-hidden relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
      
      {/* Notebook Container */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-full h-full relative"
      >
        {/* Book Spine / Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#8B5A2B] rounded-l-2xl shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] z-0 block"></div>
        
        {/* Paper Surface */}
        <div className={`absolute left-3 right-8 top-0 bottom-0 rounded-r-3xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-10 ${
          isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#FDFBF7]'
        }`}>
          {/* Inner Content Area */}
          <div className="absolute inset-0 pt-8 px-8 pb-8 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 relative z-20">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                isDarkMode ? 'bg-amber-900/40 text-amber-500' : 'bg-[#FDF0D5] text-[#A67C00]'
              }`}>
                <Book size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-[#1E293B]'}`}>
                  AI 情境记录本
                </h2>
                <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  功能行为历史手账
                </p>
              </div>
            </div>

            <div className={`h-px w-full mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'} border-dashed border-b relative z-20`}></div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 relative z-20 flex-wrap">
              {(['all', 'story', 'confide', 'task', 'inspiration', 'daily', 'podcast'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${
                    activeFilter === filter
                      ? isDarkMode 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-[#FFF8F0] text-[#D05A18] border border-[#FADCC7]'
                      : isDarkMode
                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                        : 'bg-[#F1F5F9] text-slate-500 hover:bg-[#E2E8F0]'
                  }`}
                >
                  {filter === 'all' ? '全部' : getLabel(filter)}
                </button>
              ))}
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-4 pb-12 relative z-20">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-4 rounded-xl border ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 shadow-sm' : 'bg-white border-[#F0EBE1] shadow-sm'
                    }`}
                  >
                    {/* Left Timeline Accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${getColor(item.type)} opacity-80`}></div>
                    <div className={`absolute left-[-3px] top-5 w-2 h-2 rounded-full ${getColor(item.type)} border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'}`}></div>

                    <div className="pl-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${isDarkMode ? 'text-slate-200' : 'text-[#CE5612]'}`}>
                            {getLabel(item.type)}记录
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-[#CE5612]'}`}>
                          {item.date}
                        </span>
                      </div>
                      
                      <div className={`h-px w-full mb-3 border-dashed border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>

                      <p className={`text-xs font-medium italic leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        "{item.content}"
                      </p>

                      {item.followUp && (
                        <div className={`mt-3 p-2 rounded-lg text-xs font-black flex items-start gap-2 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
                          <ListTodo size={12} className="flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">跟进: {item.followUp}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={`w-full p-8 rounded-xl border text-center flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-transparent border-dashed border-slate-300'}`}>
                  <History size={32} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'} />
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>暂无对话记录</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spiral Binding Overlay */}
        <div className="absolute left-[8px] top-4 bottom-4 w-6 flex flex-col justify-between z-30 py-2 pointers-events-none">
          {rings.map((_, i) => (
            <div key={i} className="relative w-full h-[18px]">
               {/* Shadow on paper */}
               <div className="absolute left-2 top-[3px] w-[14px] h-[6px] bg-black/10 rounded-full blur-[1px]"></div>
               {/* Hole */}
               <div className={`absolute left-2 top-0 w-[6px] h-[10px] rounded-full shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-[#e2ddd3]'}`}></div>
               {/* Metal Ring */}
               <div className="absolute left-[-2px] top-[2px] w-[14px] h-[4px] rounded-full bg-gradient-to-b from-[#e5e5e5] via-[#a3a3a3] to-[#e5e5e5] shadow-[0_1px_1px_rgba(0,0,0,0.5)] border border-[#c0c0c0]"></div>
            </div>
          ))}
        </div>

        {/* Pull to Close Bookmark Tab */}
        <motion.div 
          onClick={onBack}
          whileHover={{ opacity: 1, x: 2 }}
          whileTap={{ opacity: 0.8 }}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 py-6 rounded-r-2xl cursor-pointer shadow-[2px_0_10px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 z-20 overflow-hidden ${
            isDarkMode ? 'bg-[#2a2a2a] border border-slate-700 border-l-0' : 'bg-[#EAEAEA] border border-white border-l-0'
          }`}
          style={{ transformOrigin: 'left' }}
        >
          {/* Faint lines for grip */}
          <div className="flex flex-col gap-1 opacity-40">
            <div className={`w-4 h-0.5 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`}></div>
            <div className={`w-4 h-0.5 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`}></div>
            <div className={`w-4 h-0.5 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`}></div>
            <ChevronDown size={14} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1 opacity-70`} />
          </div>

          <p 
            className={`text-[8px] font-black uppercase tracking-[0.2em] w-max select-none ${isDarkMode ? 'text-slate-400' : 'text-[#9ca3af]'}`}
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Pull to close
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};
