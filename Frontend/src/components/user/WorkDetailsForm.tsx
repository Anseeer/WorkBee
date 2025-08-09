/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { workDetails } from '../../slice/workDraftSlice';

interface WorkFormValues {
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    taskSize: string;
    workType: string;
    description: string;
    categoryId: string | null;
    serviceId: string | null;
}

interface Prop {
    setStep: (arg: number) => void;
}

const WorkDetailForm = ({ setStep }: Prop) => {
    const dispatch = useAppDispatch();
    const [activeStep, setActiveStep] = useState<number>(0);
    const locationRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [service, setService] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);

    // Initial form values
    const initialValues: WorkFormValues = {
        location: { address: '', pincode: '', lat: 0, lng: 0 },
        taskSize: '',
        workType: 'One Time',
        description: '',
        categoryId: category,
        serviceId: service
    };

    // Load category & service from localStorage
    useEffect(() => {
        setService(localStorage.getItem('serviceId'));
        setCategory(localStorage.getItem('categoryId'));
    }, []);

    const formik = useFormik<WorkFormValues>({
        initialValues,
        enableReinitialize: true, // so form updates when service/category change
        validate: (values) => {
            const errors: Partial<Record<keyof WorkFormValues, any>> = {};

            if (!values.location.address) {
                errors.location = { ...(errors.location || {}), address: 'Address is required' };
            }
            if (!values.location.pincode) {
                errors.location = { ...(errors.location || {}), pincode: 'Pincode is required' };
            }
            if (!values.taskSize) {
                errors.taskSize = 'Please select task size';
            }
            if (!values.workType) {
                errors.workType = 'Please select workType';
            }
            if (!values.description) {
                errors.description = 'Please provide description';
            }

            return errors;
        },
        onSubmit: async (values) => {
            await dispatch(workDetails(values));
            alert('Form submitted successfully!');
            setStep(2);
        }
    });

    // Google Maps Autocomplete Setup
    useEffect(() => {
        const initAutocomplete = () => {
            if (locationRef.current && window.google?.maps) {
                if (!autocompleteRef.current) {
                    autocompleteRef.current = new window.google.maps.places.Autocomplete(locationRef.current, {
                        types: ['geocode'],
                        componentRestrictions: { country: 'IN' },
                        fields: ['formatted_address', 'geometry', 'address_components'],
                    });

                    autocompleteRef.current.addListener('place_changed', () => {
                        const place = autocompleteRef.current?.getPlace();
                        if (!place || !place.geometry) return;

                        let pincode = '';
                        place.address_components?.forEach((component) => {
                            if (component.types.includes('postal_code')) {
                                pincode = component.long_name;
                            }
                        });

                        formik.setFieldValue('location', {
                            address: place.formatted_address || '',
                            pincode,
                            lat: place.geometry.location?.lat() || 0,
                            lng: place.geometry.location?.lng() || 0
                        });
                    });
                }
            }
        };

        const loadScript = () => {
            if (window.google?.maps) {
                initAutocomplete();
                return;
            }
            const existingScript = document.getElementById('google-maps-script');
            if (existingScript) {
                existingScript.addEventListener('load', initAutocomplete);
            } else {
                const script = document.createElement('script');
                script.id = 'google-maps-script';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initAutocomplete;
                document.body.appendChild(script);
            }
        };

        loadScript();

        return () => {
            const script = document.getElementById('google-maps-script');
            if (script) {
                script.removeEventListener('load', initAutocomplete);
            }
        };
    }, [activeStep]);

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="max-w-5xl mx-auto p-6 bg-white min-h-screen"
        >
            <h2 className="text-xl font-normal text-center mb-12 text-gray-800 max-w-4xl mx-auto leading-relaxed">
                Tell us about your task. We use these details to show Taskers in your area who fit your needs.
            </h2>

            {/* Location Section */}
            <div className="mb-4">
                <div
                    onClick={() => setActiveStep(1)}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-green-600 `}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Your Work Location</h2>
                    {activeStep === 1 || formik.errors.location?.address ? (
                        <div>
                            <input
                                type="text"
                                ref={locationRef}
                                name="location.address"
                                value={formik.values.location.address}
                                onChange={formik.handleChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-700 mb-2 text-base"
                                placeholder="Enter your location..."
                            />
                            {formik.touched.location?.address && formik.errors.location?.address && (
                                <p className="text-red-500 text-sm">{formik.errors.location.address}</p>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Work Options Section */}
            <div className="mb-4">
                <div
                    className={`border-2 rounded-2xl p-6 transition-all duration-300 border-green-600 }`}
                    onClick={() => setActiveStep(2)}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Work Options</h2>
                    {activeStep === 2 || formik.errors.taskSize || formik.errors.workType ? (
                        <>
                            <div className="mb-6">
                                <h3 className="font-semibold mb-4 text-gray-900">How big is your task?</h3>
                                <div className="space-y-4">
                                    {['Small', 'Medium', 'Large'].map((size) => (
                                        <label key={size} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="taskSize"
                                                value={size}
                                                checked={formik.values.taskSize === size}
                                                onChange={formik.handleChange}
                                                className="w-4 h-4 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <span className="text-base text-gray-900">
                                                {size === 'Small' && 'Small → 2-3hrs'}
                                                {size === 'Medium' && 'Medium → 5 hrs'}
                                                {size === 'Large' && 'Large → 7+ hrs'}
                                            </span>
                                        </label>
                                    ))}
                                    {formik.touched.taskSize && formik.errors.taskSize && (
                                        <p className="text-red-500 text-sm">{formik.errors.taskSize}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-semibold mb-4 text-gray-900">How often do you need this service?</h3>
                                <div className="relative">
                                    <select
                                        name="workType"
                                        value={formik.values.workType}
                                        onChange={formik.handleChange}
                                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-400 text-base appearance-none bg-white pr-12"
                                    >
                                        <option value="One Time">One Time</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    {formik.touched.workType && formik.errors.workType && (
                                        <p className="text-red-500 text-sm">{formik.errors.workType}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
                <div
                    className={`border-2 rounded-2xl p-6 transition-all duration-300 border-green-600 `}
                    onClick={() => setActiveStep(3)}
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Tell us the details of your work</h2>
                    {activeStep === 3 || formik.errors.description ? (
                        <div>
                            <p className="text-gray-700 mb-4 text-base leading-relaxed">
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
                                <p className="text-red-500 text-sm">{formik.errors.description}</p>
                            )}
                            <div className="flex justify-center">
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
