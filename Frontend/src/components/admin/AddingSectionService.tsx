/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { addService, fetchCategory } from "../../services/adminService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { ICategory } from "../../types/ICategory";

interface Props {
    setAdded: (arg: boolean) => void;
}

const AddingServiceSection = ({ setAdded }: Props) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchCategory();
                const formatted = res.data.data.categories
                    .filter((cat: ICategory) => cat.isActive == true)
                    .map((cat: any) => ({
                        id: cat._id,
                        name: cat.name,
                    }));
                setCategories(formatted);
            } catch (err) {
                console.log(err)
                toast.error("Failed to load categories");
            }
        };
        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            wage: "",
            category: "",
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};
            if (!values.name) errors.name = "Service name is required";
            if (!values.wage) errors.wage = "Wage is required";
            if (!values.category) errors.category = "Category is required";
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const payload = {
                    name: values.name,
                    wage: values.wage,
                    category: values.category,
                };
                const res = await addService(payload);
                console.log("Service Created:", res.data.data);
                toast.success("Service added successfully");
                resetForm();
                setAdded(true);
            } catch (err: any) {
                const message = err.response?.data?.data || err.response?.data?.message || err.message;
                toast.error(`Failed to add service: ${message}`);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="border mx-8 mt-5 rounded-md border-green-700 p-4 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-1">Add Services</h3>
            <form onSubmit={formik.handleSubmit} className="flex items-center justify-between px-4">
                {/* Service Name */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label className="text-sm w-15">Service</label>
                        <input
                            className={`px-3 border rounded w-48 focus:outline-none focus:ring ${formik.touched.name && formik.errors.name
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter service name"
                        />
                    </div>
                    {formik.touched.name && formik.errors.name && (
                        <span className="text-red-500 text-xs ml-20">
                            {formik.errors.name}
                        </span>
                    )}
                </div>

                {/* Wage */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm w-15">Wage</label>
                        <input
                            className={`px-3 border rounded w-48 focus:outline-none focus:ring ${formik.touched.wage && formik.errors.wage
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            type="text"
                            name="wage"
                            value={formik.values.wage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter wage"
                        />
                    </div>
                    {formik.touched.wage && formik.errors.wage && (
                        <span className="text-red-500 text-xs ml-24">
                            {formik.errors.wage}
                        </span>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm w-20">Category</label>
                        <select
                            className={`px-3 border rounded w-48 focus:outline-none focus:ring ${formik.touched.category && formik.errors.category
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formik.touched.category && formik.errors.category && (
                        <span className="text-red-500 text-xs ml-24">
                            {formik.errors.category}
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

export default AddingServiceSection;
