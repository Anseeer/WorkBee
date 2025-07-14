import { useEffect, useState } from "react";
import {toast} from "react-toastify";


interface VerifyOtpFormProps{
    onResend:(email:string)=> void;
    verify:(verifyData:{email:string,otp:string})=> void;
}

const VerifyOtpForm = ({ onResend, verify }: VerifyOtpFormProps) => {
  
    const[timeLeft,setTimeLeft] = useState<number>(60)
    const[expired,setExpired] = useState<boolean>(false)
    const[otp,setOtp] = useState<string>('')

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleResend = ()=>{
    let email = localStorage.getItem('resetEmail');
    if (!email) {
    toast.error("Email not found. Please try again.");
    return;
    }

    setTimeLeft(60);
    setExpired(false);
    onResend(email);
    }

    const handleVerify = ()=>{

    if(!otp || otp == " "){
    toast.error("OTP is required. Please try again.");
    return;
    }

    let email = localStorage.getItem('resetEmail');

    if (!email) {
    toast.error("Email not found. Please try again.");
    return;
    }

    let verifyData = {email,otp};

    verify(verifyData);

    }

  return (
    <div className="bg-gray-50 w-full min-h-screen relative">
      <div className="absolute top-8 left-8">
        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-3xl border-2 w-[500px] h-[350px] border-green-600 p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Enter the 6-digit OTP sent to your email to verify your identity.
          </h2>

          <div className="space-y-10 py-10 px-5">
            <input
            value={otp}
            onChange={(e)=> setOtp(e.target.value)}
              type="text"
              placeholder="OTP"
              className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
            />

            {expired ? (
              <div className="text-center space-y-3">
                <p className="text-red-600 font-semibold">Time expired</p>
                <button
                  onClick={handleResend}
                  className="text-green-700 underline font-medium"
                >
                  Resend OTP
                </button>
              </div>
            ) : (
              <button
                type="submit"
                onClick={handleVerify}
                className="w-full bg-green-900 py-1 mt-2 text-white font-semibold rounded-full"
              >
                Verify ({formatTime(timeLeft)})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
