import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../context/AuthProvider";

function PrivateRoutes({ children }) {
  const { authUser } = useAuthContext();
  const location = useLocation();

  if (authUser) {
    return children;
  }
  return <Navigate to="/Login" state={{ from: location }} replace />;
}

export default PrivateRoutes;
