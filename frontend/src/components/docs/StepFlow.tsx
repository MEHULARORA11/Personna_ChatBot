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
      className="relative pl-6 md:pl-8 space-y-6 my-6 border-l border-dashed border-border-main ml-4 md:ml-6"
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
          <div 
            className="absolute -left-[41px] md:-left-[49px] flex items-center justify-center w-8 h-8 rounded-full bg-bg-surface border-2 text-xs font-bold font-display shadow-sm"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            {step.badge || idx + 1}
          </div>

          {/* Text Content */}
          <div className="flex-1 bg-bg-surface p-4.5 rounded-2xl border border-border-main hover:border-accent/30 transition-all duration-200 shadow-sm">
            <h4 className="font-bold text-text-primary font-display text-sm md:text-base">
              {step.title}
            </h4>
            <div className="text-xs md:text-sm text-text-muted mt-1 leading-relaxed">
              {step.description}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
