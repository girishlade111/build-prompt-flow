import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Pin, 
  Copy, 
  Trash2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isPinned?: boolean;
}

interface ChatPanelProps {
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to Lade Coder! I\'m your AI assistant. Describe your website idea, and I\'ll help you build it step by step.',
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand you want to create something amazing! Let me help you with that. I\'ll start generating the code based on your requirements.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isPinned: !msg.isPinned }
          : msg
      )
    );
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ready to help you build</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "group relative",
                  message.type === 'user' ? "ml-8" : "mr-8"
                )}
              >
                <div className={cn(
                  "flex gap-3",
                  message.type === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  {/* Avatar */}
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    message.type === 'user' 
                      ? "bg-accent text-accent-foreground" 
                      : "gradient-primary text-white"
                  )}>
                    {message.type === 'user' ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={cn(
                    "flex-1 space-y-1",
                    message.type === 'user' ? "text-right" : "text-left"
                  )}>
                    <div className={cn(
                      "inline-block px-4 py-2 rounded-2xl text-sm",
                      message.type === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                      message.isPinned && "ring-2 ring-accent/50"
                    )}>
                      {message.content}
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-2 text-xs text-muted-foreground",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isPinned && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          Pinned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message Actions */}
                <div className={cn(
                  "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  "flex items-center gap-1",
                  message.type === 'user' ? "-left-16" : "-right-16"
                )}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePinMessage(message.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Pin className={cn(
                      "w-3 h-3",
                      message.isPinned && "text-accent"
                    )} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyMessage(message.content)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMessage(message.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-3 mr-8"
              >
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-muted px-4 py-2 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask me anything or provide feedback..."
            className="flex-1 bg-background-secondary border-border"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || isTyping}
            className="gradient-primary text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};