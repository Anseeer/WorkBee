import { useFormik } from "formik";
import { passRegex } from "../../constant/regexs";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ResetPasswordFormProps {
  handleSubmit: (passwordData: { email: string; password: string }) => void;
  role?: "user" | "admin" | "worker";
}

const ResetPasswordForm = ({ handleSubmit }: ResetPasswordFormProps) => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPass: ""
    },
    onSubmit: () => {
      const email = localStorage.getItem("resetEmail");
      if (!email) return;
      const passwordData = { email, password: formik.values.password };
      handleSubmit(passwordData);
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};

      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passRegex.test(values.password)) {
        errors.password = "Invalid password";
      }

      if (!values.confirmPass) {
        errors.confirmPass = "Confirm password is required";
      } else if (values.confirmPass !== values.password) {
        errors.confirmPass = "Passwords do not match";
      }

      return errors;
    },
  });

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 relative">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-7 sm:left-7">
        <h1 className="merienda-text text-2xl sm:text-3xl text-green-900">WorkBee</h1>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border-2 border-green-600 shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-6 sm:mb-8">
            Set a new password for your account.
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="relative">
              {formik.touched.password && formik.errors.password && (
                <span className="text-sm sm:text-base text-red-500">{formik.errors.password}</span>
              )}
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-2 py-3 sm:px-3 sm:py-3 pr-10 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none text-sm sm:text-base"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              {formik.touched.confirmPass && formik.errors.confirmPass && (
                <span className="text-sm sm:text-base text-red-500">{formik.errors.confirmPass}</span>
              )}
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPass"
                placeholder="Confirm Password"
                value={formik.values.confirmPass}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-2 py-3 sm:px-3 sm:py-3 pr-10 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none text-sm sm:text-base"
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-900 hover:bg-green-600 text-white h-10 sm:h-12 font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
