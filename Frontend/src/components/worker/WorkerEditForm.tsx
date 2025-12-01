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
import type { IAvailability, ISlot } from "../../types/IAvailability";
import { uploadToCloud } from "../../utilities/uploadToCloud";
import { startOfDay } from "date-fns";
import type { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import type { IService, ISelectedService } from "../../types/IService";
import { fetchLocationSuggestions } from "../../utilities/fetchLocation";

interface WorkerFormData {
    name: string;
    phone: string;
    age: number | string;
    bio: string;
    profileImage: string;
    radius: string | number;
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
    availability: ISlot[];
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

interface Suggestion {
    address: string;
    pincode: string;
    lat: string | number;
    lng: string | number;
}

const WorkerEditForm: React.FC<WorkerEditFormProps> = ({
    workerData,
    onClose,
    onSave,
}) => {
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [allServices, setAllServices] = useState<IService[]>([]);
    const locationRef = useRef<HTMLInputElement>(null);
    const [servicePriceErrors, setServicePriceErrors] = useState<{ [key: string]: string }>({});
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [locationError, setLocationError] = useState("");
    const allSlots = ["morning", "afternoon", "evening", "full-day"];

    const formik = useFormik<WorkerFormData>({
        initialValues: {
            name: "",
            phone: "",
            age: "",
            bio: "",
            profileImage: "",
            radius: "",
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
            availability: workerData?.availability?.availableDates || [],
        },
        validate: (values) => {
            const errors: any = {};

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

            if (!values.name.trim()) {
                errors.name = "Username is required";
            }

            if (!values.age) {
                errors.age = "Age is required";
            }

            if (!values.radius) {
                errors.radius = "Radius is required";
            }

            if (!values.location.address.trim()) {
                errors.location = { address: "Location is required" };
            }

            if (!values.phone.trim()) {
                errors.phone = "Phone number is required";
            } else if (!/^[0-9]{10}$/.test(values.phone)) {
                errors.phone = "Enter a valid 10-digit phone number";
            }

            if (!values.services || values.services.length === 0) {
                errors.services = "Services are required";
            }

            if (!values.categories || !values.categories.length) {
                errors.categories = "Category is required";
            }

            if (!values.services) {
                errors.services = "Subcategory is required";
            }

            if (!values.bio.trim()) {
                errors.bio = "Description is required";
            }

            if (!values.availability || values.availability.length === 0) {
                errors.availability = "Please select at least one available date";
            } else {
                // Check if each selected date has at least one slot (booked or available)
                const datesWithNoSlots = values.availability.filter(dateEntry => {
                    return !dateEntry.availableSlots || dateEntry.availableSlots.length === 0;
                });

                if (datesWithNoSlots.length > 0) {
                    errors.availability = "Each selected date must have at least one slot selected";
                }
            }

            return errors;
        },
        onSubmit: (values) => {
            const hasInvalidPrices = values.services.some(service => !service.price || service.price <= 0);

            if (hasInvalidPrices) {
                toast.error("Please enter valid prices for all selected services");
                return;
            }

            const availabilityPayload: IAvailability = {
                _id: workerData?.availability?._id || "",
                workerId: workerData?.worker?._id || "",

                availableDates: values.availability.map((day) => {
                    const existing = workerData?.availability?.availableDates?.find(
                        (d) => new Date(d.date).toDateString() === new Date(day.date).toDateString()
                    );

                    return {
                        ...(existing?._id ? { _id: existing._id } : {}),

                        date: new Date(day.date).toISOString(),

                        availableSlots: day.availableSlots.map((slot, index) => {
                            const existingSlot = existing?.availableSlots?.[index];

                            return {
                                ...(existingSlot?._id ? { _id: existingSlot._id } : {}),
                                slot: slot.slot,
                                booked: slot.booked ?? false,
                                jobId: slot.jobId || null
                            };
                        }),
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
                availability: workerData?.availability?.availableDates?.map((entry) => ({
                    _id: entry._id,
                    date: new Date(entry.date),
                    availableSlots: entry.availableSlots || []
                })) || [],
            };
            formik.setValues((currentValues) => {
                if (JSON.stringify(currentValues) !== JSON.stringify(newValues)) {
                    return newValues;
                }
                return currentValues;
            });
        }
    }, [workerData]);

    const handleArrayToggle = (
        field: "categories",
        value: string
    ) => {
        const updated = formik.values[field]?.includes(value)
            ? formik.values[field].filter((item) => item !== value)
            : [...formik.values[field], value];
        formik.setFieldValue(field, updated);
    };

    const handleServiceToggle = (service: IService) => {
        const isSelected = formik.values.services.some(s => s.serviceId === service.id);

        if (isSelected) {
            const updated = formik.values.services.filter(s => s.serviceId !== service.id);
            formik.setFieldValue("services", updated);

            setServicePriceErrors(prev => {
                const updated = { ...prev };
                delete updated[service.id];
                return updated;
            });
        } else {
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
        if (price && !/^\d*\.?\d*$/.test(price)) return;

        const updated = formik.values.services.map(s =>
            s.serviceId === serviceId ? { ...s, price: Number(price) || 0 } : s
        );
        formik.setFieldValue("services", updated);

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

    const handleDateSelection = (dates: Date[] | undefined) => {
        if (!dates) {
            dates = [];
        }

        const removedDates = formik.values.availability.filter(existingDate => {
            const stillSelected = dates?.some(
                d => new Date(d).toDateString() === new Date(existingDate.date).toDateString()
            );
            return !stillSelected;
        });

        const hasBookedSlots = removedDates.some(dateEntry =>
            dateEntry.availableSlots.some(slot => slot.booked)
        );

        if (hasBookedSlots) {
            toast.error("Cannot remove dates that have booked slots");
            const datesWithBookedSlots = removedDates.filter(dateEntry =>
                dateEntry.availableSlots.some(slot => slot.booked)
            );
            dates = [
                ...dates,
                ...datesWithBookedSlots.map(d => new Date(d.date))
            ];
        }

        const updated = dates.map((date) => {
            const existing = formik.values.availability.find(
                (a) => new Date(a.date).toDateString() === date.toDateString()
            );

            if (existing) {
                return existing;
            }

            return {
                date,
                availableSlots: []
            };
        });

        formik.setFieldValue("availability", updated);
    };

    const toggleSlot = (dateKey: string, slotName: string) => {
        const updated = formik.values.availability.map((item) => {
            const dKey = new Date(item.date).toDateString();
            if (dKey !== dateKey) return item;

            const targetSlot = item.availableSlots.find(s => s.slot === slotName);

            if (targetSlot?.booked) {
                return item;
            }

            const slotExists = item.availableSlots.some(s => s.slot === slotName);

            if (slotExists) {
                return {
                    ...item,
                    availableSlots: item.availableSlots.filter(s => s.slot !== slotName)
                };
            } else {
                return {
                    ...item,
                    availableSlots: [
                        ...item.availableSlots,
                        { slot: slotName, booked: false, jobId: null }
                    ]
                };
            }
        });

        formik.setFieldValue("availability", updated);
    };

    const isSlotSelected = (dateKey: string, slotName: string): boolean => {
        const dateEntry = formik.values.availability.find(
            (a) => new Date(a.date).toDateString() === dateKey
        );
        return dateEntry?.availableSlots.some(s => s.slot === slotName) || false;
    };

    const isSlotBooked = (dateKey: string, slotName: string): boolean => {
        const dateEntry = formik.values.availability.find(
            (a) => new Date(a.date).toDateString() === dateKey
        );
        const slot = dateEntry?.availableSlots.find(s => s.slot === slotName);
        return slot?.booked || false;
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="sticky  z-10 top-0 bg-gradient-to-r from-green-600 to-green-700 border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="w-6 h-6 text-white-600" />
                        Edit Worker Profile
                    </h2>
                    <button
                        className="p-2 hover:bg-gray-500  rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-white" />
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
                                        onBlur={formik.handleBlur}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.name}
                                        </p>
                                    )}
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
                                            onBlur={formik.handleBlur}
                                            placeholder="Phone"
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.phone}
                                            </p>
                                        )}
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
                                            onBlur={formik.handleBlur}
                                            placeholder="Age"
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {formik.touched.age && formik.errors.age && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.age}
                                            </p>
                                        )}
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
                                        onBlur={formik.handleBlur}
                                        rows={3}
                                        placeholder="Bio"
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                    {formik.touched.bio && formik.errors.bio && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.bio}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>

                                    <div className="relative">
                                        <input
                                            ref={locationRef}
                                            name="location.address"
                                            value={formik.values.location.address}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                formik.setFieldValue("location.address", value);
                                                fetchLocationSuggestions(value, setSuggestions, setLocationError);
                                            }}
                                            onBlur={formik.handleBlur}
                                            placeholder="Start typing your address..."
                                            autoComplete="off"
                                            className={`w-full p-4 border-2 rounded-xl ${formik.touched.location?.address &&
                                                formik.errors.location?.address
                                                ? "border-red-500"
                                                : ""
                                                }`}
                                        />

                                        {suggestions?.length > 0 && (
                                            <div className="absolute bg-white border mt-1 w-full rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
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
                                                        className="p-3 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {s.address}
                                                    </div>
                                                ))}

                                                {locationError && (
                                                    <p className="text-red-500 text-sm mt-1">{locationError}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {formik.touched.location?.address && formik.errors.location?.address && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.location.address}
                                        </p>
                                    )}
                                </div>
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
                                        onBlur={formik.handleBlur}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                    {formik.touched.radius && formik.errors.radius && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.radius}
                                        </p>
                                    )}
                                </div>
                            </div>


                            {(
                                <div className="bg-white p-4 rounded-xl border-2 border-gray-300 space-y-4 mt-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-green-600" /> Availability Calendar
                                    </h3>

                                    <DayPicker
                                        mode="multiple"
                                        selected={formik.values.availability.map(a => new Date(a.date))}
                                        onSelect={(dates) => handleDateSelection(dates as Date[])}
                                        fromMonth={today}
                                        disabled={[
                                            { before: today },
                                            (day: Date) => {
                                                const entry = formik.values.availability.find(
                                                    (a) => new Date(a.date).toDateString() === day.toDateString()
                                                );

                                                if (!entry) return false;

                                                if (!entry.availableSlots || entry.availableSlots.length === 0) {
                                                    return false;
                                                }

                                                return entry.availableSlots.every((s) => s.booked);
                                            }
                                        ]}
                                    />

                                    <div className="border-t-2 border-gray-200 pt-4">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-green-600" />
                                            Time Slots for Selected Dates
                                        </h4>

                                        <div className="max-h-[130px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                            {formik.values.availability.map(item => {
                                                const dateKey = new Date(item.date).toDateString();
                                                const hasBookedSlots = item.availableSlots.some(s => s.booked);
                                                const allSlotsBooked = item.availableSlots.every(s => s.booked);

                                                return (
                                                    <div
                                                        key={dateKey}
                                                        className={`border-2 p-4 rounded-xl transition-all ${allSlotsBooked
                                                            ? 'border-green-300 bg-green-50'
                                                            : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <p className="font-semibold text-gray-800 flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-blue-600" />
                                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                            {hasBookedSlots && (
                                                                <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                                                    <Check className="w-3 h-3" />
                                                                    Has Bookings
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            {allSlots.map((slotName) => {
                                                                const selected = isSlotSelected(dateKey, slotName);
                                                                const booked = isSlotBooked(dateKey, slotName);

                                                                return (
                                                                    <label
                                                                        key={slotName}
                                                                        className={`flex items-center gap-2.5 p-3 rounded-lg border-2 transition-all ${booked
                                                                            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500 cursor-not-allowed shadow-sm'
                                                                            : selected
                                                                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500 hover:border-blue-600 cursor-pointer shadow-sm'
                                                                                : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                                                                            }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            disabled={booked}
                                                                            checked={selected}
                                                                            onChange={() => toggleSlot(dateKey, slotName)}
                                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                                        />
                                                                        <span className={`flex-1 capitalize font-medium ${booked
                                                                            ? 'text-green-700'
                                                                            : selected
                                                                                ? 'text-blue-700'
                                                                                : 'text-gray-700'
                                                                            }`}>
                                                                            {slotName.replace('-', ' ')}
                                                                        </span>
                                                                        {booked && (
                                                                            <span className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                                                                                <Check className="w-3 h-3" />
                                                                                Booked
                                                                            </span>
                                                                        )}
                                                                        {selected && !booked && (
                                                                            <Check className="w-5 h-5 text-blue-600 font-bold" />
                                                                        )}
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formik.touched.availability && formik.errors.availability && (
                                <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1">
                                    <X className="w-4 h-4" />
                                    {formik.errors.availability as string}
                                </p>
                            )}
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
                                        onBlur={formik.handleBlur}
                                        onChange={async (e) => {
                                            if (e.target.files) {
                                                const file = e.target.files[0];
                                                const url = await uploadToCloud(file);
                                                formik.setFieldValue("profileImage", url);
                                            }
                                        }}
                                    />
                                    {formik.touched.profileImage && formik.errors.profileImage && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.profileImage}
                                        </p>
                                    )}
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
                                        {formik.errors.govIdFront && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.govIdFront}
                                            </p>
                                        )}
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
                                        {formik.errors.govIdBack && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.govIdBack}
                                            </p>
                                        )}
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
                                                checked={formik.values?.categories?.includes(cat._id)}
                                                onChange={() => handleArrayToggle("categories", cat._id)}
                                            />
                                            {cat.name}
                                        </label>
                                    ))}
                                    {formik.errors.categories && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.categories}
                                        </p>
                                    )}
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
                                    {formik.errors.services && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.services as string}
                                        </p>
                                    )}
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