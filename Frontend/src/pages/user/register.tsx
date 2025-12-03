import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { emailRegex, passRegex, phoneRegex } from "../../constant/regexs";
import type { AxiosError } from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { API_ROUTES } from "../../constant/api.routes";
import { fetchLocationSuggestions } from "../../utilities/fetchLocation";

interface Suggestion {
  address: string;
  pincode: string;
  lat: string | number;
  lng: string | number;
}

const RegistrationPage = () => {
  const locationRef = useRef<HTMLInputElement>(null);
  const Dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [locationError, setLocationError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      location: {
        address: "",
        pincode: "",
        lat: 0,
        lng: 0,
      },
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await Dispatch(registerUserThunk(values)).unwrap();
        toast.success("Please enter the OTP to verify.");
        navigate(API_ROUTES.USER.VERIFY_REGISTERATION, { replace: true })
      } catch (error: unknown) {
        const err = error as AxiosError<{ data: string }>;
        const message = err.response?.data?.data || "Registration failed";
        toast.error(message)
      } finally {
        setLoading(false);
      }
    },
    validate: (values) => {
      const errors: {
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        confirmPassword?: string;
        location?: {
          address?: string;
          pincode?: string;
          lat?: number;
          lng?: number;
        };
      } = {};

      if (!values.name) errors.name = "Name is required";

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(values.email)) {
        errors.email = "Invalid email format";
      }
      if (!values.phone) {
        errors.phone = "Phone number is required";
      } else if (!phoneRegex.test(values.phone)) {
        errors.phone = "Invalid phone number";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passRegex.test(values.password)) {
        errors.password = "Invalid password format. Example: Abc123@";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Password is required";
      } else if (!passRegex.test(values.confirmPassword)) {
        errors.confirmPassword = "Invalid password format";
      }

      if (!values.location.address) {
        errors.location = { address: "Location is required" };
      }

      if (!values.location.pincode || !values.location.lng || !values.location.lat) {
        errors.location = { address: "Invalid Location, try again !" };
      }
      return errors;
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full overflow-y-auto">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-6"
      >
        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
      </div>

      {/* Centered Form */}
      <div className="flex items-center justify-center mt-20 mb-10">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl border-2 border-green-600 p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
              Let's get you started
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Username & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="h-5">
                    {formik.touched.name && formik.errors.name && (
                      <span className="text-sm text-red-500">{formik.errors.name}</span>
                    )}
                  </div>
                  <input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    placeholder="Username"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                  border-0 border-b-2 border-gray-300 focus:border-green-600 
                  focus:outline-none bg-transparent"
                  />
                </div>

                {/* Location */}
                <div className="relative">
                  <div className="h-5">
                    {formik.touched.location?.address && formik.errors.location?.address && (
                      <span className="text-sm text-red-500">{formik.errors.location.address}</span>
                    )}
                  </div>

                  <input
                    ref={locationRef}
                    name="location.address"
                    value={formik.values.location.address}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("location.address", value);
                      fetchLocationSuggestions(value, setSuggestions, setLocationError);
                    }}
                    autoComplete="off"
                    type="text"
                    placeholder="Location"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                            border-0 border-b-2 border-gray-300 focus:border-green-600 
                            focus:outline-none bg-transparent"
                  />

                  {/* Suggestions */}
                  {suggestions?.length > 0 && (
                    <div className="absolute left-0 right-0 bg-white border border-gray-200 
                                            mt-1 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">

                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            formik.setFieldValue("location", {
                              address: s.address,
                              pincode: s.pincode,
                              lat: Number(s.lat),
                              lng: Number(s.lng),
                            });
                            setSuggestions([]);
                          }}
                          className="p-3 text-gray-700 hover:bg-gray-100 cursor-pointer 
                                                   transition-all duration-150"
                        >
                          {s.address}
                        </div>
                      ))}

                      {locationError && (
                        <p className="text-red-500 text-sm p-3">{locationError}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-5">
                    {formik.touched.email && formik.errors.email && (
                      <span className="text-sm text-red-500">{formik.errors.email}</span>
                    )}
                  </div>
                  <input
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="email"
                    placeholder="Email"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                  border-0 border-b-2 border-gray-300 focus:border-green-600 
                  focus:outline-none bg-transparent"
                  />
                </div>

                <div>
                  <div className="h-5">
                    {formik.touched.phone && formik.errors.phone && (
                      <span className="text-sm text-red-500">{formik.errors.phone}</span>
                    )}
                  </div>
                  <input
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="tel"
                    placeholder="Phone"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                  border-0 border-b-2 border-gray-300 focus:border-green-600 
                  focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="h-5 mb-2">
                    {formik.touched.password && formik.errors.password && (
                      <span className="text-sm text-red-500">{formik.errors.password}</span>
                    )}
                  </div>
                  <input
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                  border-0 border-b-2 border-gray-300 focus:border-green-600 
                  focus:outline-none bg-transparent pr-8"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-7 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <div className="h-5 mb-2">
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <span className="text-sm text-red-500">{formik.errors.confirmPassword}</span>
                    )}
                  </div>
                  <input
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                  border-0 border-b-2 border-gray-300 focus:border-green-600 
                  focus:outline-none bg-transparent pr-8"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-7 text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-900 hover:bg-green-600 text-white font-semibold 
                rounded-full transition-colors duration-200
                h-[38px] sm:h-[42px] md:h-[45px] 
                py-2 sm:py-3 px-3 sm:px-4 
                text-sm sm:text-base"
                >
                  {loading ? 'Signing...' : 'Sign up'}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <span
                    onClick={() => navigate('/login', { replace: true })}
                    className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default RegistrationPage;
