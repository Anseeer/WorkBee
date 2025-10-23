import dashboardIcon from "../../assets/dashboard-icon.png";
import accountIcon from "../../assets/acount-icon.png";
import messageIcon from "../../assets/chat-icon.png";
import historyIcon from "../../assets/history.png";
import notificationIcon from "../../assets/Bell-icon.png";
import walletIcon from "../../assets/wallet-icon.png";
import logoutIcon from "../../assets/logout-icon.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutWorker } from "../../services/workerService";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../slice/workerSlice";
import { API_ROUTES } from "../../constant/api.routes";
import { FaArrowRight } from "react-icons/fa";

interface prop {
  handleTab: (tab: string) => void;
}

export default function WorkerSidebar({ handleTab }: prop) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((tab: string) => {
    setActiveTab(tab);
    handleTab(tab);
  }, [handleTab]);

  useEffect(() => {
    handleClick(activeTab);
  }, [activeTab, handleClick]);


  const handleLogout = async () => {
    try {
      await logoutWorker();
      dispatch(logout())
      toast.success("Logout Successfully");
      navigate(API_ROUTES.WORKER.LOGIN, { replace: true });
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

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div
      ref={sidebarRef}

      className={`bg-[#10451D] text-white h-full flex flex-col justify-between rounded-r-2xl shadow-lg flex-shrink-0
    transition-all duration-300 ease-in-out
   ${isExpanded ? 'w-56 animate-fadeInLeft' : 'w-16 animate-fadeOutLeft'} md:w-[225px]`}
    >
      {/* Top Section: Logo + Navigation */}
      <div className="p-4 flex flex-col items-center md:items-start flex-1 min-h-0 overflow-y-auto">        {!isExpanded && (
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
          { icon: dashboardIcon, label: 'Dashboard', tab: 'dashboard' },
          { icon: accountIcon, label: 'Account', tab: 'account' },
          { icon: messageIcon, label: 'Message', tab: 'message' },
          { icon: historyIcon, label: 'History', tab: 'history' },
          { icon: notificationIcon, label: 'Notifications', tab: 'notification' },
          { icon: walletIcon, label: 'Wallet', tab: 'wallet' }
        ].map(({ icon, label, tab }) => (
          <div
            key={tab}
            onClick={() => handleClick(tab)}
            className={`flex items-center space-x-3 py-3 px-2 rounded-md cursor-pointer mt-2 transition duration-150
              ${activeTab === tab
                ? 'bg-gray-500 bg-opacity-70 w-full text-white'
                : 'text-gray-300 hover:bg-gray-500 w-full hover:bg-opacity-50'}
            `}
          >
            <img src={icon} alt={label} className="w-5 h-5" />
            <span className={`text-md font-medium ${isExpanded ? 'block' : 'hidden'} md:block`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Logout Button Section */}
      <div className="p-4 border-t border-gray-600">
        <div
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3  rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-200 transition duration-150 cursor-pointer w-full"
        >
          <img src={logoutIcon} alt="Logout" className="w-5 h-5 flex-shrink-0" />
          <span
            className={`text-md font-medium ${isExpanded ? 'block' : 'hidden'
              } md:block truncate`}
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );

}
