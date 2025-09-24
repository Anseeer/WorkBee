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
import Dashboard from "../../components/admin/Dashboard";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('');
  const { selectedDetails, setSelectedDetails } = useWorkerDetails();

  const handleTab = (tab: string, defaultSubTab?: string) => {
    setActiveTab(tab);
    setSelectedDetails(null);
    setSubTab('')

    if (tab === "category & Services") {
      setSubTab("category");
    } else if (tab === "workers") {
      setSubTab(defaultSubTab || "worker");
    }
  };

  const handleSubTab = (tab: string) => {
    setSelectedDetails(null);
    setSubTab(tab);
  }

  const renderCategoryServiceTabs = () => (
    <>
      <div className="flex items-center gap-4 py-2 px-2">
        <button
          onClick={() => handleSubTab('category')}
          className={`text-2xl font-semibold ${subTab === 'category' ? 'text-green-700' : ''
            }`}
        >
          Category
        </button>
        <span className="text-2xl font-semibold">&</span>
        <button
          onClick={() => handleSubTab('service')}
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
          onClick={() => handleSubTab("worker")}
          className={`text-2xl font-semibold `}
        >
          Workers
        </button>
        <button
          onClick={() => handleSubTab("workerRequest")}
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
    <div className="w-full h-screen flex">
      <AdminSidebar handleTab={handleTab} />
      <div className="w-full h-full flex flex-col">
        {activeTab !== "workers" && activeTab !== "workerRequest" && subTab !== 'service' && subTab !== 'category' && (
          <div className="flex items-center justify-between py-2 px-2">
            <h3 className="text-2xl font-semibold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
          </div>
        )}

        {activeTab !== "workers" && activeTab !== "workerRequest" && (
          <hr className="border border-green-900" />
        )}

        <div className="flex-1 min-h-0 overflow-auto">
          {activeTab === "users" && <UserTable />}

          {activeTab === "workers" && renderWorkersAndVerfyingTab()}

          {activeTab === "dashboard" && <Dashboard />}

          {activeTab === "category & Services" && renderCategoryServiceTabs()}
          {activeTab === "jobs" && <WorksTable />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;