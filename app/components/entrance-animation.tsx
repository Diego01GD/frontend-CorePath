"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type EntranceAnimationProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export default function EntranceAnimation({
  children,
  className,
  delay = 0,
}: EntranceAnimationProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
