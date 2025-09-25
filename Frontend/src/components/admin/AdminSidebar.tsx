import dashboardIcon from "../../assets/dashboard-icon.png";
import logoutIcon from "../../assets/logout-icon.png";
import UsersIcon from "../../assets/users-icon.png";
import WorkersIcon from "../../assets/workers-icon.png";
import JobsIcon from "../../assets/jobs-icon.png";
import CategoryAndServicesIcon from "../../assets/category&services.png";
import serviceIcon from "../../assets/service-icon.png";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/adminService";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../slice/adminSlice";
import { toast } from "react-toastify";
import { API_ROUTES } from "../../constant/api.routes";

interface props {
    handleTab: (tab: string) => void;
}

export default function AdminSidebar({ handleTab }: props) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClick = useCallback(
        (tab: string) => {
            setActiveTab(tab);
            handleTab(tab);
        },
        [handleTab]
    );

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            dispatch(logout())
            toast.success("Successfully logout");
            navigate(API_ROUTES.ADMIN.LOGIN, { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <div className="bg-[#10451D] h-full text-black w-[225px] flex flex-col justify-between rounded-r-2xl shadow-lg">
            {/* Logo Section */}
            <div className="p-6">
                <h1 className="merienda-text justyify-center pb-5 text-3xl text-white">WorkBee</h1>

                {/* Dashboard */}
                <div
                    onClick={() => handleClick("dashboard")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "dashboard"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={dashboardIcon} alt="dashboard" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "dashboard" ? "text-black" : "text-gray-400"}`}>
                        Dashboard
                    </span>
                </div>

                {/* Users */}
                <div
                    onClick={() => handleClick("users")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "users"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={UsersIcon} alt="Users" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "users" ? "text-black" : "text-gray-400"}`}>
                        Users
                    </span>
                </div>

                {/* Workers */}
                <div
                    onClick={() => handleClick("workers")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "workers"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={WorkersIcon} alt="workers" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "workers" ? "text-black" : "text-gray-400"}`}>
                        Workers
                    </span>
                </div>

                {/* Workers Approval */}
                <div
                    onClick={() => handleClick("workerRequest")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "workerRequest"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={WorkersIcon} alt="workerRequest" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "workerRequest" ? "text-black" : "text-gray-400"}`}>
                        Workers Request
                    </span>
                </div>

                {/* Jobs */}
                <div
                    onClick={() => handleClick("jobs")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "jobs"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={JobsIcon} alt="jobs" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "jobs" ? "text-black" : "text-gray-400"}`}>
                        Jobs
                    </span>
                </div>

                {/* Category*/}
                <div
                    onClick={() => handleClick("categories")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "categories"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={CategoryAndServicesIcon} alt="categories" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "categories" ? "text-black" : "text-gray-400"}`}>
                        Categories
                    </span>
                </div>
                {/* service */}
                <div
                    onClick={() => handleClick("services")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                        ${activeTab === "services"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>
                    <img src={serviceIcon} alt="services" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "services" ? "text-black" : "text-gray-400"}`}>
                        Services
                    </span>
                </div>

            </div>

            {/* Logout Section */}
            <div className="px-6 pb-2">
                <div
                    onClick={() => handleLogout()}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#8FC39D] hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150 cursor-pointer">
                    <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
                    <span className="text-md text-gray-400 font-medium">Logout</span>
                </div>
            </div>
        </div>
    );
}
