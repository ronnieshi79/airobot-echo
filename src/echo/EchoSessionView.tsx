import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Book, 
  Heart, 
  Brain,
  ListTodo,
  ChevronDown,
  PenLine
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface ActionItem {
  task: string;
  time: string;
  type: 'schedule' | 'alarm';
}

interface EchoSessionViewProps {
  type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily';
  messages: Message[];
  onClose: (summary?: string) => void;
  isDarkMode: boolean;
  onAddSchedule?: (task: string, time: string, dayOfWeek: number) => void;
  onAddAlarm?: (time: string, label: string, days: number[]) => void;
}

export const EchoSessionView: React.FC<EchoSessionViewProps> = ({ 
  type, 
  messages,
  onClose, 
  isDarkMode,
  onAddSchedule,
  onAddAlarm
}) => {
  const [summary, setSummary] = useState<string>('');
  const [actionItem, setActionItem] = useState<ActionItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dynamicPrompt, setDynamicPrompt] = useState("");
  const [isSynced, setIsSynced] = useState(false);

  const scenarioConfig = {
    story: {
      title: '故事时光',
      icon: <Book size={24} className="text-orange-600" />,
      prompts: ["想听一个关于勇敢骑士的故事吗？", "让我为你编织一个星空下的童话。", "今天想听点轻松的，还是冒险的？"],
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      spineColor: 'bg-[#C25B2D]', // Muted earthy orange
      desc: '通勤路上的播客，睡前放松的奇幻之旅，为你定制专属故事。'
    },
    confide: {
      title: '心事倾诉',
      icon: <Heart size={24} className="text-pink-600" />,
      prompts: ["我在这里，随时倾听你的心声。", "今天过得好吗？有什么不开心的都可以告诉我。", "把烦恼说出来，会轻松很多。"],
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      spineColor: 'bg-[#B2466A]', // Muted earthy pink
      desc: '职场焦虑、生活烦恼，这里是你安全的树洞，随时倾听你的心声。'
    },
    task: {
      title: '事务记录',
      icon: <ListTodo size={24} className="text-emerald-600" />,
      prompts: ["今天有什么重要的待办事项？", "把你的计划告诉我，我帮你记录。", "有什么需要备忘的细节吗？"],
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      spineColor: 'bg-[#3A755A]', // Muted earthy green
      desc: '会议纪要、待办事项、日程安排，一句话帮你高效梳理工作。'
    },
    inspiration: {
      title: '灵感时刻',
      icon: <Brain size={24} className="text-indigo-600" />,
      prompts: ["捕捉每一个闪光的念头。", "你的创意非常棒，继续说下去！", "让我们来一场头脑风暴吧。"],
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      spineColor: 'bg-[#40437A]', // Muted earthy indigo
      desc: '捕捉转瞬即逝的创意火花，头脑风暴的好帮手，让点子落地。'
    },
    daily: {
      title: '每日一记',
      icon: <PenLine size={24} className="text-amber-600" />,
      prompts: ["今天经历了什么美好的事情吗？", "有什么想记录下来的瞬间？", "今天的心情如何？让我们记录下来。"],
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      spineColor: 'bg-[#B45309]', // Earthy amber/brown
      desc: '记录每日小确幸与感悟，留住生活温度，让每一天都值得回味。'
    }
  };

  const config = scenarioConfig[type] || scenarioConfig.story;

  useEffect(() => {
    const randomPrompt = config.prompts[Math.floor(Math.random() * config.prompts.length)];
    setDynamicPrompt(randomPrompt);
  }, [type]);

  useEffect(() => {
    const generateAnalysis = async () => {
      if (messages.length === 0) return;
      
      setIsAnalyzing(true);
      try {
        const echoHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'AETHER'}: ${m.text}`).join('\n');
        const response = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `请根据以下对话内容，提取出当前对话的1-2个关键点作为摘要，并提取出1个具体的跟进事务或日程安排。请以JSON格式返回，包含 "summary" (字符串) 和 "actionItem" (对象) 两个字段。actionItem对象应包含 "task" (任务描述), "time" (建议时间，格式HH:MM), 和 "type" (值为 "schedule" 或 "alarm")：\n${echoHistory}`,
          config: {
            systemInstruction: "你是一个擅长提取对话关键信息和后续行动的AI助手。请保持客观、简练。必须返回合法的JSON格式。",
            responseMimeType: "application/json",
          }
        });
        if (response.text) {
          try {
            const parsed = JSON.parse(response.text);
            if (parsed.summary) setSummary(parsed.summary);
            if (parsed.actionItem && parsed.actionItem.task) setActionItem(parsed.actionItem);
          } catch (e) {
            console.error("Failed to parse analysis JSON", e);
          }
        }
      } catch (error) {
        console.error("Analysis Error:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timer = setTimeout(() => {
      generateAnalysis();
    }, 2000); // Debounce analysis

    return () => clearTimeout(timer);
  }, [messages]);

  const handleSync = () => {
    if (!actionItem) return;
    if (actionItem.type === 'alarm' && onAddAlarm) {
      onAddAlarm(actionItem.time || '08:00', actionItem.task, [0, 1, 2, 3, 4, 5, 6]);
    } else if (onAddSchedule) {
      onAddSchedule(actionItem.task, actionItem.time || '10:00', new Date().getDay());
    }
    setIsSynced(true);
  };

  return (
    <div className={`w-full h-full flex flex-col p-4 overflow-hidden relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
      
      {/* Skeuomorphic Card Container */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-full h-full relative"
      >
        {/* Leather/Cloth Spine Shadow and Base */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 ${config.spineColor} rounded-l-2xl shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] z-0`}></div>
        
        {/* Main Paper/Card Surface */}
        <div className={`absolute left-3 right-8 top-0 bottom-0 rounded-r-3xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-10 flex flex-col ${
          isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#FDFBF7]'
        }`}>
          {/* Internal content padding */}
          <div className="absolute inset-0 pt-8 px-8 pb-8 flex flex-col overflow-hidden">
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 relative z-20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                }`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-[#1E293B]'}`}>
                    {config.title}
                  </h2>
                  <p className={`text-[10px] font-bold mt-1 leading-relaxed line-clamp-2 max-w-[200px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {config.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className={`h-px w-full mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'} border-dashed border-b relative z-20`}></div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-6 pb-12 relative z-20">
              
              {/* Dynamic Prompt / AI Intro (Styled like an embossed quote block) */}
              <div className={`p-6 rounded-2xl shadow-inner relative overflow-hidden ${
                isDarkMode ? 'bg-[#141414] border border-slate-800' : 'bg-[#F4EFE6] border border-[#E8E0CE]'
              }`}>
                {/* Decorative Pattern / Texture */}
                <div className="absolute right-[-20%] top-[-20%] w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, currentColor 10%, transparent 10%)`, backgroundSize: '10px 10px', color: 'gray' }}></div>
                
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <Sparkles className={config.textColor} size={18} />
                  <h3 className={`text-xs font-black tracking-widest uppercase ${config.textColor}`}>
                    AETHER 引导
                  </h3>
                </div>
                <p className={`text-sm font-bold leading-relaxed italic relative z-10 ${isDarkMode ? 'text-slate-300' : 'text-[#5C5346]'}`}>
                  "{dynamicPrompt}"
                </p>
              </div>

              {/* Analysis & Actions Box */}
              {(summary || actionItem) && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.color} ${isAnalyzing ? 'animate-pulse' : 'shadow-[0_0_8px_currentColor]'} `} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isAnalyzing ? 'Aether 正在整理分析...' : '本次对话分析与跟进'}
                    </span>
                  </div>
                  
                  {summary && (
                    <div className={`p-5 rounded-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-[#E8E0CE] shadow-[0_4px_10px_rgba(0,0,0,0.03)]'}`}>
                      {/* Paper pin skeuomorphism */}
                      <div className="absolute top-2 right-4 w-2 h-6 bg-red-400/20 rounded-full shadow-inner rotate-45 transform origin-center border border-red-500/10"></div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Book size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
                        <span className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>情境摘要</span>
                      </div>
                      <p className={`text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-[#3E3832]'}`}>
                        {summary}
                      </p>
                    </div>
                  )}

                  {actionItem && (
                    <div className={`p-5 rounded-2xl border-l-4 ${isDarkMode ? 'bg-[#1A2333] border border-l-blue-500 border-slate-700' : 'bg-[#F0F5FA] border border-l-blue-500 border-[#E2E8F0] shadow-sm'} flex flex-col gap-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ListTodo size={14} className="text-blue-500" />
                          <span className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {actionItem.type === 'alarm' ? '建议设立闹钟' : '生成随身事务'}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                          {actionItem.time}
                        </span>
                      </div>
                      <p className={`text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {actionItem.task}
                      </p>
                      
                      {/* Skeuomorphic Sync Button */}
                      <button 
                        onClick={handleSync}
                        disabled={isSynced}
                        className={`mt-2 py-2.5 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                          isSynced 
                            ? (isDarkMode ? 'bg-slate-800 text-slate-500 shadow-inner' : 'bg-slate-200 text-slate-400 shadow-inner') 
                            : 'bg-gradient-to-b from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 active:scale-95 shadow-[0_4px_0_theme(colors.blue.700),0_5px_10px_rgba(0,0,0,0.3)] active:border-t-4 active:border-transparent active:shadow-none'
                        }`}
                      >
                        {isSynced ? '已同步至模块' : `一键同步至 ${actionItem.type === 'alarm' ? 'AI 闹钟' : 'AI 日程'}`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pull to Close Bookmark Tab */}
        <motion.div 
          onClick={() => onClose(summary)}
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
