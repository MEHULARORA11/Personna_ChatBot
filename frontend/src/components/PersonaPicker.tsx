import { motion } from 'framer-motion';
import { Coffee, Terminal } from 'lucide-react';

export interface Persona {
  id: 'hitesh' | 'piyush';
  name: string;
  role: string;
  bio: string;
  youtube: string;
  subscribers: string;
  signatureEmoji: string;
  avatarUrl: string;
}

const PERSONAS: Persona[] = [ 
  {
    id: 'hitesh',
    name: 'Hitesh Choudhary',
    role: 'Coding Mentor & Chai Lover',
    bio: 'Ex-PW, iNeuron CTO. Builds ChaiCode & Masterji.co. Teaches with intuition-first, conversational Hinglish explanations.',
    youtube: 'Chai aur Code',
    subscribers: '1.8M+ subs',
    signatureEmoji: '☕',
    avatarUrl: '/hitesh.png',
  },
  {
    id: 'piyush',
    name: 'Piyush Garg',
    role: 'System Design & Backend Enthusiast',
    bio: 'Startup engineer and event-driven architecture enthusiast. High-energy livestreaming teacher.',
    youtube: 'Code with Piyush',
    subscribers: '1M+ subs',
    signatureEmoji: '🚀',
    avatarUrl: '/piyush.jpg',
  },
];

interface PersonaPickerProps {
  activePersona: 'hitesh' | 'piyush';
  onPersonaChange: (id: 'hitesh' | 'piyush') => void;
}

export default function PersonaPicker({ activePersona, onPersonaChange }: PersonaPickerProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Desktop / tablet: horizontal card grid */}
      <div className="hidden md:grid grid-cols-2 gap-3 max-w-2xl w-full mx-auto">
        {PERSONAS.map((persona) => {
          const isActive = activePersona === persona.id;
          const isHitesh = persona.id === 'hitesh';
          return (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className={`text-left w-full p-2.5 sm:p-3 rounded-xl border transition-all duration-200 relative flex items-center gap-3 cursor-pointer ${
                isActive
                  ? 'bg-bg-surface border-transparent shadow-md'
                  : 'bg-transparent border-border-main hover:border-text-muted/40 hover:bg-bg-surface/50'
              }`}
              style={
                isActive
                  ? { boxShadow: `0 0 0 1.5px ${isHitesh ? 'var(--accent)' : 'var(--engine)'}` }
                  : undefined
              }
              aria-pressed={isActive}
            >
              <div className="relative shrink-0">
                <div
                  className={`w-9.5 h-9.5 rounded-full overflow-hidden border transition-colors ${
                    isActive ? 'border-transparent' : 'border-border-main'
                  }`}
                >
                  <img
                    src={persona.avatarUrl}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border flex items-center justify-center text-[9px]"
                    style={{
                      borderColor: 'var(--bg-surface)',
                      backgroundColor: isHitesh ? 'var(--accent)' : 'var(--engine)',
                    }}
                  >
                    {isHitesh ? <Coffee className="w-2.5 h-2.5 text-white" /> : <Terminal className="w-2.5 h-2.5 text-white" />}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-[14.5px] font-semibold text-text-primary flex items-center gap-1.5 font-display truncate">
                  {persona.name}
                  <span className="text-xs">{persona.signatureEmoji}</span>
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5 truncate">{persona.role}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile: compact segmented switcher */}
      <div className="md:hidden flex gap-1.5 p-1.5 bg-bg-surface border border-border-main rounded-2xl">
        {PERSONAS.map((persona) => {
          const isActive = activePersona === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className="flex-1 relative py-2.5 rounded-xl cursor-pointer"
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-xl bg-bg-base border border-border-main"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full overflow-hidden border border-border-main shrink-0">
                  <img src={persona.avatarUrl} alt={persona.name} className="w-full h-full object-cover" />
                </span>
                <span className={`text-sm font-medium font-display ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                  {persona.name.split(' ')[0]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
