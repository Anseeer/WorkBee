/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Phone, Mail, User, CheckCircle, Briefcase, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useWorkerDetails } from '../context/WorkerDetailContext';
import { fetchWorkerCategory, updateWorkerData } from '../../services/workerService';
import type { ICategory } from '../../types/ICategory';
import WorkerEditForm from '../worker/WorkerEditForm';
import type { IWorker } from '../../types/IWorker';
import type { IAvailability } from '../../types/IAvailability';
import { toast } from 'react-toastify';
import { fetchWorkerDetails } from '../../slice/workerSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Calendar } from '../../utilities/Calendar';
import { StarRatingDisplay } from './StartRating';
import type { ISelectedService } from '../../types/IService';
dayjs.extend(isSameOrAfter);

interface Prop {
    isEdit?: boolean;
    setEdit?: () => void;
}

const StatCard = ({ icon: Icon, label, value, color = "blue" }: any) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    };
    const colors = colorMap[color] || colorMap.blue;
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

const WorkerDetails = ({ isEdit, setEdit }: Prop) => {
    const { selectedDetails } = useWorkerDetails();
    const worker = selectedDetails?.worker;
    const availability = selectedDetails?.availability;
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [services, setServices] = useState<ISelectedService[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!worker) return;

            try {
                const catRes = await fetchWorkerCategory(worker.categories || []);
                setCategories(typeof catRes === "string" ? [] : catRes.data?.data || []);
                if (worker?.services) {
                    const names = worker.services.map(s => s);
                    setServices(names);
                }

            } catch (error) {
                console.error("Failed to fetch worker data:", error);
            }
        };

        fetchData();
    }, [worker]);

    if (!worker || !availability) return <div>No worker selected</div>;

    const onClose = () => {
        if (setEdit) setEdit();
    }

    const onSave = async (updatedData: { worker: Partial<IWorker>; availability: IAvailability }) => {
        try {
            await updateWorkerData(updatedData);

            if (!updatedData.worker._id) throw new Error("Worker ID is missing");

            await dispatch(fetchWorkerDetails(updatedData.worker._id.toString()));
            toast.success("Updated Successfully.");

            if (setEdit) setEdit();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update");
        }
    };

    return (
        <div className="h-full bg-white overflow-hidden animate-fadeInUp">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 animate-fadeInDown">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative animate-zoomIn">
                                <img
                                    src={
                                        typeof worker.profileImage === "string"
                                            ? worker.profileImage
                                            : worker.profileImage instanceof File
                                                ? URL.createObjectURL(worker.profileImage)
                                                : "/default-avatar.png"
                                    }
                                    alt="Worker Profile"
                                    className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-black"
                                />
                                {worker.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="animate-fadeInUp">
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-xl font-bold text-gray-900">{worker.name}</h1>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${worker.status === "Approved"
                                                ? "bg-green-100 text-green-800"
                                                : worker.status === "Rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {worker.status === "Approved"
                                            ? "Verified"
                                            : worker.status === "Rejected"
                                                ? "Rejected"
                                                : worker.status === "Re-approval"
                                                    ? "Requested to re-approval"
                                                    : "Pending Approval"}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-600">Rating:</span>
                                    <StarRatingDisplay rating={worker.ratings.average || 0} />
                                    <span className="text-xs text-gray-600">
                                        ({worker.ratings.average.toFixed(1)}/5)
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{worker.location.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <User className="w-3 h-3" />
                                        <span>{worker.age} years old</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
                            <StatCard icon={CheckCircle} label="Completed" value={worker.completedWorks} color="green" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-8 pb-10">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInScale">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3 animate-fadeInUp">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium text-gray-900">{worker.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium text-gray-900">{worker.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInScale" style={{ animationDelay: "0.2s" }}>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">How Can I Help</h2>
                                <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
                            </div>

                            {/* Work Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInScale" style={{ animationDelay: "0.3s" }}>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Radius (in km)</p>
                                        <p className="font-medium text-gray-900">{worker?.radius}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories & Services */}
                            <div className="min-h-screen p-2">
                                <div className="max-w-6xl mx-auto">
                                    {/* Categories & Services */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Categories Card */}
                                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-300 p-4">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Package className="w-5 h-5" />
                                                    Categories
                                                </h3>
                                            </div>

                                            <div className="p-4">
                                                <div className="max-h-[280px] overflow-y-auto pr-2 space-y-2 custom-scrollbar-blue">
                                                    {categories.length > 0 ? (
                                                        categories.map((category, index) => (
                                                            <div
                                                                key={index}
                                                                className="group flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300 hover:shadow-md"
                                                            >
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                                                <span className="text-gray-800 font-medium flex-1">{category.name}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                            <p className="text-gray-500 text-sm">No categories found</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Counter */}
                                                {categories.length > 0 && (
                                                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">
                                                            Total: <span className="font-bold text-blue-600">{categories.length}</span> categories
                                                        </span>
                                                        {categories.length > 5 && (
                                                            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                                                                Scroll for more ↓
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Services Card */}
                                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-green-600 to-green-300 p-4">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Briefcase className="w-5 h-5" />
                                                    Services & Pricing
                                                </h3>
                                            </div>

                                            <div className="p-4">
                                                {/* Scrollable container - shows 5 items, rest scrollable */}
                                                <div className="max-h-[280px] overflow-y-auto pr-2 space-y-2 custom-scrollbar-green">
                                                    {services.length > 0 ? (
                                                        services.map((service, index) => (
                                                            <div
                                                                key={index}
                                                                className="group flex items-center justify-between space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 cursor-pointer border border-green-200 hover:border-green-300 hover:shadow-md"
                                                            >
                                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform flex-shrink-0"></div>
                                                                    <span className="text-gray-800 font-medium truncate">{service.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full shadow-sm group-hover:bg-green-700 transition-colors">
                                                                        ₹{service.price}/hr
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                            <p className="text-gray-500 text-sm">No services found</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Counter with price summary */}
                                                {services.length > 0 && (
                                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm text-gray-600">
                                                                Total: <span className="font-bold text-green-600">{services.length}</span> services
                                                            </span>
                                                            {services.length > 5 && (
                                                                <span className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded-full">
                                                                    Scroll for more ↓
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Price range: ₹{Math.min(...services.map(s => s.price))} - ₹{Math.max(...services.map(s => s.price))}/hr
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1 animate-slideInRight">
                            <Calendar availability={availability} />

                            <div className="mt-6 pt-6 bg-white border p-5 rounded-xl shadow-sm border-gray-200 animate-fadeInScale" style={{ animationDelay: "0.2s" }}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Subscription</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${worker.subscription
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {worker.subscription ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Account Status</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${worker.isAccountBuilt
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {worker.isAccountBuilt ? 'Complete' : 'Incomplete'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEdit && (
                <WorkerEditForm onSave={onSave} workerData={selectedDetails} onClose={onClose} />
            )}
        </div>
    );
};

export default WorkerDetails;
