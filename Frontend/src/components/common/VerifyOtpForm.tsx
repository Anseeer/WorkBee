import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface VerifyOtpFormProps {
  onResend: (email: string) => void;
  verify: (verifyData: { email: string; otp: string }) => void;
}

const VerifyOtpForm = ({ onResend, verify }: VerifyOtpFormProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [expired, setExpired] = useState<boolean>(false);

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

  const handleResend = () => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    setTimeLeft(60);
    setExpired(false);
    onResend(email);
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validate: (values) => {
      const errors: { otp?: string } = {};

      if (!values.otp || values.otp.trim().length === 0) {
        errors.otp = "OTP is required";
      } else if (values.otp.length !== 6 || !/^\d+$/.test(values.otp)) {
        errors.otp = "OTP must be 6 digits";
      }

      return errors;
    },
    onSubmit: (values) => {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        toast.error("Email not found. Please try again.");
        return;
      }

      verify({ email, otp: values.otp });
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen relative px-4">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <h1 className="merienda-text text-2xl sm:text-3xl text-green-900">WorkBee</h1>
      </div>

      {/* Centered Form */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-3xl border-2 border-green-600 shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-6">
            Enter the 6-digit OTP sent to your email to verify your identity.
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6 sm:space-y-8 py-6 sm:py-10 px-2 sm:px-5">
            <div>
              {formik.touched.otp && formik.errors.otp && (
                <span className="text-sm sm:text-base text-red-500 mt-1 block">{formik.errors.otp}</span>
              )}
              <input
                type="text"
                name="otp"
                placeholder="OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-2 py-2 sm:px-3 sm:py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent text-sm sm:text-base"
              />
            </div>

            {expired ? (
              <div className="text-center space-y-3">
                <p className="text-red-600 font-semibold text-sm sm:text-base">Time expired</p>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-green-700 underline font-medium text-sm sm:text-base"
                >
                  Resend OTP
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-900 py-2 sm:py-3 mt-2 sm:mt-4 text-white font-semibold rounded-full text-sm sm:text-base"
              >
                Verify ({formatTime(timeLeft)})
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );

};

export default VerifyOtpForm;
