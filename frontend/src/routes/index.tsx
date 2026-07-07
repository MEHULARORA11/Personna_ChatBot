import { useState } from 'react';
import ThreeCanvas from '../components/ThreeCanvas';
import PersonaPicker from '../components/PersonaPicker';
import ChatPanel from '../components/ChatPanel';
import type { ChatMessage } from '../api/chat';

export default function IndexPage() {
  const [activePersona, setActivePersona] = useState<'hitesh' | 'piyush'>('hitesh');
  const [isTyping, setIsTyping] = useState(false);

  // Maintain separate local chat history lists for both Hitesh and Piyush
  const [chatHistories, setChatHistories] = useState<{
    hitesh: ChatMessage[];
    piyush: ChatMessage[];
  }>({
    hitesh: [],
    piyush: [],
  });

  const handleSendMessage = (content: string) => {
    setIsTyping(true);

    const newMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: newMsgId,
      sender: 'user',
      content,
    };

    const replyMsgId = `reply-${Date.now()}`;
    const initialReplyMsg: ChatMessage = {
      id: replyMsgId,
      sender: 'persona',
      content: '',
    };

    setChatHistories((prev) => ({
      ...prev,
      [activePersona]: [...prev[activePersona], userMsg, initialReplyMsg],
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
          content: lastMsg.content + chunk,
        };
        history[lastMsgIdx] = updatedMsg;
      }

      return {
        ...prev,
        [activePersona]: history,
      };
    });
  };

  const handleStreamComplete = () => {
    setIsTyping(false);
  };

  const handleStreamError = (_errorMsg: string) => {
    setIsTyping(false);

    // Custom error message based on active persona
    const customErrorMsg =
      activePersona === 'hitesh'
        ? 'nahin ji , ye ye sab nahin chalega yaha par, ye sawaal restricted hain'
        : 'are bhai, ye sab mat karo, ye saare sawaal allowed nahin hain .';

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
          isError: true,
        };
      } else {
        history.push({
          id: `error-${Date.now()}`,
          sender: 'persona',
          content: customErrorMsg,
          isError: true,
        });
      }

      return {
        ...prev,
        [activePersona]: history,
      };
    });
  };

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Dynamic 3D WebGL background particle sphere (desktop only) */}
      <ThreeCanvas activePersona={activePersona} />

      {/* Workspace */}
      <div className="max-w-4xl mx-auto w-full flex flex-col relative z-10 flex-1 min-h-0 px-4 sm:px-0 pb-4 sm:pb-6">
        {/* Mentor selector horizontal strip */}
        <div className="space-y-3 shrink-0">
          <div className="flex items-center justify-center">
            <h2 className="text-xs font-semibold text-text-muted font-mono uppercase tracking-wider text-center">
              Choose a mentor
            </h2>
          </div>
          <PersonaPicker
            activePersona={activePersona}
            onPersonaChange={(id) => {
              // Switching does NOT trigger a network request. It swaps the chat screen instantly.
              if (!isTyping) {
                setActivePersona(id);
              }
            }}
          />
          <p className="hidden md:block text-[11px] text-text-muted leading-relaxed text-center">
            <span className="font-medium text-text-primary">Note — </span>
            switching mentors keeps each conversation separate and local to this session.
          </p>
        </div>

        {/* Chat Panel Wrapper */}
        <div className="-mx-4 sm:mx-0 flex-1 min-h-0 mt-3">
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
