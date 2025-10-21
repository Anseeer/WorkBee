import dashboardIcon from "../../assets/dashboard-icon.png";
import logoutIcon from "../../assets/logout-icon.png";
import UsersIcon from "../../assets/users-icon.png";
import WorkersIcon from "../../assets/workers-icon.png";
import JobsIcon from "../../assets/jobs-icon.png";
import CategoryAndServicesIcon from "../../assets/category&services.png";
import subscriptionIcone from "../../assets/subscription-Icon.png";
import serviceIcon from "../../assets/service-icon.png";
import revenueIcon from "../../assets/reveneu.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/adminService";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../slice/adminSlice";
import { toast } from "react-toastify";
import { API_ROUTES } from "../../constant/api.routes";
import { FaArrowRight } from "react-icons/fa";

interface AdminSidebarProps {
    handleTab: (tab: string) => void;
}

export default function AdminSidebar({ handleTab }: AdminSidebarProps) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isExpanded, setIsExpanded] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

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
            dispatch(logout());
            toast.success("Successfully logged out");
            navigate(API_ROUTES.ADMIN.LOGIN, { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div
            ref={sidebarRef}

            className={`bg-[#10451D] text-white h-full flex flex-col justify-between rounded-r-2xl shadow-lg flex-shrink-0
    transition-all duration-300 ease-in-out
   ${isExpanded ? 'w-56 animate-fadeInLeft' : 'w-16 animate-fadeOutLeft'} md:w-[225px]`}
        >
            {/* Top Section: Logo + Navigation */}
            <div className="p-4 flex flex-col items-center md:items-start flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                {!isExpanded && (
                    <button
                        className="md:hidden mb-4 p-2 bg-gray-700 rounded text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(true);
                        }}
                    >
                        <FaArrowRight />
                    </button>
                )}

                <h1 className={`merienda-text text-3xl text-white animate-fadeIn mb-5 ${isExpanded ? 'block' : 'hidden'} md:block`}>
                    WorkBee
                </h1>

                {/* Menu Items */}
                {[
                    { icon: dashboardIcon, label: "Dashboard", tab: "dashboard" },
                    { icon: UsersIcon, label: "Users", tab: "users" },
                    { icon: WorkersIcon, label: "Workers", tab: "workers" },
                    { icon: WorkersIcon, label: "Workers Request", tab: "workerRequest" },
                    { icon: JobsIcon, label: "Jobs", tab: "jobs" },
                    { icon: CategoryAndServicesIcon, label: "Categories", tab: "categories" },
                    { icon: serviceIcon, label: "Services", tab: "services" },
                    { icon: subscriptionIcone, label: "Subscription", tab: "subscription" },
                    { icon: revenueIcon, label: "Revenue", tab: "revenue" },
                ].map(({ icon, label, tab }) => (
                    <div
                        key={tab}
                        onClick={() => handleClick(tab)}
                        className={`flex items-center space-x-3 py-3 px-2 rounded-md cursor-pointer mt-2 transition duration-150 w-full
              ${activeTab === tab
                                ? "bg-[#8FC39D] bg-opacity-70 text-black"
                                : "text-gray-300 hover:bg-[#8FC39D] hover:bg-opacity-50"
                            }`}
                    >
                        <img src={icon} alt={label} className="w-5 h-5" />
                        <span
                            className={`text-md font-medium transition-all duration-300 ${isExpanded ? "block" : "hidden"
                                } md:block`}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-600">
                <div
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-[#8FC39D] hover:bg-opacity-50 text-gray-200 transition duration-150 cursor-pointer w-full"
                >
                    <img src={logoutIcon} alt="Logout" className="w-5 h-5 flex-shrink-0" />
                    <span
                        className={`text-md font-medium transition-all duration-300 ${isExpanded ? "block" : "hidden"
                            } md:block`}
                    >
                        Logout
                    </span>
                </div>
            </div>
        </div>
    );
}
