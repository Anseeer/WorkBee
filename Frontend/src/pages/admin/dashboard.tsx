import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserTable from "../../components/admin/UsersTable";
import WorkersTable from "../../components/admin/WorkersTable";
import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import WorkerDetails from "../../components/common/WorkerDetails";
import CategoryTable from "../../components/admin/CategoryTable";
import ServicesTable from "../../components/admin/ServiceTable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState<'category' | 'service'>('category');
  const { selectedDetails, setSelectedDetails } = useWorkerDetails();

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedDetails(null);
    if (tab === "category & Services") {
      setSubTab('category'); 
    }
  };

  const renderCategoryServiceTabs = () => (
    <>
      <div className="flex items-center gap-4 py-2 px-2">
        <button
          onClick={() => setSubTab('category')}
          className={`text-2xl font-semibold ${
            subTab === 'category' ? 'text-green-700' : ''
          }`}
        >
          Category
        </button>
        <span className="text-2xl font-semibold">&</span>
        <button
          onClick={() => setSubTab('service')}
          className={`text-2xl font-semibold ${
            subTab === 'service' ? 'text-green-700' : ''
          }`}
        >
          Service
        </button>
      </div>
      <hr className="border border-green-900" />
      {subTab === 'category' ? <CategoryTable /> : <ServicesTable/>}
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

        {activeTab === "workers" && (
          <>
            <h3 className="py-2 px-2 text-2xl font-semibold">Workers</h3>
            <hr className="border border-green-900" />
            {selectedDetails ? <WorkerDetails /> : <WorkersTable />}
          </>
        )}

        {activeTab === "dashboard" && (
          <>
            <h3 className="py-2 px-2 text-2xl font-semibold">Dashboard</h3>
            <hr className="border border-green-900" />
            <h1>Dashboard</h1>
          </>
        )}

        {activeTab === "category & Services" && renderCategoryServiceTabs()}
      </div>
    </div>
  );
};

export default AdminDashboard;