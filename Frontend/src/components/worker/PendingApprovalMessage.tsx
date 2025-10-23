import { Info } from "lucide-react";

interface PendingApprovalProps {
    status?: string;
    estimatedTime?: string;
}

const PendingApprovalMessage = ({
    status = "Pending Approval",
    estimatedTime = "within 24 hours",
}: PendingApprovalProps) => {
    return (
        <div className="max-h-screen flex items-center justify-center bg-gray-50 p-6 animate-fadeInUp">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center space-y-6">
                <div className="flex flex-col items-center gap-4">
                    {status === "Pending Approval" && (
                        <>
                            <Info className="w-12 h-12 text-green-600 animate-bounce" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                Account Pending Verification
                            </h2>
                            <p className="text-gray-600">
                                Your account has been successfully created. Our admin team will review and verify your account {estimatedTime}.
                            </p>
                            <p className="text-gray-600">
                                Once your account is verified, you will be able to select a subscription plan and gain full access to your dashboard.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-green-700 font-medium mt-4">
                                <span>Please wait patiently while we complete the verification process.</span>
                            </div>
                        </>
                    )}

                    {status === "Rejected" && (
                        <>
                            <Info className="w-12 h-12 text-red-600 animate-pulse" />
                            <h2 className="text-2xl font-bold text-gray-800">Account Rejected</h2>
                            <p className="text-gray-600">
                                Unfortunately, your account has been rejected by the admin.
                                Please review your profile, update any necessary information, and submit a re-approval request.
                            </p>
                        </>
                    )}

                    {status === "Re-approval" && (
                        <>
                            <Info className="w-12 h-12 text-green-600 animate-bounce" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                Re-approval Requested
                            </h2>
                            <p className="text-gray-600">
                                Your re-approval request has been submitted successfully. Our admin team will review your account {estimatedTime}.
                            </p>
                            <p className="text-gray-600">
                                Once approved, you will be able to choose a subscription plan and access your full dashboard.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-green-700 font-medium mt-4">
                                <span>Please wait patiently while we complete the verification process.</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalMessage;
