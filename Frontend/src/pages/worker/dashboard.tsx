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
import WorkerDashboard from "../../components/worker/WorkerDashboard";
import type { IWallet } from "../../types/IWallet";
import type { IAvailability } from "../../types/IAvailability";
// import BankForm from "../../components/worker/WithdrawMoney";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isEdit, setIsEdit] = useState(false);
    // const [isWithraw, setIsWithraw] = useState(false);
    const dispatch = useAppDispatch();
    const { setSelectedDetails } = useWorkerDetails();
    const workerData = useSelector((state: RootState) => state.worker);
    const wallet = workerData.wallet;
    useEffect(() => {
        const workerID = localStorage.getItem("workerId");
        if (workerID) {
            dispatch(fetchWorkerDetails(workerID));
        }
    }, [dispatch]);

    useEffect(() => {
        setSelectedDetails(workerData);
    }, [workerData, setSelectedDetails]);

    const handleTab = (tab: string) => {
        setActiveTab(tab);
    };

    const handleEdit = () => {
        setIsEdit((prev) => !prev);
    }

    // const handleWithrawMoney = () => {
    //     setIsWithraw((prev) => !prev);
    // }

    return (
        <div className="w-full h-screen flex">
            <WorkerSidebar handleTab={handleTab} />
            <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between py-2 px-2">
                    <h3 className="text-2xl font-semibold">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h3>
                    {activeTab === "account" && workerData.worker?.isAccountBuilt && (
                        <button
                            className="px-4 py-1 text-black border border-black rounded font font-semibold rounded hover:bg-green-900 hover:text-white "
                            onClick={() => handleEdit()}
                        >
                            Edit
                        </button>
                    )}
                    {/* {activeTab == "wallet" && (
                        <button
                            className="px-4 py-1 text-black border border-black rounded font font-semibold rounded hover:bg-green-900 hover:text-white "
                            onClick={() => handleWithrawMoney()}
                        >
                            Withraw Money
                        </button>
                    )} */}
                </div>
                <hr className="border border-green-900" />
                <div className="flex-1 min-h-0 overflow-auto">
                    {activeTab === "dashboard" ? (
                        workerData.worker?.isAccountBuilt ? (
                            <>
                                <WorkerDashboard worker={workerData.worker} wallet={workerData.wallet as IWallet} availability={workerData.availability as IAvailability} />
                            </>
                        ) : (
                            <div className="flex justify-center h-full items-center">
                                <div className="bg-white border-2 border-dashed border-green-600 rounded-3xl p-10 text-center shadow-lg max-w-md w-full">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                        Build Your Account
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Complete your account setup to start receiving work opportunities and
                                        manage your dashboard.
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTab('account');
                                        }}
                                        className="bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors"
                                    >
                                        Build Account
                                    </button>
                                </div>
                            </div>
                        )
                    ) : activeTab === "account" ? (
                        workerData.worker?.isAccountBuilt ? (
                            <WorkerDetails isEdit={isEdit} setEdit={handleEdit} />
                        ) : (
                            <BuildAccount />
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
                    {/* {isWithraw && <BankForm closeModal={closeWithdraw} />} */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
