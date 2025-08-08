import dashboardIcon from "../../assets/dashboard-icon.png";
import accountIcon from "../../assets/acount-icon.png";
import messageIcon from "../../assets/chat-icon.png";
import historyIcon from "../../assets/history.png";
import notificationIcon from "../../assets/Bell-icon.png";
import reviewIcon from "../../assets/review-icon.png";
import walletIcon from "../../assets/wallet-icon.png";
import logoutIcon from "../../assets/logout-icon.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutWorker } from "../../services/workerService";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../slice/workerSlice";
import { API_ROUTES } from "../../constant/api.routes";

interface prop {
  handleTab: (tab: string) => void;
}

export default function WorkerSidebar({ handleTab }: prop) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleClick(activeTab);
  }, [activeTab]);

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    handleTab(activeTab);
  };

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

  return (
    <div className="bg-[#10451D] text-black w-[225px] h-screen flex flex-col justify-between rounded-r-2xl shadow-lg">
      <div className="p-6">
        <h1 className="merienda-text justyify-center pb-5 text-3xl text-white">WorkBee</h1>
        <div
          onClick={() => handleClick("dashboard")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "dashboard"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={dashboardIcon} alt="Dashboard" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "dashboard" ? "text-white" : "text-gray-400"}`}>
            Dashboard
          </span>
        </div>

        <div
          onClick={() => handleClick("account")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "account"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={accountIcon} alt="account" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "account" ? "text-white" : "text-gray-400"}`}>
            Account
          </span>
        </div>

        <div
          onClick={() => handleClick("message")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "message"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={messageIcon} alt="message" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "message" ? "text-white" : "text-gray-400"}`}>
            Message
          </span>
        </div>

        <div
          onClick={() => handleClick("history")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "history"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={historyIcon} alt="history" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "history" ? "text-white" : "text-gray-400"}`}>
            History
          </span>
        </div>

        <div
          onClick={() => handleClick("notification")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "notification"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={notificationIcon} alt="notification" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "notification" ? "text-white" : "text-gray-400"}`}>
            Notifications
          </span>
        </div>

        <div
          onClick={() => handleClick("review&ratings")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "review&ratings"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={reviewIcon} alt="review&ratings" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "review&ratings" ? "text-white" : "text-gray-400"}`}>
            Review & Ratings
          </span>
        </div>

        <div
          onClick={() => handleClick("wallet")}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "wallet"
              ? "bg-gray-500 bg-opacity-70 text-white"
              : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-50"}`}>
          <img src={walletIcon} alt="wallet" className="w-5 h-5" />
          <span className={`text-md font-medium 
                    ${activeTab === "wallet" ? "text-white" : "text-gray-400"}`}>
            Wallet
          </span>
        </div>
      </div>

      <div className="p-6">
        <div
          onClick={() => handleLogout()} className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150 cursor-pointer">
          <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Logout</span>
        </div>
      </div>

    </div>
  );
}
