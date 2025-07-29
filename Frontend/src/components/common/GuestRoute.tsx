import type { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/axios";

interface GuestRouteProps {
  children: JSX.Element;
  role: "User" | "Worker" | "Admin";
}

const GuestRoute = ({ children, role }: GuestRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get("/auth/verify", { withCredentials: true });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated) {
    if (role == "User") {
      return <Navigate to="/home" replace />;
    } else if (role == "Admin") {
      return <Navigate to="/admins/dashboard" replace />;
    } else if (role == "Worker") {
      return <Navigate to="/workers/dashboard" replace />;
    }
  }

  return children;
};

export default GuestRoute;
