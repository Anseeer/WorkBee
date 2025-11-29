/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Clock, User, Briefcase, Phone, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { acceptWork, fetchWorkDetails, getWorkerDetails, isCompletWork } from '../../services/workerService';
import { cancelWork, getUserDetails } from '../../services/userService';
import type { IWork } from '../../types/IWork';
import type { Iuser } from '../../types/IUser';
import type { IWorker } from '../../types/IWorker';
import { FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { StatusBadge } from '../../utilities/StatusBadge';
import MapView from '../common/MapView';

interface props {
    closeModal: () => void;
    workId: string;
}

const WorkDetailsModal = ({ closeModal, workId }: props) => {
    const [workDetails, setWorkDetails] = useState<IWork | null>(null);
    const [userDetails, setUserDetails] = useState<Iuser | null>(null);
    const [workerDetails, setWorkerDetails] = useState<IWorker | null>(null);
    const [hoursWorked, setHoursWorked] = useState('');

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

    const HandleAccepted = async () => {
        try {
            await acceptWork(workDetails?._id as string);
            const work = await fetchWorkDetails(workId);
            setWorkDetails(work.data);
            toast.success("Accepted successfully");
        } catch (err: any) {
            const message = err?.response?.data?.data || "Failed to accept work";
            toast.error(message);
        }
    };

    const HandleRejected = async () => {
        await cancelWork(workDetails?._id as string, workerDetails?.id as string);
        const work = await fetchWorkDetails(workId);
        setWorkDetails(work.data);
        toast.success("Cancelation successfull")
    }

    const HandleMarkCompleted = async () => {
        if (!hoursWorked || Number(hoursWorked) <= 0) {
            toast.error("Please enter valid hours worked");
            return;
        }

        try {
            await isCompletWork(workDetails?._id as string, workDetails?.workerId as string, hoursWorked);
            const work = await fetchWorkDetails(workId);
            setWorkDetails(work.data);
            toast.success("Work completed successfully!");
            setHoursWorked('');
        } catch (err: any) {
            console.log("Error in completion :", err);
            toast.error("Failed to mark work as complete");
        }
    };

    const subTotal = Number(workDetails?.wagePerHour) * Number(workDetails?.totalHours);

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div
                className="bg-white border-2 border-green-700 rounded-xl shadow-2xl w-full max-w-[90vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b border-gray-200 p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                                {workDetails?.service}
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                                Job ID: #{workDetails?._id?.toString().substr(2, 9).toUpperCase()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                                <StatusBadge status={workDetails?.status} />
                            </span>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2">
                        Created on: {workDetails?.createdAt
                            ? new Date(workDetails.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : ""}
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6">
                    {/* Work Completion Section - Only show when status is Accepted */}
                    {workDetails?.status === "Accepted" && (
                        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Complete This Work</h3>
                                    <p className="text-gray-600 text-sm mt-1">Enter the total hours you worked on this job</p>
                                </div>
                            </div>

                            {/* Hours Input */}
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-green-200 mb-4">
                                <label className="flex items-center gap-2 text-gray-700 text-base font-semibold mb-3">
                                    <Clock className="text-green-600" size={20} />
                                    Hours Worked
                                </label>

                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="0.5"
                                        step="0.5"
                                        className="flex-1 text-2xl font-bold border-2 border-gray-300 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        onChange={(e) => setHoursWorked(e.target.value)}
                                        value={hoursWorked}
                                        placeholder="0"
                                    />
                                    <span className="text-xl font-semibold text-gray-600">hours</span>
                                </div>

                                {hoursWorked && Number(hoursWorked) > 0 && (
                                    <p className="text-green-600 text-sm mt-3 font-medium">
                                        ✓ You worked for {hoursWorked} {Number(hoursWorked) === 1 ? 'hour' : 'hours'}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={HandleMarkCompleted}
                                disabled={!hoursWorked || Number(hoursWorked) <= 0}
                                className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform ${hoursWorked && Number(hoursWorked) > 0
                                    ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] shadow-lg hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <CheckCircle2 size={24} />
                                    Mark Work as Complete
                                </span>
                            </button>

                            {/* Helper Text */}
                            <div className="bg-blue-50 p-4 mt-4">
                                <p className="text-blue-800 text-sm">
                                    Make sure to enter the accurate number of hours worked. This information will be used for payment calculation.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Existing Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <User className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" size={20} />
                                Customer Information
                            </h3>
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Name:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{userDetails?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Email:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{userDetails?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Phone:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base flex items-center gap-1 break-words">
                                        <Phone size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        {userDetails?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Worker Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <Briefcase className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" size={20} />
                                Worker Information
                            </h3>
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Name:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{workDetails?.workerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Email:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{workerDetails?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Phone:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base flex items-center gap-1 break-words">
                                        <Phone size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        {workerDetails?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Job Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                <Briefcase className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" size={20} />
                                Job Information
                            </h3>
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Category:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{workDetails?.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Service:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{workDetails?.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Size:</span>
                                    <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{workDetails?.size}</span>
                                </div>
                                {workDetails?.totalHours &&
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Total Hours Worked:</span>
                                        <span className="text-gray-900 text-xs sm:text-sm md:text-base break-words">{workDetails?.totalHours}</span>
                                    </div>
                                }
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Wage Per-Hour:</span>
                                    <span className="text-gray-900 font-bold text-sm sm:text-base md:text-lg text-green-600 flex items-center gap-1">
                                        <FaRupeeSign size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        {workDetails?.wagePerHour}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Platform commission:</span>
                                    <span className="text-gray-900 font-bold text-sm sm:text-base md:text-lg text-green-600 flex items-center gap-1">
                                        <FaRupeeSign size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        {workDetails?.commission}
                                    </span>
                                </div>
                                {workDetails?.totalAmount &&
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">Total Amount:</span>
                                        <span className="text-gray-900 font-bold text-sm sm:text-base md:text-lg text-green-600 flex items-center gap-1">
                                            <FaRupeeSign size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                            {subTotal}
                                        </span>                                    </div>
                                }
                            </div>
                        </div>

                        {/* Schedule & Location */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                Schedule & Location
                            </h3>

                            <div className="space-y-3">
                                {/* Date */}
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <span className="text-gray-600 font-medium text-sm">Date:</span>
                                    <span className="text-gray-900 text-sm mt-1 sm:mt-0 break-words">
                                        {formatDate(workDetails?.sheduleDate as string)}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <span className="text-gray-600 font-medium text-sm">Time:</span>
                                    <span className="text-gray-900 text-sm mt-1 sm:mt-0 break-words">
                                        {workDetails?.sheduleTime}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <span className="text-gray-600 font-medium text-sm">Location:</span>
                                    <span className="text-gray-900 text-sm mt-1 sm:mt-0 break-words max-w-[60%] sm:max-w-[70%] md:max-w-[75%] text-right sm:text-left">
                                        {workDetails?.location.address}
                                    </span>
                                </div>

                                {/* Pincode */}
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <span className="text-gray-600 font-medium text-sm">Pincode:</span>
                                    <span className="text-gray-900 text-sm mt-1 sm:mt-0 break-words">
                                        {workDetails?.location.pincode}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Map Location */}
                    <div className="mt-4 sm:mt-6 md:mt-8 bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                            Job Location Map
                        </h3>

                        {workDetails?.location?.lat && workDetails?.location?.lng ? (
                            <MapView
                                lat={workDetails.location.lat}
                                lng={workDetails.location.lng}
                            />
                        ) : (
                            <p className="text-sm text-gray-600">No map data available</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-4 sm:mt-6 md:mt-8 bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Job Description</h3>
                        <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed break-words whitespace-pre-line">{workDetails?.description}</p>
                    </div>

                    {/* Status Information */}
                    <div
                        className={`mt-4 sm:mt-6 md:mt-8 grid gap-4 sm:gap-6 ${workDetails?.status === "Canceled" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
                    >
                        {/* Job Status */}
                        <div
                            className={`rounded-lg p-3 sm:p-4 md:p-6 border ${workDetails?.status === "Canceled" ? "bg-red-100 border-red-300" : "bg-gray-50 border-gray-200"}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold">Job Status:</span>
                                <span
                                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm md:text-base font-semibold ${workDetails?.status === "Canceled" ? "bg-red-200 text-red-800" : getStatusColor(workDetails?.status as string)
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
                                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm md:text-base font-semibold ${getStatusColor(
                                            workDetails?.paymentStatus as string
                                        )}`}
                                    >
                                        <FaRupeeSign size={14} className="inline mr-1 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        <StatusBadge status={workDetails?.paymentStatus} />
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {workDetails?.status === "Pending" && (
                        <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                            <button
                                className="flex-1 bg-red-100 hover:bg-red-300 text-black font-bold px-4 sm:px-6 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base"
                                onClick={() => HandleRejected()}
                            >
                                Reject
                            </button>
                            <button
                                className="flex-1 bg-green-100 hover:bg-green-300 text-black font-bold px-4 sm:px-6 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base"
                                onClick={() => HandleAccepted()}
                            >
                                Accept
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkDetailsModal;