import { useEffect, useState } from "react";
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

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [userId, setUserId] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [addMoneyModal, setAddMoneyModal] = useState(false);
    const [payoutMoneyModal, setPayoutMoneyModal] = useState(false);
    const [reload, setReloadWallet] = useState(false);
    const dispatch = useAppDispatch();
    const { setSelectedDetails } = useWorkerDetails();
    const workerData = useSelector((state: RootState) => state.worker);
    const wallet = workerData.wallet;

    useEffect(() => {
        const fetchData = async () => {
            const workerID = localStorage.getItem("workerId");
            if (workerID) {
                dispatch(fetchWorkerDetails(workerID));
                console.log("first")
            }
        }
        fetchData()
    }, [dispatch, reload]);

    useEffect(() => {
        setSelectedDetails(workerData);
        console.log('WorkerData :', workerData.wallet);
        console.log("Second")
    }, [workerData, setSelectedDetails, reload]);

    const handleTab = (tab: string) => {
        setActiveTab(tab);
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
        setReloadWallet((prev) => !prev);
        setAddMoneyModal(false);
    }

    const closePayoutMoneyModal = () => {
        setReloadWallet((prev) => !prev);
        setPayoutMoneyModal(false);
    }

    return (
        <div className="w-full h-screen flex">
            <WorkerSidebar handleTab={handleTab} />
            <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between py-2 px-2">
                    <h3 className="text-2xl font-semibold">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h3>

                    <div className="flex gap-2">
                        {activeTab === "account" && workerData.worker?.isAccountBuilt && workerData.worker.subscription != null && (
                            <button
                                className="px-4 py-1 text-black border border-black rounded font-semibold hover:bg-green-900 hover:text-white"
                                onClick={() => handleEdit()}
                            >
                                Edit
                            </button>
                        )}

                        {activeTab === "wallet" && (
                            <>
                                <button
                                    className="px-4 py-1 text-green-600 border border-black rounded font-semibold hover:bg-green-900 hover:text-white"
                                    onClick={() => handleAddMoney()}
                                >
                                    Add Money
                                </button>
                                <button
                                    className="px-4 py-1 text-black border border-black rounded font-semibold hover:bg-gray-400 hover:text-white"
                                    onClick={() => handlePayoutMoney()}
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
                        !workerData.worker?.isAccountBuilt ? (
                            <BuildAccount />
                        ) : workerData.worker?.subscription == null ? (
                            <SubscriptionPlans />
                        ) : (
                            <WorkerDashboard worker={workerData.worker} wallet={workerData.wallet as IWallet} availability={workerData.availability as IAvailability} />
                        )
                    ) : activeTab === "account" ? (
                        !workerData.worker?.isAccountBuilt ? (
                            <BuildAccount />
                        ) : workerData.worker?.subscription == null ? (
                            <SubscriptionPlans />
                        ) : (
                            <WorkerDetails isEdit={isEdit} setEdit={handleEdit} />
                        )

                    ) : activeTab === "history" ? (
                        <WorkHistory />
                    ) : activeTab === "wallet" ? (
                        <div className="border-2 rounded-xl p-2 bg-gray-50 m-10 border-green-700 h-full">
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

                    {addMoneyModal && <AddMoneyModal userId={userId as string} onClose={closeAddMoneyModal} />}
                    {payoutMoneyModal && <PayoutModal balance={wallet?.balance as number} closeModal={closePayoutMoneyModal} workerID={userId} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
