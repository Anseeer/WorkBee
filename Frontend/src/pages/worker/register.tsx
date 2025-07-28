import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerWorkerThunk } from "../../slice/workerSlice";
import { getAllCategories } from "../../services/workerService";
import type { ICategory } from "../../types/ICategory";
import { emailRegex, passRegex, phoneRegex } from "../../regexs";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const WorkerRegistrationPage = () => {
    const Dispatch = useAppDispatch();
    const navigate = useNavigate();
    const locationRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // ✅ Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategoriesList(res);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                toast.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    // ✅ Load Google Maps API
    useEffect(() => {
        const loadGoogleMapsAPI = () => {
            if (window.google && window.google.maps) {
                initializeAutocomplete();
                return;
            }
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY
                }&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeAutocomplete;
            document.head.appendChild(script);
        };
        loadGoogleMapsAPI();

        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const initializeAutocomplete = () => {
        if (!locationRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(locationRef.current, {
            types: ["address"],
            componentRestrictions: { country: "IN" },
            fields: ["formatted_address", "geometry", "address_components", "name"],
        });

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

    // ✅ Formik setup
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

            if (!values.categories.length) {
                errors.categories = "Select at least one category";
            }

            return errors;
        },
        onSubmit: async (values) => {
            console.log("Values :", values)
            setLoading(true);
            try {
                const res = await Dispatch(registerWorkerThunk(values)).unwrap();
                console.log("res :", res);
                toast.success("Registration successful!");
                localStorage.clear();
                localStorage.setItem("workerToken", res.token);
                localStorage.setItem("role", res.role);
                navigate("/workers/dashboard", { replace: true });
            } catch (error: unknown) {
                const err = error as AxiosError<{ data: string }>;
                toast.error(err.response?.data?.data || "Registration failed");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleCategorySelect = (categoryId: string) => {
        const newSelection = formik.values.categories.includes(categoryId)
            ? formik.values.categories.filter((c) => c !== categoryId)
            : [...formik.values.categories, categoryId];

        formik.setFieldValue("categories", newSelection);
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
                            Become a trusted worker on WorkBee
                        </h2>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* Name + Location */}
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
                                        onChange={(e) => formik.setFieldValue("location.address", e.target.value)}
                                        onBlur={formik.handleBlur}
                                        ref={locationRef}
                                        type="text"
                                        placeholder="Location"
                                        className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                           border-0 border-b-2 border-gray-300 focus:border-green-600 
                           focus:outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Email + Phone */}
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

                            {/* Password + Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password Field */}
                                <div>
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
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 
                 border-0 border-b-2 border-gray-300 focus:border-green-600 
                 focus:outline-none bg-transparent"
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div className="relative">
                                    {/* Error Message */}
                                    <div className="h-5">
                                        {formik.touched.categories && formik.errors.categories && (
                                            <span className="text-sm text-red-500">{formik.errors.categories}</span>
                                        )}
                                    </div>

                                    {/* Dropdown Trigger */}
                                    <div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-full h-[40px] flex items-center justify-between cursor-pointer 
               border-b-2 border-gray-300 text-gray-600 bg-transparent px-2
               hover:border-green-600 transition-colors duration-200 rounded-sm"
                                    >
                                        <span>
                                            {formik.values.categories.length > 0
                                                ? categoriesList
                                                    .filter((cat) => formik.values.categories.includes(cat._id))
                                                    .map((cat) => cat.name)
                                                    .join(", ")
                                                : "Choose Categories"}
                                        </span>
                                        <span className="text-gray-400">▼</span>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute mt-1 w-full bg-white border border-gray-300 
                                       rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                                            {categoriesList.map((cat) => (
                                                <div
                                                    key={cat._id}
                                                    onClick={() => handleCategorySelect(cat._id)}
                                                    className={`px-4 py-2 flex justify-between items-center cursor-pointer
                                                    hover:bg-green-100 transition-colors duration-150
                                                  ${formik.values.categories.includes(cat._id) ? "bg-green-50" : ""}`}
                                                >
                                                    <span>{cat.name}</span>
                                                    {formik.values.categories.includes(cat._id) && (
                                                        <span className="text-green-600 font-bold">✓</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>


                            {/* Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-900 h-[30px] hover:bg-green-600 text-white font-semibold py-3 pt-1 px-4 rounded-full transition-colors duration-200"
                                >
                                    {loading ? "Signing..." : "Sign up"}
                                </button>
                            </div>

                            {/* Sign-in */}
                            <div className="text-center pt-2">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <span
                                        onClick={() => navigate("/workers/login")}
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

export default WorkerRegistrationPage;
