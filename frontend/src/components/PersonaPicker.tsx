import { motion } from 'framer-motion';
import { Play, Users } from 'lucide-react';

// Interface for Persona metadata
export interface Persona {
  id: 'hitesh' | 'piyush';
  name: string;
  role: string;
  accentColor: string;
  shadowColor: string;
  avatarGradient: string;
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
    accentColor: 'from-amber-500 to-orange-600',
    shadowColor: 'rgba(245, 158, 11, 0.25)',
    avatarGradient: 'from-amber-600 to-orange-500',
    bio: 'Ex-PW, iNeuron CTO. Builds ChaiCode & Masterji.co. Believes in intuition first and teaches using conversational Hinglish.',
    youtube: 'Chai aur Code',
    subscribers: '1.8M+ total subs',
    signatureEmoji: '☕',
    avatarUrl: '/hitesh.png'
  },
  {
    id: 'piyush',
    name: 'Piyush Garg',
    role: 'System Design & Backend Enthusiast',
    accentColor: 'from-cyan-400 to-blue-600',
    shadowColor: 'rgba(6, 182, 212, 0.25)',
    avatarGradient: 'from-cyan-500 to-blue-600',
    bio: 'Startup engineer, event-driven architecture enthusiast, unmarried (humorous about it). High-energy livestreaming teacher.',
    youtube: 'Code with Piyush',
    subscribers: '1M+ total subs',
    signatureEmoji: '🚀',
    avatarUrl: '/piyush.jpg'
  }
];

interface PersonaPickerProps {
  activePersona: 'hitesh' | 'piyush';
  onPersonaChange: (id: 'hitesh' | 'piyush') => void;
}

export default function PersonaPicker({ activePersona, onPersonaChange }: PersonaPickerProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Desktop / Tablet Grid (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-2 gap-4 lg:gap-6">
        {PERSONAS.map((persona) => {
          const isActive = activePersona === persona.id;
          return (
            <motion.button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-6 rounded-2xl border bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md cursor-pointer transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${
                isActive
                  ? 'border-transparent shadow-xl ring-2 ring-offset-2 dark:ring-offset-black'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm opacity-70 hover:opacity-90'
              }`}
              style={{
                boxShadow: isActive ? `0 20px 25px -5px ${persona.shadowColor}, 0 8px 10px -6px ${persona.shadowColor}` : undefined,
                borderColor: isActive ? (persona.id === 'hitesh' ? '#F59E0B' : '#06B6D4') : undefined,
              }}
            >
              {/* Highlight background blob */}
              {isActive && (
                <div
                  className={`absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gradient-to-br ${persona.accentColor} opacity-10 blur-xl`}
                />
              )}

              <div>
                {/* Header (Avatar & Title) */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: isActive ? 360 : 0, scale: isActive ? 1.05 : 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className={`w-14 h-14 rounded-full bg-gradient-to-tr ${persona.avatarGradient} p-[2px] shadow-md relative overflow-hidden`}
                    >
                      <img
                        src={persona.avatarUrl}
                        alt={persona.name}
                        className="w-full h-full object-cover rounded-full select-none"
                      />
                    </motion.div>
                    {isActive && (
                      <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-950 bg-gradient-to-tr ${persona.accentColor} animate-pulse`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 font-display">
                      {persona.name}
                      <span className="text-xl" title="Signature Persona Emoji">{persona.signatureEmoji}</span>
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {persona.role}
                    </p>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  {persona.bio}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500 pt-4 border-t border-zinc-100 dark:border-zinc-900 w-full">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {persona.subscribers}
                </span>
                <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {persona.youtube}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile Swipe/Tab Switcher (visible on mobile only) */}
      <div className="md:hidden flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
        {PERSONAS.map((persona) => {
          const isActive = activePersona === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute inset-0 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800/80`}
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <div className="relative z-10 w-6 h-6 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
                <img
                  src={persona.avatarUrl}
                  alt={persona.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="relative z-10 font-display">
                {persona.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
