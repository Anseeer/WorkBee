/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import WorkerSidebar from "../../components/worker/WorkerSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import BuildAccount from "../../components/worker/BuildAccountForm";
import WorkerDetails from "../../components/common/WorkerDetails";
import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import { fetchWorkerDetails } from "../../slice/workerSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import WorkHistory from "../../components/worker/WorkHistory";
import Wallet from "../../components/common/Wallet";
import Message from "./message";
import Notifications from "./notification";
import WorkerDashboard from "../../components/worker/Dashboard";
import type { IAvailability } from "../../types/IAvailability";
import type { IWallet } from "../../types/IWallet";
import { SubscriptionPlans } from "../../components/worker/Subscription";
import AddMoneyModal from "../../components/user/AddMoneyModal";
import PayoutModal from "../../components/common/PayoutForm";
import ReApplyModal from "../../components/worker/ReApprovalComponent";
import Loader from "../../components/common/Loader";
import PendingApprovalMessage from "../../components/worker/PendingApprovalMessage";
import ChangePasswordModal from "../../components/common/ChangePasswordModal";
import { toast } from "react-toastify";
import { ChangePassword } from "../../services/workerService";

const Dashboard = () => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [userId, setUserId] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [addMoneyModal, setAddMoneyModal] = useState(false);
    const [payoutMoneyModal, setPayoutMoneyModal] = useState(false);
    const [reApplyModal, setReApplyModal] = useState(false);
    const [reload, setReloadWallet] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const dispatch = useAppDispatch();
    const { setSelectedDetails } = useWorkerDetails();
    const workerData = useSelector((state: RootState) => state.worker);
    const wallet = workerData.wallet;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const workerID = localStorage.getItem("workerId");
            if (workerID) {
                if (initialLoading) setInitialLoading(true);
                await dispatch(fetchWorkerDetails(workerID));
                setInitialLoading(false);
            }
        }
        fetchData();
    }, [dispatch, reload]);

    useEffect(() => {
        setSelectedDetails(workerData);
    }, [workerData, setSelectedDetails, reload]);

    const handleTab = (tab: string) => {
        setActiveTab(tab);
    };

    const handleReload = () => {
        setReloadWallet((prev) => !prev);
    };

    const handleEdit = () => {
        setIsEdit((prev) => !prev);
    }

    const handleAddMoney = () => {
        setUserId(workerData.worker?._id as string)
        setAddMoneyModal(true)
    }

    const handlePayoutMoney = () => {
        setUserId(workerData.worker?._id as string)
        setPayoutMoneyModal(true)
    }

    const closeAddMoneyModal = () => {
        setAddMoneyModal(false);
        setReloadWallet((prev) => !prev);
    }

    const closePayoutMoneyModal = () => {
        setPayoutMoneyModal(false);
        setReloadWallet((prev) => !prev);
    }

    const handleCloseReApplyModal = () => {
        setReloadWallet((prev) => !prev);
        setReApplyModal(false);
    }

    const handleReApproval = () => {
        setUserId(workerData.worker?._id as string)
        setReApplyModal(true)
    }

    const HandleChangePassword = async (data: { currentPassword: string; newPassword: string; }) => {
        try {
            await ChangePassword(data.currentPassword, data.newPassword, workerData?.worker?._id as string);
            toast.success("Password changed successfully");
            setChangePassword(false)
        } catch (error: any) {
            console.error("Error in HandleChangePassword:", error);

            const backendMsg =
                error?.response?.data?.data ||
                error?.response?.data?.message ||
                "Error in Change Password";

            toast.error(backendMsg);
        }
    };

    return (
        <div className="w-full h-screen flex">
            {initialLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader />
                </div>
            ) : workerData.worker?.isAccountBuilt ? (<>
                <WorkerSidebar handleTab={handleTab} />
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between py-2 px-2">
                        <h3 className="text-2xl font-semibold">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h3>

                        <div className="flex gap-2">
                            {activeTab === "account" && (
                                <>
                                    {workerData.worker.status === "Rejected" && (
                                        <button
                                            onClick={() => handleReApproval()}
                                            className="text-sm border-black rounded px-2 py-1 bg-red-100 cursor-pointer text-red-900 rounded-md hover:bg-blue-200 transition"
                                        >
                                            Re-Approval
                                        </button>
                                    )}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            className="px-4 py-1 text-black border border-black rounded font-semibold hover:bg-green-900 hover:text-white transition-colors"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            onMouseEnter={() => setIsDropdownOpen(true)}
                                        >
                                            Actions
                                        </button>

                                        {isDropdownOpen && (
                                            <div
                                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-100"
                                                onMouseLeave={() => setIsDropdownOpen(false)}
                                            >
                                                <button
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center gap-2 transition-colors"
                                                    onClick={() => {
                                                        handleEdit();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5l4 4-11 11H5v-4l11.5-11z" />
                                                    </svg>
                                                    Edit Profile
                                                </button>

                                                <button
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg flex items-center gap-2 transition-colors border-t"
                                                    onClick={() => {
                                                        setChangePassword(true)
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                                                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                    </svg>
                                                    Change Password
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === "wallet" && (
                                <>
                                    <button
                                        className="px-4 py-1 text-green-600 border border-black rounded font-semibold hover:bg-green-900 hover:text-white"
                                        onClick={handleAddMoney}
                                    >
                                        Add Money
                                    </button>
                                    <button
                                        className="px-4 py-1 text-black border border-black rounded font-semibold hover:bg-gray-400 hover:text-white"
                                        onClick={handlePayoutMoney}
                                    >
                                        Payout Money
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <hr className="border border-green-900" />

                    <div className="flex-1 min-h-0 overflow-auto">
                        {activeTab === "dashboard" ? (
                            <>
                                {workerData.worker?.isVerified && workerData.worker.status != "Rejected" && workerData.worker.subscription == null ? (
                                    <SubscriptionPlans />
                                ) : !workerData.worker.isVerified || workerData.worker.status == "Rejected" && workerData.worker.subscription == null ? (
                                    <PendingApprovalMessage
                                        status={workerData.worker.status}
                                        message={workerData.worker.rejectionReason}
                                        estimatedTime="42hrs" />
                                ) : (
                                    <WorkerDashboard
                                        worker={workerData.worker}
                                        wallet={workerData.wallet as IWallet}
                                        availability={workerData.availability as IAvailability}
                                    />
                                )}
                            </>
                        ) : activeTab === "account" ? (
                            <WorkerDetails isEdit={isEdit} setEdit={handleEdit} />
                        ) : activeTab === "history" ? (
                            <WorkHistory />
                        ) : activeTab === "wallet" ? (
                            <div className="border-2 rounded-xl p-2 m-10 border-green-700 h-full">
                                <Wallet
                                    workerId={workerData.worker?._id as string}
                                    historyPrev={wallet?.transactions}
                                    balancePrev={wallet?.balance}
                                />
                            </div>
                        ) : activeTab === "message" ? (
                            <Message />
                        ) : activeTab === "notification" ? (
                            <Notifications />
                        ) : null}

                        {addMoneyModal && (
                            <AddMoneyModal
                                userId={userId as string}
                                onClose={closeAddMoneyModal}
                                handleReload={handleReload}
                            />
                        )}

                        {payoutMoneyModal && (
                            <PayoutModal
                                balance={wallet?.balance as number}
                                closeModal={closePayoutMoneyModal}
                                workerID={userId}
                            />
                        )}

                        {reApplyModal && (
                            <ReApplyModal close={handleCloseReApplyModal} workerID={userId as string} handleEdit={handleEdit} />
                        )}

                        {changePassword && (
                            <ChangePasswordModal onClose={() => setChangePassword(false)} onSave={HandleChangePassword} />
                        )}

                    </div>
                </div>
            </>
            ) : (
                <>
                    {!workerData.worker?.isAccountBuilt ? (
                        <>
                            <BuildAccount />
                        </>
                    ) : null}
                </>
            )}
        </div>
    );

};

export default Dashboard;
