import { lazy, Suspense, useState } from "react";

const AdminSidebar = lazy(() => import("../../components/admin/AdminSidebar"));
const UserTable = lazy(() => import("../../components/admin/UsersTable"));
const WorkersTable = lazy(() => import("../../components/admin/WorkersTable"));
const WorkerDetails = lazy(() => import("../../components/common/WorkerDetails"));
const CategoryManagment = lazy(() => import("../../components/admin/CategoryManagment"));
const ServiceManagment = lazy(() => import("../../components/admin/ServiceManagment"));
const WorkerApprovalComponent = lazy(() => import("../../components/admin/WorkerRequestSection"));
const WorksTable = lazy(() => import("../../components/admin/worksTable"));
const Dashboard = lazy(() => import("../../components/admin/Dashboard"));
const SubscriptionManagment = lazy(() => import("../../components/admin/SubscriptionManagment"));
const RevenueManagement = lazy(() => import("../../components/admin/RevenueManagement"));

import { useWorkerDetails } from "../../components/context/WorkerDetailContext";
import Loader from "../../components/common/Loader";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/common/ErrorFallback";

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
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Suspense fallback={<Loader />}>
          <AdminSidebar handleTab={handleTab} />
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
        </Suspense>
      </ErrorBoundary>
    </div >
  );
};

export default AdminDashboard;