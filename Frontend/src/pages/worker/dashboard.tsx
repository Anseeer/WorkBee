import { useState } from "react";
import WorkerSidebar from "../../components/worker/WorkerSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import BuildAccount from "../../components/worker/BuildAccountForm";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const workerData = useSelector((state: RootState) => state.worker.worker);

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
                    workerData?.isAccountBuilt ? (
                        <h1>Dashboard</h1>
                    ) : (
                        <button>Build Account</button>
                    )
                ) : activeTab === "account" ? (
                    workerData?.isAccountBuilt ? (
                    <h1>Account</h1>
                    ) : (
                        <BuildAccount/>
                    )
                ) : null}

            </div>
        </div>
    );
};

export default Dashboard;
