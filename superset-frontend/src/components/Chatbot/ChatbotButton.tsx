import React from 'react';
import { styled } from '@superset-ui/core';
import { Icons } from 'src/components/Icons';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #1985a0;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick, isOpen }) => (
  <FloatingButton onClick={onClick} aria-label={isOpen ? 'Close chat' : 'Open chat'}>
    {!isOpen ? <Icons.CommentOutlined /> : <Icons.DownOutlined />}
  </FloatingButton>
); 