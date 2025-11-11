/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { addSubscriptionPlan } from "../../services/adminService";

interface Props {
    setAdded: (arg: boolean) => void;
}

const SubscriptionPlansAddingSection = ({ setAdded }: Props) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            comission: "",
            amount: "",
            durationInDays: "",
        },
        validate: (values) => {
            const errors: { name?: string; description?: string; comission?: string, durationInDays?: string, amount?: string } = {};

            if (!values.name) {
                errors.name = "Plan name is required";
            }

            if (!values.description) {
                errors.description = "Description is required";
            } else {
                const wordCount = values.description.trim().split(/\s+/).length;
                if (wordCount < 2) {
                    errors.description = "Description must be at least 2 words";
                } else if (wordCount > 10) {
                    errors.description = "Description cannot exceed 10 words";
                }
            }

            if (!values.comission) {
                errors.comission = "comission is required";
            }

            if (!values.durationInDays) {
                errors.durationInDays = "durationInDays is required";
            }

            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const payload = {
                    planName: values.name,
                    description: values.description,
                    durationInDays: values.durationInDays,
                    amount: values.amount,
                    comission: values.comission,
                };

                await addSubscriptionPlan(payload);

                resetForm();
                setAdded(true);
                toast.success("SubscriptionPlan added successfully");
            } catch (err: any) {
                const message =
                    err.response?.data?.data ||
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to add plan";
                toast.error(`Failed to add SubscriptionPlan: ${message}`);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="border animate-fadeInUp mx-8 rounded-md border-green-700 p-3 shadow-sm bg-white">
            <h3 className="font-semibold text-green-700 text-lg mb-2">
                Add Subscription Plan
            </h3>

            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {/* Name */}
                <div className="flex animate-fadeInUp flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.name && formik.errors.name
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-green-300"
                            }`}
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter plan name"
                    />
                    {formik.touched.name && formik.errors.name && (
                        <span className="text-red-500 text-xs mt-1">{formik.errors.name}</span>
                    )}
                </div>

                {/* Description */}
                <div className="flex animate-fadeInUp flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                        className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.description && formik.errors.description
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-green-300"
                            }`}
                        type="text"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter description"
                    />
                    {formik.touched.description && formik.errors.description && (
                        <span className="text-red-500 text-xs mt-1">
                            {formik.errors.description}
                        </span>
                    )}
                </div>

                {/* Amount */}
                <div className="flex animate-fadeInUp flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.amount && formik.errors.amount
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-green-300"
                            }`}
                        type="number"
                        name="amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter amount"
                    />
                    {formik.touched.amount && formik.errors.amount && (
                        <span className="text-red-500 text-xs mt-1">{formik.errors.amount}</span>
                    )}
                </div>

                {/* Commission */}
                <div className="flex animate-fadeInUp flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Commission</label>
                    <input
                        className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.comission && formik.errors.comission
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-green-300"
                            }`}
                        type="number"
                        name="comission"
                        value={formik.values.comission}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter commission %"
                    />
                    {formik.touched.comission && formik.errors.comission && (
                        <span className="text-red-500 text-xs mt-1">
                            {formik.errors.comission}
                        </span>
                    )}
                </div>

                {/* Duration */}
                <div className="flex animate-fadeInUp flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Duration (in Days)
                    </label>
                    <input
                        className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.durationInDays && formik.errors.durationInDays
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-green-300"
                            }`}
                        type="number"
                        name="durationInDays"
                        value={formik.values.durationInDays}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter duration"
                    />
                    {formik.touched.durationInDays && formik.errors.durationInDays && (
                        <span className="text-red-500 text-xs mt-1">
                            {formik.errors.durationInDays}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-end">
                    <button
                        className="bg-[#10451D] hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-md w-full md:w-full"
                        type="submit"
                    >
                        {!loading ? "Add Plan" : "Adding..."}
                    </button>
                </div>
            </form>
        </div>
    );

};

export default SubscriptionPlansAddingSection;

