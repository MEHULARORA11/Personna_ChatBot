import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  title: string;
  description: string | React.ReactNode;
  badge?: string;
}

interface StepFlowProps {
  steps: Step[];
}

export default function StepFlow({ steps }: StepFlowProps) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
      className="relative pl-6 md:pl-8 space-y-6 my-6 border-l-2 border-dashed border-zinc-200 dark:border-zinc-800/80 ml-4 md:ml-6"
    >
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
          className="relative flex flex-col md:flex-row gap-2 md:gap-6 items-start"
        >
          {/* Number Circle Badge */}
          <div className="absolute -left-[43px] md:-left-[51px] flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-950 border-2 border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-bold font-display shadow-sm">
            {step.badge || idx + 1}
          </div>

          {/* Text Content */}
          <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-200">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 font-display text-sm md:text-base">
              {step.title}
            </h4>
            <div className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              {step.description}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
