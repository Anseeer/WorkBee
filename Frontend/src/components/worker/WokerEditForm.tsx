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
import type { IService } from "../../types/IServiceTypes";
import { getServiceByCategory } from "../../services/workerService";
import type { IWorker } from "../../types/IWorker";
import type { IAvailability } from "../../types/IAvailability";
import { uploadToCloud } from "../../utilities/uploadToCloud";
import { startOfMonth } from "date-fns";


interface WorkerFormData {
    name: string;
    phone: string;
    age: number | string;
    bio: string;
    profileImage: string;
    radius: string | number;
    workType: string[];
    preferredSchedule: string[];
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    govIdFront: string;
    govIdBack: string;
    services: string[];
    categories: string[];
    availability: Date[];
}

interface WorkerEditFormProps {
    workerData?: WorkerState;
    onClose: () => void;
    onSave: (data: { worker: Partial<IWorker>; availability: IAvailability }) => void;
}

const WorkerEditForm: React.FC<WorkerEditFormProps> = ({
    workerData,
    onClose,
    onSave,
}) => {
    const locationRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [allServices, setAllServices] = useState<IService[]>([]);
    useEffect(() => {
        console.log(showDropdown);
        const loadGoogleMapsAPI = () => {
            if (window.google && window.google.maps) {
                initializeAutocomplete();
                return;
            }
            const script = document.createElement("script");
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
    });

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

    const formik = useFormik<WorkerFormData>({
        initialValues: {
            name: "",
            phone: "",
            age: "",
            bio: "",
            profileImage: "",
            radius: "",
            workType: [],
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
        onSubmit: (values) => {
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
                workType: values.workType,
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

            console.log("Final Payload:", payload);
            onSave(payload);
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetchCategory();
            setAllCategories(res.data.data.categories);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            if (formik.values.categories.length > 0) {
                const res = await getServiceByCategory(formik.values.categories);
                const mappedServices = res.data.data.map((srv: any) => ({
                    ...srv,
                    id: srv._id,
                }));
                setAllServices(mappedServices);
            } else {
                setAllServices([]);
            }
        };

        fetchServices();
    }, [formik.values.categories]);


    useEffect(() => {
        if (workerData?.worker) {
            const worker = workerData.worker;
            formik.setValues({
                name: worker.name || "",
                phone: worker.phone || "",
                age: worker.age?.toString() || "",
                bio: worker.bio || "",
                profileImage: typeof worker.profileImage === "string" ? worker.profileImage : "",
                radius: worker.radius?.toString() || "2",
                workType: Array.isArray(worker.workType) ? worker.workType : [worker.workType],
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
            });
        }
    }, [workerData]);


    const workingHours = [
        { id: "morning", label: "Morning (9am - 1pm)" },
        { id: "afternoon", label: "Afternoon (1pm - 5pm)" },
        { id: "evening", label: "Evening (5pm - 9pm)" },
        { id: "full-day", label: "Full Day (9am - 5pm)" },
    ];

    const jobTypes = [
        { id: "one-time", label: "One Time" },
        { id: "weekly", label: "Weekly" },
        { id: "monthly", label: "Monthly" },
    ];

    const handleArrayToggle = (
        field: "services" | "categories" | "preferredSchedule",
        value: string
    ) => {
        const updated = formik.values[field].includes(value)
            ? formik.values[field].filter((item) => item !== value)
            : [...formik.values[field], value];
        formik.setFieldValue(field, updated);
    };

    const today = new Date();
    const startOfCurrentMonth = startOfMonth(today);

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
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 space-y-4">
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
                                    </div>
                                    <input
                                        id="location"
                                        value={formik.values.location.address}
                                        onChange={(e) =>
                                            formik.setFieldValue("location.address", e.target.value)
                                        }
                                        onBlur={formik.handleBlur}
                                        ref={locationRef}
                                        type="text"
                                        placeholder="Enter your address"
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 space-y-4">
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
                                        Work Type
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {jobTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => {
                                                    const current = formik.values.workType;
                                                    const updated = current.includes(type.id)
                                                        ? current.filter((t) => t !== type.id)
                                                        : [...current, type.id];
                                                    formik.setFieldValue("workType", updated);
                                                }}
                                                className={`flex items-center justify-center px-3 py-2 border rounded-lg transition 
                    ${formik.values.workType.includes(type.id)
                                                        ? "bg-green-100 border-green-400"
                                                        : "hover:bg-green-50"
                                                    }`}
                                            >
                                                <span className="text-sm">{type.label}</span>
                                                {formik.values.workType.includes(type.id) && (
                                                    <Check className="w-4 h-4 text-green-600 ml-1" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {formik.values.workType.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {formik.values.workType.map((wt) => {
                                                const typeLabel = jobTypes.find((t) => t.id === wt)?.label || wt;
                                                return (
                                                    <span
                                                        key={wt}
                                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-300"
                                                    >
                                                        {typeLabel}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
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
                                fromMonth={startOfCurrentMonth}
                                disabled={[
                                    { before: today },
                                ]}
                                modifiersClassNames={{
                                    selected: "bg-green-700 text-white rounded-full",
                                }}
                            />


                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
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

                            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100 grid grid-cols-2 gap-4">
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

                            <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-xl border border-teal-100">
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

                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                                <h3 className="text-lg font-semibold mb-4">Services</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {allServices?.map((service) => {
                                        const isSelected = formik.values.services.includes(service.id);

                                        return (
                                            <label
                                                key={service.id}
                                                className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${isSelected ? "bg-green-100 border-green-500" : "bg-white border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => handleArrayToggle("services", service.id)}
                                                />
                                                <span className="flex-1">{service.name}</span>
                                                {isSelected && <Check className="w-4 h-4 text-green-600" />}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-700 text-white rounded-lg"
                        >
                            <Check className="w-4 h-4 inline mr-2" /> Update Worker
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkerEditForm;
