import React, { useEffect, useState } from 'react';
import { Eye, Check, X, User, FileText, Calendar, MapPin } from 'lucide-react';
import { approveWorker, fetchWorkersNonVerified, rejectedWorker } from '../../services/adminService';
import type { IWorker } from '../../types/IWorker';
import { toast } from 'react-toastify';

const ImageModal: React.FC<{
    isOpen: boolean;
    imageUrl: string;
    onClose: () => void;
    title: string;
}> = ({ isOpen, imageUrl, onClose, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparant bg-blur-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-dashed rounded-2xl max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

const WorkerApprovalComponent: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<{
        url: string;
        title: string;
    } | null>(null);

    const [requests, setRequests] = useState<IWorker[]>([]);
    const [rejected, setRejected] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWorkersNonVerified();
            const workers = res.data.data;
            setRequests(workers);
        };
        fetchData();
    }, [rejected]);


    const pendingRequests = requests.filter(request => request.isVerified === false);

    const handleApprove = async (workerId: string) => {
        if (!workerId) {
            toast.error("Worker Id Not Get")
        }
        await approveWorker(workerId);
        toast.success("Approved");
        setRequests(prev =>
            prev.filter(request => request.id !== workerId)
        );
    };

    const handleReject = async (workerId: string) => {
        await rejectedWorker(workerId)
        toast.success("Rejected")
        setRejected(true)
    };

    const openImageModal = (imageUrl: string, title: string) => {
        setSelectedImage({ url: imageUrl, title });
    };

    const formatDate = (dateInput?: string | Date) => {
        if (!dateInput) return "N/A";
        return new Date(dateInput).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="h-[560px] overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <p className="text-gray-600">Review and approve worker registration requests</p>
                </div>

                {pendingRequests.length === 0 ? (
                    <div className="bg-transparent rounded-2xl  p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
                        <p className="text-gray-600">No pending worker requests to review at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                                {request.profileImage !== " " ? (
                                                    <img className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center" sizes='6' src={request.profileImage as string} alt="" />
                                                ) : <User className="w-6 h-6 text-white" />}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">{request.name}</h3>
                                                <p className="text-gray-600">{request.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {request.status === "Pending Approval" ? (
                                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                                    {request.status}
                                                </div>
                                            ) : request.status === "Rejected" ? (
                                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                                    {request.status}
                                                </div>
                                            ) : null}

                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <User className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Phone</div>
                                                <div className="font-medium">{request.phone}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Location</div>
                                                <div className="font-medium">{request.location.address}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Created</div>
                                                <div className="font-medium">
                                                    {formatDate(request.createdAt)}
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            <h4 className="font-semibold text-gray-800">Government ID Documents</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Array.isArray(request.govId) ? (
                                                request.govId.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-400 hover:border-green-300 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                                Government ID - {index + 1}
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <img
                                                                src={url}
                                                                alt={`Government ID ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg blur-sm group-hover:blur-none transition-all duration-300"
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    openImageModal(url, `Government ID - ${index + 1}`)
                                                                }
                                                                className="absolute inset-0 bg-transparent bg-blur-50 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all duration-200"
                                                            >
                                                                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No Government IDs</div>
                                            )}
                                        </div>
                                    </div>


                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleApprove(request.id)}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                        >
                                            <Check className="w-5 h-5" />
                                            <span>Approve Worker</span>
                                        </button>
                                        {request.status !== "Rejected" ?
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                            >
                                                <X className="w-5 h-5" />
                                                <span>Reject Request</span>
                                            </button> : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ImageModal
                isOpen={selectedImage !== null}
                imageUrl={selectedImage?.url || ''}
                title={selectedImage?.title || ''}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
};

export default WorkerApprovalComponent;