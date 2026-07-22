'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 25
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14
    }
  }
};

export function FramerRevealContainer({ children, className, style, id }) {
  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function FramerRevealItem({ children, className, style, id }) {
  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}
