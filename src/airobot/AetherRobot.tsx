import React from 'react';
import { AiRobot } from './AiRobot';

interface AetherRobotProps {
  isSpeaking: boolean;
  isBlinking: boolean;
  isChatOpen: boolean;
  onClick: () => void;
  conversationState?: 'idle' | 'listening' | 'thinking' | 'speaking';
  isVoiceActive?: boolean;
  isDarkMode?: boolean;
}

export const AetherRobot: React.FC<AetherRobotProps> = ({
  isSpeaking,
  isBlinking,
  isChatOpen,
  onClick,
  conversationState = 'idle',
  isVoiceActive = false,
  isDarkMode = false,
}) => {
  return (
    <AiRobot 
      isSpeaking={isSpeaking}
      isBlinking={isBlinking}
      isChatOpen={isChatOpen}
      onClick={onClick}
      conversationState={conversationState}
      isVoiceActive={isVoiceActive}
      isDarkMode={isDarkMode}
      size="lg"
    />
  );
};
