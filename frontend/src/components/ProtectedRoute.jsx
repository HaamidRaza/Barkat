import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const RequireSeller = ({ children }) => {
  const { isSeller, authReady } = useAppContext();
  if (!authReady) return null;
  if (!isSeller) return <Navigate to="/seller/login" replace />;
  return children;
};

export const RequireAdmin = ({ children }) => {
  const { isAdmin, authReady } = useAppContext();
  if (!authReady) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export const RequireUser = ({ children }) => {
  const { user, authReady } = useAppContext();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};