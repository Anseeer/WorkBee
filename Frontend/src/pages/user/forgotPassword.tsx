import { useState } from "react";
import {toast} from "react-toastify"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { forgotPassUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";

const ForgotPAss = () => {
    const[email,setEmail] = useState<string>('')
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email) {
        toast.error("Email is required");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Invalid email format");
        return;
      }

      try {
        await dispatch(forgotPassUserThunk(email)).unwrap();
        localStorage.setItem('resetEmail', email);
        toast.success("OTP sent successfully!");
        navigate('/otp-verification', { replace: true });
      } catch (err: any) {
        toast.error(err || "Failed to send OTP");
      }
    };

  return (
    <div className="bg-gray-50 w-full min-h-screen relative">
      <div className="absolute top-8 left-8">
        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-3xl border-2 w-[500px] h-[300px] border-green-600 p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Enter your email to reset it.
          </h2>

          <div className="space-y-10 py-10 px-5">
            <input
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
            />
            <button 
            type="submit"
            onClick={onSubmit}
            className="w-full bg-green-900 py-1 mt-7 text-white font-semibold rounded-full"
            >
                Send Otp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPAss;
