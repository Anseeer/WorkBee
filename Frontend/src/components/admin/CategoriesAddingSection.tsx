/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { addCategory } from "../../services/adminService";
import { useState } from "react";
import { toast } from "react-toastify";
import { uploadToCloud } from "../../utilities/uploadToCloud";

interface Props {
    setAdded: (arg: boolean) => void;
}

const AddingCategorySection = ({ setAdded }: Props) => {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            category: "",
            description: "",
            imageFile: null as File | null,
        },
        validate: (values) => {
            const errors: { category?: string; description?: string; imageFile?: string } = {};

            if (!values.category) {
                errors.category = "Category is required";
            } else if (values.category.length < 3) {
                errors.category = "Must be at least 3 characters";
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

            if (!values.imageFile) {
                errors.imageFile = "Image is required";
            } else if (values.imageFile) {
                const validTypes = ["image/png", "image/jpeg", "image/jpg"];
                if (!validTypes.includes(values.imageFile.type)) {
                    errors.imageFile = "Only PNG or JPG images are allowed";
                }
            }

            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const imageUrl = await uploadToCloud(values.imageFile as File);

                const payload = {
                    name: values.category,
                    description: values.description,
                    imageUrl: imageUrl,
                };

                const res = await addCategory(payload);
                console.log("Res AfterCreating :", res.data.data);

                resetForm();
                setPreview(null);
                setAdded(true);
                toast.success("Category added successfully");
            } catch (err: any) {
                const message =
                    err.response?.data?.data ||
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to add category";
                console.log("Error msg:", message);
                toast.error(`Failed to add category: ${message}`);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="border mx-8  animate-fadeInUp  rounded-md border-green-700 p-2 shadow-sm">
            <h3 className="font-semibold text-green-700 ">Add Category</h3>
            <form
                onSubmit={formik.handleSubmit}
                className="flex items-center justify-between px-4 gap-2 flex-wrap"
            >
                {/* Category */}
                <div className="flex py-1 flex-col  animate-fadeInUp">
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
                <div className="flex  animate-fadeInUp py-1 flex-col">
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

                {/* Image Upload */}
                <div className="flex  animate-fadeInUp py-1 flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm w-12">Icon</label>
                        <div className="flex items-center gap-3">
                            <input
                                className={`px-3 border rounded w-48 focus:outline-none focus:ring ${formik.touched.imageFile && formik.errors.imageFile
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                type="file"
                                accept="image/*"
                                name="imageFile"
                                onChange={(e) => {
                                    const file = e.currentTarget.files?.[0] || null;
                                    formik.setFieldValue("imageFile", file);
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            )}
                        </div>
                    </div>
                    {formik.touched.imageFile && formik.errors.imageFile && (
                        <span className="text-red-500 text-xs ml-20">
                            {formik.errors.imageFile}
                        </span>
                    )}
                </div>

                {/* Add Button */}
                <button
                    className="bg-[#10451D] hover:bg-green-700 text-white font-semibold px-4 py-1 rounded shadow self-start"
                    type="submit"
                >
                    {!loading ? `Add` : `Adding...`}
                </button>
            </form>
        </div>
    );
};

export default AddingCategorySection;

