import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, Sparkles, Terminal, Coffee } from 'lucide-react';
import { sendChatMessage } from '../api/chat';
import type { ChatMessage } from '../api/chat';
import { animate } from 'animejs';
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
      className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all flex items-center gap-1 cursor-pointer font-sans"
    >
      {copied ? 'Copied!' : 'Copy'}
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
        <div className="my-2.5 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-zinc-950 text-zinc-100 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800/80 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            <span>{match ? match[1] : 'code'}</span>
            <CopyButton text={codeString} />
          </div>
          <pre className="p-3.5 overflow-x-auto scrollbar-thin text-[11px] leading-relaxed">
            <code>{codeString}</code>
          </pre>
        </div>
      );
    }
    return (
      <code className="bg-zinc-100 dark:bg-zinc-800/60 text-orange-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono text-[11px] border border-zinc-200 dark:border-zinc-800/50" {...props}>
        {children}
      </code>
    );
  },
  p({ children }: any) {
    return <p className="mb-2 last:mb-0 leading-relaxed text-sm">{children}</p>;
  },
  ul({ children }: any) {
    return <ul className="list-disc pl-5 mb-2.5 space-y-1 text-sm">{children}</ul>;
  },
  ol({ children }: any) {
    return <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-sm">{children}</ol>;
  },
  li({ children }: any) {
    return <li className="leading-relaxed">{children}</li>;
  },
  h1({ children }: any) {
    return <h1 className="text-base font-bold mt-3 mb-1.5 text-zinc-950 dark:text-zinc-50">{children}</h1>;
  },
  h2({ children }: any) {
    return <h2 className="text-sm font-bold mt-2.5 mb-1.5 text-zinc-950 dark:text-zinc-50">{children}</h2>;
  },
  h3({ children }: any) {
    return <h3 className="text-xs font-bold mt-2 mb-1 text-zinc-950 dark:text-zinc-50">{children}</h3>;
  },
  a({ href, children }: any) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 underline hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors">
        {children}
      </a>
    );
  },
  blockquote({ children }: any) {
    return (
      <blockquote className="border-l-3 border-zinc-300 dark:border-zinc-700 pl-3.5 py-1 my-2 italic text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-r-lg">
        {children}
      </blockquote>
    );
  },
  table({ children }: any) {
    return (
      <div className="overflow-x-auto my-3 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-xs text-left">{children}</table>
      </div>
    );
  },
  thead({ children }: any) {
    return <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 uppercase font-semibold text-[10px] tracking-wider">{children}</thead>;
  },
  tbody({ children }: any) {
    return <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/40 bg-white dark:bg-zinc-950/20">{children}</tbody>;
  },
  tr({ children }: any) {
    return <tr className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">{children}</tr>;
  },
  th({ children }: any) {
    return <th className="px-4 py-2.5 font-bold border-b border-zinc-200 dark:border-zinc-800">{children}</th>;
  },
  td({ children }: any) {
    return <td className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/60 text-zinc-600 dark:text-zinc-400 leading-normal">{children}</td>;
  }
};

export default function ChatPanel({
  activePersonaId,
  messages,
  onSendMessage,
  onReceiveChunk,
  onStreamComplete,
  onStreamError,
  isTyping
}: ChatPanelProps) {
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const lastPersonaRef = useRef<'hitesh' | 'piyush'>(activePersonaId);

  useEffect(() => {
    // Show toast when the persona changes
    if (lastPersonaRef.current !== activePersonaId) {
      const isHitesh = activePersonaId === 'hitesh';
      setToastMessage(isHitesh ? 'Chai Mode Active ☕' : 'Engine Mode Active 🚀');
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
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

    // AnimeJS micro-interaction: Bounce effect on the send button
    if (sendBtnRef.current) {
      animate(sendBtnRef.current, {
        scale: [1, 0.8, 1.1, 1],
        duration: 400,
        ease: 'easeOutElastic(1, .5)'
      });
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
      }
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

  // Define accent colors depending on the active persona
  const themeAccentClass = isHitesh 
    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
    : 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';

  const themeBtnBg = isHitesh
    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
    : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20';

  return (
    <div className="flex flex-col h-[650px] md:h-[720px] bg-white/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-20 left-1/2 z-30 pointer-events-none"
          >
            <div className={`px-4 py-2 rounded-full border shadow-lg text-xs font-semibold tracking-wide font-mono flex items-center gap-2 backdrop-blur-md ${
              isHitesh 
                ? 'bg-amber-50/95 border-amber-200 text-amber-800 dark:bg-amber-950/95 dark:border-amber-900 dark:text-amber-300 shadow-amber-500/10'
                : 'bg-cyan-50/95 border-cyan-200 text-cyan-800 dark:bg-cyan-950/95 dark:border-cyan-900 dark:text-cyan-300 shadow-cyan-500/10'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isHitesh ? 'bg-amber-500' : 'bg-cyan-500'}`} />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-900 bg-white/40 dark:bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0 shadow-sm">
            <img
              src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
              alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-display flex items-center gap-1.5 leading-none">
              Chatting with {isHitesh ? 'Hitesh Sir' : 'Piyush Sir'}
              <span className="text-xs px-2 py-0.5 rounded-full border text-[10px] font-mono leading-none tracking-wider uppercase bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                AI Agent
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`} />
              Active memory (30s auto-refresh)
            </p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${themeAccentClass}`}>
          {isHitesh ? <Coffee className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
          <span>{isHitesh ? 'Chai Mode' : 'Engine Mode'}</span>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8 space-y-4 select-none">
            {/* Title Greeting with gradient and signature */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-3xl md:text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                {greeting.text}, I'm Personic {greeting.icon}
              </motion.div>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto font-sans leading-relaxed font-medium">
                Your smart AI coding mentor chatbot. Choose a mentor on the left to start learning, code auditing, or system modeling.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Persona Avatar on Left */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0 mt-1 shadow-sm">
                        <img
                          src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
                          alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4.5 py-3 text-sm leading-relaxed shadow-sm border ${
                        isUser
                          ? 'bg-zinc-900 border-zinc-800 text-white rounded-tr-none dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900 ml-auto'
                          : msg.isError
                          ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 rounded-tl-none font-medium flex items-center gap-2'
                          : 'bg-white border-zinc-200 text-zinc-800 rounded-tl-none dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-200'
                      }`}
                    >
                      {msg.isError && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      
                      {isUser || msg.isError ? (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          components={MarkdownComponents as any}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>

                    {/* User Avatar on Right */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-700 dark:text-zinc-300 text-xs font-bold mt-1 border border-zinc-300/40 dark:border-zinc-700/40">
                        ME
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Custom Streaming Typing Indicator */}
            {isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0 mt-1">
                  <img
                    src={isHitesh ? '/hitesh.png' : '/piyush.jpg'}
                    alt={isHitesh ? 'Hitesh Choudhary' : 'Piyush Garg'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white border border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Form */}
      <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-zinc-200 dark:border-zinc-900 bg-white/40 dark:bg-black/40">
        <div className="relative flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-inner focus-within:ring-2 focus-within:ring-amber-500/30 dark:focus-within:ring-cyan-500/30 transition-all duration-300 max-w-3xl mx-auto">
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? 'Waiting for reply...' : `Message ${isHitesh ? 'Hitesh Sir' : 'Piyush Sir'}...`}
            disabled={isTyping}
            className={`w-full bg-transparent border-0 p-1.5 text-sm placeholder-zinc-400 dark:placeholder-zinc-600 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-0 resize-none min-h-[50px] max-h-[180px] leading-relaxed pr-10`}
          />
          
          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900/50 pt-2.5 mt-2">
            {/* Decorative Claude/ChatGPT styled utility buttons */}
            <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                title="Add attachment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0l-3.536 3.536m3.536-3.536L13.5 13.5m-6-6l3.536 3.536m0 0L7.5 14.5m3.536-3.536L16.5 7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                title="Use prompt templates"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-20"
                title="Clear input text"
                onClick={() => setInputVal('')}
                disabled={!inputVal}
              >
                <span className="text-[11px] font-semibold font-sans">Clear</span>
              </button>
            </div>
            
            {/* Send Button and Instructions */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                Shift+Enter for new line
              </span>
              <button
                ref={sendBtnRef}
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className={`p-2.5 rounded-xl text-white transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md ${themeBtnBg}`}
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 text-center mt-3 font-mono">
          Personic &bull; Response streams are live &bull; Preserves history locally
        </p>
      </form>
    </div>
  );
}
