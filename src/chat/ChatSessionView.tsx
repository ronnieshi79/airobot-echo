import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Book, 
  Heart, 
  Brain,
  ListTodo,
  History
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { HistorySummary } from './useChat';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface ChatSessionViewProps {
  type: 'story' | 'confide' | 'task' | 'inspiration';
  messages: Message[];
  onClose: (summary?: string) => void;
  isDarkMode: boolean;
  historySummaries: HistorySummary[];
}

export const ChatSessionView: React.FC<ChatSessionViewProps> = ({ 
  type, 
  messages,
  onClose, 
  isDarkMode,
  historySummaries
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dynamicPrompt, setDynamicPrompt] = useState("");

  const scenarioConfig = {
    story: {
      title: '故事时光',
      icon: <Book className="text-orange-500" size={24} />,
      bgImage: 'https://picsum.photos/seed/forest/1920/1080?blur=4',
      prompts: ["想听一个关于勇敢骑士的故事吗？", "让我为你编织一个星空下的童话。", "今天想听点轻松的，还是冒险的？"],
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      description: 'AETHER 正在为你编织奇妙的故事...'
    },
    confide: {
      title: '心事倾诉',
      icon: <Heart className="text-pink-500" size={24} />,
      bgImage: 'https://picsum.photos/seed/sunset/1920/1080?blur=4',
      prompts: ["我在这里，随时倾听你的心声。", "今天过得好吗？有什么不开心的都可以告诉我。", "把烦恼说出来，会轻松很多。"],
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      description: 'AETHER 正在温柔地倾听你的心声...'
    },
    task: {
      title: '事务记录',
      icon: <ListTodo className="text-emerald-500" size={24} />,
      bgImage: 'https://picsum.photos/seed/workspace/1920/1080?blur=4',
      prompts: ["今天有什么重要的待办事项？", "把你的计划告诉我，我帮你记录。", "有什么需要备忘的细节吗？"],
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      description: 'AETHER 正在帮你梳理事务重点...'
    },
    inspiration: {
      title: '灵感时刻',
      icon: <Brain className="text-indigo-500" size={24} />,
      bgImage: 'https://picsum.photos/seed/galaxy/1920/1080?blur=4',
      prompts: ["捕捉每一个闪光的念头。", "你的创意非常棒，继续说下去！", "让我们来一场头脑风暴吧。"],
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      description: 'AETHER 正在捕捉你的灵感火花...'
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
        const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'AETHER'}: ${m.text}`).join('\n');
        const response = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `请根据以下对话内容，提取出当前对话的1-2个关键点或核心信息，用简短的一句话总结（不超过30个字）：\n${chatHistory}`,
          config: {
            systemInstruction: "你是一个擅长提取对话关键信息的AI助手。请保持客观、简练。",
          }
        });
        if (response.text) {
          setSummary(response.text);
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

  const scenarioHistory = historySummaries.filter(h => h.type === type);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-[3rem]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={config.bgImage} 
          alt="background" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/60'}`}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-8 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onClose(summary)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border ${
              isDarkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/80 border-black/10 text-slate-800 shadow-sm hover:bg-white'
            } backdrop-blur-md`}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                {config.icon}
              </div>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {config.title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 px-8 py-6 flex flex-col overflow-y-auto scrollbar-hide">
        {/* Dynamic Prompt & Current Session Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full p-8 rounded-[2.5rem] border backdrop-blur-xl mb-8 ${
            isDarkMode ? 'bg-slate-900/40 border-white/10 shadow-2xl' : 'bg-white/60 border-white shadow-xl'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className={config.textColor} size={24} />
            <h3 className={`text-lg font-black tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              AETHER 引导
            </h3>
          </div>
          
          <p className={`text-lg font-bold leading-relaxed italic mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            "{dynamicPrompt}"
          </p>

          {summary && (
            <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200/50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  当前记录中...
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                <p className={`text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {summary}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* History List */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <History className="text-blue-500" size={18} />
            <h3 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              历史记录
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {scenarioHistory.length > 0 ? (
              scenarioHistory.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-[1.5rem] border backdrop-blur-md ${
                    isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-white/80 border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.date}
                    </span>
                  </div>
                  <p className={`text-xs font-bold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.content}
                  </p>
                </div>
              ))
            ) : (
              <div className={`p-6 rounded-[1.5rem] border text-center backdrop-blur-md ${isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-white/80 border-slate-100 shadow-sm'}`}>
                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  暂无记录，开启语音开始一段新的对话吧
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
