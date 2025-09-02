import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../services/axios";
import Loader from "./Loader";
import { API_ROUTES } from "../../constant/api.routes";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: "User" | "Worker" | "Admin";
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
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
        console.log("Fail auth", authInfo)
        setAuthInfo({ isAuthenticated: false, userRole: null });
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [authInfo]);

  if (loading) return <Loader />;


  if (!authInfo.isAuthenticated || authInfo.userRole?.toLowerCase() !== role.toLowerCase()) {
    if (role === "User") return <Navigate to={API_ROUTES.USER.LOGIN} replace />;
    if (role === "Worker") return <Navigate to={API_ROUTES.WORKER.LOGIN} replace />;
    if (role === "Admin") return <Navigate to={API_ROUTES.ADMIN.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
