/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../common/Table';
import type { ICategory } from '../../types/ICategory';
import { Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import type { IService } from '../../types/IServiceTypes';
import { deleteService, fetchCategory, fetchService, setIsActiveService, updateService } from '../../services/adminService';
import AddingServiceSection from './AddingSectionService';


const ServicesTable = () => {
    const [service, setService] = useState<IService[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [added, setAdded] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<IService | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setCategories([])
                const categoryRes = await fetchCategory();
                const formattedCategories = categoryRes.data.data.categories.map((cat: any) => ({
                    ...cat,
                    id: cat._id,
                }));

                console.log("REsult :", formattedCategories)
                setCategories(formattedCategories);

                const serviceRes = await fetchService();
                const servicesRaw = serviceRes.data.data.service.map((srv: any) => ({
                    ...srv,
                    id: srv._id,
                }));


                const servicesWithNames = servicesRaw.map((srv: any) => {
                    const categoryObj = formattedCategories.find((cat: ICategory) => cat.id === srv.category);
                    return {
                        ...srv,
                        categoryName: categoryObj ? categoryObj.name : 'Unknown',
                    };
                });


                setService(servicesWithNames);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        setAdded(false);
        setDeleted(false);
        fetchAllData();
    }, [added, deleted]);



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
        formik.setValues({
            name: serv.name,
            wage: serv.wage,
            category: serv.category,
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
        },
        enableReinitialize: true,
        validate: values => {
            const errors: {
                name?: string;
                description?: string;
                category?: string;
                wage?: string;
            } = {};
            if (!values.name) errors.name = "Service name is required";
            if (!values.wage) errors.wage = "Wage is required";
            if (!values.category) errors.category = "Category is required";
            return errors;
        },
        onSubmit: async values => {
            if (!editData?.id) return;
            try {
                await updateService(editData.id, values);
                toast.success("Service updated successfully");
                setAdded(true);
                handleEditClose();
            } catch (err: any) {
                const message =
                    err.response?.data?.data ||
                    err.response?.data?.message ||
                    err.message;
                toast.error(`Failed to update service: ${message}`);
            }
        },
    });

    const columns: Column<IService>[] = [
        { key: 'id', label: 'ID', render: u => u.id.slice(0, 10) },
        { key: 'name', label: 'Name' },
        { key: 'categoryName', label: 'Category' },
        { key: 'wage', label: 'Wage' },
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
                itemsPerPage={3}
                data={service}
                columns={columns}
                searchKeys={['name', 'description', 'wage']}
            />

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-transparant bg-blur-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 border border-green-900 border-2 w-96 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-green-700">
                                Edit Service
                            </h2>
                            <button onClick={handleEditClose}>
                                <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm mb-1">Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${formik.touched.name && formik.errors.name
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <span className="text-red-500 text-xs">
                                        {formik.errors.name}
                                    </span>
                                )}
                            </div>
                            {/* Wage */}
                            <div>
                                <label className="block text-sm mb-1">Wage</label>
                                <input
                                    type="text"
                                    name="wage"
                                    value={formik.values.wage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${formik.touched.wage && formik.errors.wage
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {formik.touched.wage && formik.errors.wage && (
                                    <span className="text-red-500 text-xs">
                                        {formik.errors.wage}
                                    </span>
                                )}
                            </div>
                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-sm mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                {formik.touched.category &&
                                    formik.errors.category && (
                                        <span className="text-red-500 text-xs">
                                            {formik.errors.category}
                                        </span>
                                    )}
                            </div>
                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleEditClose}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesTable;
