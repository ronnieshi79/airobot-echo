import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type RobotState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type RobotEmotion = 'happy' | 'curious' | 'focus' | 'comfort' | 'neutral';

interface AiRobotProps {
  conversationState?: RobotState;
  isSpeaking?: boolean;
  isBlinking?: boolean;
  isVoiceActive?: boolean;
  isChatOpen?: boolean;
  activeContext?: string;
  currentFeature?: string;
  onClick?: () => void;
  isDarkMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AiRobot: React.FC<AiRobotProps> = ({
  conversationState = 'idle',
  isSpeaking = false,
  isBlinking = false,
  isVoiceActive = false,
  isChatOpen = false,
  activeContext,
  currentFeature,
  onClick,
  isDarkMode = false,
  size = 'lg',
  className = '',
}) => {
  // Local blink timer if external isBlinking isn't actively cycling
  const [localBlink, setLocalBlink] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setLocalBlink(true);
      setTimeout(() => setLocalBlink(false), 160);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const shouldBlink = isBlinking || localBlink;
  const effectiveSpeaking = isSpeaking || conversationState === 'speaking';
  const effectiveListening = conversationState === 'listening' || isVoiceActive;
  const effectiveThinking = conversationState === 'thinking';

  // Size scale factors
  const dimensionConfig = {
    sm: {
      container: 'w-24 h-24',
      scale: 0.42,
    },
    md: {
      container: 'w-32 h-32',
      scale: 0.58,
    },
    lg: {
      container: 'w-[250px] h-[250px] sm:w-[270px] sm:h-[270px]',
      scale: 1,
    }
  }[size];

  const handleClick = () => {
    setIsInteracted(true);
    setTimeout(() => setIsInteracted(false), 1200);
    if (onClick) onClick();
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: effectiveSpeaking ? [0, -6, 0] : [0, -8, 0],
        rotate: effectiveListening ? [0, 2, -2, 0] : (effectiveThinking ? [0, -1.5, 0] : [0, 0.8, -0.8, 0])
      }}
      transition={{ 
        scale: { duration: 0.4 },
        opacity: { duration: 0.4 },
        y: { repeat: Infinity, duration: effectiveSpeaking ? 1.4 : 3.6, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: effectiveListening ? 2.5 : 4.5, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleClick}
      className={`relative cursor-pointer select-none flex flex-col items-center justify-center ${dimensionConfig.container} ${className}`}
    >
      {/* 1. Outer Concentric Voice/Listening Pulsing Rings */}
      <AnimatePresence>
        {(effectiveListening || effectiveSpeaking) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1.4 + i * 0.25, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.2, 
                  delay: (i - 1) * 0.6, 
                  ease: "easeOut" 
                }}
                className={`absolute w-full h-full rounded-full border-2 ${
                  effectiveSpeaking 
                    ? 'border-pink-400/40' 
                    : 'border-cyan-400/50'
                }`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 2. Precision SVG IP Character (Exact match to 图1 猫耳圆球白团子形象) */}
      <div className="relative w-full h-full flex items-center justify-center z-10 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
        <svg 
          viewBox="0 0 240 240" 
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Ambient Body Radial Gradient */}
            <radialGradient id="bodyGradient" cx="45%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FFFDF9" />
              <stop offset="88%" stopColor="#F9F4EB" />
              <stop offset="100%" stopColor="#EFE7DA" />
            </radialGradient>

            {/* Inner Ear Translucent Pink Gradient */}
            <linearGradient id="earInnerGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFF2F5" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#FFDEE7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFC9D8" stopOpacity="0.95" />
            </linearGradient>

            {/* Rosy Blush Blur Filter */}
            <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF4B7E" stopOpacity={effectiveSpeaking || isInteracted ? "0.85" : "0.65"} />
              <stop offset="50%" stopColor="#FF6B97" stopOpacity={effectiveSpeaking || isInteracted ? "0.45" : "0.3"} />
              <stop offset="100%" stopColor="#FF8DAE" stopOpacity="0" />
            </radialGradient>

            {/* Side Pom-Pom Shadow */}
            <filter id="pompomShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.12" />
            </filter>

            {/* Glow Outer Rim */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 3. Cat Ears (Top Left & Top Right) */}
          <g id="cat-ears">
            {/* Left Cat Ear */}
            <motion.g
              animate={
                effectiveListening 
                  ? { rotate: [-2, 3, -2], y: [0, -2, 0] } 
                  : (effectiveSpeaking ? { rotate: [0, -3, 0], y: [0, -1, 0] } : { rotate: 0, y: 0 })
              }
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "68px 75px" }}
            >
              {/* Outer Ear White Base */}
              <path
                d="M 52 92 C 42 62, 54 36, 68 28 C 84 38, 92 64, 88 88 Z"
                fill="#FFFDFB"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Inner Ear Soft Pink Area */}
              <path
                d="M 57 86 C 50 64, 58 46, 68 38 C 79 46, 83 66, 80 84 Z"
                fill="url(#earInnerGradient)"
              />
            </motion.g>

            {/* Right Cat Ear */}
            <motion.g
              animate={
                effectiveListening 
                  ? { rotate: [2, -3, 2], y: [0, -2, 0] } 
                  : (effectiveSpeaking ? { rotate: [0, 3, 0], y: [0, -1, 0] } : { rotate: 0, y: 0 })
              }
              transition={{ repeat: Infinity, duration: 2, delay: 0.1, ease: "easeInOut" }}
              style={{ transformOrigin: "172px 75px" }}
            >
              {/* Outer Ear White Base */}
              <path
                d="M 188 92 C 198 62, 186 36, 172 28 C 156 38, 148 64, 152 88 Z"
                fill="#FFFDFB"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Inner Ear Soft Pink Area */}
              <path
                d="M 183 86 C 190 64, 182 46, 172 38 C 161 46, 157 66, 160 84 Z"
                fill="url(#earInnerGradient)"
              />
            </motion.g>
          </g>

          {/* 4. Main White Plush Round Body (带纯白厚边框与圆润渐变) */}
          <g id="main-body">
            {/* Outer Thick White Rim Glow */}
            <circle
              cx="120"
              cy="125"
              r="76"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="6"
              filter="url(#softGlow)"
            />
            {/* Inner Plush Sphere Face */}
            <circle
              cx="120"
              cy="125"
              r="74"
              fill="url(#bodyGradient)"
            />
            {/* Soft Top Light Arc Reflex */}
            <ellipse
              cx="120"
              cy="70"
              rx="42"
              ry="16"
              fill="#FFFFFF"
              fillOpacity="0.45"
            />
          </g>

          {/* 5. Left & Right Cheek Pom-Poms / Paws (两侧可爱的圆球绒球) */}
          <g id="cheek-pompoms">
            {/* Left Cheek Pom-Pom */}
            <motion.circle
              animate={
                effectiveSpeaking 
                  ? { scale: [1, 1.08, 1], x: [0, -1, 0] } 
                  : { scale: 1, x: 0 }
              }
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              cx="45"
              cy="134"
              r="17"
              fill="#FFFFFF"
              stroke="#FFF9F5"
              strokeWidth="2.5"
              filter="url(#pompomShadow)"
            />
            {/* Right Cheek Pom-Pom */}
            <motion.circle
              animate={
                effectiveSpeaking 
                  ? { scale: [1, 1.08, 1], x: [0, 1, 0] } 
                  : { scale: 1, x: 0 }
              }
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.1, ease: "easeInOut" }}
              cx="195"
              cy="134"
              r="17"
              fill="#FFFFFF"
              stroke="#FFF9F5"
              strokeWidth="2.5"
              filter="url(#pompomShadow)"
            />
          </g>

          {/* 6. Soft Rosy Blush on Cheeks (红晕小脸蛋) */}
          <g id="blushes">
            {/* Left Blush */}
            <circle
              cx="87"
              cy="137"
              r="16"
              fill="url(#blushGradient)"
            />
            {/* Right Blush */}
            <circle
              cx="153"
              cy="137"
              r="16"
              fill="url(#blushGradient)"
            />
          </g>

          {/* 7. Expressive Anime Big Eyes (大黑萌眼 + 标志性高光双白点) */}
          <g id="eyes">
            {/* Left Eye Group */}
            <motion.g
              animate={
                shouldBlink
                  ? { scaleY: 0.08 }
                  : (isInteracted || (effectiveSpeaking && !effectiveListening)
                    ? { scaleY: 0.95 }
                    : (effectiveThinking
                      ? { y: [0, -3, 0], x: [0, 1.5, 0] }
                      : { scaleY: 1, y: 0, x: 0 }))
              }
              transition={
                shouldBlink 
                  ? { duration: 0.14, ease: "easeInOut" } 
                  : { duration: 0.3 }
              }
              style={{ transformOrigin: "86px 112px" }}
            >
              {isInteracted ? (
                /* Happy Curved Crescent Eye */
                <path
                  d="M 72 116 C 76 102, 96 102, 100 116"
                  fill="none"
                  stroke="#1A1818"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  {/* Black Eye Ball */}
                  <circle
                    cx="86"
                    cy="112"
                    r="16.5"
                    fill="#151414"
                  />
                  {/* Main Big White Highlight (Top-Left) */}
                  <circle
                    cx="80.5"
                    cy="106.5"
                    r="5.8"
                    fill="#FFFFFF"
                  />
                  {/* Secondary Small White Highlight (Bottom-Right) */}
                  <circle
                    cx="92.5"
                    cy="118.5"
                    r="3.2"
                    fill="#FFFFFF"
                  />
                </>
              )}
            </motion.g>

            {/* Right Eye Group */}
            <motion.g
              animate={
                shouldBlink
                  ? { scaleY: 0.08 }
                  : (isInteracted || (effectiveSpeaking && !effectiveListening)
                    ? { scaleY: 0.95 }
                    : (effectiveThinking
                      ? { y: [0, -3, 0], x: [0, 1.5, 0] }
                      : { scaleY: 1, y: 0, x: 0 }))
              }
              transition={
                shouldBlink 
                  ? { duration: 0.14, ease: "easeInOut" } 
                  : { duration: 0.3 }
              }
              style={{ transformOrigin: "154px 112px" }}
            >
              {isInteracted ? (
                /* Happy Curved Crescent Eye */
                <path
                  d="M 140 116 C 144 102, 164 102, 168 116"
                  fill="none"
                  stroke="#1A1818"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  {/* Black Eye Ball */}
                  <circle
                    cx="154"
                    cy="112"
                    r="16.5"
                    fill="#151414"
                  />
                  {/* Main Big White Highlight (Top-Left) */}
                  <circle
                    cx="148.5"
                    cy="106.5"
                    r="5.8"
                    fill="#FFFFFF"
                  />
                  {/* Secondary Small White Highlight (Bottom-Right) */}
                  <circle
                    cx="160.5"
                    cy="118.5"
                    r="3.2"
                    fill="#FFFFFF"
                  />
                </>
              )}
            </motion.g>
          </g>

          {/* 8. Mouth (小横线/说话开合/微笑) */}
          <g id="mouth">
            {effectiveSpeaking ? (
              <motion.ellipse
                animate={{
                  rx: [3.5, 5.5, 3.5, 6, 3.5],
                  ry: [2, 4.5, 2, 5, 2]
                }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
                cx="120"
                cy="142"
                fill="#3A3838"
              />
            ) : isInteracted ? (
              <path
                d="M 114 140 Q 120 146 126 140"
                fill="none"
                stroke="#3A3838"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            ) : effectiveListening ? (
              <ellipse
                cx="120"
                cy="141.5"
                rx="3.5"
                ry="2.5"
                fill="#3A3838"
              />
            ) : (
              /* Idle Delicate Small Line Mouth (一字萌嘴) */
              <line
                x1="113"
                y1="141"
                x2="127"
                y2="141"
                stroke="#3A3838"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            )}
          </g>
        </svg>
      </div>
    </motion.div>
  );
};
