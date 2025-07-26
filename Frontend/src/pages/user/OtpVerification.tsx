import { useAppDispatch } from "../../hooks/useAppDispatch";
import { resendOtpUserThunk, verifyOtpUserThunk } from "../../slice/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VerifyOtpForm from "../../components/common/VerifyOtpForm";
import { emailRegex, otpRegex } from "../../regexs";
import type { AxiosError } from "axios";

const OtpVerification = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const handleResend = (email: string) => {
    dispatch(resendOtpUserThunk(email)).unwrap();
    toast.success("Resend Otp")
    console.log("Resending OTP...");
  };

  const handleVerify = (verifyData: { email: string, otp: string }) => {
    try {
      if (!verifyData.email || verifyData.email.trim() === "") {
        throw new Error("Email Not Recive");
      }
      if (!verifyData.otp || verifyData.otp.trim() === "") {
        throw new Error("OTP Not Recive");
      }
      if (!emailRegex.test(verifyData.email)) {
        throw new Error("valid email address");
      }
      if (!otpRegex.test(verifyData.otp)) {
        throw new Error("valid OTP");
      }
      dispatch(verifyOtpUserThunk(verifyData))
        .unwrap()
        .then(() => {
          toast.success('Verified');
          navigate('/reset-password', { replace: true });
        })
        .catch((err) => {
          toast.error(err || 'Verification failed');
        });

    } catch (error: unknown) {
      const err = error as AxiosError<{ data: string }>;

      if (err.response?.data?.data) {
        toast.error(err.response.data.data);
      } else {
        toast.error("Verification failed");
      }
    }


  }

  return <VerifyOtpForm onResend={handleResend} verify={handleVerify} />
};

export default OtpVerification;
