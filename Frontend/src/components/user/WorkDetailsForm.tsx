/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { workDetails } from '../../slice/workDraftSlice';
import { fetchCategoryById, fetchServiceById, } from '../../services/userService';
import type { IService } from '../../types/IService';
import type { ICategory } from '../../types/ICategory';
import { fetchLocationSuggestions } from '../../utilities/fetchLocation';

interface Suggestion {
    address: string;
    pincode: string;
    lat: string | number;
    lng: string | number;
}

interface WorkFormValues {
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    taskSize: string;
    description: string;
    categoryId: string | null;
    serviceId: string | null;
    service: string | null;
    category: string | null;
}

interface Prop {
    setStep: (arg: number) => void;
}

const WorkDetailForm = ({ setStep }: Prop) => {
    const dispatch = useAppDispatch();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [serviceId, setServiceId] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [service, setService] = useState<IService | null>(null);
    const [category, setCategory] = useState<ICategory | null>(null);
    const locationRef = useRef<HTMLInputElement>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [locationError, setLocationError] = useState("");

    const initialValues: WorkFormValues = {
        location: {
            address: "",
            pincode: "",
            lat: 0,
            lng: 0,
        },
        taskSize: '',
        description: '',
        categoryId,
        serviceId,
        service: service?.name as string,
        category: category?.name as string,
    };

    useEffect(() => {
        const fetchData = async () => {
            const serviceId = localStorage.getItem('serviceId');
            const categoryId = localStorage.getItem('categoryId');

            setServiceId(serviceId);
            setCategoryId(categoryId);

            if (serviceId) {
                const service = await fetchServiceById(serviceId);
                setService(service.data.data);
            }

            if (categoryId) {
                const category = await fetchCategoryById(categoryId);
                setCategory(category.data.data);
            }
        };

        fetchData();
    }, []);

    const formik = useFormik<WorkFormValues>({
        initialValues,
        enableReinitialize: true,
        validate: (values) => {
            const errors: Partial<Record<keyof WorkFormValues, any>> = {};
            errors.location = {};

            if (!values.location.address) {
                errors.location.address = "Address is required";
            } else if (
                !values.location.pincode ||
                !values.location.lat ||
                !values.location.lng
            ) {
                errors.location.address =
                    "Please select a valid location from the dropdown suggestions";
            }

            if (!values.taskSize) {
                errors.taskSize = 'Please select task size';
            }

            if (!values.description) {
                errors.description = 'Please provide description';
            }

            return errors;
        },
        onSubmit: async (values) => {
            console.log("Values :", values)
            dispatch(workDetails(values));
            setStep(2);
        }
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="max-w-5xl mx-auto p-6 bg-white min-h-screen animate-fadeInUp"
        >
            <h2 className="text-xl font-normal text-center mb-12 text-gray-800 max-w-4xl mx-auto leading-relaxed animate-fadeInDown">
                Tell us about your task. We use these details to show Taskers in your area who fit your needs.
            </h2>

            {/* Location Section */}
            <div className="mb-4 animate-slideInRight">
                <div
                    onClick={() => setActiveStep(1)}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-green-600`}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 animate-fadeInScale">
                        Your Work Location
                    </h2>

                    {(activeStep === 1 || formik.errors.location?.address) && (
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
                                className={`w-full p-4 border-2 rounded-xl
                                        border-green-700 focus:border-green-700
                                        ${formik.touched.location?.address && formik.errors.location?.address
                                        ? "border-red-500 focus:border-red-500"
                                        : ""
                                    }`}
                            />

                            {formik.touched.location?.address && formik.errors.location?.address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.location.address}
                                </p>
                            )}

                            {/* Suggestions dropdown */}
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
                    )}
                </div>
            </div>

            {/* Work Options Section */}
            <div className="mb-4 animate-slideInRight">
                <div
                    className={`border-2 rounded-2xl p-6 transition-all duration-300 border-green-600`}
                    onClick={() => setActiveStep(2)}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 animate-fadeInScale">
                        Work Options
                    </h2>

                    {activeStep === 2 || formik.errors.taskSize ? (
                        <div className="animate-fadeInUp">
                            <div className="mb-6">
                                <h3 className="font-semibold mb-4 text-gray-900">
                                    How big is your task?
                                </h3>
                                <div className="space-y-4">
                                    {["Small", "Medium", "Large"].map((size) => (
                                        <label
                                            key={size}
                                            className="flex items-center space-x-3 cursor-pointer animate-fadeInUp"
                                        >
                                            <input
                                                type="radio"
                                                name="taskSize"
                                                value={size}
                                                checked={formik.values.taskSize === size}
                                                onChange={formik.handleChange}
                                                className="w-4 h-4 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <span className="text-base text-gray-900">
                                                {size === "Small" && "Small → 2-3hrs"}
                                                {size === "Medium" && "Medium → 5 hrs"}
                                                {size === "Large" && "Large → 7+ hrs"}
                                            </span>
                                        </label>
                                    ))}

                                    {formik.touched.taskSize && formik.errors.taskSize && (
                                        <p className="text-red-500 text-sm animate-fadeInDown">
                                            {formik.errors.taskSize}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-6 animate-slideInRight">
                <div
                    className={`border-2 rounded-2xl p-6 transition-all duration-300 border-green-600`}
                    onClick={() => setActiveStep(3)}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 animate-fadeInScale">
                        Tell us the details of your work
                    </h2>

                    {activeStep === 3 || formik.errors.description ? (
                        <div className="animate-fadeInUp">
                            <p className="text-gray-700 mb-4 text-base leading-relaxed animate-fadeInDown">
                                Start the conversation and tell your Tasker what you need done.
                            </p>

                            <textarea
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                placeholder="Provide a summary of your task"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-400 h-40 resize-none mb-2 text-base placeholder-gray-400"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-sm animate-fadeInDown">
                                    {formik.errors.description}
                                </p>
                            )}

                            <div className="flex justify-center animate-zoomIn">
                                <button
                                    type="submit"
                                    className="bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition-colors text-base font-medium"
                                >
                                    See Worker & Prices
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </form>
    );
};

export default WorkDetailForm;