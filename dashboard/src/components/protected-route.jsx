import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Status } from "@portfolio/shared/components/status";
export function ProtectedRoute({ children }) {
  const { authChecked, isAuthenticated } = useSelector((state) => state.user);
  if (!authChecked) return <Status loading />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
