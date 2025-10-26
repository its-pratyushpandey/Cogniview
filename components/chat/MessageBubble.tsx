"use client";

import { motion } from "framer-motion";
import { User, Bot, AlertTriangle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: string;
  text: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  
  const getIcon = () => {
    if (isUser) return <User className="w-4 h-4" />;
    if (isError) return <AlertTriangle className="w-4 h-4" />;
    return <Bot className="w-4 h-4" />;
  };



  const getBubbleStyle = () => {
    if (isUser) return "premium-message-user ml-auto";
    if (isError) return "premium-message-error";
    return "premium-message-assistant";
  };

  const getAlignment = () => {
    return isUser ? "justify-end" : "justify-start";
  };

  return (
    <div className={`flex ${getAlignment()} w-full`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${getBubbleStyle()}`}
        style={{ minWidth: '100px', wordBreak: 'break-word' }}
      >
        <div className="flex items-start gap-2">
          <div className={`flex-shrink-0 mt-0.5 p-1.5 rounded-lg ${
            isUser ? 'bg-white/20' : isError ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="text-sm leading-relaxed">{message.text}</div>
            {message.timestamp && (
              <div className={`text-xs mt-1.5 ${
                isUser ? "text-white/70" : isError ? "text-red-600" : "text-gray-500"
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}