import PropTypes from "prop-types";
import * as React from "react";

import { cn } from "@portfolio/shared/lib/utils";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@portfolio/shared/components/ui/card";

const GlassCard = React.forwardRef(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "border-glass-border bg-glass shadow-glass rounded-2xl backdrop-blur-xl",
      className,
    )}
    {...props}
  />
));
GlassCard.displayName = "GlassCard";

export {
  GlassCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

GlassCard.propTypes = {
  className: PropTypes.string,
};
