import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserTable from "../../components/admin/UsersTable";
import WorkersTable from "../../components/admin/WorkersTable";
import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import WorkerDetails from "../../components/common/WorkerDetails";


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { selectedDetails, setSelectedDetails } = useWorkerDetails();
    console.log("SelectedDetails :", selectedDetails)

  

    const handleTab = (tab: string) => {
        setActiveTab(tab);
        setSelectedDetails(null)
    }
    return (
        <>
            <div className="w-full flex">
                <AdminSidebar handleTab={handleTab} />
                <div className="w-full">
                    <h3 className="py-2 px-2 text-2xl font-semibold" >{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                    <hr className="border border-green-900" />
                    {activeTab == "users" ? (
                        <UserTable />
                    ) : activeTab == "workers" ? (
                        <>
                            {selectedDetails ? (
                                <WorkerDetails />
                            ) : (
                                <WorkersTable />
                            )}
                        </>
                    ) : activeTab == "dashboard" ? (
                        <>
                            <h1>DashBoard</h1>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;