/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { emailRegex, passRegex, phoneRegex } from "../../constant/regexs";
import type { AxiosError } from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { API_ROUTES } from "../../constant/api.routes";

const RegistrationPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null); const [loading, setLoading] = useState<boolean>(false);
  const Dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

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
        await Dispatch(registerUserThunk(values)).unwrap()
        toast.success("Registration successful!");
        navigate(API_ROUTES.USER.HOME, { replace: true })
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
        errors.password = "Invalid password format";
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

  const updateLocation = useCallback(
    (locationData: typeof formik.values.location) => {
      formik.setFieldValue("location", locationData);
    },
    [formik]
  );

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        console.error("Google Maps Places API not loaded properly");
        return;
      }

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: "IN" },
            fields: ["formatted_address", "geometry", "address_components", "name"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place || !place.geometry) return;

          const addressComponents = place.address_components || [];
          const pincode =
            addressComponents.find((c: any) => c.types.includes("postal_code"))?.long_name || "";

          const lat = place.geometry.location?.lat() ?? 0;
          const lng = place.geometry.location?.lng() ?? 0;

          updateLocation({
            address: place.formatted_address || "",
            pincode,
            lat,
            lng,
          });
        });

        autocompleteRef.current = autocomplete;
      } catch (error) {
        console.error("Error initializing Autocomplete:", error);
      }
    };

    const loadGoogleMapsAPI = () => {
      if (window.google?.maps?.places) {
        initializeAutocomplete();
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          setTimeout(initializeAutocomplete, 100);
        });
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY
        }&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(initializeAutocomplete, 100);
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [updateLocation]);

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

                <div>
                  <div className="h-5">
                    {formik.touched.location?.address && formik.errors.location?.address && (
                      <span className="text-sm text-red-500">{formik.errors.location.address}</span>
                    )}
                  </div>
                  <input
                    onKeyDown={(e) => {
                      const keysToPrevent = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Tab', 'Enter'];
                      if (keysToPrevent.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    name="location.address"
                    value={formik.values.location.address}
                    onChange={(e) => {
                      formik.setFieldValue('location.address', e.target.value);
                    }}
                    ref={inputRef}
                    type="text"
                    placeholder="Location"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                  border-0 border-b-2 border-gray-300 focus:border-green-600 
                  focus:outline-none bg-transparent"
                  />
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
                  <div className="h-5">
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <div className="h-5">
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
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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


