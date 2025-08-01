import { useEffect, useState } from "react";
import WorkerSidebar from "../../components/worker/WorkerSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import BuildAccount from "../../components/worker/BuildAccountForm";
import WorkerDetails from "../../components/common/WorkerDetails";
import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import { fetchWorkerDetails } from "../../slice/workerSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const Dispatch = useAppDispatch();
    const { setSelectedDetails } = useWorkerDetails();
    const workerData = useSelector((state: RootState) => state.worker);

    useEffect(() => {
        const workerID = localStorage.getItem("workerId");
        console.log("WrokerId in localStorage :",workerID)
        if (workerID) {
            Dispatch(fetchWorkerDetails(workerID));
        }
    }, [Dispatch]);

    useEffect(() => {
        setSelectedDetails(workerData);
    }, [workerData, setSelectedDetails]);

    const handleTab = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-full flex">
            <WorkerSidebar handleTab={handleTab} />

            <div className="w-full">
                <h3 className="py-2 px-2 text-2xl font-semibold">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h3>
                <hr className="border border-green-900" />

                {activeTab === "dashboard" ? (
                    workerData.worker?.isAccountBuilt ? (
                        <h1>Dashboard</h1>
                    ) : (
                        <button>Build Account</button>
                    )
                ) : activeTab === "account" ? (
                    workerData.worker?.isAccountBuilt ? (
                        <WorkerDetails />
                    ) : (
                        <BuildAccount />
                    )
                ) : null}

            </div>
        </div>
    );
};

export default Dashboard;
