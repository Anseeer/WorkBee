import type { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import Loader from "./Loader";
// import Loader from "./Loader";

interface GuestRouteProps {
  children: JSX.Element;
  role: "User" | "Worker" | "Admin";
}
const GuestRoute = ({ children, role }: GuestRouteProps) => {
  const [authInfo, setAuthInfo] = useState<{ isAuthenticated: boolean; userRole: string | null }>({
    isAuthenticated: false,
    userRole: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get("/auth/verify", { withCredentials: true });
        setAuthInfo({ isAuthenticated: true, userRole: res.data.role });
      } catch {
        setAuthInfo({ isAuthenticated: false, userRole: null });
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) return <Loader />;


  if (authInfo.isAuthenticated && authInfo.userRole?.toLowerCase() === role.toLowerCase()) {
    if (role === "User") return <Navigate to="/home" replace />;
    if (role === "Worker") return <Navigate to="/workers/dashboard" replace />;
    if (role === "Admin") return <Navigate to="/admins/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
