import "./App.css"
import Dashboard from "./pages/user/home";
import RegistrationPage from "./pages/user/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import WorkerDetails from "./components/common/WorkerDetails";
import { WorkerDetailsProvider } from "./components/context/WorkerDetailContext";
import GuestRoute from "./components/common/GuestRoute";
import NotFoundPage from "./components/common/NotFoundPAge";
import WorkDetails from "./pages/user/workDetails";
import Profile from "./pages/user/profile";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { fetchData } from "./utilities/fetchData";
import Message from "./pages/user/messages";
import { ROLE } from "./constant/roles";
import { Notifications } from "./pages/user/notifications";
import WorkerNotifications from "./pages/worker/notification";

const App = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch])

  return (
    <>
      <Router>
        <Routes>
          {/* user */}
          <Route path="/" element={
            <GuestRoute role={ROLE.USER} >
              <LandingPage />
            </GuestRoute>
          } />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPAss />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/work-details" element={
            <ProtectedRoute role={ROLE.USER}>
              <WorkDetails />
            </ProtectedRoute>
          } />
          <Route
            path="/home"
            element={
              <ProtectedRoute role={ROLE.USER} >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role={ROLE.USER} >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute role={ROLE.USER} >
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/message"
            element={
              <ProtectedRoute role={ROLE.USER} >
                <Message />
              </ProtectedRoute>
            }
          />

          {/* worker */}
          <Route path="/workers" element={
            <GuestRoute role={ROLE.WORKER}>
              <WorkerLandingPage />
            </GuestRoute>
          } />
          <Route path="/workers/register" element={
            <GuestRoute role={ROLE.WORKER}>
              <WorkerRegistrationPage />
            </GuestRoute>
          } />
          <Route path="/workers/login" element={
            <GuestRoute role={ROLE.WORKER}>
              <WorkerLoginPage />
            </GuestRoute>
          } />
          <Route path="/workers/dashboard" element={
            <WorkerDetailsProvider>
              <ProtectedRoute role={ROLE.WORKER}>
                <WorkerDashBoard />
              </ProtectedRoute>
            </WorkerDetailsProvider>
          } />
          <Route path="/workers/notifications" element={
            <WorkerDetailsProvider>
              <ProtectedRoute role={ROLE.WORKER}>
                <WorkerNotifications />
              </ProtectedRoute>
            </WorkerDetailsProvider>
          } />
          <Route path="/workers/forgot-password" element={<WorkerForgotPasswordPage />} />
          <Route path="/workers/verify-otp" element={<WorkerOtpVerification />} />
          <Route path="/workers/reset-password" element={<WorkerResetPasswordPage />} />

          {/* admin */}
          <Route path="/admins/workers-detail" element={<WorkerDetails />} />
          <Route path="/admins/dashboard" element={
            <WorkerDetailsProvider>
              <ProtectedRoute role={ROLE.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            </WorkerDetailsProvider>
          } />
          <Route path="/admins/login" element={
            <GuestRoute role={ROLE.ADMIN}>
              <AdminLoginPage />
            </GuestRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;