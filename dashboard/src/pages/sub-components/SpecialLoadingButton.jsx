import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import { Button } from "@portfolio/shared/components/ui/button";
export default function SpecialLoadingButton({ content, width = "w-full" }) {
  return (
    <Button disabled className={width}>
      <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
      {content}?
    </Button>
  );
}
SpecialLoadingButton.propTypes = {
  content: PropTypes.string.isRequired,
  width: PropTypes.string,
};
