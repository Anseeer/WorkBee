/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

const AddNotificationSection = () => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            message: "",
            To: "",
        },
        validate: (values) => {
            const errors: Partial<{ message: string; To: string }> = {};

            if (!values.message) {
                errors.message = "Message is required";
            } else if (values.message.length < 3) {
                errors.message = "Must be at least 3 characters";
            }

            if (!values.To) {
                errors.To = "Select the receiver";
            }

            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                console.log("Sending notification:", values);

                toast.success("Notification sent successfully");
            } catch (err: any) {
                const message =
                    err.response?.data?.data ||
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to send notification";
                console.log("Error msg:", message);
                toast.error(`Failed to send notification: ${message}`);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="border mx-8 my-8 rounded-md border-green-700 p-2 shadow-sm">
            <h3 className="font-semibold text-green-700">Send Notification</h3>
            <form
                onSubmit={formik.handleSubmit}
                className="flex items-start justify-between px-4 gap-4 flex-wrap"
            >
                {/* Message */}
                <div className="flex flex-col">
                    <div className="flex items-start gap-2">
                        <label className="text-sm ">Message</label>
                        <textarea
                            className={`px-3 py-2 border rounded w-64 resize-none focus:outline-none focus:ring ${formik.touched.message && formik.errors.message
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            name="message"
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter message"
                            rows={2}
                        />
                    </div>
                    {formik.touched.message && formik.errors.message && (
                        <span className="text-red-500 text-xs ml-24">
                            {formik.errors.message}
                        </span>
                    )}
                </div>

                {/* Receiver */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm ">To</label>
                        <select
                            className={`px-3 py-2 border rounded w-48 focus:outline-none focus:ring ${formik.touched.To && formik.errors.To
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            name="To"
                            value={formik.values.To}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Select Receiver</option>
                            <option value="users">Users</option>
                            <option value="workers">Workers</option>
                        </select>
                    </div>
                    {formik.touched.To && formik.errors.To && (
                        <span className="text-red-500 text-xs ml-20">
                            {formik.errors.To}
                        </span>
                    )}
                </div>

                {/* Submit */}
                <button
                    className="bg-[#10451D] hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow self-start"
                    type="submit"
                    disabled={loading}
                >
                    {!loading ? "Send" : "Sending..."}
                </button>
            </form>
        </div>
    );
};

export default AddNotificationSection;
