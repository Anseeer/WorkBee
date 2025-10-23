/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../common/Table';
import type { ICategory } from '../../types/ICategory';
import { Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import type { IService } from '../../types/IServiceTypes';
import { deleteService, fetchCategory, fetchService, setIsActiveService, updateService } from '../../services/adminService';
import AddingServiceSection from './ServiceAddingSection';
import { uploadToCloud } from '../../utilities/uploadToCloud';

const ServiceManagment = () => {
    const [isLoading, setLoading] = useState(false);
    const [service, setService] = useState<IService[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [added, setAdded] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<IService | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [currrentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryRes = await fetchCategory(1, 1000);
                const formattedCategories = categoryRes.data.data.category.map((cat: any) => ({
                    ...cat,
                    id: cat._id,
                }));
                setCategories(formattedCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const serviceRes = await fetchService(currrentPage, 5);
                const servicesRaw = serviceRes.data.data.services.map((srv: any) => ({
                    ...srv,
                    id: srv._id,
                }));

                const servicesWithNames = servicesRaw.map((srv: any) => {
                    const categoryId =
                        typeof srv.category === "object" ? srv.category._id : srv.category;

                    const categoryObj = categories.find(
                        (cat: ICategory) => cat.id === categoryId
                    );

                    return {
                        ...srv,
                        categoryName: categoryObj ? categoryObj.name : "Unknown",
                    };
                });

                setService(servicesWithNames);
                setTotalPage(serviceRes.data.data.totalPage);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };

        if (categories.length > 0) {
            fetchServices();
        }
    }, [added, deleted, isEditing, currrentPage, categories]);

    const handleToggle = async (id: string) => {
        try {
            await setIsActiveService(id);
            setService(prev =>
                prev.map(service =>
                    service.id === id
                        ? { ...service, isActive: !service.isActive }
                        : service
                )
            );
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            toast.error("Failed To Delete, Can't get the id");
            return;
        }
        try {
            await deleteService(id);
            toast.success("Deleted Successfully");
            setDeleted(true);
        } catch (err: any) {
            const message =
                err.response?.data?.data ||
                err.response?.data?.message ||
                err.message ||
                "Failed to delete service";
            toast.error(`Failed to delete service: ${message}`);
        }
    };

    const handleEditOpen = (serv: IService) => {
        setEditData(serv);
        setIsEditing(true);
        setExistingImageUrl(serv.image || null);
        formik.setValues({
            name: serv.name,
            wage: serv.wage,
            category: serv.category,
            image: null,
        });
    };

    const handleEditClose = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            category: '',
            wage: '',
            image: null as File | null,
        },
        enableReinitialize: true,
        validate: (values) => {
            const errors: {
                name?: string;
                wage?: string;
                category?: string;
                image?: string;
            } = {};

            if (!values.name) errors.name = "Service name is required";
            if (!values.wage) errors.wage = "Wage is required";
            if (!values.category) errors.category = "Category is required";

            if (!values.image && !existingImageUrl) {
                errors.image = "Image is required";
            }

            if (values.image) {
                const validTypes = ["image/png", "image/jpeg", "image/jpg"];
                if (!validTypes.includes(values.image.type)) {
                    errors.image = "Only PNG or JPG images are allowed";
                }
            }

            return errors;
        },
        onSubmit: async values => {
            setLoading(true);
            if (!editData?.id) return;
            try {
                let imageUrl = existingImageUrl;

                if (values.image) {
                    imageUrl = await uploadToCloud(values.image);
                }

                await updateService(editData._id as string, {
                    name: values.name,
                    wage: values.wage,
                    category: values.category,
                    image: imageUrl as string
                });
                toast.success("Service updated successfully");
                setLoading(false)
                setAdded(true);
                handleEditClose();
            } catch (err: any) {
                const message =
                    err.response?.data?.data ||
                    err.response?.data?.message ||
                    err.message;
                setLoading(false)
                toast.error(`Failed to update service: ${message}`);
            }
        },
    });

    const columns: Column<IService>[] = [
        { key: 'name', label: 'Name' },
        { key: 'categoryName', label: 'Category' },
        { key: 'wage', label: 'Wage' },
        {
            key: 'image',
            label: 'Icon',
            render: (u) => (
                <img
                    src={u.image}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            )
        },
        {
            key: 'isActive',
            label: 'Active',
            render: u => (
                <div
                    onClick={() => handleToggle(u.id)}
                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center ${u.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </div>
            ),
        },
        {
            key: 'actions' as keyof IService,
            label: 'Actions',
            render: u => (
                <div className="flex gap-3">
                    <button
                        onClick={() => handleEditOpen(u)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <AddingServiceSection setAdded={setAdded} />
            <DataTable
                setCurrentPage={setCurrentPage}
                currentPage={currrentPage}
                totalPages={totalPage}
                data={service}
                columns={columns}
                searchKeys={['name', 'description', 'wage']}
                advancedFilterKeys={['name', 'categoryName', 'wage', 'isActive']}
            />

            {isEditing && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg p-6 shadow-lg border-2 border-green-800 animate-fadeInUp">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-green-700">Edit Service</h2>
                            <button
                                onClick={handleEditClose}
                                className="text-gray-600 hover:text-gray-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit} className="space-y-4">

                            {/* Service Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.name && formik.errors.name
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-green-400"
                                        }`}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <span className="text-red-500 text-xs">{formik.errors.name}</span>
                                )}
                            </div>

                            {/* Wage */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Wage</label>
                                <input
                                    type="text"
                                    name="wage"
                                    value={formik.values.wage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.wage && formik.errors.wage
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-green-400"
                                        }`}
                                />
                                {formik.touched.wage && formik.errors.wage && (
                                    <span className="text-red-500 text-xs">{formik.errors.wage}</span>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Icon</label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Existing image */}
                                    {existingImageUrl && !formik.values.image && (
                                        <img
                                            src={existingImageUrl}
                                            alt="Current Icon"
                                            className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                        />
                                    )}

                                    {/* New image preview */}
                                    {formik.values.image && (
                                        <img
                                            src={URL.createObjectURL(formik.values.image)}
                                            alt="New Icon Preview"
                                            className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                        />
                                    )}

                                    {/* Upload input */}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) =>
                                            formik.setFieldValue("image", e.currentTarget.files?.[0] || null)
                                        }
                                        className="text-sm w-full sm:w-auto"
                                    />
                                </div>
                                {/* ✅ Corrected: Image error displays here */}
                                {formik.touched.image && formik.errors.image && (
                                    <span className="text-red-500 text-xs">{formik.errors.image}</span>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.category && formik.errors.category
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-green-400"
                                        }`}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <span className="text-red-500 text-xs">{formik.errors.category}</span>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={handleEditClose}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                                >
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManagment;
