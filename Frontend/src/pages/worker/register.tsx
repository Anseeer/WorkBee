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
    const [showPassword, setShowPassword] = useState(true);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
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
                errors.password = "Invalid password format";
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
                await Dispatch(registerWorkerThunk(values)).unwrap();
                toast.success("Registration successful!");
                navigate(API_ROUTES.WORKER.DASHBOARD, { replace: true });
            } catch (error: unknown) {
                const message = error as string || "Registration failed";
                toast.error(message);
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

                        {/* Password & Categories */}
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
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Categories Dropdown */}
                            <div className="relative">
                                <div className="h-5">
                                    {formik.touched.categories && formik.errors.categories && (
                                        <span className="text-sm text-red-500">{formik.errors.categories}</span>
                                    )}
                                </div>

                                <div
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-full h-[40px] flex items-center justify-between cursor-pointer 
                                                border-b-2 border-gray-300 text-gray-600 bg-transparent px-2
                                                hover:border-green-600 transition-colors duration-200 rounded-sm"
                                >
                                    <span className="truncate flex flex-wrap gap-1">
                                        {formik.values.categories.length > 0 ? (
                                            (() => {
                                                const selectedCats = categoriesList.filter((cat) =>
                                                    formik.values.categories.includes(cat.id)
                                                );
                                                const screenWidth = window.innerWidth;
                                                const visibleCount = screenWidth < 640 ? 1 : 2; // 1 for mobile, 2 for tablet/desktop
                                                const visibleCats = selectedCats.slice(0, visibleCount);
                                                const remainingCount = selectedCats.length - visibleCats.length;

                                                return (
                                                    <>
                                                        {visibleCats.map((cat) => (
                                                            <span
                                                                key={cat.id}
                                                                className="bg-green-100 text-green-700 text-xs sm:text-sm font-medium px-2 py-1 rounded-md"
                                                            >
                                                                {cat.name}
                                                            </span>
                                                        ))}
                                                        {remainingCount > 0 && (
                                                            <span className="text-gray-500 text-xs sm:text-sm font-medium">
                                                                +{remainingCount} more
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-gray-400">Choose Categories</span>
                                        )}
                                    </span>
                                    <span className="text-gray-400">▼</span>
                                </div>

                                {showDropdown && (
                                    <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                                        {categoriesList.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => handleCategorySelect(cat.id)}
                                                className={`px-4 py-2 flex justify-between items-center cursor-pointer
                                                        hover:bg-green-100 transition-colors duration-150
                                                        ${formik.values.categories.includes(cat.id) ? 'bg-green-50' : ''}`}
                                            >
                                                <span>{cat.name}</span>
                                                {formik.values.categories.includes(cat.id) && (
                                                    <span className="text-green-600 font-bold">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
