import "./App.css"
import Dashboard from "./pages/user/dashboard";
import RegistrationPage from "./pages/user/register";
import { BrowserRouter as Router ,Route,Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { setTokenFromStorage } from "./slice/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/user/login";
import ForgotPAss from "./pages/user/forgotPassword";
import OtpVerification from "./pages/user/OtpVerification";
import ResetPassword from "./pages/user/resetPassword";
const App = ()=>{
  const dispatch = useAppDispatch()
  useEffect(()=>{
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setTokenFromStorage(token));
    }
  }, []);

  return(
    <>
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/forgot-password" element={<ForgotPAss/>} />
        <Route path="/otp-verification" element={<OtpVerification/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
       <Route
         path="/dashboard"
         element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
         }
        /> 
        </Routes>
    </Router>
    </>
  )
}

export default App;