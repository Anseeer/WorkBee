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
import Wallet from "../../components/user/Wallet";
import Message from "./message";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isEdit, setIsEdit] = useState(false);
    const dispatch = useAppDispatch();
    const { setSelectedDetails } = useWorkerDetails();
    const workerData = useSelector((state: RootState) => state.worker);
    const wallet = workerData.wallet;

    useEffect(() => {
        const workerID = localStorage.getItem("workerId");
        if (workerID) {
            dispatch(fetchWorkerDetails(workerID));
        }
    }, [dispatch, isEdit]);

    useEffect(() => {
        setSelectedDetails(workerData);
    }, [workerData, setSelectedDetails]);

    const handleTab = (tab: string) => {
        setActiveTab(tab);
    };

    const handleEdit = () => {
        setIsEdit((prev) => !prev);
    }

    return (
        <div className="w-full flex">
            <WorkerSidebar handleTab={handleTab} />

            <div className="w-full">
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
                </div>

                <hr className="border border-green-900" />

                {activeTab === "dashboard" ? (
                    workerData.worker?.isAccountBuilt ? (
                        <h1>Dashboard</h1>
                    ) : (
                        <button>Build Account</button>
                    )
                ) : activeTab === "account" ? (
                    workerData.worker?.isAccountBuilt ? (
                        <>
                            <WorkerDetails isEdit={isEdit} setEdit={handleEdit} />
                        </>
                    ) : (
                        <BuildAccount />
                    )
                ) : activeTab === "history" ? (
                    <WorkHistory />
                ) : activeTab === "wallet" ? (
                    <div className="border-2 rounded-xl p-2 bg-gray-50 m-10 border-green-700">
                        <Wallet history={wallet?.transactions} balance={wallet?.balance} />
                    </div>
                ) : activeTab === "message" ? (
                    <Message/>
                ): null}
            </div>
        </div>
    );
};

export default Dashboard;
