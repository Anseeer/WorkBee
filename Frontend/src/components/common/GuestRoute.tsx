import type { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: JSX.Element;
  roleType: "User" | "Worker" | "Admin";
}

const GuestRoute = ({ children, roleType }: GuestRouteProps) => {
  const currentRole = localStorage.getItem("role");

  const userToken = localStorage.getItem("userToken");
  const workerToken = localStorage.getItem("workerToken");
  const adminToken = localStorage.getItem("adminToken");

  if (roleType === "User" && currentRole === "User" && userToken) {
    return <Navigate to="/home" replace />;
  }

  if (roleType === "Worker" && currentRole === "Worker" && workerToken) {
    return <Navigate to="/workers/dashboard" replace />;
  }

  if (roleType === "Admin" && currentRole === "Admin" && adminToken) {
    return <Navigate to="/admins/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
