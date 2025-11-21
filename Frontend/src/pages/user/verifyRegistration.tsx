/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { reVerifyRegister, verifyRegisterUserThunk } from "../../slice/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VerifyOtpForm from "../../components/common/VerifyOtpForm";
import { otpRegex } from "../../constant/regexs";
import { API_ROUTES } from "../../constant/api.routes";

export const VerifyRegistration = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const userId = localStorage.getItem("temp_userId");

    const handleResend = async () => {
        try {
            if (!userId) {
                toast.error("Email not found");
                return;
            }

            await dispatch(reVerifyRegister(userId))
            toast.success("OTP Resend successfully ")
        } catch (error) {
            console.log("HANDLE RESEND ERROR:", error);
            toast.error("Faild to resend otp");
        }
    }

    const handleVerify = async (otp: string) => {
        try {
            if (!userId) throw new Error("UserId Not Received");
            if (!otp) throw new Error("OTP Not Received");
            if (!otpRegex.test(otp)) throw new Error("Valid OTP required");

            await dispatch(verifyRegisterUserThunk({ userId, otp })).unwrap();

            toast.success("Registered successfully !");
            navigate(API_ROUTES.USER.HOME, { replace: true });

        } catch (error: any) {
            console.log("HANDLE VERIFY ERROR:", error);

            const msg =
                error?.data ||
                error?.message ||
                "Verification failed";

            toast.error(msg);
        }
    };


    return <VerifyOtpForm onResend={handleResend} onSubmit={handleVerify} />;
};

