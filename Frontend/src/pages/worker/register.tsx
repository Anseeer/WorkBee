/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerWorkerThunk } from "../../slice/workerSlice";
import { getAllCategories } from "../../services/workerService";
import type { ICategory } from "../../types/ICategory";
import { emailRegex, passRegex, phoneRegex } from "../../constant/regexs";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_ROUTES } from "../../constant/api.routes";


const WorkerRegistrationPage = () => {
    const Dispatch = useAppDispatch();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            categories: [] as string[],
        },
        validate: (values) => {
            const errors: {
                name?: string;
                email?: string;
                phone?: string;
                password?: string;
                confirmPassword?: string;
                location?: { address?: string };
                categories?: string;
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
                errors.password = "Confirm Password is required";
            } else if (!passRegex.test(values.password)) {
                errors.password = "Invalid password format. Example: Abc123@";
            }

            if (values.confirmPassword !== values.password) {
                errors.password = "Passwords must match"
                errors.confirmPassword = "Passwords must match"
            }

            if (!values.location.address) {
                errors.location = { address: "Location is required" };
            }

            if (!values.location.pincode || values.location.pincode == "" || !values.location.lat || !values.location.lng) {
                errors.location = { address: "Invalid Location, please try again " };
            }

            if (!values.categories.length) {
                errors.categories = "Select at least one category";
            }

            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const workerId = await Dispatch(registerWorkerThunk(values)).unwrap();
                console.log("WorkerID :", workerId)
                toast.success("Registration successful!");
                navigate(API_ROUTES.WORKER.VERIFY_REGISTERATION, { replace: true });

            } catch (error: any) {
                toast.error(error);
            } finally {
                setLoading(false);
            }
        },

    });

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAllCategories();
            const formatted = res.map((cat: ICategory) => ({
                ...cat,
                id: cat._id,
            }));
            setCategoriesList(formatted);
        };
        fetchCategories();
    }, []);

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


    const handleCategorySelect = (categoryId: string) => {
        const newSelection = formik.values.categories.includes(categoryId)
            ? formik.values.categories.filter((c) => c !== categoryId)
            : [...formik.values.categories, categoryId];

        formik.setFieldValue("categories", newSelection);
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Logo */}
            <div
                onClick={() => navigate("/workers")}
                className="absolute top-6 left-6 sm:top-8 sm:left-8">
                <h1 className="merienda-text text-2xl sm:text-3xl md:text-4xl text-green-900">WorkBee</h1>
            </div>

            {/* Centered Form Container */}
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex justify-center items-center mt-16 mb-10">
                <div className="bg-white rounded-3xl border-2 border-green-600 p-5 sm:p-6 md:p-8 shadow-md w-full">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-6">
                        Become a trusted worker on WorkBee
                    </h2>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-5 sm:space-y-6">
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
                                        if (keysToPrevent.includes(e.key)) e.preventDefault();
                                    }}
                                    name="location.address"
                                    value={formik.values.location.address}
                                    onChange={(e) => formik.setFieldValue('location.address', e.target.value)}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                        {/* ----------  Password & Confirm Password  ---------- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Password */}
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
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2 top-7 text-gray-500"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <div className="h-5">
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <span className="text-sm text-red-500">{formik.errors.confirmPassword}</span>
                                    )}
                                </div>
                                <input
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    className="w-full relative px-0 py-2 text-gray-600 placeholder-gray-400 
                 border-0 border-b-2 border-gray-300 focus:border-green-600 
                 focus:outline-none bg-transparent pr-8"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-2 top-7 text-gray-500"
                                >
                                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* ----------  BIG CATEGORY SELECTION (full row)  ---------- */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="h-5">
                                {formik.touched.categories && formik.errors.categories && (
                                    <span className="text-sm text-red-500">{formik.errors.categories}</span>
                                )}
                            </div>

                            <div className="relative w-full">
                                {/* Trigger */}
                                <div
                                    onClick={() => setShowDropdown((p) => !p)}
                                    className="w-full min-h-[42px] flex items-center justify-between 
        cursor-pointer border border-gray-300 hover:border-green-600 
        transition-all duration-200 bg-white px-3 py-2 rounded-md shadow-sm"
                                >
                                    <div className="flex flex-wrap gap-1 flex-1">
                                        {formik.values.categories.length > 0 ? (
                                            (() => {
                                                const selected = categoriesList.filter((c) =>
                                                    formik.values.categories.includes(c.id)
                                                );
                                                const screen = window.innerWidth;
                                                const visible = screen < 640 ? 2 : 4;
                                                const shown = selected.slice(0, visible);
                                                const more = selected.length - shown.length;

                                                return (
                                                    <>
                                                        {shown.map((cat) => (
                                                            <span
                                                                key={cat.id}
                                                                className="bg-green-100 text-green-700 text-xs sm:text-sm 
                             font-medium px-2.5 py-1 rounded-md"
                                                            >
                                                                {cat.name}
                                                            </span>
                                                        ))}
                                                        {more > 0 && (
                                                            <span className="text-gray-500 text-xs sm:text-sm font-medium">
                                                                +{more} more
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-gray-400">Choose Categories (click to open)</span>
                                        )}
                                    </div>
                                    <span className="text-gray-400 ml-2">▼</span>
                                </div>
                            </div>

                            {/* Dropdown – BIG, scrollable, same design */}
                            {showDropdown && (
                                <div
                                    className="absolute mt-1 mb-2 bg-white rounded-md shadow-lg 
                                            max-h-64 overflow-y-auto z-20 border border-gray-200 
                                            w-max min-w-[200px]"
                                >
                                    {categoriesList.map((cat) => (
                                        <div
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`flex justify-between items-center px-4 py-2 
                                                     hover:bg-green-50 transition-colors ${formik.values.categories.includes(cat.id)
                                                    ? "bg-green-50"
                                                    : ""
                                                }`}
                                        >
                                            <span className="text-gray-700">{cat.name}</span>

                                            {formik.values.categories.includes(cat.id) && (
                                                <span className="text-green-600 font-bold">✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            <p className="text-gray-600 text-sm sm:text-base">
                                Already have an account?{' '}
                                <span
                                    onClick={() => navigate('/workers/login')}
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
    );

};

export default WorkerRegistrationPage;
