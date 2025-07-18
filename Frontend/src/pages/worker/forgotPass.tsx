import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ForgotPasswordForm from "../../components/ForgotPassForm";
import { forgotPassUserThunk } from "../../slice/workerSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const WorkerForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleForgotPassword = async (email: string) => {
    try {
      if (!email || email.trim() === "") {
        throw new Error("Please enter an email address");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      await dispatch(forgotPassUserThunk(email)).unwrap();
      localStorage.setItem("resetEmail", email);
      toast.success("OTP sent successfully!");
      navigate("/workers/verify-otp", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to send OTP");
    }
  };

  return <ForgotPasswordForm Submit={handleForgotPassword}  />;
};

export default WorkerForgotPasswordPage;
