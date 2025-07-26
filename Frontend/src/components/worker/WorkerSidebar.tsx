import dashboardIcon from "../../assets/dashboard-icon.png";
import accountIcon from "../../assets/acount-icon.png";
import messageIcon from "../../assets/chat-icon.png";
import historyIcon from "../../assets/history.png";
import notificationIcon from "../../assets/Bell-icon.png";
import reviewIcon from "../../assets/review-icon.png";
import walletIcon from "../../assets/wallet-icon.png";
import logoutIcon from "../../assets/logout-icon.png";

export default function WorkerSidebar() {
  return (
    <div className="bg-[#10451D] text-black w-[225px] h-screen flex flex-col justify-between rounded-r-2xl shadow-lg">
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="merienda-text justyify-center pb-5 text-3xl text-white">WorkBee</h1>
        {/* Dashboard */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={dashboardIcon} alt="Dashboard" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Dashboard</span>
        </div>


        {/* Account */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={accountIcon} alt="Account" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Account</span>
        </div>

        {/* Message */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={messageIcon} alt="Message" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Message</span>
        </div>

        {/* History */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={historyIcon} alt="History" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">History</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={notificationIcon} alt="Notifications" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Notifications</span>
        </div>

        {/* Review & Ratings */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={reviewIcon} alt="Reviews & Ratings" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Reviews & Ratings</span>
        </div>

        {/* Wallet */}
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150">
          <img src={walletIcon} alt="Wallet" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Wallet</span>
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-500 hover:bg-opacity-50 text-gray-800 mt-2 transition duration-150 cursor-pointer">
          <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
          <span className="text-md text-gray-400 font-medium">Logout</span>
        </div>
      </div>


    </div>
  );
}
