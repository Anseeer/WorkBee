import { X, Calendar, Clock, User, Briefcase, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { acceptWork, fetchWorkDetails, getWorkerDetails, isCompletWork } from '../../services/workerService';
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

const WorkDetailsModal = ({ closeModal, workId }: props) => {

    const [workDetails, setWorkDetails] = useState<IWork | null>(null);
    const [userDetails, setUserDetails] = useState<Iuser | null>(null);
    const [workerDetails, setWorkerDetails] = useState<IWorker | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);


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
    }, [])


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

    const HandleAccepted = async () => {
        try {
            await acceptWork(workDetails?._id as string);
            const work = await fetchWorkDetails(workId);
            setWorkDetails(work.data);

            toast.success("Accepted successfully");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const message = err?.response?.data?.data || "Failed to accept work";
            toast.error(message);
        }
    };


    const HandleRejected = async () => {
        await cancelWork(workDetails?._id as string);
        const work = await fetchWorkDetails(workId);
        setWorkDetails(work.data);
        toast.success("Cancelation successfull")
    }

    const HandleIsCompleted = async () => {
        await isCompletWork(workDetails?._id as string, workDetails?.workerId as string);
        const work = await fetchWorkDetails(workId);
        setWorkDetails(work.data);
        toast.success("Completed successfull")
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            {(
                <div
                    className="fixed inset-0 bg-transparent-500  bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center p-4"

                    onClick={closeModal}
                >
                    {/* Modal Content */}
                    <div
                        className="bg-white border-2 border-green-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{workDetails?.service}</h2>
                                    <p className="text-gray-600 mt-1">Job ID: #{workDetails?._id?.toString().substr(2, 9).toUpperCase()}</p>
                                </div>
                                <div className='flex items-center'>
                                    {workDetails?.status === "Accepted" && (
                                        <div className="flex items-center gap-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={isCompleted}
                                                    onChange={(e) => {
                                                        setIsCompleted(e.target.checked);
                                                        HandleIsCompleted();
                                                    }}
                                                />
                                                <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors">
                                                    <div className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform m-1 ${isCompleted ? "translate-x-6" : ""}`}></div>
                                                </div>
                                            </label>
                                            <span className="text-gray-700">
                                                {isCompleted ? "Completed" : "Not Completed"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium`}>
                                        <StatusBadge status={workDetails?.status} />
                                    </span>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Created on: {workDetails?.createdAt
                                    ? new Date(workDetails.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    })
                                    : ''}
                            </p>

                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* Customer Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="text-blue-600" size={20} />
                                        Customer Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Name:</span>
                                            <span className="text-gray-900">{userDetails?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Email:</span>
                                            <span className="text-gray-900">{userDetails?.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Phone:</span>
                                            <span className="text-gray-900 flex items-center gap-1">
                                                <Phone size={16} className="text-gray-500" />
                                                {userDetails?.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Worker Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Briefcase className="text-green-600" size={20} />
                                        Worker Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Name:</span>
                                            <span className="text-gray-900">{workDetails?.workerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Email:</span>
                                            <span className="text-gray-900">{workerDetails?.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Phone:</span>
                                            <span className="text-gray-900 flex items-center gap-1">
                                                <Phone size={16} className="text-gray-500" />
                                                {workerDetails?.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Briefcase className="text-purple-600" size={20} />
                                        Job Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Category:</span>
                                            <span className="text-gray-900">{workDetails?.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Service:</span>
                                            <span className="text-gray-900">{workDetails?.service}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Work Type:</span>
                                            <span className="text-gray-900">{workDetails?.workType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Size:</span>
                                            <span className="text-gray-900">{workDetails?.size}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Wage:</span>
                                            <span className="text-gray-900 font-bold text-lg text-green-600 flex items-center gap-1">
                                                <FaRupeeSign size={16} />
                                                {workDetails?.wage}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule & Location */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar className="text-orange-600" size={20} />
                                        Schedule & Location
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Date:</span>
                                            <span className="text-gray-900 flex items-center gap-1">
                                                <Calendar size={16} className="text-gray-500" />
                                                {formatDate(workDetails?.sheduleDate as string)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Time:</span>
                                            <span className="text-gray-900 flex items-center gap-1">
                                                <Clock size={16} className="text-gray-500" />
                                                {workDetails?.sheduleTime}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Location:</span>
                                            <span className="text-gray-900 flex items-center gap-1">
                                                {workDetails?.location.address}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Pincode:</span>
                                            <span className="text-gray-900">{workDetails?.location.pincode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                                <p className="text-gray-700 leading-relaxed">{workDetails?.description}</p>
                            </div>

                            {/* Status Information */}
                            <div
                                className={`mt-6 grid gap-4 ${workDetails?.status === "Canceled" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                                    }`}
                            >
                                {/* Job Status */}
                                <div
                                    className={`rounded-lg p-6 border ${workDetails?.status === "Canceled"
                                        ? "bg-red-100 border-red-300 w-full"
                                        : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-800 text-lg font-semibold">Job Status:</span>
                                        <span
                                            className={`px-4 py-2 rounded-full text-base font-semibold ${workDetails?.status === "Canceled"
                                                ? "bg-red-200 text-red-800"
                                                : getStatusColor(workDetails?.status as string)
                                                }`}
                                        >
                                            <StatusBadge status={workDetails?.status} />
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Status - only if not canceled */}
                                {workDetails?.status !== "Canceled" && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-lg font-semibold">
                                                Payment Status:
                                            </span>
                                            <span
                                                className={`px-4 py-2 rounded-full text-base font-semibold ${getStatusColor(
                                                    workDetails?.paymentStatus as string
                                                )}`}
                                            >
                                                <FaRupeeSign size={18} className="inline mr-2" />
                                                <StatusBadge status={workDetails?.paymentStatus} />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>


                        </div>

                        {/* Footer Actions */}
                        <div className="mt-4">
                            {workDetails?.status === "Pending" && (
                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 bg-red-100 hover:bg-red-300 text-black font font-bold m-4 py-2 rounded-lg"
                                        onClick={() => HandleRejected()}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="flex-1 bg-green-100 hover:bg-green-300 text-black font font-bold m-4 py-2 rounded-lg"
                                        onClick={() => HandleAccepted()}
                                    >
                                        Accept
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkDetailsModal;