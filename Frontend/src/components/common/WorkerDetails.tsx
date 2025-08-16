/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Phone, Mail, User, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useWorkerDetails } from '../context/WorkerDetailContext';
import { fetchWorkerCategory, fetchWorkerService, updateWorkerData } from '../../services/workerService';
import type { ICategory } from '../../types/ICategory';
import type { IService } from '../../types/IServiceTypes';
import WorkerEditForm from '../worker/WokerEditForm';
import type { IWorker } from '../../types/IWorker';
import type { IAvailability } from '../../types/IAvailability';
import { toast } from 'react-toastify';

interface Prop {
    isEdit?: boolean;
    setEdit?: () => void;
}

interface CalendarProps {
    availability: IAvailability;
}

const Calendar = ({ availability }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getAvailableDaysForMonth = (date: dayjs.Dayjs): number[] => {
        const month = date.month();
        const year = date.year();
        return (availability?.availableDates || [])
            .filter(d => dayjs(d.date).year() === year && dayjs(d.date).month() === month)
            .map(d => dayjs(d.date).date());
    };

    useEffect(() => {
        const generateCalendar = (date: dayjs.Dayjs) => {
            const startOfMonth = date.startOf("month");
            const startDay = startOfMonth.day(); // Sunday = 0

            const daysInMonth = date.daysInMonth();
            const days: (number | null)[] = [];

            for (let i = 0; i < startDay; i++) {
                days.push(null); // blank days before start
            }

            for (let i = 1; i <= daysInMonth; i++) {
                days.push(i);
            }
            setCalendarDays(days);
        };
        generateCalendar(currentDate);
    }, [currentDate, availability]);

    const goToPreviousMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const goToNextMonth = () => {
        setCurrentDate(currentDate.add(1, "month"));
    };

    const month = currentDate.format("MMMM");
    const year = currentDate.format("YYYY");
    const availableDays = getAvailableDaysForMonth(currentDate);

    // Corrected the return statement for the Calendar component
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6  top-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
                <div className="flex gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center mb-4">
                    <h4 className="font-semibold text-gray-900">{month} {year}</h4>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs font-medium p-2 text-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`text-center p-2 text-sm font-medium rounded-lg transition-colors ${day === null
                                ? ""
                                : availableDays.includes(day)
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "text-gray-400"
                                }`}
                        >
                            {day !== null ? day : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
    const [services, setServices] = useState<IService[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!worker) return;

            try {
                const catRes = await fetchWorkerCategory(worker.categories || []);
                const servRes = await fetchWorkerService(worker.services || []);

                setCategories(catRes.data.data || []);
                setServices(servRes.data.data || []);
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
            console.log("Updated :", updatedData);
            await updateWorkerData(updatedData);
            toast.success("Updated Successfully.");
            if (setEdit) setEdit();
        } catch (error) {
            console.log(error);
            toast.error("Failed To update");
        }
    }

    return (
        <div className="h-[560px] bg-gray-50 overflow-hidden">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={
                                        typeof worker.profileImage === "string"
                                            ? worker.profileImage
                                            : worker.profileImage instanceof File
                                                ? URL.createObjectURL(worker.profileImage)
                                                : "/default-avatar.png"
                                    }
                                    alt="Worker Profile"
                                    className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-white"
                                />
                                {worker.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
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
                                                : "Pending Approval"}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
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

                        <div className="flex space-x-4">
                            <StatCard icon={CheckCircle} label="Completed" value={worker.completedWorks} color="green" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-100 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium text-gray-900">{worker.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
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

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">How Can I Help</h2>
                                <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Work Type</p>
                                        <p className="font-medium text-gray-900">{worker.workType.join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Preferred Schedule</p>
                                        <p className="font-medium text-gray-900">{worker.preferredSchedule.join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Radius (in km)</p>
                                        <p className="font-medium text-gray-900">{worker?.radius}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-3">
                                        {categories.length > 0 ? (
                                            categories.map((category, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                                                >
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="text-gray-800 font-medium">{category.name}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No categories found</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                                    <div className="space-y-3">
                                        {services.length > 0 ? (
                                            services.map((service, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                                                >
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-gray-800 font-medium">{service.name}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No services found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <Calendar availability={availability} />

                            <div className="mt-6 pt-6 bg-white border p-5 rounded-xl shadow-sm border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Subscription</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${worker.subscription.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {worker.subscription.isActive ? 'Active' : 'Inactive'}
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
            {
                isEdit ? (
                    <WorkerEditForm onSave={onSave} workerData={selectedDetails} onClose={onClose} />
                ) : null
            }
        </div >
    );
};

export default WorkerDetails;