import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../services/axios";
import Loader from "./Loader";
import { API_ROUTES } from "../../constant/api.routes";
import { ROLE, type Role } from "../../constant/roles";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: Role;
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
        console.log("Auth verification failed");
        setAuthInfo({ isAuthenticated: false, userRole: null });
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) return <Loader />;


  if (!authInfo.isAuthenticated || authInfo.userRole?.toLowerCase() !== role.toLowerCase()) {
    if (role === ROLE.USER) return <Navigate to={API_ROUTES.USER.LOGIN} replace />;
    if (role === ROLE.WORKER) return <Navigate to={API_ROUTES.WORKER.LOGIN} replace />;
    if (role === ROLE.ADMIN) return <Navigate to={API_ROUTES.ADMIN.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
