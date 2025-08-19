import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserTable from "../../components/admin/UsersTable";
import WorkersTable from "../../components/admin/WorkersTable";
import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import WorkerDetails from "../../components/common/WorkerDetails";
import CategoryTable from "../../components/admin/CategoryTable";
import ServicesTable from "../../components/admin/ServiceTable";
import WorkerApprovalComponent from "../../components/admin/WorkerRequestSection";
import WorksTable from "../../components/admin/worksTable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState<'category' | 'service' | 'worker' | 'workerRequest'>('category');
  const { selectedDetails, setSelectedDetails } = useWorkerDetails();

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedDetails(null);
    if (tab === "category & Services") {
      setSubTab("category");
    } else if (tab === "workers") {
      setSubTab("worker");
    }
  };


  const renderCategoryServiceTabs = () => (
    <>
      <div className="flex items-center gap-4 py-2 px-2">
        <button
          onClick={() => setSubTab('category')}
          className={`text-2xl font-semibold ${subTab === 'category' ? 'text-green-700' : ''
            }`}
        >
          Category
        </button>
        <span className="text-2xl font-semibold">&</span>
        <button
          onClick={() => setSubTab('service')}
          className={`text-2xl font-semibold ${subTab === 'service' ? 'text-green-700' : ''
            }`}
        >
          Service
        </button>
      </div>
      <hr className="border border-green-900" />
      {subTab === 'category' ? <CategoryTable /> : <ServicesTable />}
    </>
  );

  const renderWorkersAndVerfyingTab = () => (
    <>
      <div className="flex items-center gap-4 py-2 px-2">
        <button
          onClick={() => setSubTab("worker")}
          className={`text-2xl font-semibold `}
        >
          Workers
        </button>
        <button
          onClick={() => setSubTab("workerRequest")}
          className={`text-sm rounded font-semibold border border-black text-white p-1 bg-green-700 ml-auto hover:text-black hover:bg-green-500 ${subTab === "workerRequest" ? "text-green-700" : ""
            }`}
        >
          Workers Request
        </button>
      </div>
      <hr className="border border-green-900" />
      {subTab === "worker" && (
        <>
          {selectedDetails ? <WorkerDetails /> : <WorkersTable />}
        </>
      )}
      {subTab === "workerRequest" && (
        <>
          <WorkerApprovalComponent />
        </>
      )}
    </>
  );


  return (
    <div className="w-full flex">
      <AdminSidebar handleTab={handleTab} />
      <div className="w-full">
        {activeTab === "users" && (
          <>
            <h3 className="py-2 px-2 text-2xl font-semibold">Users</h3>
            <hr className="border border-green-900" />
            <UserTable />
          </>
        )}

        {activeTab === "workers" && renderWorkersAndVerfyingTab()}

        {activeTab === "dashboard" && (
          <>
            <h3 className="py-2 px-2 text-2xl font-semibold">Dashboard</h3>
            <hr className="border border-green-900" />
            <h1>Dashboard</h1>
          </>
        )}

        {activeTab === "category & Services" && renderCategoryServiceTabs()}
        {activeTab === "jobs" && (
          <>
            <h3 className="py-2 px-2 text-2xl font-semibold">Jobs</h3>
            <hr className="border border-green-900" />
            <WorksTable />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;