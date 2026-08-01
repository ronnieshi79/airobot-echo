import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, History, MessageSquare, Mic, Brain, ListTodo, Book, Heart } from 'lucide-react';
import { SubCategory } from '../types';
import { HistorySummary } from './useChat';

interface ChatHomeViewProps {
  isDarkMode: boolean;
  subCategory: SubCategory;
  historySummaries: HistorySummary[];
  onSendMessage: (text: string) => void;
}

export const ChatHomeView: React.FC<ChatHomeViewProps> = ({ isDarkMode, subCategory, historySummaries, onSendMessage }) => {
  const [dynamicPrompt, setDynamicPrompt] = useState("");

  useEffect(() => {
    const scenarios = ['故事时光', '事务记录', '灵感时刻', '心事倾诉'];
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    if (historySummaries.length > 0) {
      const latest = historySummaries[0];
      let topic = "刚才的话题";
      if (latest.content.length > 15) {
        topic = latest.content.substring(0, 12) + "...";
      } else {
        topic = latest.content;
      }
      setDynamicPrompt(`今天我们继续讨论关于“${topic}”，或者开始一个新的${randomScenario}？`);
    } else {
      setDynamicPrompt(`今天想听个${randomScenario}，还是记录一下新的灵感？`);
    }
  }, [historySummaries]);

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-hidden">
      {/* 1. Top Slogan */}
      <div className="mb-6 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <Sparkles size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 回响
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          每一个对话，语音记录都有回响；
        </p>
      </div>

      {/* 2. Middle: History List (Notepad style) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide mb-6 relative">
        <div className={`flex items-center gap-2 mb-4 sticky top-0 z-10 py-2 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/90'} backdrop-blur-sm`}>
          <History className="text-blue-500" size={18} />
          <h3 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            回响记录本
          </h3>
        </div>
        
        <div className="flex flex-col gap-4">
          {historySummaries.length > 0 ? (
            historySummaries.map((summary) => (
              <div 
                key={summary.id}
                className={`relative p-5 rounded-[1.5rem] border-l-4 ${
                  summary.type === 'confide' ? 'border-l-pink-500' : 
                  summary.type === 'story' ? 'border-l-orange-500' : 
                  summary.type === 'task' ? 'border-l-emerald-500' : 'border-l-indigo-500'
                } ${
                  isDarkMode ? 'bg-slate-800/50 border-y-white/5 border-r-white/5' : 'bg-slate-50 border-y-slate-100 border-r-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    summary.type === 'confide' ? 'text-pink-500' : 
                    summary.type === 'story' ? 'text-orange-500' : 
                    summary.type === 'task' ? 'text-emerald-500' : 'text-indigo-500'
                  }`}>
                    {summary.type === 'confide' ? '心事倾诉' : 
                     summary.type === 'story' ? '故事时光' : 
                     summary.type === 'task' ? '事务记录' : '灵感时刻'}
                  </span>
                  <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {summary.date}
                  </span>
                </div>
                <p className={`text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {summary.content}
                </p>
              </div>
            ))
          ) : (
            <div className={`p-8 rounded-[1.5rem] border text-center border-dashed ${isDarkMode ? 'bg-slate-800/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                暂无记录，开启语音开始一段新的对话吧
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom: Dynamic AI Prompt */}
      <div className="flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSendMessage(dynamicPrompt)}
          className={`w-full p-6 rounded-[2rem] border text-left flex flex-col gap-3 ${
            isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20' : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100 shadow-sm'
          } transition-colors`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-500" size={18} />
            <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              AETHER 建议
            </h3>
          </div>
          <p className={`text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            "{dynamicPrompt}"
          </p>
        </motion.button>
      </div>
    </div>
  );
};
