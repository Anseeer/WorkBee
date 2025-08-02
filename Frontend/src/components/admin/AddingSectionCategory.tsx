import { useFormik } from "formik";
import { addCategory } from "../../services/adminService";
import { useState } from "react";
import { toast } from "react-toastify";

interface props {
    setAdded: (arg: boolean) => void;
}

const AddingCategorySection = ({ setAdded }: props) => {

    const [loading, setLoading] = useState(false);


    const formik = useFormik({
        initialValues: {
            category: "",
            description: "",
        },
        validate: (values) => {
            const errors: { category?: string; description?: string } = {};
            if (!values.category) {
                errors.category = "Category is required";
            } else if (values.category.length < 3) {
                errors.category = "Must be at least 3 characters";
            }

            if (!values.description) {
                errors.description = "Description is required";
            } else if (values.description.length < 5) {
                errors.description = "Must be at least 5 characters";
            }

            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const payload = { name: values.category, description: values.description };
                const res = await addCategory(payload);
                console.log("Res AfterCreating :", res.data.data);
                resetForm();
                setAdded(true);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                const message = err.response?.data?.data || err.response?.data?.message || err.message || "Failed to add category";
                console.log("Error msg:", message);
                toast.error(`Failed to add category: ${message}`);
            }
            finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="border mx-8 mt-5 rounded-md border-green-700 p-4 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-1">Add Category</h3>
            <form
                onSubmit={formik.handleSubmit}
                className="flex items-center justify-between px-4"
            >
                {/* Category */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label className="text-sm w-20">Category</label>
                        <input
                            className={`px-3 border rounded w-48 focus:outline-none focus:ring ${formik.touched.category && formik.errors.category
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            type="text"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter category"
                        />
                    </div>
                    {formik.touched.category && formik.errors.category && (
                        <span className="text-red-500 text-xs ml-20">
                            {formik.errors.category}
                        </span>
                    )}
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm w-24">Description</label>
                        <input
                            className={`px-3 border rounded w-64 focus:outline-none focus:ring ${formik.touched.description && formik.errors.description
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            type="text"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter description"
                        />
                    </div>
                    {formik.touched.description && formik.errors.description && (
                        <span className="text-red-500 text-xs ml-24">
                            {formik.errors.description}
                        </span>
                    )}
                </div>

                {/* Add Button */}
                <button
                    className="bg-[#10451D] hover:bg-green-700 text-white font-semibold px-8 py-1 rounded shadow self-start"
                    type="submit"
                >
                    {!loading ? `Add` : `Adding...`}
                </button>
            </form>
        </div>
    );
};

export default AddingCategorySection;
