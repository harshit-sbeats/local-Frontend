import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();

  // still checking auth
  if (isAuthenticated === null) return null;

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
};

export default RootRedirect;
