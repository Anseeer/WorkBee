/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { loginUserThunk } from "../../slice/userSlice";
import LoginForm from "../../components/common/LoginForm";
import { emailRegex, passRegex } from "../../regexs";
import { API_ROUTES } from "../../constant/api.routes";


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

//   const HandleLoginSucess = async (credentialResponse: any) => {
//     try {
//       const res = await axios.post("/users/google-login", {
//         token: credentialResponse.credential,
//       });

//       console.log(res)

//       toast.success("Login successful");
//       navigate(API_ROUTES.USER.HOME)
//     } catch (error) {
//     console.error(error);
//     toast.error("Google Log-In failed");
//   }
// }

return <LoginForm Submit={handleLogin}  loading={loading} role="User" HandleForgotPass={HandleForgotPass} HandleRegister={HandleRegister} />;
};

export default LoginPage;
