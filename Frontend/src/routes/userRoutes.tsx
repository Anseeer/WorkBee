import LandingPage from "../pages/user/landing";
import RegistrationPage from "../pages/user/register";
import LoginPage from "../pages/user/login";
import ForgotPAss from "../pages/user/forgotPassword";
import OtpVerification from "../pages/user/OtpVerification";
import ResetPassword from "../pages/user/resetPassword";
import WorkDetails from "../pages/user/workDetails";
import Dashboard from "../pages/user/home";
import Profile from "../pages/user/profile";
import { Notifications } from "../pages/user/notifications";
import Message from "../pages/user/messages";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuestRoute from "../components/common/GuestRoute";
import { ROLE } from "../constant/roles";
import { API_ROUTES } from "../constant/api.routes";
import { VerifyRegistration } from "../pages/user/verifyRegistration";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/common/ErrorFallback";

export const userRoutes = [

    {
        path: API_ROUTES.USER.LANDING,
        element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <LandingPage />
                </ErrorBoundary>
            </GuestRoute>
        ),
    },
    {
        path: API_ROUTES.USER.REGISTER, element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <RegistrationPage />
                </ErrorBoundary>
            </GuestRoute>
        )
    },
    {
        path: API_ROUTES.USER.VERIFY_REGISTERATION, element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <VerifyRegistration />
                </ErrorBoundary>
            </GuestRoute>
        )
    },
    {
        path: API_ROUTES.USER.LOGIN, element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <LoginPage />
                </ErrorBoundary>
            </GuestRoute>
        )
    },
    {
        path: API_ROUTES.USER.FORGOT_PASS, element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <ForgotPAss />
                </ErrorBoundary>
            </GuestRoute>
        )
    },
    {
        path: API_ROUTES.USER.VERIFY_OTP, element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <OtpVerification />
                </ErrorBoundary>
            </GuestRoute>
        )
    },
    {
        path: API_ROUTES.USER.RESET_PASS, element: (
            <GuestRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <ResetPassword />
                </ErrorBoundary>
            </GuestRoute>
        )
    },
    {
        path: API_ROUTES.USER.WORK_DETAILS,
        element: (
            <ProtectedRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <WorkDetails />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
    },
    {
        path: API_ROUTES.USER.HOME,
        element: (
            <ProtectedRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <Dashboard />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
    },
    {
        path: API_ROUTES.USER.PROFILE,
        element: (
            <ProtectedRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <Profile />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
    },
    {
        path: API_ROUTES.USER.NOTIFICATIONS,
        element: (
            <ProtectedRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <Notifications />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
    },
    {
        path: API_ROUTES.USER.MESSAGE,
        element: (
            <ProtectedRoute role={ROLE.USER}>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <Message />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
    },
];
