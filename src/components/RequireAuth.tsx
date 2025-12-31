import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/services/auth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}