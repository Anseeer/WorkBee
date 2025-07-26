import type { JSX } from "react/jsx-dev-runtime";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { setTokenFromStorage } from "../../slice/userSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setTokenFromStorage(token));
    }
  }, []);
  const { token } = useAppSelector((state) => state.user);

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
