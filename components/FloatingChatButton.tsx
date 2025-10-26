"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("./chat/ChatWindow"), { ssr: false });

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-[9999] flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer'
        }}
      >
        <MessageSquare className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with Kiki AI
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 border-l-4 border-l-gray-900 border-t-2 border-b-2 border-t-transparent border-b-transparent" />
        </div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[9998]"
              style={{ zIndex: 9998 }}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[9999]"
              style={{ 
                zIndex: 9999,
                width: '350px',
                height: '550px',
                right: '60px',
                bottom: '90px'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-[10000] border border-gray-200"
                style={{ zIndex: 10000 }}
              >
                <X className="w-3 h-3" />
              </button>
              
              <ChatWindow />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}