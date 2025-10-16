import AdminDashboard from "../pages/admin/dashboard";
import AdminLoginPage from "../pages/admin/login";
import { WorkerDetailsProvider } from "../components/context/WorkerDetailContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuestRoute from "../components/common/GuestRoute";
import { ROLE } from "../constant/roles";
import { API_ROUTES } from "../constant/api.routes";

export const adminRoutes = [
    {
        path: API_ROUTES.ADMIN.DASHBOARD,
        element: (
            <WorkerDetailsProvider>
                <ProtectedRoute role={ROLE.ADMIN}>
                    <AdminDashboard />
                </ProtectedRoute>
            </WorkerDetailsProvider>
        ),
    },
    {
        path: API_ROUTES.ADMIN.LOGIN,
        element: (
            <GuestRoute role={ROLE.ADMIN}>
                <AdminLoginPage />
            </GuestRoute>
        ),
    },
];
