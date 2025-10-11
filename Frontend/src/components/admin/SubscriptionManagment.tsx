/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../common/Table';
import { Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import type { ISubscription } from '../../types/ISubscription';
import { fetchSubscriptionPlans } from '../../services/adminService';
import SubscriptionPlansAddingSection from './SubscriptionPlanAddingSection';

const SubscriptionManagment = () => {
    const [subscription, setSubscription] = useState<ISubscription[]>([]);
    const [added, setAdded] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<ISubscription | null>(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchSubscriptionPlans(currentPage, 3);
            console.log(res);
            setSubscription([]);
            setTotalPage(5);
            setIsEditing(false);
            setEditData(null);
        };
        setAdded(false);
        setDeleted(false);
        fetchData();
    }, [added, deleted, currentPage]);

    const handleToggle = async (id: string) => {
        console.log(id);
    };

    const handleDelete = async (id: string) => {
        console.log(id);
    };

    const handleEditOpen = (cat: ISubscription) => {
        console.log(cat);
    };

    const handleEditClose = () => {

    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            amount: '',
            comission: '',
            durationInDays: '',
        },
        enableReinitialize: true,
        validate: (values) => {
            const errors: { name?: string; description?: string, amount?: string, durationInDays?: string, comission?: string } = {};
            if (!values.name) errors.name = "Plan name is required";
            if (!values.comission) errors.comission = "comission is required";
            if (!values.amount) errors.amount = "amount is required";
            if (!values.durationInDays) errors.durationInDays = "duration is required";
            if (!values.description) {
                errors.description = "Description is required";
            } else {
                const wordCount = values.description.trim().split(/\s+/).length;
                if (wordCount < 2) {
                    errors.description = "Description must be at least 2 words";
                } else if (wordCount > 10) {
                    errors.description = "Description cannot exceed 10 words";
                }
            } return errors;
        },
        onSubmit: async (values) => {
            if (!editData?.id) return;
            try {
                console.log("Values :", values);
                toast.success("plan updated successfully");
                setAdded(true);
                handleEditClose();
            } catch (err: any) {
                const message = err.response?.data?.data || err.response?.data?.message || err.message;
                toast.error(`Failed to update plan: ${message}`);
            }
        }
    });

    const columns: Column<ISubscription>[] = [
        { key: 'planName', label: 'Name' },
        { key: 'amount', label: 'Amount' },
        { key: 'comission', label: 'Comission' },
        { key: 'durationInDays', label: 'Duration' },
        { key: 'description', label: 'Description', render: (u) => u.description?.split(' ').slice(0, 5).join(' ') },
        {
            key: 'isActive',
            label: 'Active',
            render: (u) => (
                <div
                    onClick={() => handleToggle(u.id as string)}
                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </div>
            )
        },
        {
            key: 'actions' as keyof ISubscription,
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
                        onClick={() => handleDelete(u.id as string)}
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
            <SubscriptionPlansAddingSection setAdded={setAdded} />
            <DataTable
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPage}
                data={subscription}
                columns={columns}
                searchKeys={['planName', 'description']}
            />

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-transparant bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-lg border border-green-900 border-2 p-6 w-[420px] shadow-lg">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-green-700">Edit Category</h2>
                            <button onClick={handleEditClose}>
                                <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* Category Name */}
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

                            {/* Description */}
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

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
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

export default SubscriptionManagment;
