import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useAuth();
  const location = useLocation();

  if (!authChecked) {
    return null; // or loader
  }

  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(
      location.pathname + location.search
    );

    return (
      <Navigate
        to={`/login?redirectTo=${redirectTo}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
