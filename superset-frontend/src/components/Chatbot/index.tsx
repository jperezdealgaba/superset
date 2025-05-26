import React, { useState } from 'react';
import { ChatbotButton } from './ChatbotButton';
import { ChatbotDialog } from './ChatbotDialog';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatbotButton onClick={handleToggle} isOpen={isOpen} />
      <ChatbotDialog isOpen={isOpen} onClose={handleToggle} />
    </>
  );
}; 