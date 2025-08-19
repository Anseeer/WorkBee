import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { googleLoginSuccess, loginUserThunk } from "../../slice/userSlice";
import LoginForm from "../../components/common/LoginForm";
import { emailRegex, passRegex } from "../../regexs";
import { API_ROUTES } from "../../constant/api.routes";
import axios from "../../services/axios";
import type { CredentialResponse } from "@react-oauth/google";


const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      if (!credentials.email || credentials.email.trim() === "") {
        throw new Error("Please enter an email address");
      }
      if (!credentials.password || credentials.password.trim() === "") {
        throw new Error("Please enter password");
      }

      if (!emailRegex.test(credentials.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!passRegex.test(credentials.password)) {
        throw new Error("Password must be at least 6 characters long and include letters, numbers, and symbols like _ . @");
      }
      setLoading(true);
      const res = await dispatch(loginUserThunk(credentials)).unwrap();
      console.log("Res :", res)
      toast.success("Login successful!");
      navigate(API_ROUTES.USER.HOME, { replace: true });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const HandleForgotPass = () => {
    navigate(API_ROUTES.USER.FORGOT_PASS)
  }

  const HandleRegister = () => {
    navigate(API_ROUTES.USER.REGISTER);
  }

  const handleGoogleLogin = async (response: CredentialResponse) => {
    console.log("Google Login Success:", response);

    if (!response.credential) {
      toast.error("Google login failed: No credential received");
      return;
    }

    try {
      const res = await axios.post("/users/google-login", {
        credential: response.credential,
      });

      console.log("Backend user:", res.data.data);

      await dispatch(googleLoginSuccess(res.data.data));

      toast.success("Login successful");
      navigate(API_ROUTES.USER.HOME);
    } catch (error) {
      console.error(error);
      toast.error("Google Log-In failed");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    toast.error("Google login failed");
  };
 
  return <LoginForm Submit={handleLogin} handleGoogleLogin={handleGoogleLogin} handleGoogleError={handleGoogleError} loading={loading} role="User" HandleForgotPass={HandleForgotPass} HandleRegister={HandleRegister} />;
};

export default LoginPage;
