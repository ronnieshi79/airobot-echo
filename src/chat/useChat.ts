import { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ActiveCard } from '../types';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HistorySummary {
  id: string;
  date: string;
  content: string;
  type: 'story' | 'confide' | 'task' | 'inspiration';
}

export function useChat() {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeChatSession, setActiveChatSession] = useState<{
    id: string;
    type: 'story' | 'confide' | 'task' | 'inspiration';
    messages: { role: 'user' | 'bot'; text: string }[];
    summary?: string;
  } | null>(null);

  const [historySummaries, setHistorySummaries] = useState<HistorySummary[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aether_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out duplicates to prevent key warnings from old data
          const unique = parsed.filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
          setHistorySummaries(unique);
        }
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  const startNewSession = useCallback((type: 'story' | 'confide' | 'task' | 'inspiration') => {
    setActiveChatSession({
      id: Date.now().toString(),
      type,
      messages: [],
    });
  }, []);

  const endSession = useCallback((summary?: string) => {
    setActiveChatSession(prev => {
      if (prev && summary) {
        const newSummary: HistorySummary = {
          id: prev.id,
          date: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          content: summary,
          type: prev.type,
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
          localStorage.setItem('aether_chat_history', JSON.stringify(updated));
          return updated;
        });
      }
      return null;
    });
  }, []);

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
        inspiration: "你是一个充满创意的灵感缪斯。请与用户进行头脑风暴，捕捉他们的灵感火花并提供创意延伸。语气要充满启发性和鼓励。"
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
