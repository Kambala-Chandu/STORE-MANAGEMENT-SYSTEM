import React, { forwardRef, memo } from 'react';
import { motion, useReducedMotion as framerUseReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';

// Check user reduced motion preference
export const useReducedMotion = () => {
  return framerUseReducedMotion();
};

export const ENTERPRISE_EASE = [0.22, 1, 0.36, 1];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: ENTERPRISE_EASE,
    },
  },
};

export const scaleFadeVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: ENTERPRISE_EASE,
    },
  },
};

// 1. MotionContainer - Wraps entire page with staggered container
export const MotionContainer = memo(({ children, className, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionContainer.displayName = 'MotionContainer';

// 2. MotionItem - Stagger child entrance
export const MotionItem = memo(({ children, className, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionItem.displayName = 'MotionItem';

// 3. MotionCard - Interactive card with entrance and hover lift
export const MotionCard = memo(
  forwardRef(({ children, className, whileHover = true, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        variants={shouldReduceMotion ? undefined : itemVariants}
        whileHover={
          whileHover && !shouldReduceMotion
            ? {
                y: -3,
                transition: { duration: 0.2, ease: ENTERPRISE_EASE },
              }
            : undefined
        }
        className={cn(
          'rounded-2xl border border-white/[0.08] bg-[#0b1329]/[0.85] backdrop-blur-xl transition-all duration-200',
          'hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/40',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  })
);
MotionCard.displayName = 'MotionCard';

export default {
  MotionContainer,
  MotionItem,
  MotionCard,
  containerVariants,
  itemVariants,
  scaleFadeVariants,
  useReducedMotion,
  ENTERPRISE_EASE,
};

