import { motion } from 'framer-motion';

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
    <div className="w-full flex flex-col items-center">
      {/* Desktop & Mobile: unified compact segmented control */}
      <div className="flex gap-1 p-1 bg-bg-surface border border-border-main rounded-full max-w-sm w-full shadow-sm">
        {PERSONAS.map((persona) => {
          const isActive = activePersona === persona.id;
          const isHitesh = persona.id === 'hitesh';
          return (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className="flex-1 relative py-1.5 px-3 rounded-full cursor-pointer select-none border-0 focus:outline-none"
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-full bg-bg-base border"
                  style={{
                    borderColor: isHitesh ? 'var(--accent)' : 'var(--engine)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <span className="w-5.5 h-5.5 rounded-full overflow-hidden border border-border-main shrink-0">
                  <img
                    src={persona.avatarUrl}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                  />
                </span>
                <span
                  className={`text-[12.5px] font-semibold font-sans tracking-tight transition-colors duration-200 ${
                    isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {persona.id === 'hitesh' ? 'Hitesh Sir' : 'Piyush Sir'}
                </span>
                <span className="text-xs shrink-0">{persona.signatureEmoji}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
