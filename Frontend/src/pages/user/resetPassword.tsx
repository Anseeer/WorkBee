import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { resetPasswordUserThunk } from "../../slice/userSlice";
import ResetPasswordForm from "../../components/common/ResetPassForm";
import type { AxiosError } from "axios";
import { emailRegex, passRegex } from "../../constant/regexs";
import { API_ROUTES } from "../../constant/api.routes";

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleReset = async (passwordData: { email: string; password: string }) => {
    try {

      if (!passwordData.email || passwordData.email.trim() === "") {
        throw new Error("Please enter an email address");
      }
      if (!passwordData.password || passwordData.password.trim() === "") {
        throw new Error("Please enter password");
      }

      if (!emailRegex.test(passwordData.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!passRegex.test(passwordData.password)) {
        throw new Error("Password must be at least 6 characters long and include letters, numbers, and symbols like _ . @");
      }

      await dispatch(resetPasswordUserThunk(passwordData)).unwrap();
      toast.success("Password reset successfully!");
      navigate(API_ROUTES.USER.LOGIN, { replace: true });
    } catch (error: unknown) {
      const err = error as AxiosError<{ data: string }>;

      if (err.response?.data?.data) {
        toast.error(err.response.data.data);
      } else {
        toast.error("Verification failed");
      }
    }
  };

  return <ResetPasswordForm handleSubmit={handleReset} role="user" />;
};

export default ResetPasswordPage;
