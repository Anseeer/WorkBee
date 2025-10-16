/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { emailRegex, passRegex } from "../../constant/regexs";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import GoogleAuth from "./GoogleSignButton";
import type { CredentialResponse } from "@react-oauth/google";



interface LoginFormProps {
  Submit: (credentials: { email: string; password: string }) => void;
  HandleForgotPass: () => void;
  HandleRegister: () => void;
  HandleSuccess?: (credentials: any) => Promise<void>;
  HandleFail?: () => void;
  handleGoogleLogin?: (response: CredentialResponse) => void;
  handleGoogleError?: () => void;
  loading?: boolean;
  role?: "User" | "Admin" | "Worker";
}

const LoginForm = ({ Submit, handleGoogleLogin, handleGoogleError, HandleForgotPass, HandleRegister, loading = false, role }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(true);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values)
      Submit(values);
    },
    validate: (values) => {
      const errors: { email?: string; password?: string } = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(values.email)) {
        errors.email = "Invalid email format";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passRegex.test(values.password)) {
        errors.password = "Invalid password format";
      }

      return errors;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md">

        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 hide-below-300">
          <h1 className="merienda-text text-2xl sm:text-3xl text-green-900">
            WorkBee
          </h1>
        </div>


        <div className="bg-white rounded-3xl border-2 border-green-600 p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-6 sm:mb-8">
            Glad to see you again!
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">

            <div>
              {formik.touched.email && formik.errors.email && (
                <span className="text-sm text-red-500 mt-1 block">
                  {formik.errors.email}
                </span>
              )}
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none rounded-t-md"
              />
            </div>

            <div className="relative">
              {formik.touched.password && formik.errors.password && (
                <span className="text-sm text-red-500 mt-1 block">
                  {formik.errors.password}
                </span>
              )}
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none rounded-b-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Left-aligned Links */}
          {role !== "Admin" && (
            <div className="pt-6 space-y-3 text-sm">

              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
                <span className="text-gray-600">Forgot</span>
                <button
                  type="button"
                  onClick={HandleForgotPass}
                  className="text-green-600 hover:text-green-700 underline bg-transparent border-none"
                >
                  Password?
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
                <span className="text-gray-600">Don't have an account?</span>
                <button
                  type="button"
                  onClick={HandleRegister}
                  className="text-green-600 hover:text-green-700 underline bg-transparent border-none"
                >
                  Sign up
                </button>
              </div>

              {handleGoogleLogin && handleGoogleError && (
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
                  <span className="text-gray-600">Login through</span>
                  <GoogleAuth
                    handleGoogleLogin={handleGoogleLogin}
                    handleGoogleError={handleGoogleError}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );


};

export default LoginForm;
