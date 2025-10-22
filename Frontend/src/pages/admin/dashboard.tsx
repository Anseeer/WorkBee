import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserTable from "../../components/admin/UsersTable";
import WorkersTable from "../../components/admin/WorkersTable";
import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import WorkerDetails from "../../components/common/WorkerDetails";
import CategoryManagment from "../../components/admin/CategoryManagment";
import ServiceManagment from "../../components/admin/ServiceManagment";
import WorkerApprovalComponent from "../../components/admin/WorkerRequestSection";
import WorksTable from "../../components/admin/worksTable";
import Dashboard from "../../components/admin/Dashboard";
import SubscriptionManagment from "../../components/admin/SubscriptionManagment";
import RevenueManagement from "../../components/admin/RevenueManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { selectedDetails, setSelectedDetails } = useWorkerDetails();

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedDetails(null);
  };

  const renderWorkersAndVerfyingTab = () => (
    <>
      {activeTab === "workers" && (
        <>
          {selectedDetails ? <WorkerDetails /> : <WorkersTable />}
        </>
      )}
    </>
  );

  return (
    <div className="w-full h-screen flex">
      <AdminSidebar handleTab={handleTab} />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* <div className="w-full h-full flex flex-col"> */}
        <div className="flex items-center justify-between py-2 px-2">
          <h3 className="text-2xl font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ` Management`}
          </h3>
        </div>

        <hr className="border border-green-900" />

        <div className="flex-1 min-h-0 overflow-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "users" && <UserTable />}
          {activeTab === "workers" && renderWorkersAndVerfyingTab()}
          {activeTab === "categories" && <CategoryManagment />}
          {activeTab === "services" && <ServiceManagment />}
          {activeTab === "subscription" && <SubscriptionManagment />}
          {activeTab === "jobs" && <WorksTable />}
          {activeTab === "workerRequest" && <WorkerApprovalComponent />}
          {activeTab === "revenue" && <RevenueManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;