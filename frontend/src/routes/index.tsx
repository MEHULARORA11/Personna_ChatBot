import { useState } from 'react';
import ThreeCanvas from '../components/ThreeCanvas';
import PersonaPicker from '../components/PersonaPicker';
import ChatPanel from '../components/ChatPanel';
import type { ChatMessage } from '../api/chat';
import { motion } from 'framer-motion';

export default function IndexPage() {
  const [activePersona, setActivePersona] = useState<'hitesh' | 'piyush'>('hitesh');
  const [isTyping, setIsTyping] = useState(false);

  // Maintain separate local chat history lists for both Hitesh and Piyush
  const [chatHistories, setChatHistories] = useState<{
    hitesh: ChatMessage[];
    piyush: ChatMessage[];
  }>({
    hitesh: [],
    piyush: []
  });

  const handleSendMessage = (content: string) => {
    setIsTyping(true);

    const newMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: newMsgId,
      sender: 'user',
      content
    };

    const replyMsgId = `reply-${Date.now()}`;
    const initialReplyMsg: ChatMessage = {
      id: replyMsgId,
      sender: 'persona',
      content: ''
    };

    setChatHistories((prev) => ({
      ...prev,
      [activePersona]: [...prev[activePersona], userMsg, initialReplyMsg]
    }));
  };

  const handleReceiveChunk = (chunk: string) => {
    setChatHistories((prev) => {
      const history = [...prev[activePersona]];
      if (history.length === 0) return prev;

      // Find the last message (which is our empty persona placeholder) and append the chunk
      const lastMsgIdx = history.length - 1;
      const lastMsg = history[lastMsgIdx];
      if (lastMsg && lastMsg.sender === 'persona') {
        const updatedMsg = {
          ...lastMsg,
          content: lastMsg.content + chunk
        };
        history[lastMsgIdx] = updatedMsg;
      }

      return {
        ...prev,
        [activePersona]: history
      };
    });
  };

  const handleStreamComplete = () => {
    setIsTyping(false);
  };

  const handleStreamError = (_errorMsg: string) => {
    setIsTyping(false);

    // Custom error message based on active persona
    const customErrorMsg = activePersona === 'hitesh'
      ? "nahin ji , ye ye sab nahin chalega yaha par, ye sawaal restricted hain"
      : "are bhai, ye sab mat karo, ye saare sawaal allowed nahin hain .";

    setChatHistories((prev) => {
      const history = [...prev[activePersona]];
      if (history.length === 0) return prev;

      const lastMsgIdx = history.length - 1;
      const lastMsg = history[lastMsgIdx];
      
      // If the last message is empty and failed, replace it with an error bubble.
      // Otherwise, create a new error message bubble.
      if (lastMsg && lastMsg.sender === 'persona' && lastMsg.content === '') {
        history[lastMsgIdx] = {
          id: lastMsg.id,
          sender: 'persona',
          content: customErrorMsg,
          isError: true
        };
      } else {
        history.push({
          id: `error-${Date.now()}`,
          sender: 'persona',
          content: customErrorMsg,
          isError: true
        });
      }

      return {
        ...prev,
        [activePersona]: history
      };
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative min-h-[calc(100vh-10rem)] py-4">
      {/* Dynamic 3D WebGL Background particle sphere */}
      <ThreeCanvas activePersona={activePersona} />

      {/* Hero Welcome / Intro */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl mx-auto mb-8 space-y-3 z-10"
      >
        <span className="px-3 py-1 rounded-full border border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5 text-xs font-mono tracking-wider uppercase font-semibold">
          AI Interview Series
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-display leading-tight">
          Interact with Coding Mentors
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Ask questions, get weather details, or search for video tutorials. Responses are styled after real mentors using Hinglish tone behaviors.
        </p>
      </motion.div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10 flex-1">
        {/* Left Side: Selector and Bio Info */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-wider">
              Choose AI Mentor
            </h2>
            <PersonaPicker
              activePersona={activePersona}
              onPersonaChange={(id) => {
                // Switching does NOT trigger a network request. It swaps the chat screen instantly.
                if (!isTyping) {
                  setActivePersona(id);
                }
              }}
            />
          </div>

          {/* Prompt/Sponsorship Tip */}
          <div className="hidden lg:block p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/20 dark:bg-black/20 text-xs text-zinc-500 leading-relaxed font-mono">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">SYSTEM NOTE:</span> Switching mentors preserves conversation history locally. Cookies manage context in 30-second sliding windows.
          </div>
        </div>

        {/* Right Side: Chat Arena */}
        <div className="lg:col-span-7">
          <ChatPanel
            activePersonaId={activePersona}
            messages={chatHistories[activePersona]}
            onSendMessage={handleSendMessage}
            onReceiveChunk={handleReceiveChunk}
            onStreamComplete={handleStreamComplete}
            onStreamError={handleStreamError}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
}
