export const EASE_OUT = [0.16, 1, 0.3, 1]

export const durations = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: durations.base, ease: EASE_OUT } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: durations.base, ease: EASE_OUT } },
}

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

export const scaleTap = {
  whileTap: { scale: 0.97 },
  whileHover: { scale: 1.02 },
}

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.base, ease: EASE_OUT } },
  exit: { opacity: 0, y: -12, transition: { duration: durations.fast, ease: EASE_OUT } },
}
