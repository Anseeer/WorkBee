import type { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import Loader from "./Loader";
import { API_ROUTES } from "../../constant/api.routes";

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
    if (role === "User") return <Navigate to={API_ROUTES.USER.HOME} replace />;
    if (role === "Worker") return <Navigate to={API_ROUTES.WORKER.DASHBOARD} replace />;
    if (role === "Admin") return <Navigate to={API_ROUTES.ADMIN.DASHBOARD} replace />;
  }

  return children;
};

export default GuestRoute;
