import { useRef, useState, useEffect, useReducer } from "react";
import type { Action } from "../../types/ActionTypes";
import { toast } from "react-toastify";
import { emailRegex, passRegex, phoneRegex } from "../../regexs";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerWorkerThunk } from "../../slice/workerSlice";
import type { AxiosError } from "axios";
import { getAllCategories } from "../../services/workerService";
import type { ICategory } from "../../types/ICategory";
import { useNavigate } from "react-router-dom";


const WorkerRegistrationPage = () => {
    const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // only IDs
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const Dispatch = useAppDispatch();
    const [Loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategoriesList(res);
            } catch (err: unknown) {
                toast.error("Failed to fetch categories");
                console.log(err)
            }
        };
        fetchCategories();
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
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleCategorySelect = (categoryId: string) => {
        const newSelection = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((c) => c !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(newSelection);
        dispatch({ type: "SET_CATEGORIES", payload: newSelection });
    };



    const initializeAutocomplete = () => {
        if (!locationRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
            locationRef.current,
            {
                types: ['address'],
                componentRestrictions: { country: 'IN' },
                fields: ['formatted_address', 'geometry', 'address_components', 'name']
            }
        );


        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();

            if (!place || !place.geometry) {
                console.log('No place data available');
                return;
            }


            const addressComponents = place.address_components || [];
            let pincode = '';


            for (const component of addressComponents) {
                if (component.types.includes('postal_code')) {
                    pincode = component.long_name;
                    break;
                }
            }


            const lat = place.geometry.location?.lat();
            const lng = place.geometry.location?.lng();


            dispatch({
                type: "SET_LOCATION",
                payload: {
                    address: place.formatted_address || '',
                    pincode: pincode,
                    lat: lat || null,
                    lng: lng || null,
                }
            });
        });
    };


    interface IState {
        name: string,
        email: string,
        password: string,
        phone: string,
        location: {
            address: string,
            pincode: string,
            lat: number | null;
            lng: number | null;

        },
        categories: string[]
    }
    const initialState: IState = {
        name: "",
        email: "",
        phone: "",
        password: "",
        location: {
            address: "",
            pincode: "",
            lat: 0,
            lng: 0
        },
        categories: [""]
    }

    const reducer = (state: IState, action: Action) => {
        switch (action.type) {
            case "SET_NAME":
                return { ...state, name: action.payload };
            case "SET_EMAIL":
                return { ...state, email: action.payload };
            case "SET_PHONE":
                return { ...state, phone: action.payload };
            case "SET_PASS":
                return { ...state, password: action.payload };
            case "SET_LOCATION":
                return {
                    ...state, location: {
                        address: action.payload.address,
                        pincode: action.payload.pincode,
                        lat: action.payload.lat,
                        lng: action.payload.lng,
                    }
                };
            case "SET_LOCATION_ADDRESS":
                return {
                    ...state, location: {
                        ...state.location,
                        address: action.payload
                    }
                };
            case "SET_CATEGORIES":
                return { ...state, categories: action.payload }
            case "RESET_FORM":
                return initialState;
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!state.name?.trim() || !state.email?.trim() || !state.phone?.trim() || !state.password?.trim() || !state.categories || !state.location) {
            toast.error("All fields are required");
            return;
        }

        if (!emailRegex.test(state.email)) {
            toast.error("Invalid email format");
            return;
        }

        if (!passRegex.test(state.password)) {
            toast.error("Password must be at least 6 characters long and include letters, numbers, and symbols like _ . @");
            return;
        }

        if (!state.location || !state.location.address || !state.location.pincode) {
            toast.error("Location is required");
            return;
        }

        if (!phoneRegex.test(state.phone)) {
            toast.error("Invalid phone number");
            return;
        }
        setLoading(true)
        try {
            await Dispatch(registerWorkerThunk(state))
            toast.success("Registration successful!");
            navigate('/workers/dashboard', { replace: true })
            dispatch({ type: "RESET_FORM", payload: initialState });
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            console.log(err)
            toast.error("Registration failed " + err);
        } finally {
            setLoading(false);
        }

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

                        <form onSubmit={HandleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input
                                    autoComplete="new-name"
                                    value={state?.name}
                                    onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                                    name="name"
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                                <input
                                    value={state.location.address}
                                    onChange={(e) => dispatch({ type: "SET_LOCATION_ADDRESS", payload: e.target.value })}
                                    type="text"
                                    ref={locationRef}
                                    placeholder="location"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    value={state?.email}
                                    onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                                <input
                                    value={state?.phone}
                                    onChange={(e) => dispatch({ type: "SET_PHONE", payload: e.target.value })}
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    value={state?.password}
                                    onChange={(e) => dispatch({ type: "SET_PASS", payload: e.target.value })}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />

                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className=" w-full cursor-pointer border-b-2 border-gray-300 py-2 px-1 text-gray-600 bg-transparent focus:outline-none"
                                    >

                                        {selectedCategories.length > 0
                                            ? categoriesList
                                                .filter((cat) => selectedCategories.includes(cat._id))
                                                .map((cat) => cat.name)
                                                .join(", ")
                                            : "Choose Categories"}

                                    </div>

                                    {showDropdown && (
                                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto mt-1">
                                            {categoriesList.map((cat) => (
                                                <div
                                                    key={cat._id}
                                                    onClick={() => handleCategorySelect(cat._id)}
                                                    className={`px-4 py-2 hover:bg-green-100 flex justify-between items-center cursor-pointer ${selectedCategories.includes(cat._id) ? "bg-green-50" : ""
                                                        }`}
                                                >
                                                    <span>{cat.name}</span>
                                                    {selectedCategories.includes(cat._id) && (
                                                        <span className="text-green-600 font-bold">✓</span>
                                                    )}
                                                </div>
                                            ))}


                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button

                                    type="submit"
                                    className="w-full bg-green-900 h-[30px] hover:bg-green-600 text-white font-semibold py-3 pt-1 px-4 rounded-full transition-colors duration-200"
                                >
                                    {Loading ? `SigningUP...` : `Sign up`}
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <span onClick={() => navigate("/workers/login")} className="text-green-600 hover:text-green-700 font-medium cursor-pointer">
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
