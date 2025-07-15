import "./App.css"
import Dashboard from "./pages/user/dashboard";
import RegistrationPage from "./pages/user/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { setTokenFromStorage } from "./slice/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/user/login";
import ForgotPAss from "./pages/user/forgotPassword";
import OtpVerification from "./pages/user/OtpVerification";
import ResetPassword from "./pages/user/resetPassword";
import LandingPage from "./pages/user/landing";
import WorkerRegistrationPage from "./pages/worker/register";
import AdminRegistrationPage from "./pages/admin/register";
import WorkerDashBoard from "./pages/worker/dashboard";
import WorkerLoginPage from "./pages/worker/login";
import WorkerForgotPasswordPage from "./pages/worker/forgotPass";
import WorkerOtpVerification from "./pages/worker/verifyOtp";
import WorkerResetPasswordPage from "./pages/worker/resetPassword";
import AdminDashboard from "./pages/admin/dashboard";
import AdminLoginPage from "./pages/admin/login";
import AdminForgotPasswordPage from "./pages/admin/forgotPassword";
import AdminOtpVerification from "./pages/admin/verifyOtp";
import AdminResetPasswordPage from "./pages/admin/resetPssword";
const App = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setTokenFromStorage(token));
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* user */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPAss />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* worker */}
          <Route path="/workers/register" element={<WorkerRegistrationPage />} />
          <Route path="/workers/login" element={<WorkerLoginPage />} />
          <Route path="/workers/dashboard" element={<WorkerDashBoard />} />
          <Route path="/workers/forgot-password" element={<WorkerForgotPasswordPage />} />
          <Route path="/workers/verify-otp" element={<WorkerOtpVerification />} />
          <Route path="/workers/reset-password" element={<WorkerResetPasswordPage />} />

          {/* admin */}
          <Route path="/admins/register" element={<AdminRegistrationPage />} />
          <Route path="/admins/dashboard" element={<AdminDashboard />} />
          <Route path="/admins/login" element={<AdminLoginPage />} />
          <Route path="/admins/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/admins/verify-otp" element={<AdminOtpVerification />} />
          <Route path="/admins/reset-password" element={<AdminResetPasswordPage />} />


        </Routes>
      </Router>
    </>
  )
}

export default App;