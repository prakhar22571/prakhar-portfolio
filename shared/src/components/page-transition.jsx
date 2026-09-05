import PropTypes from "prop-types";
import { m } from "framer-motion";

import { pageTransitionVariants } from "@portfolio/shared/lib/motion";
import { usePrefersReducedMotion } from "@portfolio/shared/hooks/use-reduced-motion";

export function PageTransition({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <m.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
    >
      {children}
    </m.div>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node,
};
