import React from 'react';
import { AiRobot } from './AiRobot';
import { ConversationState } from '../types';

interface IPCharacterProps {
  conversationState: ConversationState;
  isSpeaking: boolean;
  isBlinking: boolean;
  isVoiceActive: boolean;
  onClick: () => void;
  isDarkMode?: boolean;
}

export const IPCharacter: React.FC<IPCharacterProps> = ({ 
  conversationState, 
  isSpeaking, 
  isBlinking, 
  isVoiceActive,
  onClick,
  isDarkMode = false
}) => {
  return (
    <AiRobot 
      conversationState={conversationState}
      isSpeaking={isSpeaking}
      isBlinking={isBlinking}
      isVoiceActive={isVoiceActive}
      onClick={onClick}
      isDarkMode={isDarkMode}
      size="lg"
    />
  );
};
