/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { fetchWorkHistory, logoutUser } from "../../services/userService";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchUserDataThunk, logout } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../constant/api.routes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import type { IWork } from "../../types/IWork";
import { getProfileImage } from "../../utilities/getProfile";
import EditUserModal from "./UserEditModal";
import PaymentModal from "./PaymentModal";
import Wallet from "../common/Wallet";
import AddMoneyModal from "./AddMoneyModal";
import WorkInfoModal from "./WorkInfo";

const ProfileSection = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isActiveTab, setIsActiveTab] = useState('Profile');
    const [isEdit, setIsEdit] = useState(false);
    const [isPaymentModal, setIsPaymentModal] = useState(false);
    const [isAddMoneyModal, setAddMoneyModal] = useState(false);
    const [isWorkInfoModal, setWorkInfoModal] = useState(false);
    const [amount, setAmount] = useState<number | null>(null);
    const [workId, setWorkId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [workHistory, setWorkHistory] = useState<IWork[]>([])
    const [selectedImg, setSelectedImg] = useState<File | null | string>(null);
    const user = useSelector((state: RootState) => state.user?.user);
    const wallet = useSelector((state: RootState) => state.user?.wallet);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [walletUpdated, setWalletUpdated] = useState(false);

    useEffect(() => {
        if (user?.profileImage) {
            setSelectedImg(user.profileImage as string);
        }
    }, [user?.profileImage, isEdit]);

    const Profile = getProfileImage(user?.name, selectedImg);

    const handleSectionClick = (section: string) => {
        setIsActiveTab(section)
    };

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchUserDataThunk());
            const workHistory = await fetchWorkHistory(user?.id as string, currentPage, 6);
            setWorkHistory(workHistory.data.data.paginatedWorks);
            setTotalPage(workHistory.data.data.totalPages)
        }
        fetchData();
    }, [isEdit, isPaymentModal, isAddMoneyModal, isWorkInfoModal, currentPage]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logout Successful");
            dispatch(logout());
            navigate(API_ROUTES.USER.LOGIN, { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleEdit = () => {
        console.log('Edit clicked');
        setIsActiveTab('Edit')
    };



    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const Close = () => {
        setIsActiveTab("Profile")
    }

    const closeModal = () => {
        setIsPaymentModal(false)
        setWorkInfoModal(false)
    }

    const closeAddMoneyModal = () => {
        setAddMoneyModal(false)
        setWalletUpdated((prev) => !prev);
    }

    const handleAddMoney = () => {
        setUserId(user?.id as string)
        setAddMoneyModal(true)
    }

    const HandleWorkInfo = (workId: string) => {
        setWorkId(workId)
        setWorkInfoModal(true)
    }

    const HandlePay = (workId: string, wage: number | string) => {
        setIsPaymentModal(true);
        setAmount(Number(wage));
        setWorkId(workId);

    }


    return (
        <div className="
                    flex flex-col md:flex-row 
                    min-h-screen mx-[20%] sm:mx-4 md:mx-10 my-4 md:my-10 
                    border border-green-900 rounded-xl bg-white shadow
                    ">
            {/* Sidebar */}
            <div className="
                    w-full md:w-56 lg:w-64 
                    bg-white border-b md:border-b-0 md:border-r-2 
                    rounded-t-xl md:rounded-l-3xl md:rounded-tr-none 
                    border-gray-300
                ">
                <div className="p-4 sm:p-6">
                    <nav className="space-y-2 sm:space-y-4 flex md:block justify-around md:justify-start">
                        {[
                            { label: "Profile", key: "Profile" },
                            { label: "MyWorks", key: "MyWorks" },
                            { label: "Wallet", key: "Wallet" }
                        ].map((item) => (
                            <div
                                key={item.key}
                                onClick={() => handleSectionClick(item.key)}
                                className={`
                            text-base sm:text-lg font-medium cursor-pointer 
                            px-3 py-2 rounded-lg transition-all duration-200 
                            ${isActiveTab === item.key
                                        ? "text-green-700 font-bold bg-green-100 border-l-4 border-green-600 shadow-md shadow-green-500/30"
                                        : "hover:bg-gray-100"
                                    }
            `}
                            >
                                {item.label}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>


            {/* Main Content */}
            <div className="flex-1 bg-gray-50 rounded-b-xl md:rounded-bl-2xl md:rounded-tr-2xl">
                {/* Header */}
                <div className="bg-white border-b rounded-t-xl border-gray-300 
      px-4 sm:px-6 md:px-8 py-3 sm:py-4 
      flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">
                        {isActiveTab === "Profile" ? "Account" :
                            isActiveTab === "MyWorks" ? "Work History" :
                                isActiveTab === "Wallet" ? "Wallet" : null}
                    </h1>
                    {isActiveTab === "Profile" ? (
                        <button
                            onClick={handleEdit}
                            className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base
            cursor-pointer hover:scale-105 transition-all duration-300
            border-2 border-black rounded-full font-medium hover:bg-gray-50"
                        >
                            Edit
                        </button>
                    ) : isActiveTab === "Wallet" ? (
                        <button
                            onClick={handleAddMoney}
                            className="px-3 sm:px-4 py-1 sm:py-1.5 text-sm sm:text-base
            cursor-pointer hover:scale-105 transition-all duration-300
            border-2 border-black rounded-full font-medium hover:bg-gray-50"
                        >
                            Add Money
                        </button>
                    ) : null}
                </div>

                {/* Profile Content */}
                {isActiveTab == "Profile" ? (
                    <div className="p-8">
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-black">
                                        <img
                                            src={Profile}
                                            alt="Profile img"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 space-y-4 sm:space-y-6 w-full">
                                    {/* Name */}
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <span className="text-sm sm:text-base md:text-lg font-medium text-black">
                                            {user?.name}
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        <span className="text-sm sm:text-base md:text-lg text-black">
                                            {user?.email}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                        >
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span className="text-sm sm:text-base md:text-lg text-black">
                                            {user?.location.address.split(" ").slice(0, 7).join(" ")}
                                        </span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                        >
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        <span className="text-sm sm:text-base md:text-lg text-black">
                                            {user?.phone}
                                        </span>
                                    </div>

                                    {/* Logout */}
                                    <div className="pt-4 sm:pt-6">
                                        <button
                                            onClick={handleLogout}
                                            className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-black rounded-full font-medium hover:bg-gray-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : isActiveTab == "MyWorks" ? (
                    <div className="w-full p-4">
                        {/* Header - hidden on small screens */}
                        <div className="hidden md:grid grid-cols-6 border-b pb-2 font-semibold text-lg text-gray-700">
                            <div>Work</div>
                            <div>Date</div>
                            <div>Worker</div>
                            <div>Status</div>
                            <div>Payment</div>
                            <div>Action</div>
                        </div>

                        {/* Rows */}
                        {workHistory.length > 0 ? (
                            workHistory.map((work) => (
                                <div
                                    key={work._id}
                                    className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-0 items-center bg-gray-50 rounded-lg p-4 my-3 shadow-sm"
                                >
                                    {/* Work */}
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold">{work.service.split(" ").slice(0, 3).join(" ")}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center space-x-2">
                                        <span>
                                            {work.createdAt
                                                ? new Date(work.createdAt).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "No date"}
                                        </span>
                                    </div>

                                    {/* Worker */}
                                    <div className="flex items-center space-x-2">
                                        <span>{work.workerName || "Name"}</span>
                                    </div>

                                    {/* Status */}
                                    <div
                                        className={`px-3 py-1 text-sm font-medium rounded-full w-fit
            ${work.status === "Pending" ? "bg-orange-100 text-orange-700" :
                                                work.status === "Canceled" ? "bg-red-100 text-red-700" :
                                                    work.status === "Accepted" ? "bg-blue-100 text-blue-700" :
                                                        work.status === "Rejected" ? "bg-red-100 text-red-700" :
                                                            work.status === "Completed" ? "bg-green-100 text-green-700" :
                                                                "bg-gray-100 text-gray-700"}`}
                                    >
                                        {work.status || "Pending"}
                                    </div>

                                    {/* Payment */}
                                    <div className="flex items-center space-x-2">
                                        <span>{work.wage || "InitialPayment"}</span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex justify-start md:justify-center">
                                        {work.status == "Completed" && work.paymentStatus == "Pending" ? (
                                            <button
                                                onClick={() => HandlePay(work._id as string, work.wage)}
                                                className="px-3 py-1 rounded bg-orange-100 hover:bg-orange-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300"
                                            >
                                                Pay
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => HandleWorkInfo(work._id as string)}
                                                className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300"
                                            >
                                                Info
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">No work history found.</div>
                        )}

                        {/* Pagination */}
                        {totalPage > 1 && workHistory.length > 0 && (
                            <div className="flex justify-center items-center mb-1 mt-4 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: totalPage }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 border rounded-full transition ${currentPage === page ? "bg-gray-900 text-white" : "hover:bg-gray-200"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPage}
                                    className="px-2 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>

            ) : isActiveTab == "Edit" ? (
            <EditUserModal onClose={Close} setEdit={setIsEdit} />
            ) : isActiveTab == "Wallet" ? (
            <Wallet walletUpdated={walletUpdated} workerId={user?.id} historyPrev={wallet?.transactions} balancePrev={wallet?.balance} />
                ) : null}
            {isPaymentModal ? (
                <PaymentModal Amount={amount as number} workId={workId as string} onClose={closeModal} />
            ) : isAddMoneyModal ? (
                <AddMoneyModal userId={userId as string} onClose={closeAddMoneyModal} />
            ) : isWorkInfoModal ? (
                <WorkInfoModal workId={workId as string} closeModal={closeModal} />
            ) : null}
        </div>
        </div >
    );
};


export default ProfileSection;
