import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ForgotPasswordForm from "../../components/common/ForgotPassForm";
import { forgotPassUserThunk } from "../../slice/userSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { API_ROUTES } from "../../constant/api.routes";
import { emailRegex } from "../../constant/regexs";

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleForgotPassword = async (email: string) => {
    try {
      if (!email || email.trim() === "") {
        throw new Error("Please enter an email address");
      }

      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      await dispatch(forgotPassUserThunk(email)).unwrap();
      localStorage.setItem("resetEmail", email);
      toast.success("OTP sent successfully!");
      navigate(API_ROUTES.USER.VERIFY_OTP, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to send OTP");
    }
  };

  return <ForgotPasswordForm Submit={handleForgotPassword} />;
};

export default ForgotPasswordPage;
