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
import WorkInfoModal from "../common/WorkInfo";
import { WorkerRatingModal } from "./WorkerRatingModal";

const ProfileSection = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isActiveTab, setIsActiveTab] = useState('Profile');
    const [isEdit, setIsEdit] = useState(false);
    const [reloadWallet, setReloadWallet] = useState(false);
    const [isPaymentModal, setIsPaymentModal] = useState(false);
    const [isWorkerRatingModal, setWorkerRatingModal] = useState(false);
    const [isAddMoneyModal, setAddMoneyModal] = useState(false);
    const [isWorkInfoModal, setWorkInfoModal] = useState(false);
    const [wagePerHour, setWagePerHour] = useState<number | null>(null);
    const [totalHours, setTotalHours] = useState<number | null>(null);
    const [platFromFee, setPlatFromFee] = useState<number | null>(null);
    const [workId, setWorkId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [workHistory, setWorkHistory] = useState<IWork[]>([])
    const [selectedImg, setSelectedImg] = useState<File | null | string>(null);
    const user = useSelector((state: RootState) => state.user?.user);
    const wallet = useSelector((state: RootState) => state.user?.wallet);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        if (user?.profileImage) {
            setSelectedImg(user.profileImage as string);
        }
        if (user?.id) {
            setUserId(user?.id);
        }
    }, [user?.profileImage, isEdit, user?.id]);

    const Profile = getProfileImage(user?.name, selectedImg);

    const handleSectionClick = (section: string) => {
        setIsActiveTab(section)
    };

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchUserDataThunk());
            const workHistory = await fetchWorkHistory(user?.id as string, currentPage, 4);
            setWorkHistory(workHistory.data.data.paginatedWorks);
            setTotalPage(workHistory.data.data.totalPages)
        }
        fetchData();
    }, [isEdit, isPaymentModal, isAddMoneyModal, isWorkInfoModal, currentPage, dispatch, user?.id]);

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
        setAddMoneyModal(false);
        setReloadWallet((prev) => !prev);
    }

    const handleAddMoney = () => {
        setUserId(user?.id as string)
        setAddMoneyModal(true)
    }

    const HandleWorkInfo = (workId: string) => {
        setWorkId(workId)
        setWorkInfoModal(true)
    }

    const HandlePay = (workId: string, wagePerHour: number | string, totalHours: string, platFromFee: number | string) => {
        setIsPaymentModal(true);
        setWagePerHour(Number(wagePerHour));
        setPlatFromFee(Number(platFromFee));
        setTotalHours(Number(totalHours));
        setWorkId(workId);
    }

    return (
        <>
            <div className="flex flex-col md:flex-row h-auto min-h-[400px] mx-[10%] my-6 md:my-10 border border-green-900 border-3 rounded-xl bg-white  animate-fadeInUp">
                {/* Sidebar */}
                <div className="w-full md:w-44 lg:w-52 bg-white border-b-2 md:border-b-0 md:border-r-2 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-gray-300 animate-fadeInLeft">
                    <div className="p-3 sm:p-4 md:p-6">
                        <nav className="space-y-2 sm:space-y-3 md:space-y-4">
                            {[
                                { label: "Profile", key: "Profile" },
                                { label: "MyWorks", key: "MyWorks" },
                                { label: "Wallet", key: "Wallet" }
                            ].map((item, idx) => (
                                <div
                                    key={item.key}
                                    onClick={() => handleSectionClick(item.key)}
                                    className={`text-sm sm:text-base md:text-lg font-medium cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg transition-all duration-200 
                        ${isActiveTab === item.key
                                            ? "text-green-700 font-bold bg-green-100 border-l-4 border-green-600 shadow-md shadow-green-500/30 animate-zoomIn"
                                            : "hover:bg-gray-100 animate-fadeInUp"}
                        `}
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-b-2xl md:rounded-bl-2xl md:rounded-tr-2xl overflow-hidden p-2 sm:p-3 md:p-5 lg:min-h-[500px] lg:p-6 animate-fadeInRight">
                    {/* Header */}
                    <div className="bg-white border-b rounded-tr-2xl md:rounded-tr-none border-gray-300 px-2 sm:px-3 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 md:gap-4 animate-fadeInDown">
                        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-black truncate animate-fadeInUp">
                            {isActiveTab === "Profile"
                                ? "Account"
                                : isActiveTab === "MyWorks"
                                    ? "Work History"
                                    : isActiveTab === "Wallet"
                                        ? "Wallet"
                                        : null}
                        </h1>
                        {(isActiveTab === "Profile" || isActiveTab === "Wallet") && (
                            <button
                                onClick={isActiveTab === "Profile" ? handleEdit : handleAddMoney}
                                className="px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base border-2 border-black rounded-full text-black font-medium transition-all duration-300 hover:bg-gray-300 hover:shadow-lg hover:scale-105 animate-fadeInUp"
                            >
                                {isActiveTab === "Profile" ? "Edit" : "Add Money"}
                            </button>
                        )}
                    </div>

                    {/* Profile Content */}
                    {isActiveTab === "Profile" ? (
                        <div className="p-2 sm:p-3 md:p-5 lg:p-6 animate-fadeInUp">
                            <div className="flex flex-col items-center space-y-3 sm:space-y-4 md:flex-row md:items-start md:space-x-4 lg:space-x-6 md:space-y-0">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0 flex justify-center animate-fadeIn">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src={Profile}
                                            alt="Profile img"
                                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-300 object-cover rounded-full border-3 border-black animate-fadeInUp"
                                        />
                                    </div>
                                </div>

                                {/* Profile Information */}
                                <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 text-xs sm:text-sm md:text-base min-w-0 animate-fadeInRight">
                                    <div className="flex items-center space-x-2 sm:space-x-3 animate-fadeInUp">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                        <span className="text-black break-words">{user?.name}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 sm:space-x-3 animate-fadeInUp delay-75">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-black break-words">{user?.email}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 sm:space-x-3 animate-fadeInUp delay-150">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                        </div>
                                        <span className="text-black break-words">{user?.location.address}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 sm:space-x-3 animate-fadeInUp delay-200">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-black break-words">{user?.phone}</span>
                                    </div>

                                    <div className="pt-2 sm:pt-3 md:pt-4 animate-fadeInUp delay-250">
                                        <button
                                            onClick={handleLogout}
                                            className="px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base border-2 border-black rounded-full text-black font-medium hover:bg-gray-300 hover:shadow-lg hover:scale-105 transition-all duration-300"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : isActiveTab === "MyWorks" ? (
                        <div className="w-full p-2 sm:p-3 md:p-4 lg:p-5 overflow-x-auto animate-fadeInUp">
                            {/* Table header becomes stackable */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 border-b pb-1 sm:pb-2 font-semibold text-xs sm:text-sm md:text-base">
                                <div>Work</div>
                                <div>Date</div>
                                <div className="hidden sm:block">Worker</div>
                                <div>Status</div>
                                <div className="hidden md:block">Payment</div>
                                <div>Action</div>
                            </div>

                            {workHistory.length > 0 ? (
                                workHistory.map((work, index) => (
                                    <div
                                        key={work._id}
                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 items-center bg-white rounded-lg p-2 sm:p-3 my-1 sm:my-2 shadow-sm gap-2 transform transition-transform duration-500 hover:scale-[1.01] animate-fadeInUp"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="font-medium text-xs sm:text-sm md:text-base break-words">{work.service}</div>
                                        <div className="text-xs sm:text-sm">{work.createdAt ? new Date(work.createdAt).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        }) : "No date"}</div>
                                        <div className="hidden sm:block text-xs sm:text-sm break-words">{work.workerName || "Name"}</div>
                                        <div className="text-xs sm:text-sm">
                                            <span className={`px-1 sm:px-2 py-0.5 text-xs sm:text-sm font-medium rounded-full w-fit
                        ${work.status === "Pending" ? "bg-orange-100 text-orange-700 " :
                                                    work.status === "Canceled" ? "bg-red-100 text-red-700 " :
                                                        work.status === "Accepted" ? "bg-blue-100 text-blue-700 " :
                                                            work.status === "Rejected" ? "bg-red-100 text-red-700 " :
                                                                work.status === "Completed" ? "bg-green-100 text-green-700 " :
                                                                    "bg-white text-gray-700 "}`}>
                                                {work.status || "Pending"}
                                            </span>
                                        </div>
                                        <div className="hidden md:block text-xs sm:text-sm break-words">₹{work.totalAmount || work.wagePerHour + "/hr" || "InitialPayment"}</div>
                                        {work.status === "Completed" && work.paymentStatus === "Pending" ? (
                                            <button
                                                onClick={() => HandlePay(work._id as string, work.wagePerHour, work.totalHours, work.platformFee)}
                                                className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm rounded bg-orange-100 hover:bg-orange-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300 animate-fadeInUp"
                                            >
                                                Pay
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => HandleWorkInfo(work._id as string)}
                                                className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm rounded bg-blue-100 hover:bg-blue-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300 animate-fadeInUp"
                                            >
                                                Info
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4 sm:py-6 md:py-8 text-xs sm:text-sm md:text-base animate-fadeIn">
                                    No work history found.
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPage > 1 && workHistory.length > 0 && (
                                <div className="flex justify-center items-center mb-1 mt-2 space-x-1 sm:space-x-2 animate-fadeInUp">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-1 sm:px-2 py-0.5 sm:py-1 rounded disabled:opacity-50 text-xs sm:text-sm"
                                    >
                                        &lt;
                                    </button>

                                    {Array.from({ length: totalPage }, (_, idx) => idx + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-1 sm:px-2 py-0.5 sm:py-1 border rounded-full text-xs sm:text-sm ${currentPage === page ? "bg-gray-900 text-white" : ""}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPage}
                                        className="px-1 sm:px-2 py-0.5 sm:py-1 rounded disabled:opacity-50 text-xs sm:text-sm"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </div>

                    ) : isActiveTab === "Edit" ? (
                        <EditUserModal onClose={Close} setEdit={setIsEdit} />
                    ) : isActiveTab === "Wallet" ? (
                        <Wallet historyPrev={wallet?.transactions} workerId={userId as string} reload={reloadWallet} balancePrev={wallet?.balance} />
                    ) : null}
                    {isPaymentModal ? (
                        <PaymentModal setRatingModal={setWorkerRatingModal} platformFee={platFromFee as number} wagePerHour={wagePerHour as number} hoursWorked={totalHours as number} workId={workId as string} onClose={closeModal} />
                    ) : isAddMoneyModal ? (
                        <AddMoneyModal userId={userId as string} onClose={closeAddMoneyModal} />
                    ) : isWorkerRatingModal ? (
                        <WorkerRatingModal workId={workId as string} onClose={() => setWorkerRatingModal(false)} />
                    ) : null}

                </div>
            </div >
            {isWorkInfoModal && <WorkInfoModal workId={workId as string} closeModal={closeModal} />}
        </>
    );
};


export default ProfileSection;