import React, { forwardRef, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion as framerUseReducedMotion } from 'framer-motion';

// 7. Hook to check preference
export const useReducedMotion = () => {
  const shouldReduceMotion = framerUseReducedMotion();
  return shouldReduceMotion;
};

// 8. Shared spring config
export const SPRING_CONFIG = { type: 'spring', stiffness: 300, damping: 30 };

// 9. The cubic bezier
export const ENTERPRISE_EASE = [0.22, 1, 0.36, 1];

// 1. MotionPage - Wraps entire page with fade-in
export const MotionPage = memo(({ children, className }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: ENTERPRISE_EASE }}
    >
      {children}
    </motion.div>
  );
});
MotionPage.displayName = 'MotionPage';

// 2. MotionCard - Individual card entrance with optional delay
export const MotionCard = memo(forwardRef(({ children, delay = 0, className }, ref) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: ENTERPRISE_EASE }}
    >
      {children}
    </motion.div>
  );
}));
MotionCard.displayName = 'MotionCard';

// 3. MotionStagger - Container that staggers children
export const MotionStagger = memo(({ children, className, staggerDelay = 0.06 }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});
MotionStagger.displayName = 'MotionStagger';

// 4. MotionItem - Child of MotionStagger
export const MotionItem = memo(({ children, className }) => {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ENTERPRISE_EASE } },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
});
MotionItem.displayName = 'MotionItem';

// 5. MotionSection - Section entrance with viewport trigger
export const MotionSection = memo(({ children, className, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: ENTERPRISE_EASE }}
    >
      {children}
    </motion.section>
  );
});
MotionSection.displayName = 'MotionSection';

// 6. MotionHover - Subtle hover lift effect
export const MotionHover = memo(({ children, className, scale = 1.01 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={shouldReduceMotion ? {} : { scale, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      transition={SPRING_CONFIG}
    >
      {children}
    </motion.div>
  );
});
MotionHover.displayName = 'MotionHover';

const Motion = {
  MotionPage,
  MotionCard,
  MotionStagger,
  MotionItem,
  MotionSection,
  MotionHover,
  useReducedMotion,
  SPRING_CONFIG,
  ENTERPRISE_EASE
};

export default Motion;
