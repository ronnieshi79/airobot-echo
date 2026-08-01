import { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ActiveCard } from '../types';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HistorySummary {
  id: string;
  date: string;
  content: string;
  type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily';
  followUp?: string;
}

const DEMO_HISTORY: HistorySummary[] = [
  { id: 'demo-1', date: '刚刚', content: '听了一段关于冰岛极光的旅行故事', type: 'story', followUp: '明天晚上继续听北欧神话故事' },
  { id: 'demo-2', date: '昨天', content: '倾诉了工作上的焦虑和疲惫', type: 'confide', followUp: '周末安排一次户外放松活动' },
  { id: 'demo-3', date: '周二', content: '整理了Q3宣发方案的数据报表', type: 'task', followUp: '明天上午10点提醒与市场部对齐' },
  { id: 'demo-4', date: '上周', content: '讨论了新产品UI的拟物化设计', type: 'inspiration', followUp: '下周一整理设计草图' }
];

export function useEcho() {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeChatSession, setActiveChatSession] = useState<{
    id: string;
    type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily';
    messages: { role: 'user' | 'bot'; text: string }[];
    summary?: string;
  } | null>(null);

  const [historySummaries, setHistorySummaries] = useState<HistorySummary[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aether_echo_history_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out duplicates and invalid entries
          const validAndUnique = parsed.filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id) &&
            item.content !== '进行了一次对话' &&
            item.content !== '未命名对话'
          );
          setHistorySummaries(validAndUnique.length > 0 ? validAndUnique : DEMO_HISTORY);
        } else {
          setHistorySummaries(DEMO_HISTORY);
        }
      } catch (e) {
        console.error("Failed to parse echo history");
        setHistorySummaries(DEMO_HISTORY);
      }
    } else {
      setHistorySummaries(DEMO_HISTORY);
    }
  }, []);

  const startNewSession = useCallback((type: 'story' | 'confide' | 'task' | 'inspiration' | 'daily') => {
    setActiveChatSession({
      id: Date.now().toString(),
      type,
      messages: [],
    });
  }, []);

  const endSession = useCallback(async () => {
    if (!activeChatSession) return;
    
    if (activeChatSession.messages.length === 0) {
      setActiveChatSession(null);
      return;
    }
    
    // Generate summary and follow-up if there are messages
    let finalSummary = activeChatSession.summary || "未命名对话";
    let finalFollowUp = "";

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `请根据以下对话，提炼出一个明确的对话主题（10字以内，比如“冰岛极光故事”、“Q3宣发方案讨论”），以及一个具体的跟进建议（比如：明天晚上继续听xxx故事，或者明天上午10点提醒xxx）。如果没有明显的跟进建议，可以留空。\n\n对话内容：\n${activeChatSession.messages.map(m => `${m.role}: ${m.text}`).join('\n')}`,
        config: {
          systemInstruction: "你是一个擅长总结和制定计划的助手。请返回JSON格式：{\"topic\": \"明确的主题\", \"followUp\": \"跟进建议\"}",
          responseMimeType: "application/json",
        }
      });
      
      if (response.text) {
        try {
          const data = JSON.parse(response.text);
          finalSummary = data.topic || data.summary || finalSummary;
          finalFollowUp = data.followUp || "";
        } catch (e) {
          console.error("Failed to parse JSON response", e);
        }
      }
    } catch (error) {
      console.error("Failed to generate summary and follow-up", error);
    }

    setActiveChatSession(prev => {
      if (prev) {
        const newSummary: HistorySummary = {
          id: prev.id,
          date: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          content: finalSummary,
          type: prev.type,
          followUp: finalFollowUp
        };
        setHistorySummaries(current => {
          const existingIndex = current.findIndex(s => s.id === prev.id);
          let updated;
          if (existingIndex >= 0) {
            updated = [...current];
            updated[existingIndex] = newSummary;
          } else {
            updated = [newSummary, ...current].slice(0, 20); // Keep last 20
          }
          localStorage.setItem('aether_echo_history_v2', JSON.stringify(updated));
          return updated;
        });
      }
      return null;
    });
  }, [activeChatSession]);

  const sendMessage = useCallback(async (text: string) => {
    if (!activeChatSession) return;

    // Add user message locally
    setActiveChatSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, { role: 'user', text }]
      };
    });

    setIsChatLoading(true);

    try {
      const systemInstructions = {
        story: "你是一个讲故事的高手。请根据用户的要求讲一个生动有趣的故事。语气要富有感染力，像是在给孩子讲睡前故事。",
        confide: "你是一个温柔体贴的倾听者。用户现在想向你倾诉心事，请给予情感支持、安慰和理解。语气要柔和、共情。",
        task: "你是一个高效的个人助理。请帮用户记录事务、梳理安排，并提供清晰的建议。语气要专业、干练。",
        inspiration: "你是一个充满创意的灵感缪斯。请与用户进行头脑风暴，捕捉他们的灵感火花并提供创意延伸。语气要充满启发性和鼓励。",
        daily: "你是一个温暖的生活日记盒。请引导用户记录今天的日常、感悟和美好的瞬间，帮助他们留住生活的温度。语气要温馨、治愈、充满温情。"
      };

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: systemInstructions[activeChatSession.type],
        }
      });

      const aiText = response.text || "抱歉，我刚才走神了，能再说一遍吗？";

      setActiveChatSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, { role: 'bot', text: aiText }]
        };
      });

      // Generate summary if it's a long conversation (e.g., > 4 messages)
      if (activeChatSession.messages.length >= 3) {
        const summaryResponse = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `请总结以下对话的核心内容，用一句话概括：\n${activeChatSession.messages.map(m => `${m.role}: ${m.text}`).join('\n')}\nAI: ${aiText}`,
          config: {
            systemInstruction: "你是一个擅长总结的助手。请用一句话总结对话内容。",
          }
        });
        const summary = summaryResponse.text;
        setActiveChatSession(prev => prev ? { ...prev, summary } : null);
      }

    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsChatLoading(false);
    }
  }, [activeChatSession]);

  return {
    isChatLoading,
    activeChatSession,
    historySummaries,
    startNewSession,
    endSession,
    sendMessage,
  };
}
