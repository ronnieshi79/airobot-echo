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
  // Local blink timer
  const [localBlink, setLocalBlink] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setLocalBlink(true);
      setTimeout(() => setLocalBlink(false), 180);
    }, 3600 + Math.random() * 2400);
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
      container: 'w-[230px] h-[230px] sm:w-[250px] sm:h-[250px]',
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
        y: effectiveSpeaking ? [0, -4, 0] : [0, -6, 0],
        rotate: effectiveListening ? [0, 1.5, -1.5, 0] : (effectiveThinking ? [0, -1, 0] : [0, 0.6, -0.6, 0])
      }}
      transition={{ 
        scale: { duration: 0.4 },
        opacity: { duration: 0.4 },
        y: { repeat: Infinity, duration: effectiveSpeaking ? 1.4 : 3.8, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: effectiveListening ? 2.5 : 5, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative cursor-pointer select-none flex flex-col items-center justify-center ${dimensionConfig.container} ${className}`}
    >
      {/* 1. Outer Voice Waves on Active Mode */}
      <AnimatePresence>
        {(effectiveListening || effectiveSpeaking) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1.35 + i * 0.22, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.2, 
                  delay: (i - 1) * 0.6, 
                  ease: "easeOut" 
                }}
                className={`absolute w-full h-full rounded-[3.5rem] border-2 ${
                  effectiveSpeaking 
                    ? 'border-pink-400/40' 
                    : 'border-cyan-400/45'
                }`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 2. Precision SVG IP Character (参考图2：圆润厚耳、软萌Squircle方包子脸、立体腮红球与生动大萌眼) */}
      <div className="relative w-full h-full flex items-center justify-center z-10 filter drop-shadow-[0_16px_35px_rgba(235,185,160,0.22)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)]">
        <svg 
          viewBox="0 0 240 240" 
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 3D Soft Squircle Face Gradient (奶白向暖杏温润渐变) */}
            <radialGradient id="squircleFaceGrad" cx="50%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFFDF9" />
              <stop offset="85%" stopColor="#FFF4E6" />
              <stop offset="100%" stopColor="#F9E8D6" />
            </radialGradient>

            {/* Inner Ear Soft Peach Gradient (柔嫩粉桃渐变) */}
            <linearGradient id="earInnerPeachGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFF0F3" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#FFDEE7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFCCD8" stopOpacity="0.95" />
            </linearGradient>

            {/* Outer Ear Warm Base Gradient */}
            <linearGradient id="earOuterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FAF1E6" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Rosy Cheek Blush Soft Diffuse Gradient */}
            <radialGradient id="blushPeachGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF4680" stopOpacity={effectiveSpeaking || isInteracted ? "0.9" : "0.72"} />
              <stop offset="45%" stopColor="#FF6B98" stopOpacity={effectiveSpeaking || isInteracted ? "0.55" : "0.38"} />
              <stop offset="75%" stopColor="#FFA0BC" stopOpacity={effectiveSpeaking || isInteracted ? "0.2" : "0.1"} />
              <stop offset="100%" stopColor="#FFA0BC" stopOpacity="0" />
            </radialGradient>

            {/* Cheek Pom-Pom Drop Shadow */}
            <filter id="pompomSoftShadow" x="-35%" y="-35%" width="170%" height="170%">
              <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#D4A790" floodOpacity="0.28" />
            </filter>

            {/* Outer Soft Squircle Body Shadow */}
            <filter id="bodyAmbientGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#E8C3B0" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* 3. Soft Rounded Thick Ears (图2：大圆弧兔猫软耳，耳尖圆润厚实，带半透高光) */}
          <g id="soft-ears">
            {/* Left Ear */}
            <motion.g
              animate={
                effectiveListening 
                  ? { rotate: [-2.5, 3, -2.5], y: [0, -2, 0] } 
                  : (effectiveSpeaking ? { rotate: [0, -3, 0], y: [0, -1, 0] } : { rotate: 0, y: 0 })
              }
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "80px 85px" }}
            >
              {/* Outer Ear Curved Pill Path */}
              <path
                d="M 64 96 C 50 68, 54 38, 76 28 C 96 20, 108 48, 102 90 Z"
                fill="url(#earOuterGrad)"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Inner Ear Soft Pink Pill Area */}
              <path
                d="M 68 90 C 58 66, 62 45, 76 38 C 90 32, 98 52, 94 86 Z"
                fill="url(#earInnerPeachGrad)"
              />
              {/* Ear Translucent Highlight Arc */}
              <path
                d="M 63 76 C 60 55, 68 38, 77 32"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            </motion.g>

            {/* Right Ear */}
            <motion.g
              animate={
                effectiveListening 
                  ? { rotate: [2.5, -3, 2.5], y: [0, -2, 0] } 
                  : (effectiveSpeaking ? { rotate: [0, 3, 0], y: [0, -1, 0] } : { rotate: 0, y: 0 })
              }
              transition={{ repeat: Infinity, duration: 2, delay: 0.1, ease: "easeInOut" }}
              style={{ transformOrigin: "160px 85px" }}
            >
              {/* Outer Ear Curved Pill Path */}
              <path
                d="M 176 96 C 190 68, 186 38, 164 28 C 144 20, 132 48, 138 90 Z"
                fill="url(#earOuterGrad)"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Inner Ear Soft Pink Pill Area */}
              <path
                d="M 172 90 C 182 66, 178 45, 164 38 C 150 32, 142 52, 146 86 Z"
                fill="url(#earInnerPeachGrad)"
              />
              {/* Ear Translucent Highlight Arc */}
              <path
                d="M 177 76 C 180 55, 172 38, 163 32"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            </motion.g>
          </g>

          {/* 4. Squircle Body / Face (图2：圆角方包子脸，底座不全圆，而是圆润方圆，外带厚白边) */}
          <g id="squircle-body">
            {/* Outer Thick White Rim Glow & Squircle Base */}
            <rect
              x="45"
              y="58"
              width="150"
              height="136"
              rx="58"
              ry="54"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="7"
              filter="url(#bodyAmbientGlow)"
            />

            {/* Inner Soft Cream/Peach Porcelain Face */}
            <rect
              x="47"
              y="60"
              width="146"
              height="132"
              rx="55"
              ry="51"
              fill="url(#squircleFaceGrad)"
            />

            {/* Soft Warm Ambient Lighting Reflex along top & bottom */}
            <path
              d="M 65 72 Q 120 62 175 72"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 75 182 Q 120 188 165 182"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>

          {/* 5. Left & Right Cheek Pom-Poms / Paws (两侧立体饱满的小球爪爪) */}
          <g id="cheek-pompoms">
            {/* Left Cheek Pom-Pom */}
            <motion.circle
              animate={
                effectiveSpeaking 
                  ? { scale: [1, 1.07, 1], x: [0, -1, 0] } 
                  : { scale: 1, x: 0 }
              }
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              cx="44"
              cy="135"
              r="17.5"
              fill="#FFFFFF"
              stroke="#FFF8F5"
              strokeWidth="2.5"
              filter="url(#pompomSoftShadow)"
            />
            {/* Right Cheek Pom-Pom */}
            <motion.circle
              animate={
                effectiveSpeaking 
                  ? { scale: [1, 1.07, 1], x: [0, 1, 0] } 
                  : { scale: 1, x: 0 }
              }
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.1, ease: "easeInOut" }}
              cx="196"
              cy="135"
              r="17.5"
              fill="#FFFFFF"
              stroke="#FFF8F5"
              strokeWidth="2.5"
              filter="url(#pompomSoftShadow)"
            />
          </g>

          {/* 6. Soft Diffuse Rosy Blushes (横向透润大腮红，紧贴眼下与脸侧) */}
          <g id="blushes">
            {/* Left Blush */}
            <ellipse
              cx="87"
              cy="136"
              rx="18"
              ry="11.5"
              fill="url(#blushPeachGrad)"
            />
            {/* Right Blush */}
            <ellipse
              cx="153"
              cy="136"
              rx="18"
              ry="11.5"
              fill="url(#blushPeachGrad)"
            />
          </g>

          {/* 7. Expressive Anime Big Obsidian Eyes (生动水润黑曜石大眼，大圆弧双高光) */}
          <g id="eyes">
            {/* Left Eye */}
            <motion.g
              animate={
                shouldBlink
                  ? { scaleY: 0.08 }
                  : (isInteracted || (effectiveSpeaking && !effectiveListening)
                    ? { scaleY: 0.95 }
                    : (effectiveThinking
                      ? { y: [0, -2.5, 0], x: [0, 1.5, 0] }
                      : { scaleY: 1, y: 0, x: 0 }))
              }
              transition={
                shouldBlink 
                  ? { duration: 0.14, ease: "easeInOut" } 
                  : { duration: 0.3 }
              }
              style={{ transformOrigin: "87px 115px" }}
            >
              {isInteracted ? (
                /* Happy Eye Arc */
                <path
                  d="M 73 120 C 77 106, 97 106, 101 120"
                  fill="none"
                  stroke="#1D212A"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  {/* Black Obsidian Eye Ball */}
                  <circle
                    cx="87"
                    cy="115"
                    r="16.8"
                    fill="#1C212D"
                  />
                  {/* Bottom Soft Navy Light Reflex */}
                  <ellipse
                    cx="87"
                    cy="126"
                    rx="8"
                    ry="3.5"
                    fill="#3B4459"
                    opacity="0.5"
                  />
                  {/* Main Big Round Gloss Highlight (Top-Left) */}
                  <circle
                    cx="81.5"
                    cy="109"
                    r="5.8"
                    fill="#FFFFFF"
                  />
                  {/* Secondary Small Round Gloss Highlight (Bottom-Right) */}
                  <circle
                    cx="93.5"
                    cy="121"
                    r="3.4"
                    fill="#FFFFFF"
                  />
                </>
              )}
            </motion.g>

            {/* Right Eye */}
            <motion.g
              animate={
                shouldBlink
                  ? { scaleY: 0.08 }
                  : (isInteracted || (effectiveSpeaking && !effectiveListening)
                    ? { scaleY: 0.95 }
                    : (effectiveThinking
                      ? { y: [0, -2.5, 0], x: [0, 1.5, 0] }
                      : { scaleY: 1, y: 0, x: 0 }))
              }
              transition={
                shouldBlink 
                  ? { duration: 0.14, ease: "easeInOut" } 
                  : { duration: 0.3 }
              }
              style={{ transformOrigin: "153px 115px" }}
            >
              {isInteracted ? (
                /* Happy Eye Arc */
                <path
                  d="M 139 120 C 143 106, 163 106, 167 120"
                  fill="none"
                  stroke="#1D212A"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  {/* Black Obsidian Eye Ball */}
                  <circle
                    cx="153"
                    cy="115"
                    r="16.8"
                    fill="#1C212D"
                  />
                  {/* Bottom Soft Navy Light Reflex */}
                  <ellipse
                    cx="153"
                    cy="126"
                    rx="8"
                    ry="3.5"
                    fill="#3B4459"
                    opacity="0.5"
                  />
                  {/* Main Big Round Gloss Highlight (Top-Left) */}
                  <circle
                    cx="147.5"
                    cy="109"
                    r="5.8"
                    fill="#FFFFFF"
                  />
                  {/* Secondary Small Round Gloss Highlight (Bottom-Right) */}
                  <circle
                    cx="159.5"
                    cy="121"
                    r="3.4"
                    fill="#FFFFFF"
                  />
                </>
              )}
            </motion.g>
          </g>

          {/* 8. Mouth (精致微小横线 / 开合呼吸) */}
          <g id="mouth">
            {effectiveSpeaking ? (
              <motion.ellipse
                animate={{
                  rx: [3.2, 5.2, 3.2, 5.8, 3.2],
                  ry: [2, 4.2, 2, 4.8, 2]
                }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
                cx="120"
                cy="140"
                fill="#3C3B3D"
              />
            ) : isInteracted ? (
              <path
                d="M 114 138 Q 120 144 126 138"
                fill="none"
                stroke="#3C3B3D"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            ) : effectiveListening ? (
              <ellipse
                cx="120"
                cy="139.5"
                rx="3.5"
                ry="2.4"
                fill="#3C3B3D"
              />
            ) : (
              /* Idle Delicate Small Line Mouth (图2：微小精致小横线) */
              <line
                x1="114"
                y1="139"
                x2="126"
                y2="139"
                stroke="#3C3B3D"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            )}
          </g>
        </svg>
      </div>
    </motion.div>
  );
};
