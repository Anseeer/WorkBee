import WorkerLandingPage from "../pages/worker/landing";
import WorkerRegistrationPage from "../pages/worker/register";
import WorkerLoginPage from "../pages/worker/login";
import WorkerForgotPasswordPage from "../pages/worker/forgotPass";
import WorkerOtpVerification from "../pages/worker/verifyOtp";
import WorkerResetPasswordPage from "../pages/worker/resetPassword";
import WorkerDashBoard from "../pages/worker/dashboard";
import WorkerNotifications from "../pages/worker/notification";
import { WorkerDetailsProvider } from "../components/context/WorkerDetailContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuestRoute from "../components/common/GuestRoute";
import { ROLE } from "../constant/roles";
import { API_ROUTES } from "../constant/api.routes";
import { VerifyRegistration } from "../pages/worker/verifyRegistration";

export const workerRoutes = [
    {
        path: API_ROUTES.WORKER.LANDING,
        element: (
            <GuestRoute role={ROLE.WORKER}>
                <WorkerLandingPage />
            </GuestRoute>
        ),
    },
    {
        path: API_ROUTES.WORKER.REGISTER,
        element: (
            <GuestRoute role={ROLE.WORKER}>
                <WorkerRegistrationPage />
            </GuestRoute>
        ),
    },
    {
        path: API_ROUTES.WORKER.VERIFY_REGISTERATION,
        element: (
            <GuestRoute role={ROLE.WORKER}>
                <VerifyRegistration />
            </GuestRoute>
        ),
    },
    {
        path: API_ROUTES.WORKER.LOGIN,
        element: (
            <GuestRoute role={ROLE.WORKER}>
                <WorkerLoginPage />
            </GuestRoute>
        ),
    },
    {
        path: API_ROUTES.WORKER.DASHBOARD,
        element: (
            <WorkerDetailsProvider>
                <ProtectedRoute role={ROLE.WORKER}>
                    <WorkerDashBoard />
                </ProtectedRoute>
            </WorkerDetailsProvider>
        ),
    },
    {
        path: API_ROUTES.WORKER.NOTIFICATION,
        element: (
            <WorkerDetailsProvider>
                <ProtectedRoute role={ROLE.WORKER}>
                    <WorkerNotifications />
                </ProtectedRoute>
            </WorkerDetailsProvider>
        ),
    },
    { path: API_ROUTES.WORKER.FORGOT_PASS, element: <WorkerForgotPasswordPage /> },
    { path: API_ROUTES.WORKER.VERIFY_OTP, element: <WorkerOtpVerification /> },
    { path: API_ROUTES.WORKER.RESET_PASS, element: <WorkerResetPasswordPage /> },
];
