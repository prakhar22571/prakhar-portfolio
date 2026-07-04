import { useRef } from "react"
import { m, useInView } from "framer-motion"

import { fadeUp, staggerContainer } from "@/lib/motion"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

function resolveMotionTag(as) {
  return typeof as === "string" ? m[as] || m.div : m.div
}

export function Reveal({ as = "div", className, children, variants = fadeUp, viewportMargin = "-80px", ...props }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: viewportMargin })
  const Tag = as

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = resolveMotionTag(as)
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={variants}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export function RevealGroup({ as = "div", className, children, stagger = 0.08, viewportMargin = "-80px", ...props }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: viewportMargin })
  const Tag = as

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = resolveMotionTag(as)
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={staggerContainer(stagger)}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({ as = "div", className, children, variants = fadeUp, ...props }) {
  const MotionTag = resolveMotionTag(as)
  return (
    <MotionTag className={className} variants={variants} {...props}>
      {children}
    </MotionTag>
  )
}
