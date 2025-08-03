/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { deleteCategory, fetchCategory, setIsActiveCategory, updateCategory } from '../../services/adminService';
import { DataTable, type Column } from '../common/Table';
import type { ICategory } from '../../types/ICategory';
import { Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import AddingCategorySection from './AddingSectionCategory';

const CategoryTable = () => {
    const [category, setCategory] = useState<ICategory[]>([]);
    const [added, setAdded] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<ICategory | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchCategory();
            const formatted = res.data.data.categories.map((cat: any) => ({
                ...cat,
                id: cat._id
            }));
            setCategory(formatted);
        };
        setAdded(false);
        setDeleted(false);
        fetchData();
    }, [added, deleted]);

    const handleToggle = async (id: string) => {
        try {
            await setIsActiveCategory(id);
            setCategory(prev =>
                prev.map(category =>
                    category.id === id ? { ...category, isActive: !category.isActive } : category
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
            await deleteCategory(id);
            toast.success("Deleted Successfully");
            setDeleted(true);
        } catch (err: any) {
            const message = err.response?.data?.data || err.response?.data?.message || err.message || "Failed to delete category";
            toast.error(`Failed to delete category: ${message}`);
        }
    };

    const handleEditOpen = (cat: ICategory) => {
        setEditData(cat);
        setIsEditing(true);
        formik.setValues({
            name: cat.name,
            description: cat.description as string
        });
    };

    const handleEditClose = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        enableReinitialize: true,
        validate: (values) => {
            const errors: { name?: string; description?: string } = {};
            if (!values.name) errors.name = "Category name is required";
            if (!values.description) errors.description = "Description is required";
            return errors;
        },
        onSubmit: async (values) => {
            if (!editData?.id) return;
            try {
                console.log(values)
                await updateCategory(editData._id, values);
                toast.success("Category updated successfully");
                setAdded(true);
                handleEditClose();
            } catch (err: any) {
                const message = err.response?.data?.data || err.response?.data?.message || err.message;
                toast.error(`Failed to update category: ${message}`);
            }
        }
    });

    const columns: Column<ICategory>[] = [
        { key: 'id', label: 'ID', render: (u) => u.id.slice(0, 10) },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        {
            key: 'isActive',
            label: 'Active',
            render: (u) => (
                <div
                    onClick={() => handleToggle(u.id)}
                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </div>
            )
        },
        {
            key: 'actions' as keyof ICategory,
            label: 'Actions',
            render: (u) => (
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
        }
    ];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <AddingCategorySection setAdded={setAdded} />
            <DataTable
                itemsPerPage={3}
                data={category}
                columns={columns}
                searchKeys={['name', 'description']}
            />

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-transparant bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-green-700">Edit Category</h2>
                            <button onClick={handleEditClose}>
                                <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Category Name</label>
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
                                    <span className="text-red-500 text-xs">{formik.errors.name}</span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${formik.touched.description && formik.errors.description
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <span className="text-red-500 text-xs">{formik.errors.description}</span>
                                )}
                            </div>
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

export default CategoryTable;
