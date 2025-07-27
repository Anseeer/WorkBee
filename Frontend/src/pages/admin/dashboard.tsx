import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserTable from "../../components/admin/UsersTable";
import WorkersTable from "../../components/admin/WorkersTable";
import WorkerDetails from "../../components/admin/WorkerDetails";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const handleTab = (tab: string) => {
        setActiveTab(tab);
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
                        <WorkersTable />
                    ) : activeTab == "dashboard" ? (
                       <>
                        {/* <h1>DashBoard</h1> */}
                        <WorkerDetails/>
                       </>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;