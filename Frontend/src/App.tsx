import "./App.css"
import Dashboard from "./pages/user/home";
import RegistrationPage from "./pages/user/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { setTokenFromStorage } from "./slice/userSlice";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/user/login";
import ForgotPAss from "./pages/user/forgotPassword";
import OtpVerification from "./pages/user/OtpVerification";
import ResetPassword from "./pages/user/resetPassword";
import LandingPage from "./pages/user/landing";
import WorkerRegistrationPage from "./pages/worker/register";
import WorkerLandingPage from "./pages/worker/landing";
import WorkerDashBoard from "./pages/worker/dashboard";
import WorkerLoginPage from "./pages/worker/login";
import WorkerForgotPasswordPage from "./pages/worker/forgotPass";
import WorkerOtpVerification from "./pages/worker/verifyOtp";
import WorkerResetPasswordPage from "./pages/worker/resetPassword";
import AdminDashboard from "./pages/admin/dashboard";
import AdminLoginPage from "./pages/admin/login";
import WorkerDetails from "./components/admin/WorkerDetails";
import { WorkerDetailsProvider } from "./components/context/WorkerDetailContext";
import GuestRoute from "./components/common/GuestRoute";
const App = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setTokenFromStorage(token));
    }
  });

  return (
    <>
      <Router>
        <Routes>
          {/* user */}
          <Route path="/" element={
            <GuestRoute roleType="User" >
              <LandingPage />
            </GuestRoute>
          } />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPAss />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["User"]} >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* worker */}
          <Route path="/workers/landing" element={
            <GuestRoute roleType="Worker" >
              <WorkerLandingPage />
            </GuestRoute>
          } />
          <Route path="/workers/register" element={<WorkerRegistrationPage />} />
          <Route path="/workers/login" element={<WorkerLoginPage />} />
          <Route path="/workers/dashboard" element={
            <ProtectedRoute allowedRoles={["Worker"]}>
              <WorkerDashBoard />
            </ProtectedRoute>
          } />
          <Route path="/workers/forgot-password" element={<WorkerForgotPasswordPage />} />
          <Route path="/workers/verify-otp" element={<WorkerOtpVerification />} />
          <Route path="/workers/reset-password" element={<WorkerResetPasswordPage />} />

          {/* admin */}
          <Route path="/admins/workers-detail" element={<WorkerDetails />} />
          <Route path="/admins/dashboard" element={
            <WorkerDetailsProvider>
              <ProtectedRoute allowedRoles={["Admin"]} >
                <AdminDashboard />
              </ProtectedRoute>
            </WorkerDetailsProvider>
          } />
          <Route path="/admins/login" element={<AdminLoginPage />} />
          
        </Routes>
      </Router>
    </>
  )
}

export default App;