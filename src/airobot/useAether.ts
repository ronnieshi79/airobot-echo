import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Message } from '../types';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const useAether = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '你好呀！我是 AETHER，想听故事还是学习新知识？' }
  ]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const addBotMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
    setIsChatOpen(true);
  }, []);

  const handleRobotChat = async (prompt: string, type: 'general' | 'story' | 'confide' | 'task' | 'inspiration' | 'daily' = 'general') => {
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setConversationState('thinking');
    
    try {
      let systemPrompt = `你是一个可爱的AI机器人助手，名为AETHER。你住在用户的拟物闹钟里。`;
      if (type === 'story') systemPrompt += `你现在是讲故事模式，请为用户讲述一个简短、充满想象力且富有启发性的小故事。`;
      if (type === 'confide') systemPrompt += `你现在是心事倾诉模式，请做一个温柔的倾听者，给予用户情感支持和安慰。`;
      if (type === 'task') systemPrompt += `你现在是事务记录模式，请帮用户梳理接下来的安排，并提供清晰的建议。`;
      if (type === 'inspiration') systemPrompt += `你现在是灵感时刻模式，请与用户进行头脑风暴，捕捉他们的灵感火花并提供创意延伸。`;
      
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${systemPrompt} 用户说：${prompt}。请用简短、活泼、拟人化的语气回复（不超过100个字）。`,
      });
      const response = await model;
      const aiText = response.text || "我在这里陪着你！";
      addBotMessage(aiText);
      setConversationState('speaking');
      setIsSpeaking(true);

      // Generate TTS
      try {
        const ttsResponse = await genAI.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: aiText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                },
            },
          },
        });
        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const binaryString = window.atob(base64Audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const int16Array = new Int16Array(bytes.buffer);
          const audioBuffer = audioContext.createBuffer(1, int16Array.length, 24000);
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < int16Array.length; i++) {
            channelData[i] = int16Array[i] / 32768.0;
          }
          
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start();
          source.onended = () => {
            setIsSpeaking(false);
            setConversationState('idle');
          };
        } else {
          setTimeout(() => {
            setIsSpeaking(false);
            setConversationState('idle');
          }, 3000);
        }
      } catch (ttsError) {
        console.error("TTS Error:", ttsError);
        setTimeout(() => {
          setIsSpeaking(false);
          setConversationState('idle');
        }, 3000);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      addBotMessage("哎呀，我的大脑卡住了，但我依然支持你！");
      setConversationState('idle');
    }
  };

  return {
    isChatOpen,
    setIsChatOpen,
    conversationState,
    setConversationState,
    messages,
    setMessages,
    isVoiceActive,
    setIsVoiceActive,
    isSpeaking,
    setIsSpeaking,
    isBlinking,
    addBotMessage,
    handleRobotChat
  };
};
