import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Terminal } from 'lucide-react';

interface ComparisonCardProps {
  persona: 'hitesh' | 'piyush';
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ComparisonCard({ persona, title, subtitle, children }: ComparisonCardProps) {
  const isHitesh = persona === 'hitesh';
  
  // Design details based on persona
  const gradientClass = isHitesh 
    ? 'from-amber-500 to-orange-500 shadow-amber-500/10' 
    : 'from-cyan-500 to-blue-500 shadow-cyan-500/10';
  
  const borderClass = isHitesh
    ? 'border-amber-200/50 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-800'
    : 'border-cyan-200/50 dark:border-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-800';

  const bgGradient = isHitesh
    ? 'hover:bg-amber-500/[0.01] dark:hover:bg-amber-500/[0.02]'
    : 'hover:bg-cyan-500/[0.01] dark:hover:bg-cyan-500/[0.02]';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`flex flex-col gap-4 p-5 rounded-2xl border bg-white dark:bg-zinc-950/60 backdrop-blur-sm shadow-sm transition-all duration-300 ${borderClass} ${bgGradient}`}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white shadow-md`}>
          {isHitesh ? <Coffee className="w-4.5 h-4.5" /> : <Terminal className="w-4.5 h-4.5" />}
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-display">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="space-y-4 flex-1">
        {children}
      </div>
    </motion.div>
  );
}
