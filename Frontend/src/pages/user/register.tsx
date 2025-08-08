import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { emailRegex, passRegex, phoneRegex } from "../../regexs";
import type { AxiosError } from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { API_ROUTES } from "../../constant/api.routes";


const RegistrationPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
        console.log(values)
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


      return errors;
    },
  })

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'IN' },
        fields: ['formatted_address', 'geometry', 'address_components', 'name']
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();

      if (!place || !place.geometry) return;

      const addressComponents = place.address_components || [];
      let pincode = "";

      for (const component of addressComponents) {
        if (component.types.includes("postal_code")) {
          pincode = component.long_name;
          break;
        }
      }

      const lat = place.geometry.location?.lat() || 0;
      const lng = place.geometry.location?.lng() || 0;

      formik.setFieldValue("location", {
        address: place.formatted_address || "",
        pincode,
        lat,
        lng,
      });
    });


  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 fixed w-full">
      <div className="absolute top-7.5 left-7.5">
        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
      </div>

      <div className="flex items-center justify-center m-25">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl border-2 min-h-[400px] border-green-600 p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
              Let's get you started
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                    name="location.address"
                    value={formik.values.location.address}
                    onChange={(e) => {
                      formik.setFieldValue("location.address", e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    ref={inputRef}
                    type="text"
                    placeholder="Location"
                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                         border-0 border-b-2 border-gray-300 focus:border-green-600 
                         focus:outline-none bg-transparent"
                  />
                </div>
              </div>

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
                    type={showPassword ? "password" : "text"}
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
                    type={showConfirmPassword ? "password" : "text"}
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-900 h-[30px] hover:bg-green-600 
                       text-white font-semibold py-3 pt-1 px-4 
                       rounded-full transition-colors duration-200"
                >
                  {loading ? "Signing..." : "Sign up"}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  Already have account?{" "}
                  <span
                    onClick={() => navigate("/login", { replace: true })}
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


