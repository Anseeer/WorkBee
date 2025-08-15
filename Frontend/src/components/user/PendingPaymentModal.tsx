import { X } from "lucide-react";
import { useState } from "react";

const PendingPaymentModal = () => {

    const [isClose, setIsClose] = useState(true);

    const payments = [
        {
            _id: "1",
            serviceName: "Home Cleaning",
            amount: 500,
            dueDate: "2025-08-20",
        },
        {
            _id: "2",
            serviceName: "AC Repair",
            amount: 1200,
        },
    ];

    const onClose = () => {
        setIsClose(false);
    }
    if (!isClose) return;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Pending Payments
                </h2>

                {payments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No pending payments 🎉</p>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <div
                                key={payment._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {payment.serviceName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Amount: ₹{payment.amount}
                                    </p>
                                    {payment.dueDate && (
                                        <p className="text-xs text-red-500">
                                            Due: {new Date(payment.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Pay Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingPaymentModal;
