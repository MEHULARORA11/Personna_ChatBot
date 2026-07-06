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
    <div className="flex-1 flex flex-col relative">
      {/* Dynamic 3D WebGL background particle sphere (desktop only) */}
      <ThreeCanvas activePersona={activePersona} />

      {/* Hero — hidden on mobile to give the chat full height */}
      <div className="hidden sm:block text-center max-w-xl mx-auto mb-6 space-y-2 z-10 px-4">
        <span
          className="inline-block px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider uppercase font-medium"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          AI Interview Series
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-display leading-tight">
          Talk to your coding mentors
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto">
          Ask questions, get explanations, or just chat — in Hitesh&apos;s or Piyush&apos;s own voice.
        </p>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start relative z-10 flex-1 px-4 sm:px-0 pb-4 sm:pb-0">
        {/* Left: mentor picker — collapses above the chat on mobile */}
        <div className="lg:col-span-4 flex flex-col gap-5 order-1">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-text-muted font-mono uppercase tracking-wider">
              Choose a mentor
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

          <div
            className="hidden lg:block p-4 rounded-2xl border text-xs text-text-muted leading-relaxed"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="font-medium text-text-primary">Note — </span>
            switching mentors keeps each conversation separate and local to this session.
          </div>
        </div>

        {/* Right: chat */}
        <div className="lg:col-span-8 order-2 -mx-4 sm:mx-0">
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
