import PropTypes from "prop-types";
import { Button } from "./ui/button.jsx";
export function Status({ loading = false, error, onRetry }) {
  return (
    <div className="p-8 text-center" role={error ? "alert" : "status"}>
      <p>{loading ? "Loading..." : error}</p>
      {error && onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

Status.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onRetry: PropTypes.func,
};
