/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VerifyOtpForm from "../../components/common/VerifyOtpForm";
import { otpRegex } from "../../constant/regexs";
import { API_ROUTES } from "../../constant/api.routes";
import { reVerifyRegister, verifyRegisterWorkerThunk } from "../../slice/workerSlice";

export const VerifyRegistration = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const workerId = localStorage.getItem("temp_workerId");

    const handleResend = async () => {
        try {
            if (!workerId) {
                toast.error("WorkerId not found");
                return;
            }
            await dispatch(reVerifyRegister(workerId))
            toast.success("OTP Resend successfully ")
        } catch (error) {
            console.log("HANDLE RESEND ERROR:", error);
            toast.error("Faild to resend otp");
        }
    }

    const handleVerify = async (otp: string) => {
        try {
            if (!workerId) throw new Error("WorkerId Not Received");
            if (!otp) throw new Error("OTP Not Received");
            if (!otpRegex.test(otp)) throw new Error("Valid OTP required");

            await dispatch(verifyRegisterWorkerThunk({ tempWorkerId: workerId, otp })).unwrap();

            toast.success("Registered successfully !");
            navigate(API_ROUTES.WORKER.DASHBOARD, { replace: true });

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

