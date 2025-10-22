/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { addService, fetchCategory } from "../../services/adminService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { ICategory } from "../../types/ICategory";
import { uploadToCloud } from "../../utilities/uploadToCloud";

interface Props {
    setAdded: (arg: boolean) => void;
}

const AddingServiceSection = ({ setAdded }: Props) => {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchCategory(1, 100);
                const formatted = res.data.data.category
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
            image: null as File | null,
        },
        validate: (values) => {
            const errors: {
                name?: string;
                wage?: string;
                image?: string;
                category?: string;
            } = {};

            if (!values.name) errors.name = "Service name is required";
            if (!values.wage) errors.wage = "Wage is required";
            if (!values.category) errors.category = "Category is required";

            if (!values.image) {
                errors.image = "Service image is required";
            } else {
                const validTypes = ["image/png", "image/jpeg", "image/jpg"];
                if (!validTypes.includes(values.image.type)) {
                    errors.image = "Only PNG or JPG images are allowed";
                }
            }
            return errors;
        },

        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const imageUrl = await uploadToCloud(values.image as File);

                const payload = {
                    name: values.name,
                    wage: values.wage,
                    category: values.category,
                    image: imageUrl,
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
        <div className="border animate-fadeInUp mx-4 sm:mx-8 mt-1 rounded-md border-green-700 p-4 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-2 text-lg">Add Service</h3>

            <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
                {/* Service Name */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Service Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter service name"
                        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 w-full ${formik.touched.name && formik.errors.name
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-green-400"
                            }`}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <span className="text-red-500 text-xs mt-1">{formik.errors.name}</span>
                    )}
                </div>

                {/* Wage */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Wage</label>
                    <input
                        type="text"
                        name="wage"
                        value={formik.values.wage}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter wage"
                        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 w-full ${formik.touched.wage && formik.errors.wage
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-green-400"
                            }`}
                    />
                    {formik.touched.wage && formik.errors.wage && (
                        <span className="text-red-500 text-xs mt-1">{formik.errors.wage}</span>
                    )}
                </div>

                {/* Image Upload */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Service Icon</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            name="imageFile"
                            onChange={(e) => {
                                const file = e.currentTarget.files?.[0] || null;
                                formik.setFieldValue("image", file);
                                if (file) setPreview(URL.createObjectURL(file));
                            }}
                            className={`px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${formik.touched.image && formik.errors.image
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-green-400"
                                }`}
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                        )}
                    </div>

                    {formik.touched.image && formik.errors.image && (
                        <span className="text-red-500 text-xs mt-1">{formik.errors.image}</span>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 w-full ${formik.touched.category && formik.errors.category
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-green-400"
                            }`}
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                        <span className="text-red-500 text-xs mt-1">
                            {formik.errors.category}
                        </span>
                    )}
                </div>

                {/* Add Button */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#10451D] hover:bg-green-700 transition-all text-white font-semibold px-6 py-2.5 rounded-md shadow-md w-full sm:w-auto"
                    >
                        {loading ? "Adding..." : "Add Service"}
                    </button>
                </div>
            </form>
        </div>
    );

};

export default AddingServiceSection;
