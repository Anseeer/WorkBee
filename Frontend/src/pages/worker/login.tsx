import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import LoginForm from "../../components/common/LoginForm";
import { emailRegex, passRegex } from "../../regexs";
import { loginWorkerThunk } from "../../slice/workerSlice";
import { API_ROUTES } from "../../constant/api.routes";

const WorkerLoginPage = () => {
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
            await dispatch(loginWorkerThunk(credentials)).unwrap();
            toast.success("Login successful!");
            navigate(API_ROUTES.WORKER.DASHBOARD, { replace: true });
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            toast.error(msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const HandleForgotPass = () => {
        navigate(API_ROUTES.WORKER.FORGOT_PASS)
    }

    const HandleRegister = () => {
        navigate(API_ROUTES.WORKER.REGISTER);
    }

    return <LoginForm Submit={handleLogin} loading={loading} role="Worker" HandleForgotPass={ HandleForgotPass } HandleRegister={ HandleRegister } />;
};

export default WorkerLoginPage;
