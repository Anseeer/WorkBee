import { XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { reApplyWorker } from '../../services/workerService';

interface props {
    close: () => void;
    handleEdit: () => void;
}

export default function ReApplyModal({ close, handleEdit }: props) {

    const handleReapply = async () => {
        try {
            await reApplyWorker();
            toast.success("Re approval sent..!")
            close()
        } catch (error) {
            console.log(error);
            toast.error("Faild to re-approval request")
            close()
        }
    };

    const handleEditProfile = () => {
        close()
        handleEdit()
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                    onClick={() => close()}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XCircle size={24} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                        <AlertCircle className="text-red-600" size={48} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    Request Rejected
                </h2>

                {/* Message */}
                <p className="text-red-600 text-center mb-6">
                    Admin rejected your approval request. Please upload valid IDs then re-apply.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleEditProfile}
                        className="flex-1 px-4 py-2.5 border border-gray-300 bg-gray-100 text-gray-700 rounded-lg font-medium
               hover:bg-gray-300 hover:shadow-md hover:scale-[1.02] 
               active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={handleReapply}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium
               hover:bg-blue-800 hover:shadow-lg hover:scale-[1.03]
               active:scale-[0.97] transition-all duration-200 cursor-pointer"
                    >
                        Re-apply
                    </button>
                </div>

            </div>
        </div>
    );
}