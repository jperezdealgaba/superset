import React from 'react';
import { styled } from '@superset-ui/core';
import { Icons } from 'src/components/Icons';
import { Input } from 'antd-v5';

const DialogContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
`;

const DialogHeader = styled.div`
  padding: 16px;
  background-color: #1985a0;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #177690;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const DialogContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Message = styled.div<{ isUser?: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${props => (props.isUser ? '#1985a0' : '#f0f2f5')};
  color: ${props => (props.isUser ? 'white' : 'inherit')};
`;

const DialogFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f2f5;

  .ant-input-group {
    display: flex;
    gap: 8px;
  }

  .ant-input {
    border-radius: 20px;
  }

  button {
    border: none;
    background: none;
    color: #1985a0;
    cursor: pointer;
    padding: 0 8px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotDialog: React.FC<ChatbotDialogProps> = ({ isOpen, onClose }) => {
  const [messages] = React.useState([
    { text: 'Hello!', isUser: false },
    { text: 'How may I help you today?', isUser: false },
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (input.trim()) {
      // Here you would typically handle sending the message
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <DialogContainer isOpen={isOpen}>
      <DialogHeader onClick={onClose}>
        <h3>Chatbot</h3>
        <button onClick={handleCloseClick} aria-label="Close chat">
          <Icons.CloseOutlined />
        </button>
      </DialogHeader>
      <DialogContent>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
      </DialogContent>
      <DialogFooter>
        <Input.Group compact>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <button onClick={handleSend} aria-label="Send message">
            <Icons.RightOutlined />
          </button>
        </Input.Group>
      </DialogFooter>
    </DialogContainer>
  );
}; 