import { X, Calendar, Clock, User, Briefcase, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchWorkDetails, getWorkerDetails } from '../../services/workerService';
import { cancelWork, getUserDetails } from '../../services/userService';
import type { IWork } from '../../types/IWork';
import type { Iuser } from '../../types/IUser';
import type { IWorker } from '../../types/IWorker';
import { FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { StatusBadge } from '../../utilities/StatusBadge';

interface props {
    closeModal: () => void;
    workId: string;
}

const WorkInfoModal = ({ closeModal, workId }: props) => {

    const [workDetails, setWorkDetails] = useState<IWork | null>(null);
    const [userDetails, setUserDetails] = useState<Iuser | null>(null);
    const [workerDetails, setWorkerDetails] = useState<IWorker | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            const workDetails = await fetchWorkDetails(workId);
            setWorkDetails(workDetails.data);
            const workerId = workDetails.data?.workerId;
            if (workerId) {
                const workerDetails = await getWorkerDetails(workerId);
                setWorkerDetails(workerDetails.data.data.worker);
            } else {
                console.error("No workerId found in workDetails");
            }

            const userId = workDetails.data?.userId;
            if (userId) {
                const userDetails = await getUserDetails(userId);
                setUserDetails(userDetails.user);
            } else {
                console.error("No workerId found in workDetails");
            }
        }
        fetchData();
    }, [workId])


    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'text-green-600 bg-green-50';
            case 'pending': return 'text-yellow-600 bg-yellow-50';
            case 'completed': return 'text-blue-600 bg-blue-50';
            case 'cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const HandleRejected = async () => {
        await cancelWork(workDetails?._id as string);
        const work = await fetchWorkDetails(workId);
        setWorkDetails(work.data);
        toast.success("Cancelation successfull")
    }


    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
            <div
                className="bg-white border-2 border-green-700 rounded-xl shadow-2xl w-full max-w-[90vw] sm:max-w-3xl md:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b border-gray-200 p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">{workDetails?.service}</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Job ID: #{workDetails?._id?.toString().substr(2, 9).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                <StatusBadge status={workDetails?.status} />
                            </span>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 hover:bg-gray-100 rounded-full"
                                aria-label="Close work info modal"
                            >
                                <X size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                        Created on: {workDetails?.createdAt
                            ? new Date(workDetails.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit', month: '2-digit', year: 'numeric'
                            })
                            : ''}
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <User className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                                Customer Information
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Name:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{userDetails?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Email:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{userDetails?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Phone:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm flex items-center gap-1 break-words">
                                        <Phone size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {userDetails?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Worker Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <Briefcase className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                                Worker Information
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Name:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.workerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Email:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workerDetails?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Phone:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm flex items-center gap-1 break-words">
                                        <Phone size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {workerDetails?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Job Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <Briefcase className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                                Job Information
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Category:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Service:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Work Type:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.workType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Size:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Wage:</span>
                                    <span className="text-gray-900 font-bold text-sm sm:text-base text-green-600 flex items-center gap-1">
                                        <FaRupeeSign size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {workDetails?.wage}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Schedule & Location */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <Calendar className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                                Schedule & Location
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Date:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm flex items-center gap-1 break-words">
                                        <Calendar size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {formatDate(workDetails?.sheduleDate as string)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Time:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm flex items-center gap-1 break-words">
                                        <Clock size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {workDetails?.sheduleTime}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Location:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.location.address}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Pincode:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm break-words">{workDetails?.location.pincode}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4 sm:mt-6 md:mt-8 bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Job Description</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words whitespace-pre-line">
                            {workDetails?.description}
                        </p>
                    </div>

                    {/* Status Information */}
                    <div
                        className={`mt-4 sm:mt-6 grid gap-4 sm:gap-6 ${workDetails?.status === "Canceled" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                            }`}
                    >
                        {/* Job Status */}
                        <div
                            className={`rounded-lg p-3 sm:p-4 md:p-6 border ${workDetails?.status === "Canceled" ? "bg-red-100 border-red-300" : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold">Job Status:</span>
                                <span
                                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${workDetails?.status === "Canceled" ? "bg-red-200 text-red-800" : getStatusColor(workDetails?.status as string)
                                        }`}
                                >
                                    <StatusBadge status={workDetails?.status} />
                                </span>
                            </div>
                        </div>

                        {/* Payment Status - only if not canceled */}
                        {workDetails?.status !== "Canceled" && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm sm:text-base md:text-lg font-semibold">Payment Status:</span>
                                    <span
                                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
                                            workDetails?.paymentStatus as string
                                        )}`}
                                    >
                                        <FaRupeeSign size={14} className="inline mr-1 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <StatusBadge status={workDetails?.paymentStatus} />
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {workDetails?.status === "Pending" && (
                        <div className="mt-4 sm:mt-6 p-3 sm:p-4">
                            <div className="flex justify-center">
                                <button
                                    className="w-full sm:w-auto px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-red-100 hover:bg-red-300 text-black font-bold rounded-lg transition-colors"
                                    onClick={() => HandleRejected()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkInfoModal;