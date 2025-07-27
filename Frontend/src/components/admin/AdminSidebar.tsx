import dashboardIcon from "../../assets/dashboard-icon.png";
import notificationIcon from "../../assets/Bell-icon.png";
import reviewIcon from "../../assets/review-icon.png";
import logoutIcon from "../../assets/logout-icon.png";
import SubscriptIcon from "../../assets/stepFour-icon.png";
import UsersIcon from "../../assets/users-icon.png";
import WorkersIcon from "../../assets/workers-icon.png";
import JobsIcon from "../../assets/jobs-icon.png";
import CategoryAndServicesIcon from "../../assets/category&services.png";
import RevenueIcon from "../../assets/reveneu.png";
import { useEffect, useState } from "react";

interface props{
    handleTab:(tab:string)=> void;
}

export default function AdminSidebar({handleTab}:props) {
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(()=>{
        handleClick(activeTab);
    },[activeTab]);

    const handleClick = (tab: string) => {
        setActiveTab(tab);
        handleTab(activeTab);
    };

    return (
        <div className="bg-[#10451D] h-screen text-black w-[225px] h-full flex flex-col justify-between rounded-r-2xl shadow-lg">
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

                {/* Subscription */}
                 <div
                    onClick={() => handleClick("subscriptions")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "subscriptions"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>                    
                            <img src={SubscriptIcon} alt="subscriptions" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "subscriptions" ? "text-black" : "text-gray-400"}`}>
                        Subscription
                    </span>
                </div>

                {/* Category & Services*/}
                 <div
                    onClick={() => handleClick("category & services")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "category&services"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>                    
                            <img src={CategoryAndServicesIcon} alt="category&services" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "category&services" ? "text-black" : "text-gray-400"}`}>
                        Category & Services
                    </span>
                </div>


                {/* Review & Ratings */}
                 <div
                    onClick={() => handleClick("review & ratings")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "review&ratings"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>                    
                            <img src={reviewIcon} alt="review&ratings" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "review&ratings" ? "text-black" : "text-gray-400"}`}>
                        Review & Ratings
                    </span>
                </div>

                {/* Revenue */}
                 <div
                    onClick={() => handleClick("revenue")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "revenue"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>                    
                            <img src={RevenueIcon} alt="revenue" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "revenue" ? "text-black" : "text-gray-400"}`}>
                        Revenue
                    </span>
                </div>
                {/* Notifications */}
                 <div
                    onClick={() => handleClick("notifications")}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer mt-2 transition duration-150 
                    ${activeTab === "notifications"
                            ? "bg-[#8FC39D] bg-opacity-70 text-black"
                            : "text-gray-800 hover:bg-[#8FC39D] hover:bg-opacity-50"}`}>                    
                            <img src={notificationIcon} alt="notifications" className="w-5 h-5" />
                    <span className={`text-md font-medium 
                    ${activeTab === "notifications" ? "text-black" : "text-gray-400"}`}>
                        Notifications
                    </span>
                </div>
            </div>

            {/* Logout Section */}
            <div className="px-6 pb-2">
                <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#8FC39D] hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150 cursor-pointer">
                    <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
                    <span className="text-md text-gray-400 font-medium">Logout</span>
                </div>
            </div>


        </div>
    );
}
