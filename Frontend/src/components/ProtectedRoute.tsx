import type { JSX } from "react/jsx-dev-runtime";
import { useAppSelector } from "../hooks/useAppSelector";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAppSelector((state) => state.user);

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
