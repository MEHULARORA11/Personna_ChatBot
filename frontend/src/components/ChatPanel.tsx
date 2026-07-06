import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, Paperclip, Coffee, Terminal } from 'lucide-react';
import { sendChatMessage } from '../api/chat';
import type { ChatMessage } from '../api/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatPanelProps {
  activePersonaId: 'hitesh' | 'piyush';
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onReceiveChunk: (chunk: string) => void;
  onStreamComplete: () => void;
  onStreamError: (errorMsg: string) => void;
  isTyping: boolean;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      type="button"
      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white transition-colors cursor-pointer font-sans"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const MarkdownComponents = {
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !className;
    const codeString = String(children).replace(/\n$/, '');

    if (!isInline) {
      return (
        <div className="my-2.5 rounded-xl overflow-hidden border border-black/10 bg-[#1b1a17] text-zinc-100 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-black/20 text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
            <span>{match ? match[1] : 'code'}</span>
            <CopyButton text={codeString} />
          </div>
          <pre className="p-3.5 overflow-x-auto text-[11.5px] leading-relaxed">
            <code>{codeString}</code>
          </pre>
        </div>
      );
    }
    return (
      <code
        className="bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono text-[12px]"
        {...props}
      >
        {children}
      </code>
    );
  },
  p({ children }: any) {
    return <p className="mb-2 last:mb-0 leading-relaxed text-[14.5px]">{children}</p>;
  },
  ul({ children }: any) {
    return <ul className="list-disc pl-5 mb-2.5 space-y-1 text-[14.5px]">{children}</ul>;
  },
  ol({ children }: any) {
    return <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-[14.5px]">{children}</ol>;
  },
  li({ children }: any) {
    return <li className="leading-relaxed">{children}</li>;
  },
  h1({ children }: any) {
    return <h1 className="text-base font-semibold mt-3 mb-1.5 font-display">{children}</h1>;
  },
  h2({ children }: any) {
    return <h2 className="text-[15px] font-semibold mt-2.5 mb-1.5 font-display">{children}</h2>;
  },
  h3({ children }: any) {
    return <h3 className="text-sm font-semibold mt-2 mb-1 font-display">{children}</h3>;
  },
  a({ href, children }: any) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-2 hover:text-accent-hover font-medium transition-colors"
      >
        {children}
      </a>
    );
  },
  blockquote({ children }: any) {
    return (
      <blockquote className="border-l-2 border-accent/40 pl-3.5 py-0.5 my-2 italic text-text-muted">
        {children}
      </blockquote>
    );
  },
  table({ children }: any) {
    return (
      <div className="overflow-x-auto my-3 border border-border-main rounded-xl">
        <table className="min-w-full divide-y divide-border-main text-xs text-left">{children}</table>
      </div>
    );
  },
  thead({ children }: any) {
    return <thead className="bg-bg-base text-text-muted uppercase font-semibold text-[10px] tracking-wider">{children}</thead>;
  },
  tbody({ children }: any) {
    return <tbody className="divide-y divide-border-main">{children}</tbody>;
  },
  tr({ children }: any) {
    return <tr>{children}</tr>;
  },
  th({ children }: any) {
    return <th className="px-3.5 py-2.5 font-semibold">{children}</th>;
  },
  td({ children }: any) {
    return <td className="px-3.5 py-2.5 text-text-muted leading-normal">{children}</td>;
  },
};

export default function ChatPanel({
  activePersonaId,
  messages,
  onSendMessage,
  onReceiveChunk,
  onStreamComplete,
  onStreamError,
  isTyping,
}: ChatPanelProps) {
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const lastPersonaRef = useRef<'hitesh' | 'piyush'>(activePersonaId);

  useEffect(() => {
    // Show toast when the persona changes
    if (lastPersonaRef.current !== activePersonaId) {
      const isHitesh = activePersonaId === 'hitesh';
      setToastMessage(isHitesh ? 'Chai Mode active' : 'Engine Mode active');
      lastPersonaRef.current = activePersonaId;

      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activePersonaId]);

  // Auto-scroll to the bottom of the message container when a message is added or updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Adjust textarea height automatically based on typing length
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputVal]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const messageText = inputVal.trim();
    if (!messageText || isTyping) return;

    // Trigger sending callback
    onSendMessage(messageText);

    // Clear the input field immediately
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Call API helper for streaming
    sendChatMessage({
      persona: activePersonaId,
      message: messageText,
      onChunk: (chunk) => {
        onReceiveChunk(chunk);
      },
      onError: (errMsg) => {
        onStreamError(errMsg);
      },
      onComplete: () => {
        onStreamComplete();
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter, but allow shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Get time-based greeting for Personic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: '☕' };
    if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: '☀️' };
    if (hour >= 17 && hour < 21) return { text: 'Good evening', icon: '🌆' };
    return { text: 'Good night', icon: '🌙' };
  };

  const greeting = getGreeting();
  const isHitesh = activePersonaId === 'hitesh';
  const accentVar = isHitesh ? 'var(--accent)' : 'var(--engine)';

  return (
    <div
      className="flex flex-col h-[calc(100dvh-4rem)] sm:h-[680px] lg:h-[720px] sm:rounded-2xl sm:border sm:shadow-sm overflow-hidden relative bg-bg-surface"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -12, x: '-50%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute top-4 left-1/2 z-30 pointer-events-none"
          >
            <div
              className="px-3.5 py-1.5 rounded-full border shadow-sm text-xs font-medium flex items-center gap-1.5 bg-bg-surface"
              style={{ borderColor: accentVar, color: accentVar }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentVar }} />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Header */}
      <div
        className="px-4 sm:px-6 py-3.5 sm:py-4 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border shrink-0" style={{ borderColor: 'var(--border)' }}>
            <img
              src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
              alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold font-display leading-none truncate">
              {isHitesh ? 'Hitesh Sir' : 'Piyush Sir'}
            </h2>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </p>
          </div>
        </div>
        <div
          className="hidden xs:flex px-2.5 py-1 rounded-full border text-[11px] font-mono items-center gap-1.5 shrink-0"
          style={{ borderColor: accentVar, color: accentVar }}
        >
          {isHitesh ? <Coffee className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
          <span>{isHitesh ? 'Chai Mode' : 'Engine Mode'}</span>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3 select-none">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 mb-1" style={{ borderColor: accentVar }}>
              <img
                src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
                alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-semibold font-display leading-tight">
                {greeting.text}, I&apos;m Personic {greeting.icon}
              </h3>
              <p className="text-sm text-text-muted max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                Ask a coding question and {isHitesh ? 'Hitesh' : 'Piyush'} will answer in their own voice.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0" style={{ borderColor: 'var(--border)' }}>
                        <img
                          src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
                          alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed ${
                        isUser
                          ? 'text-white rounded-br-md'
                          : msg.isError
                          ? 'bg-red-500/10 text-red-500 rounded-bl-md font-medium flex items-center gap-2 border border-red-500/20'
                          : 'bg-bg-base border rounded-bl-md text-text-primary'
                      }`}
                      style={
                        isUser
                          ? { backgroundColor: 'var(--bubble-user)' }
                          : !msg.isError
                          ? { borderColor: 'var(--border)' }
                          : undefined
                      }
                    >
                      {msg.isError && <AlertCircle className="w-4 h-4 flex-shrink-0" />}

                      {isUser || msg.isError ? (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents as any}>
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end gap-2.5 justify-start"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <img
                    src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
                    alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-base)' }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ backgroundColor: 'var(--text-muted)', animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t shrink-0 pb-safe"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className={`flex items-end gap-2 rounded-2xl border p-2 pl-3.5 transition-shadow duration-200 focus-within:ring-2 ${
            isHitesh ? 'focus-within:ring-accent/30' : 'focus-within:ring-engine/30'
          }`}
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-base)',
          }}
        >
          <button
            type="button"
            className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors cursor-pointer shrink-0 mb-0.5"
            title="Attach a file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? 'Waiting for reply…' : `Message ${isHitesh ? 'Hitesh Sir' : 'Piyush Sir'}…`}
            disabled={isTyping}
            className="flex-1 bg-transparent border-0 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-0 resize-none min-h-[24px] max-h-[200px] leading-relaxed"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="p-2.5 rounded-full text-white transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            style={{ backgroundColor: accentVar }}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10.5px] text-text-muted text-center mt-2.5 font-mono hidden sm:block">
          Enter to send &bull; Shift+Enter for a new line
        </p>
      </form>
    </div>
  );
}
