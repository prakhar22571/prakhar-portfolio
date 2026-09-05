import PropTypes from "prop-types";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "../../lib/button-variants.js";

import { cn } from "@portfolio/shared/lib/utils";

const Button = React.forwardRef(
  (
    { className, variant, size, asChild = false, type = "button", ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  asChild: PropTypes.bool,
  type: PropTypes.string,
};
