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
    if (isUser) return "bg-blue-600 text-white ml-auto";
    if (isError) return "bg-red-50 text-red-800 border border-red-200";
    return "bg-white text-gray-800 border border-gray-200";
  };

  const getAlignment = () => {
    return isUser ? "justify-end" : "justify-start";
  };

  return (
    <div className={`flex ${getAlignment()}`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${getBubbleStyle()}`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="text-sm whitespace-pre-wrap">{message.text}</div>
            {message.timestamp && (
              <div className={`text-xs mt-1 ${
                isUser ? "text-blue-200" : isError ? "text-red-500" : "text-gray-500"
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}