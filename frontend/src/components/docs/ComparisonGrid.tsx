import React from 'react';
import { motion } from 'framer-motion';

interface ComparisonGridProps {
  children: React.ReactNode;
}

export default function ComparisonGrid({ children }: ComparisonGridProps) {
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
      className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6"
    >
      {children}
    </motion.div>
  );
}
