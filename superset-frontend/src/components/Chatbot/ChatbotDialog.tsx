import React, { useState, useEffect } from 'react';
import { styled, css } from '@superset-ui/core';
import { Icons } from 'src/components/Icons';
import { Input, Dropdown } from 'antd-v5';
import type { MenuProps } from 'antd-v5';
import { Resizable } from 're-resizable';

type DisplayMode = 'overlay' | 'dock' | 'fullscreen';

interface DialogContainerProps {
  isOpen: boolean;
  mode: DisplayMode;
}

const ResizableWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 1000;

  .resizable-chatbot {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 8px;
  }
`;

const DialogContainer = styled.div<DialogContainerProps>`
  position: fixed;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
  transform-origin: bottom right;

  ${({ mode }) => {
    switch (mode) {
      case 'fullscreen':
        return css`
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          border-radius: 0;
        `;
      case 'dock':
        return css`
          top: 0;
          right: 0;
          width: 25%;
          height: 100vh;
          border-radius: 0;
        `;
      case 'overlay':
      default:
        return css`
          display: none;
        `;
    }
  }}
`;

const DialogHeader = styled.div`
  padding: 16px;
  background-color: #1985a0;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: #177690;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;

    .anticon {
      color: white;
    }
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

    svg {
      color: white;
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

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

interface Message {
  text: string;
  isUser: boolean;
  isClickable?: boolean;
}

interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const Message = styled.div<{ isUser?: boolean; isClickable?: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${props => (props.isUser ? '#1985a0' : '#f0f2f5')};
  color: ${props => (props.isUser ? 'white' : 'inherit')};
  cursor: ${props => (props.isClickable ? 'pointer' : 'default')};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    ${props => props.isClickable && `
      background-color: ${props.isUser ? '#1a7b93' : '#e6e8eb'};
    `}
  }

  .message-icon {
    display: flex;
    align-items: center;
    opacity: 0.7;
    font-size: 14px;
  }
`;

const DialogFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f2f5;
  background: white;

  .input-container {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 11px;
  }

  .ant-input {
    border: none;
    padding: 0;
    box-shadow: none;
    
    &:focus {
      box-shadow: none;
    }
  }

  button {
    border: none;
    background: none;
    color: #1985a0;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 0.8;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const ChatbotDialog: React.FC<ChatbotDialogProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = React.useState<Message[]>([
    { text: 'Hello!', isUser: false },
    { text: 'How may I help you today?', isUser: false },
    { text: 'Here are a couple suggestions for you:', isUser: false },
    { text: 'What is the aggregate risk picture for Kubernetes 1.24', isUser: false, isClickable: true },
    { text: 'What vulnerabilities or CWEs are the most important to fix before the next release of Kubernetes?', isUser: false, isClickable: true },
  ]);
  const [input, setInput] = React.useState('');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('overlay');
  const [size, setSize] = useState({ width: 350, height: 500 });
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { text: input.trim(), isUser: true };
      setMessages(prev => [...prev, newMessage]);
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

  const handleMessageClick = (message: Message) => {
    if (message.isClickable) {
      setInput(message.text);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'overlay',
      label: 'Overlay',
      icon: displayMode === 'overlay' ? <Icons.CheckOutlined /> : null,
      onClick: () => setDisplayMode('overlay'),
    },
    {
      key: 'dock',
      label: 'Dock to window',
      icon: displayMode === 'dock' ? <Icons.CheckOutlined /> : null,
      onClick: () => setDisplayMode('dock'),
    },
    {
      key: 'fullscreen',
      label: 'Fullscreen',
      icon: displayMode === 'fullscreen' ? <Icons.CheckOutlined /> : null,
      onClick: () => setDisplayMode('fullscreen'),
    },
  ];

  return displayMode === 'overlay' ? (
    <ResizableWrapper style={{ display: isOpen ? 'block' : 'none' }}>
      <Resizable
        size={size}
        minWidth={300}
        minHeight={400}
        maxWidth={800}
        maxHeight={800}
        enable={{
          top: true,
          right: false,
          bottom: true,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: true,
          topLeft: true,
        }}
        onResizeStop={(e, direction, ref, d) => {
          setSize({
            width: size.width + d.width,
            height: size.height + d.height,
          });
        }}
        className="resizable-chatbot"
      >
        <DialogHeader onClick={onClose}>
          <h3>Chatbot</h3>
          <div className="header-actions" onClick={e => e.stopPropagation()}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <button onClick={e => e.stopPropagation()} aria-label="Menu">
                <Icons.EllipsisOutlined />
              </button>
            </Dropdown>
            <button onClick={handleCloseClick} aria-label="Close chat">
              <Icons.CloseOutlined />
            </button>
          </div>
        </DialogHeader>
        <DialogContent ref={contentRef}>
          {messages.map((message, index) => (
            <Message 
              key={index} 
              isUser={message.isUser} 
              isClickable={message.isClickable}
              onClick={() => handleMessageClick(message)}
            >
              <span>{message.text}</span>
              {message.isClickable && (
                <span className="message-icon">
                  <Icons.RightOutlined />
                </span>
              )}
            </Message>
          ))}
        </DialogContent>
        <DialogFooter>
          <div className="input-container">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              autoComplete="off"
              bordered={false}
            />
            <button onClick={handleSend} aria-label="Send message">
              <Icons.RightOutlined />
            </button>
          </div>
        </DialogFooter>
      </Resizable>
    </ResizableWrapper>
  ) : (
    <DialogContainer isOpen={isOpen} mode={displayMode}>
      <DialogHeader onClick={onClose}>
        <h3>Chatbot</h3>
        <div className="header-actions" onClick={e => e.stopPropagation()}>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <button onClick={e => e.stopPropagation()} aria-label="Menu">
              <Icons.EllipsisOutlined />
            </button>
          </Dropdown>
          <button onClick={handleCloseClick} aria-label="Close chat">
            <Icons.CloseOutlined />
          </button>
        </div>
      </DialogHeader>
      <DialogContent ref={contentRef}>
        {messages.map((message, index) => (
          <Message 
            key={index} 
            isUser={message.isUser} 
            isClickable={message.isClickable}
            onClick={() => handleMessageClick(message)}
          >
            <span>{message.text}</span>
            {message.isClickable && (
              <span className="message-icon">
                <Icons.RightOutlined />
              </span>
            )}
          </Message>
        ))}
      </DialogContent>
      <DialogFooter>
        <div className="input-container">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            autoComplete="off"
            bordered={false}
          />
          <button onClick={handleSend} aria-label="Send message">
            <Icons.RightOutlined />
          </button>
        </div>
      </DialogFooter>
    </DialogContainer>
  );
}; 