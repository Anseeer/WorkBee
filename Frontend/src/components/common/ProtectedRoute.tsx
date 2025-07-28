import type { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: ("User" | "Worker" | "Admin")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const role = localStorage.getItem("role");

  const token =
    role === "User"
      ? localStorage.getItem("userToken")
      : role === "Worker"
        ? localStorage.getItem("workerToken")
        : role === "Admin"
          ? localStorage.getItem("adminToken")
          : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!token || !role || !allowedRoles.includes(role as any)) {
    if (allowedRoles.includes("Worker")) {
      return <Navigate to="/workers/login" replace />;
    } else if (allowedRoles.includes("Admin")) {
      return <Navigate to="/admins/login" replace />;
    } else if (allowedRoles.includes("User")) {
      return <Navigate to="/login" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
