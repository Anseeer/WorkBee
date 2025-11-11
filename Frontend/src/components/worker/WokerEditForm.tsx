/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import {
    Camera,
    Upload,
    X,
    Check,
    Clock,
    User,
    Image,
} from "lucide-react";
import { useFormik } from "formik";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { WorkerState } from "../../slice/workerSlice";
import { fetchCategory } from "../../services/adminService";
import type { ICategory } from "../../types/ICategory";
import { getServiceByCategory } from "../../services/workerService";
import type { IWorker } from "../../types/IWorker";
import type { IAvailability } from "../../types/IAvailability";
import { uploadToCloud } from "../../utilities/uploadToCloud";
import { startOfDay } from "date-fns";
import type { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import type { IService, ISelectedService } from "../../types/IService";

interface WorkerFormData {
    name: string;
    phone: string;
    age: number | string;
    bio: string;
    profileImage: string;
    radius: string | number;
    preferredSchedule: string[];
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    govIdFront: string;
    govIdBack: string;
    services: ISelectedService[];
    categories: string[];
    availability: Date[];
}

interface WorkerEditFormProps {
    workerData?: WorkerState;
    onClose: () => void;
    onSave: (data: { worker: Partial<IWorker>; availability: IAvailability }) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

const WorkerEditForm: React.FC<WorkerEditFormProps> = ({
    workerData,
    onClose,
    onSave,
}) => {
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [allServices, setAllServices] = useState<IService[]>([]);
    const locationRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const [servicePriceErrors, setServicePriceErrors] = useState<{ [key: string]: string }>({});

    const formik = useFormik<WorkerFormData>({
        initialValues: {
            name: "",
            phone: "",
            age: "",
            bio: "",
            profileImage: "",
            radius: "",
            preferredSchedule: [],
            location: {
                address: "",
                pincode: "",
                lat: 0,
                lng: 0,
            },
            govIdFront: "",
            govIdBack: "",
            services: [],
            categories: [],
            availability: [],
        },
        validate: (values) => {
            const errors: any = {};

            // Validate service prices
            values.services.forEach((service) => {
                if (!service.price || service.price <= 0) {
                    setServicePriceErrors(prev => ({
                        ...prev,
                        [service.serviceId]: "Price is required and must be greater than 0"
                    }));
                } else {
                    setServicePriceErrors(prev => {
                        const updated = { ...prev };
                        delete updated[service.serviceId];
                        return updated;
                    });
                }
            });

            return errors;
        },
        onSubmit: (values) => {
            // Check if all services have valid prices
            const hasInvalidPrices = values.services.some(service => !service.price || service.price <= 0);

            if (hasInvalidPrices) {
                toast.error("Please enter valid prices for all selected services");
                return;
            }

            const availabilityPayload: IAvailability = {
                _id: workerData?.availability?._id || "",
                workerId: workerData?.worker?._id || "",
                availableDates: values.availability.map((date, index) => {
                    const existingDate = workerData?.availability?.availableDates?.[index];
                    return {
                        ...(existingDate?._id ? { _id: existingDate._id } : {}),
                        date: date.toISOString(),
                        bookedSlots: existingDate?.bookedSlots || [],
                    };
                }),
                createdAt: workerData?.availability?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const workerPayload: Partial<IWorker> = {
                _id: workerData?.worker?._id || "",
                name: values.name,
                phone: values.phone,
                age: typeof values.age === "string" ? parseInt(values.age) : values.age,
                bio: values.bio,
                profileImage: values.profileImage,
                radius:
                    typeof values.radius === "string"
                        ? parseInt(values.radius)
                        : values.radius,
                preferredSchedule: values.preferredSchedule,
                location: {
                    address: values.location.address,
                    pincode: values.location.pincode,
                    lat: values.location.lat,
                    lng: values.location.lng,
                },
                govId: [values.govIdFront, values.govIdBack],
                services: values.services,
                categories: values.categories,
            };

            const payload = {
                worker: workerPayload,
                availability: availabilityPayload,
            };

            onSave(payload);
        },
    });

    useEffect(() => {
        const initializeAutocomplete = () => {
            if (!window.google?.maps?.places) {
                console.error("Google Maps API not loaded properly");
                return;
            }

            try {
                const autocomplete = new window.google.maps.places.Autocomplete(
                    locationRef.current!,
                    {
                        componentRestrictions: { country: "IN" },
                        fields: ["formatted_address", "geometry", "address_components", "name"],
                    }
                );

                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (!place || !place.geometry) return;

                    const addressComponents = place.address_components || [];
                    let pincode = "";

                    for (const component of addressComponents) {
                        if (component.types.includes("postal_code")) {
                            pincode = component.long_name;
                            break;
                        }
                    }

                    const lat = place.geometry.location?.lat() ?? 0;
                    const lng = place.geometry.location?.lng() ?? 0;

                    formik.setFieldValue("location", {
                        address: place.formatted_address || "",
                        pincode,
                        lat,
                        lng,
                    });
                });

                autocompleteRef.current = autocomplete;
                setIsGoogleLoaded(true);
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
                toast.error("Failed to load location services");
            };
            document.head.appendChild(script);
        };

        loadGoogleMapsAPI();

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue("location.address", e.target.value);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetchCategory(1, 1000);
            setAllCategories(res.data.data.category);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            if (formik.values.categories.length > 0) {
                const res: AxiosResponse<{ data: IService[] }> | string = await getServiceByCategory(formik.values.categories);
                if (res && typeof res !== "string") {
                    const mappedServices = res.data.data.map((srv: any) => ({
                        ...srv,
                        id: srv._id,
                    }));
                    setAllServices(mappedServices);
                }
            } else {
                setAllServices([]);
            }
        };

        fetchServices();
    }, [formik.values.categories]);

    useEffect(() => {
        if (workerData?.worker) {
            const worker = workerData.worker;
            const newValues = {
                name: worker.name || "",
                phone: worker.phone || "",
                age: worker.age?.toString() || "",
                bio: worker.bio || "",
                profileImage: typeof worker.profileImage === "string" ? worker.profileImage : "",
                radius: worker.radius?.toString() || "2",
                preferredSchedule: worker.preferredSchedule || [],
                location: {
                    address: worker.location?.address || "",
                    pincode: worker.location?.pincode || "",
                    lat: worker.location?.lat || 0,
                    lng: worker.location?.lng || 0,
                },
                govIdFront: Array.isArray(worker.govId)
                    ? worker.govId[0] || ""
                    : typeof worker.govId === "string" ? worker.govId : "",
                govIdBack: Array.isArray(worker.govId) ? worker.govId[1] || "" : "",
                services: worker.services || [],
                categories: worker.categories || [],
                availability:
                    workerData.availability?.availableDates.map(
                        (slot) => new Date(slot.date)
                    ) || [],
            };
            formik.setValues((currentValues) => {
                if (JSON.stringify(currentValues) !== JSON.stringify(newValues)) {
                    return newValues;
                }
                return currentValues;
            });
        }
    }, [workerData]);

    const workingHours = [
        { id: "morning", label: "Morning (9am - 1pm)" },
        { id: "afternoon", label: "Afternoon (1pm - 5pm)" },
        { id: "evening", label: "Evening (5pm - 9pm)" },
        { id: "full-day", label: "Full Day (9am - 5pm)" },
    ];

    const handleArrayToggle = (
        field: "categories" | "preferredSchedule",
        value: string
    ) => {
        const updated = formik.values[field].includes(value)
            ? formik.values[field].filter((item) => item !== value)
            : [...formik.values[field], value];
        formik.setFieldValue(field, updated);
    };

    const handleServiceToggle = (service: IService) => {
        const isSelected = formik.values.services.some(s => s.serviceId === service.id);

        if (isSelected) {
            // Remove service
            const updated = formik.values.services.filter(s => s.serviceId !== service.id);
            formik.setFieldValue("services", updated);

            // Clear price error for this service
            setServicePriceErrors(prev => {
                const updated = { ...prev };
                delete updated[service.id];
                return updated;
            });
        } else {
            // Add service with default price 0 - user must enter price
            const newService: ISelectedService = {
                serviceId: service.id,
                name: service.name,
                price: 0,
                unit: "hour"
            };
            formik.setFieldValue("services", [...formik.values.services, newService]);
        }
    };

    const handleServicePriceChange = (serviceId: string, price: string) => {
        // Only allow numbers and decimal
        if (price && !/^\d*\.?\d*$/.test(price)) return;

        const updated = formik.values.services.map(s =>
            s.serviceId === serviceId ? { ...s, price: Number(price) || 0 } : s
        );
        formik.setFieldValue("services", updated);

        // Validate price
        const priceNum = Number(price);
        if (priceNum <= 0) {
            setServicePriceErrors(prev => ({
                ...prev,
                [serviceId]: "Price must be greater than 0"
            }));
        } else {
            setServicePriceErrors(prev => {
                const updated = { ...prev };
                delete updated[serviceId];
                return updated;
            });
        }
    };

    const getServicePrice = (serviceId: string): number => {
        const service = formik.values.services.find(s => s.serviceId === serviceId);
        return service?.price || 0;
    };

    const isServiceSelected = (serviceId: string): boolean => {
        return formik.values.services.some(s => s.serviceId === serviceId);
    };

    const today = startOfDay(new Date());

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600" />
                        Edit Worker Profile
                    </h2>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border-2 border-gray-300 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" /> Basic Information
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            placeholder="Phone"
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Age
                                        </label>
                                        <input
                                            name="age"
                                            type="number"
                                            min="18"
                                            max="70"
                                            value={formik.values.age}
                                            onChange={formik.handleChange}
                                            placeholder="Age"
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formik.values.bio}
                                        onChange={formik.handleChange}
                                        rows={3}
                                        placeholder="Bio"
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <div className="h-5">
                                        {formik.touched.location?.address && formik.errors.location?.address && (
                                            <span className="text-sm text-red-500">
                                                {formik.errors.location.address}
                                            </span>
                                        )}
                                        {!isGoogleLoaded && (
                                            <p className="text-xs text-gray-500 mt-1">Loading location services...</p>
                                        )}
                                    </div>
                                    <input
                                        ref={locationRef}
                                        name="location.address"
                                        value={formik.values.location.address}
                                        onChange={handleLocationInputChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter your address"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-2 border-gray-300 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-green-600" /> Work Details
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter radius (in km)
                                    </label>
                                    <input
                                        type="number"
                                        name="radius"
                                        min="1"
                                        max="100"
                                        placeholder="e.g., 15"
                                        value={formik.values.radius}
                                        onChange={formik.handleChange}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Work Schedule
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {workingHours.map((slot) => (
                                            <label
                                                key={slot.id}
                                                className={`flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer ${formik.values.preferredSchedule.includes(slot.id)
                                                    ? "bg-green-100 border-green-400"
                                                    : "hover:bg-green-50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formik.values.preferredSchedule.includes(slot.id)}
                                                        onChange={() => handleArrayToggle("preferredSchedule", slot.id)}
                                                        className="hidden"
                                                    />
                                                    <span className="text-sm">{slot.label}</span>
                                                </div>
                                                {formik.values.preferredSchedule.includes(slot.id) && (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DayPicker
                                mode="multiple"
                                selected={formik.values.availability}
                                onSelect={(dates) => formik.setFieldValue("availability", dates)}
                                fromMonth={today}
                                disabled={[
                                    { before: today },
                                ]}
                                modifiersClassNames={{
                                    selected: "bg-green-700 text-white rounded-full",
                                }}
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Image className="w-5 h-5 text-purple-600" /> Profile Image
                                </h3>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer">
                                    {formik.values.profileImage ? (
                                        <img
                                            src={formik.values.profileImage}
                                            alt="Profile"
                                            className="w-16 h-16 rounded-full object-cover mb-2"
                                        />
                                    ) : (
                                        <Camera className="w-8 h-8 mb-2 text-purple-500" />
                                    )}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={async (e) => {
                                            if (e.target.files) {
                                                const file = e.target.files[0];
                                                const url = await uploadToCloud(file);
                                                formik.setFieldValue("profileImage", url);
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="bg-white  border-2 border-gray-300 p-4 rounded-xl  grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Front</label>
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer">
                                        {formik.values.govIdFront ? (
                                            <img
                                                src={formik.values.govIdFront}
                                                alt="Front ID"
                                                className="w-full h-full object-cover rounded mb-1"
                                            />
                                        ) : (
                                            <Upload className="w-6 h-6 mb-1 text-orange-500" />
                                        )}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={async (e) => {
                                                if (e.target.files) {
                                                    const file = e.target.files[0];
                                                    const url = await uploadToCloud(file);
                                                    formik.setFieldValue("govIdFront", url);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="block mb-2">Back</label>
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer">
                                        {formik.values.govIdBack ? (
                                            <img
                                                src={formik.values.govIdBack}
                                                alt="Back ID"
                                                className="w-full h-full object-cover rounded mb-1"
                                            />
                                        ) : (
                                            <Upload className="w-6 h-6 mb-1 text-orange-500" />
                                        )}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={async (e) => {
                                                if (e.target.files) {
                                                    const file = e.target.files[0];
                                                    const url = await uploadToCloud(file);
                                                    formik.setFieldValue("govIdBack", url);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white  border-2 border-gray-300 p-4 rounded-xl ">
                                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {allCategories.map((cat) => (
                                        <label key={cat._id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formik.values.categories.includes(cat._id)}
                                                onChange={() => handleArrayToggle("categories", cat._id)}
                                            />
                                            {cat.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border-2 border-gray-300">
                                <h3 className="text-lg font-semibold mb-4">Services & Pricing</h3>

                                {/* Max height with scroll for long lists */}
                                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {allServices?.map((service) => {
                                        const isSelected = isServiceSelected(service.id);
                                        const servicePrice = getServicePrice(service.id);

                                        return (
                                            <div key={service.id} className="space-y-2">
                                                <label
                                                    className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all ${isSelected
                                                        ? "bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-sm"
                                                        : "bg-white border-gray-300 hover:border-green-300 hover:shadow-sm"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2.5 flex-1">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-600"
                                                            checked={isSelected}
                                                            onChange={() => handleServiceToggle(service)}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-sm font-medium text-gray-800">{service.name}</span>
                                                            {isSelected && servicePrice > 0 && (
                                                                <div className="inline-flex items-center ml-2 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                                                                    ₹{servicePrice}/hr
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSelected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                                                </label>

                                                {/* Compact Price Input - Only show when selected */}
                                                {isSelected && (
                                                    <div className="ml-6 pl-3 border-l-2 border-green-300 py-1.5 bg-gray-50 rounded-r-lg">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={servicePrice || ""}
                                                                onChange={(e) => handleServicePriceChange(service.id, e.target.value)}
                                                                placeholder="Price"
                                                                className={`w-24 px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm ${servicePriceErrors[service.id]
                                                                    ? "border-red-400 bg-red-50"
                                                                    : "border-gray-300 bg-white"
                                                                    }`}
                                                            />
                                                            <span className="text-xs text-gray-500">₹/hour</span>
                                                            {!servicePriceErrors[service.id] && servicePrice > 0 && (
                                                                <span className="text-xs text-green-600 font-medium ml-auto">✓ Valid</span>
                                                            )}
                                                        </div>
                                                        {servicePriceErrors[service.id] && (
                                                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                                <span className="text-red-500">⚠</span>
                                                                {servicePriceErrors[service.id]}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary */}
                                {formik.values.services.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                                Selected Services: <span className="font-semibold text-gray-800">{formik.values.services.length}</span>
                                            </span>
                                            {formik.values.services.every(s => s.price > 0) ? (
                                                <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> All prices set
                                                </span>
                                            ) : (
                                                <span className="text-orange-500 text-xs font-medium">
                                                    ⚠ {formik.values.services.filter(s => !s.price || s.price <= 0).length} price(s) needed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" /> Update Worker
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkerEditForm;