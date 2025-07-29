import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../services/axios";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
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

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (role == "User") {
      return <Navigate to="/login" replace />;
    } else if (role == "Worker") {
      return <Navigate to="/workers/login" replace />;
    } else if (role == "Admin") {
      return <Navigate to="/admins/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
