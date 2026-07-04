import { m } from "framer-motion"

import { pageTransitionVariants } from "@/lib/motion"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

export function PageTransition({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <m.div initial="initial" animate="animate" exit="exit" variants={pageTransitionVariants}>
      {children}
    </m.div>
  )
}
