import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Timer, 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  MessageSquare,
  Volume2,
  VolumeX,
  Bot,
  Mic,
  MicOff,
  Activity,
  Sun,
  Moon,
  X,
  Battery,
  Wifi,
  Square,
  Calendar,
  ListTodo,
  MessageCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Check,
  Search,
  Newspaper,
  Image as ImageIcon,
  Music,
  ArrowLeft,
  Loader2,
  ExternalLink,
  ChevronDown,
  Headphones,
  Bell
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { HomeMenu } from './components/HomeMenu';
import { AlarmView, TimeView, useClock } from './clock';
import { AiRobot, AetherRobot, useAether } from './airobot';
import { useSchedule, TodayView, CalendarView, ScheduleView } from './schedule';
import { useEcho, EchoHomeView, EchoSessionView, EchoHistoryView } from './echo';
import { MainCategory, SubCategory, ScheduleItem, Message, AlarmItem, ActiveCard } from './types';
import { SubCategoryDial } from './components/SubCategoryDial';
import { SkeuomorphicDial } from './components/SkeuomorphicDial';
import { FunctionalModulePlate } from './components/FunctionalModulePlate';
import { ThemeContextSelector, ContextType } from './components/ThemeContextSelector';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [mainCategory, setMainCategory] = useState<MainCategory>('echo');
  const [subCategory, setSubCategory] = useState<SubCategory>('echo-home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contextMode, setContextMode] = useState<ContextType>('auto');
  
  // AI Robot Module
  const {
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
    handleRobotChat: baseHandleRobotChat
  } = useAether();

  // Clock Module
  const {
    time,
    timerSeconds,
    setTimerSeconds,
    isTimerRunning,
    setIsTimerRunning,
    focusTime,
    setFocusTime,
    isFocusRunning,
    setIsFocusRunning,
    alarms,
    toggleAlarm,
    deleteAlarm,
    addAlarm,
    ringingAlarmId
  } = useClock(addBotMessage);

  // Schedule Module
  const {
    selectedDate,
    setSelectedDate,
    selectedScheduleDay,
    setSelectedScheduleDay,
    schedules,
    isAddingSchedule,
    setIsAddingSchedule,
    newTask,
    setNewTask,
    newTime,
    setNewTime,
    addSchedule,
    toggleSchedule,
    deleteSchedule
  } = useSchedule();

  const activeContext = useMemo(() => {
    if (contextMode !== 'auto') return contextMode;
    const currentHour = time.getHours();
    const currentMinutes = time.getMinutes();
    const timeValue = currentHour + currentMinutes / 60;
    if (timeValue >= 5 && timeValue < 11) return 'morning';
    if (timeValue >= 11 && timeValue < 17.5) return 'afternoon';
    if (timeValue >= 17.5 && timeValue < 21.5) return 'evening';
    return 'night';
  }, [contextMode, time]);

  const themeBgMap = {
    morning: isDarkMode ? 'from-slate-950 via-amber-950/40 to-orange-950/30' : 'from-amber-50 via-orange-50/40 to-yellow-50',
    afternoon: isDarkMode ? 'from-slate-950 via-teal-950/40 to-emerald-950/30' : 'from-emerald-50 via-teal-50/40 to-sky-50',
    evening: isDarkMode ? 'from-slate-950 via-rose-950/40 to-pink-950/30' : 'from-rose-50 via-pink-50/40 to-orange-50',
    night: isDarkMode ? 'from-slate-950 via-indigo-950/40 to-purple-950/30' : 'from-indigo-50 via-slate-100 to-purple-50'
  };

  const themeGlowMap = {
    morning: isDarkMode ? 'bg-amber-600' : 'bg-amber-300',
    afternoon: isDarkMode ? 'bg-emerald-600' : 'bg-emerald-300',
    evening: isDarkMode ? 'bg-rose-600' : 'bg-rose-300',
    night: isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'
  };

  // AI Echo Module
  const {
    isChatLoading,
    activeChatSession,
    historySummaries,
    startNewSession,
    endSession,
    sendMessage: sendChatMessage,
  } = useEcho();

  const activeChatSessionRef = useRef(activeChatSession);
  useEffect(() => {
    activeChatSessionRef.current = activeChatSession;
  }, [activeChatSession]);

  // Live API Refs (Restored)
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  // Chat Features State (Remaining)
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  // Info & Card State
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, conversationState]);

  const handleRobotChat = async (prompt: string, type: 'general' | 'story' | 'confide' | 'task' | 'inspiration' | 'daily' | 'podcast' = 'general') => {
    // Intent detection for Chat scenarios and other modules
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("闹钟") || lowerPrompt.includes("叫醒")) {
      setMainCategory('time');
      setSubCategory('alarm');
    } else if (lowerPrompt.includes("计时") || lowerPrompt.includes("倒计时") || lowerPrompt.includes("秒表")) {
      setMainCategory('time');
      setSubCategory('timer');
    } else if (lowerPrompt.includes("专注") || lowerPrompt.includes("番茄钟")) {
      setMainCategory('time');
      setSubCategory('focus');
    } else if (lowerPrompt.includes("日程") || lowerPrompt.includes("安排") || lowerPrompt.includes("待办")) {
      setMainCategory('calendar');
      setSubCategory('today');
    }

    if (lowerPrompt.includes("故事") || lowerPrompt.includes("讲一个") || lowerPrompt.includes("听个")) {
      startNewSession('story');
      setMainCategory('echo');
      setSubCategory('echo-home');
      baseHandleRobotChat(prompt, 'story');
      return;
    }
    if (lowerPrompt.includes("记录") || lowerPrompt.includes("事务") || lowerPrompt.includes("备忘")) {
      startNewSession('task');
      setMainCategory('echo');
      setSubCategory('echo-home');
      baseHandleRobotChat(prompt, 'task');
      return;
    }
    if (lowerPrompt.includes("灵感") || lowerPrompt.includes("点子") || lowerPrompt.includes("头脑风暴")) {
      startNewSession('inspiration');
      setMainCategory('echo');
      setSubCategory('echo-home');
      baseHandleRobotChat(prompt, 'inspiration');
      return;
    }
    if (lowerPrompt.includes("心事") || lowerPrompt.includes("倾诉") || lowerPrompt.includes("难过") || lowerPrompt.includes("不开心")) {
      startNewSession('confide');
      setMainCategory('echo');
      setSubCategory('echo-home');
      baseHandleRobotChat(prompt, 'confide');
      return;
    }
    if (lowerPrompt.includes("日记") || lowerPrompt.includes("每日一记") || lowerPrompt.includes("记事") || lowerPrompt.includes("今天")) {
      startNewSession('daily');
      setMainCategory('echo');
      setSubCategory('echo-home');
      baseHandleRobotChat(prompt, 'daily');
      return;
    }

    await baseHandleRobotChat(prompt, type);
  };
  const playNextChunk = useCallback(() => {
    if (audioQueue.current.length === 0 || isPlayingRef.current || !audioContextRef.current) {
      setIsSpeaking(false);
      return;
    }
    isPlayingRef.current = true;
    setIsSpeaking(true);
    const chunk = audioQueue.current.shift()!;
    const audioBuffer = audioContextRef.current.createBuffer(1, chunk.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) channelData[i] = chunk[i] / 32768.0;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      isPlayingRef.current = false;
      playNextChunk();
    };
    source.start();
  }, []);

  // Handle 30s timeout for conversation
  useEffect(() => {
    if (isChatOpen || conversationState !== 'idle') {
      const timer = setInterval(() => {
        if (Date.now() - lastInteractionTime > 30000) {
          setIsChatOpen(false);
          setConversationState('idle');
          setIsVoiceActive(false);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isChatOpen, conversationState, lastInteractionTime]);

  const startVoiceMode = async () => {
    if (isVoiceActive) { stopVoiceMode(); return; }
    try {
      setIsVoiceActive(true);
      setIsListening(true);
      setIsChatOpen(true);
      setConversationState('listening');
      setLastInteractionTime(Date.now());
      const session = await genAI.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } } },
          systemInstruction: "你是一个住在拟物闹钟里的AI机器人，名字叫AETHER。你说话简短、亲切、充满活力。请用语音回复用户。如果你听到用户想听故事、倾诉心事、记录事务或寻找灵感，请在回复中提到你会为他开启一个专属的对话情境。",
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => startAudioCapture(),
          onmessage: async (message: LiveServerMessage) => {
            setLastInteractionTime(Date.now());
            
            if (message.serverContent?.inputTranscription?.text) {
              const userText = message.serverContent.inputTranscription.text;
              const lowerText = userText.toLowerCase();
              
              // Check for "关闭" command
              if (lowerText.includes('关闭') || lowerText.includes('退出')) {
                stopVoiceMode();
                setIsChatOpen(false);
                return;
              }

              setConversationState('thinking');
              setMessages(prev => {
                const newMessages = [...prev, { role: 'user', text: userText }];
                return newMessages.slice(-20);
              });

              if (lowerText.includes("闹钟") || lowerText.includes("叫醒")) {
                setMainCategory('time');
                setSubCategory('alarm');
              } else if (lowerText.includes("计时") || lowerText.includes("倒计时") || lowerText.includes("秒表")) {
                setMainCategory('time');
                setSubCategory('timer');
              } else if (lowerText.includes("专注") || lowerText.includes("番茄钟")) {
                setMainCategory('time');
                setSubCategory('focus');
              } else if (lowerText.includes("日程") || lowerText.includes("安排") || lowerText.includes("待办")) {
                setMainCategory('calendar');
                setSubCategory('today');
              }

              if (!activeChatSessionRef.current) {
                if (lowerText.includes("故事") || lowerText.includes("讲一个") || lowerText.includes("听个")) {
                  startNewSession('story');
                  setMainCategory('echo');
                  setSubCategory('echo-story');
                } else if (lowerText.includes("记录") || lowerText.includes("事务") || lowerText.includes("备忘")) {
                  startNewSession('task');
                  setMainCategory('echo');
                  setSubCategory('echo-task');
                } else if (lowerText.includes("灵感") || lowerText.includes("点子") || lowerText.includes("头脑风暴")) {
                  startNewSession('inspiration');
                  setMainCategory('echo');
                  setSubCategory('echo-inspiration');
                } else if (lowerText.includes("心事") || lowerText.includes("倾诉") || lowerText.includes("难过") || lowerText.includes("不开心")) {
                  startNewSession('confide');
                  setMainCategory('echo');
                  setSubCategory('echo-confide');
                } else if (lowerText.includes("日记") || lowerText.includes("每日一记") || lowerText.includes("记事") || lowerText.includes("今天")) {
                  startNewSession('daily');
                  setMainCategory('echo');
                  setSubCategory('echo-daily');
                }
              }
            }
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              setConversationState('speaking');
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const binaryString = window.atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              audioQueue.current.push(new Int16Array(bytes.buffer));
              playNextChunk();
            }
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              setMessages(prev => {
                const newMessages = [...prev, { role: 'bot', text: message.serverContent!.modelTurn!.parts[0].text! }];
                return newMessages.slice(-20);
              });
              
              // Generate suggestions after AI speaks
              setSuggestions(['播放下一集', '暂停播放', '查看日程', '设置闹钟']);
              
              // Back to listening after speaking (continuous dialog)
              setTimeout(() => {
                setConversationState('listening');
              }, 3000);
            }
          },
          onclose: () => stopVoiceMode(),
          onerror: () => stopVoiceMode()
        }
      });
      sessionRef.current = session;
    } catch (err) { setIsVoiceActive(false); }
  };

  const stopVoiceMode = () => {
    setIsVoiceActive(false); 
    setIsListening(false); 
    setIsSpeaking(false);
    setConversationState('idle');
    if (sessionRef.current) { sessionRef.current.close(); sessionRef.current = null; }
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    // stopCardAudio(); // Removed podcast audio stop
  };

  const handleUserMessage = async (text: string) => {
    setLastInteractionTime(Date.now());
    
    // Check for "关闭" command
    if (text.includes('关闭') || text.includes('退出')) {
      setIsChatOpen(false);
      setConversationState('idle');
      setIsVoiceActive(false);
      return;
    }

    setMessages(prev => {
      const newMessages = [...prev, { role: 'user', text }];
      return newMessages.slice(-20);
    });
    
    setConversationState('thinking');
    
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: "你是一个AI机器人AETHER。请简短回复用户，语气亲切幽默。",
        }
      });

      const aiText = response.text || "抱歉，我没听清楚。";
      
      setConversationState('speaking');
      setMessages(prev => {
        const newMessages = [...prev, { role: 'bot', text: aiText }];
        return newMessages.slice(-20);
      });

      // Generate suggestions
      setSuggestions(['播放下一集', '暂停播放', '查看日程', '设置闹钟']);
      
      // Back to listening after speaking
      setTimeout(() => {
        setConversationState('listening');
      }, 3000);
    } catch (error) {
      console.error("AI Error:", error);
      setConversationState('listening');
    }
  };

  const startAudioCapture = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported or device not found");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current.onaudioprocess = (e) => {
        if (!sessionRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current.sendRealtimeInput({ audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' } });
      };
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
    } catch (err) { 
      console.warn("Could not capture audio:", err);
      // Gracefully stop voice mode if mic access fails
      stopVoiceMode();
    }
  };

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (amount: number) => {
    if (subCategory === 'timer' && !isTimerRunning) {
      setTimerSeconds(prev => Math.max(60, prev + amount));
    } else if (subCategory === 'focus' && !isFocusRunning) {
      setFocusTime(prev => Math.max(60, prev + amount));
    }
  };

  const setTime = (seconds: number) => {
    if (subCategory === 'timer' && !isTimerRunning) {
      setTimerSeconds(seconds);
    } else if (subCategory === 'focus' && !isFocusRunning) {
      setFocusTime(seconds);
    }
  };

  const renderSubCategoryContent = () => {
    switch (mainCategory) {
      case 'time':
        if (subCategory === 'home') {
          return (
            <FunctionalModulePlate 
              isDarkMode={isDarkMode}
            >
              <HomeMenu 
                isDarkMode={isDarkMode} 
                time={time} 
                schedules={schedules} 
                focusTime={focusTime}
                isFocusRunning={isFocusRunning}
                timerSeconds={timerSeconds}
                isTimerRunning={isTimerRunning}
                alarms={alarms}
                onNavigate={(cat, sub) => { setMainCategory(cat); setSubCategory(sub); }}
                onFocusClick={() => { setMainCategory('time'); setSubCategory('focus'); }}
                onTimerClick={() => { setMainCategory('time'); setSubCategory('timer'); }}
                onAlarmClick={() => { setMainCategory('time'); setSubCategory('alarm'); }}
              />
            </FunctionalModulePlate>
          );
        }
        return (
          <FunctionalModulePlate 
            isDarkMode={isDarkMode}
          >
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {subCategory === 'alarm' ? (
                <AlarmView
                  isDarkMode={isDarkMode}
                  alarms={alarms}
                  onToggleAlarm={toggleAlarm}
                  onDeleteAlarm={deleteAlarm}
                  onAddAlarm={addAlarm}
                  ringingAlarmId={ringingAlarmId}
                />
              ) : (
                <TimeView
                  subCategory={subCategory}
                  time={time}
                  timerSeconds={subCategory === 'focus' ? focusTime : timerSeconds}
                  isTimerRunning={subCategory === 'focus' ? isFocusRunning : isTimerRunning}
                  onTimerStart={() => subCategory === 'focus' ? setIsFocusRunning(true) : setIsTimerRunning(true)}
                  onTimerPause={() => subCategory === 'focus' ? setIsFocusRunning(false) : setIsTimerRunning(false)}
                  onTimerReset={() => subCategory === 'focus' ? setFocusTime(1500) : setTimerSeconds(0)}
                  onTimerAdjust={adjustTime}
                  onTimerSet={setTime}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </FunctionalModulePlate>
        );
      case 'calendar':
        return (
          <FunctionalModulePlate 
            isDarkMode={isDarkMode} 
            className="flex flex-col"
          >
            <div className="relative z-10 w-full h-full flex flex-col">
              {subCategory === 'today' && (
                <TodayView 
                  isDarkMode={isDarkMode} 
                  schedules={schedules} 
                />
              )}
              {subCategory === 'calendar-view' && (
                <CalendarView 
                  isDarkMode={isDarkMode} 
                  selectedDate={selectedDate} 
                  setSelectedDate={setSelectedDate} 
                  schedules={schedules} 
                />
              )}
              {subCategory === 'weekly' && (
                <ScheduleView 
                  isDarkMode={isDarkMode} 
                  schedules={schedules} 
                />
              )}
            </div>
          </FunctionalModulePlate>
        );
      case 'echo':
        return (
          <FunctionalModulePlate isDarkMode={isDarkMode} className="!bg-transparent !border-transparent !shadow-none !backdrop-blur-none">
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              {subCategory === 'echo-history' ? (
                <EchoHistoryView 
                  isDarkMode={isDarkMode}
                  historySummaries={historySummaries}
                  onBack={() => setSubCategory('echo-home')}
                />
              ) : (
                <EchoHomeView 
                  contextMode={contextMode}
                  onContextModeChange={setContextMode}
                  historySummaries={historySummaries}
                  onSendMessage={(text) => {
                    if (!isChatOpen) setIsChatOpen(true);
                    if (!isVoiceActive) startVoiceMode();
                    handleRobotChat(text);
                  }}
                  isDarkMode={isDarkMode}
                  subCategory={subCategory}
                  time={time}
                  onViewHistory={() => setSubCategory('echo-history')}
                  onStartSession={(type, content) => {
                    startNewSession(type);
                    if (content) {
                      setMessages([{ role: 'user', text: content }]);
                    } else {
                      setMessages([]);
                    }
                    if (!isChatOpen) setIsChatOpen(true);
                    if (!isVoiceActive) startVoiceMode();
                    handleRobotChat(`开启${type === 'story' ? '故事' : type === 'podcast' ? '播客' : type === 'confide' ? '倾诉' : type === 'task' ? '事务' : type === 'daily' ? '日记' : '灵感'}情境`, type);
                  }}
                />
              )}
              <AnimatePresence>
                {activeChatSession && (
                  <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-50"
                  >
                    <EchoSessionView 
                      type={activeChatSession.type as any}
                      messages={messages}
                      onClose={endSession}
                      isDarkMode={isDarkMode}
                      onAddSchedule={addSchedule}
                      onAddAlarm={addAlarm}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FunctionalModulePlate>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 overflow-hidden bg-gradient-to-br ${themeBgMap[activeContext]} ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px] opacity-25 transition-all duration-700 ${themeGlowMap[activeContext]}`}></div>
        <div className={`absolute bottom-0 -right-20 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 transition-all duration-700 ${themeGlowMap[activeContext]}`}></div>
        <div className={`absolute top-1/2 left-1/4 w-20 h-20 rounded-full blur-[40px] opacity-30 ${isDarkMode ? 'bg-slate-600' : 'bg-white'}`}></div>
      </div>

      {/* Header Info */}
      <div className="fixed top-8 left-12 flex items-center gap-4 z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
          <Activity size={20} />
        </div>
        <span className={`text-xl font-black tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>AETHER</span>
      </div>

      <div className="fixed top-8 right-12 flex items-center gap-6 text-xs font-bold text-slate-400 z-10">
        <div className="flex items-center gap-2"><Battery size={16} /> 85%</div>
        <div className="flex items-center gap-2"><Wifi size={16} /> ONLINE</div>
        <div className={`text-lg font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {time.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
        {/* Center Column: Main Content Area */}
        <div className="flex flex-col items-center justify-center h-full pointer-events-auto">
          <div className="w-full flex items-center justify-center">
            {renderSubCategoryContent()}
          </div>
        </div>

        {/* Right Column: Robot & Chat (Positioned in right bottom corner) */}
        <div className={`hidden lg:flex justify-end ${isChatOpen ? 'items-center' : 'items-end'} h-full pointer-events-auto p-12 fixed right-0 top-0 bottom-0`}>
          <div className="flex flex-col items-center gap-8 w-[395px]">
            <AnimatePresence mode="wait">
              {isChatOpen && (
                <div className="flex flex-col items-center gap-6 w-full">
                  <motion.div 
                    key="chat-panel"
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className={`relative w-[320px] rounded-[3rem] shadow-2xl overflow-visible flex flex-col ${isDarkMode ? 'bg-slate-900/95 border border-white/10' : 'bg-white/95 border border-black/5'}`}
                  >
                    {/* Robot Head Header - Overlapping top left */}
                    <div className="absolute -top-10 -left-10 z-50">
                      <AiRobot 
                        size="md"
                        isSpeaking={isSpeaking}
                        isBlinking={isBlinking}
                        conversationState={conversationState}
                        isVoiceActive={isVoiceActive}
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    {/* Header Info */}
                    <div className="pt-8 pb-4 px-8 flex items-center justify-between">
                      <div className="ml-20 flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                            {mainCategory === 'time' && <Timer size={14} className="text-orange-500" />}
                            {mainCategory === 'echo' && <MessageSquare size={14} className="text-orange-500" />}
                            {mainCategory === 'calendar' && <Calendar size={14} className="text-orange-500" />}
                          </div>
                          <span className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {mainCategory === 'time' ? '专注时钟' : 
                             mainCategory === 'echo' ? 'AI 回响' : '日程助手'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-2 h-2 rounded-full bg-cyan-400"
                          />
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {conversationState === 'listening' ? 'AETHER LISTENING' : 
                             conversationState === 'thinking' ? 'AETHER THINKING' : 
                             conversationState === 'speaking' ? 'AETHER SPEAKING' : 'AETHER IDLE'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setIsChatOpen(false); setConversationState('idle'); setIsVoiceActive(false); }} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-50 border-black/5 text-slate-400 hover:bg-slate-100'}`}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Messages Area */}
                    <div 
                      ref={chatScrollRef}
                      className="px-6 pb-8 flex flex-col gap-4 h-[400px] overflow-y-auto scroll-smooth scrollbar-hide"
                    >
                      <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[90%] p-4 rounded-[2rem] text-[13px] leading-relaxed font-bold shadow-sm ${
                              msg.role === 'user' 
                                ? 'bg-orange-50 text-orange-900 rounded-tr-none border border-orange-100' 
                                : (isDarkMode ? 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-md')
                            }`}>
                              {msg.text}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {conversationState === 'thinking' && (
                        <div className="flex justify-start">
                          <div className="flex gap-1 p-3">
                            {[0, 1, 2].map(i => (
                              <motion.div 
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                className="w-1 h-1 rounded-full bg-orange-400"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Separated Voice Controls */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 w-full mt-4"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUserMessage("比特森林在哪？")}
                      className={`w-[245px] h-16 rounded-full flex items-center justify-center gap-5 cursor-pointer transition-all ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/5 shadow-xl'}`}
                    >
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map(i => (
                          <motion.div 
                            key={i}
                            animate={conversationState === 'listening' ? { 
                              height: [10, i === 3 ? 32 : (i === 2 || i === 4 ? 24 : 16), 10],
                            } : { height: 8 }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                            className="w-2 rounded-full bg-orange-500"
                          />
                        ))}
                      </div>
                      <span className="text-base font-black text-orange-500 tracking-widest">请说话...</span>
                    </motion.div>

                    {/* Suggestion Tags */}
                    <div className="flex flex-wrap justify-center gap-2 max-w-[282px]">
                      {suggestions.slice(0, 3).map((tag, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                          onClick={() => handleUserMessage(tag)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all border ${
                            isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-black/5 text-slate-500'
                          }`}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className={`flex flex-col items-center gap-6 relative ${isChatOpen ? 'hidden' : 'flex'}`}>
              <AiRobot 
                isSpeaking={isSpeaking}
                isBlinking={isBlinking}
                isChatOpen={isChatOpen}
                conversationState={conversationState}
                isVoiceActive={isVoiceActive}
                isDarkMode={isDarkMode}
                activeContext={activeContext}
                onClick={() => setIsChatOpen(!isChatOpen)}
                size="lg"
              />

            {!isChatOpen && (
              <div className="flex flex-col items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isVoiceActive ? stopVoiceMode : startVoiceMode}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="flex gap-2 items-center justify-center h-12">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div 
                        key={i}
                        animate={isVoiceActive ? { 
                          height: [8, i === 3 ? 32 : (i === 2 || i === 4 ? 24 : 16), 8],
                          opacity: 1
                        } : { 
                          height: [4, 6, 4],
                          opacity: 0.6
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: isVoiceActive ? 0.6 : 3, 
                          delay: i * 0.12,
                          ease: "easeInOut"
                        }}
                        className={`w-1.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] ${isVoiceActive ? 'bg-cyan-400' : 'bg-cyan-400/40'}`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-500/60'}`}>
                    叫名字对话
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Theme & Context Controller */}
      <ThemeContextSelector 
        contextMode={contextMode}
        onContextModeChange={(mode) => {
          setContextMode(mode);
          if (mode === 'night') {
            setIsDarkMode(true);
          } else if (mode === 'morning' || mode === 'afternoon') {
            setIsDarkMode(false);
          }
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        activeContext={activeContext}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ${!isDarkMode ? '.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); }' : ''}
      `}</style>
    </div>
  );
}



