import React from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ChatPage: React.FC = () => {
  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      <DisclaimerBanner compact />
      <ChatInterface />
    </div>
  );
};
