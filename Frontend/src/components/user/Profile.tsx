/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { cancelWork, fetchWorkHistory, logoutUser } from "../../services/userService";
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
import Wallet from "./Wallet";

const ProfileSection = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isActiveTab, setIsActiveTab] = useState('Profile');
    const [isEdit, setIsEdit] = useState(false);
    const [isPaymentModal, setIsPaymentModal] = useState(false);
    const [amount, setAmount] = useState<number | null>(null);
    const [workId, setWorkId] = useState<string | null>(null);
    const [workHistory, setWorkHistory] = useState<IWork[]>([])
    const [selectedImg, setSelectedImg] = useState<File | null | string>(null);
    const user = useSelector((state: RootState) => state.user?.user);
    const wallet = useSelector((state: RootState) => state.user?.wallet);

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
            const workHistory = await fetchWorkHistory(user?.id as string);
            setWorkHistory(workHistory.data.data);
        }
        fetchData();
    }, [isEdit, isPaymentModal]);

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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(workHistory.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = workHistory.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const Close = () => {
        setIsActiveTab("Profile")
    }

    const HandleCancelWork = async (workId: string) => {
        await cancelWork(workId);
        const workHistory = await fetchWorkHistory(user?.id as string);
        setWorkHistory(workHistory.data.data);
        toast.success("Cancelation successfull")
    }

    const closeModal = () => {
        setIsPaymentModal(false)
    }

    return (
        <div className="flex h-[530px] mx-50 my-10 border border-green-900 border-3 rounded-xl bg-white">
            {/* Sidebar */}
            <div className="w-52 bg-white border-r-2 rounded-l-3xl border-gray-300">
                <div className="p-6">
                    <nav className="space-y-4">
                        {[
                            { label: "Profile", key: "Profile" },
                            { label: "MyWorks", key: "MyWorks" },
                            { label: "Wallet", key: "Wallet" }
                        ].map((item) => (
                            <div
                                key={item.key}
                                onClick={() => handleSectionClick(item.key)}
                                className={`text-lg font-medium cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 
                        ${isActiveTab === item.key
                                        ? "text-green-700 font-bold bg-green-100 border-l-4 border-green-600 shadow-md shadow-green-500/30"
                                        : "hover:bg-gray-100"
                                    }`}
                            >
                                {item.label}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>


            {/* Main Content */}
            <div className="flex-1 bg-gray-50 rounded-bl rounded-2xl ">
                {/* Header */}
                <div className="bg-white border-b rounded-tr-2xl border-gray-300 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-black">{isActiveTab == "Profile" ? "Account" : isActiveTab == "MyWorks" ? "Work History" : isActiveTab == "Wallet" ? "Wallet" : null}</h1>
                    {isActiveTab == "Profile" ? (
                        <button
                            onClick={handleEdit}
                            className="px-8 py-3 cursor-pointer hover:bg-gray-300 hover:z-[100] hover:shadow-xl  hover:scale-105 
            transition-all duration-300 ease-in-out border-2 border-black rounded-full text-black font-medium hover:bg-gray-50 transition-colors"
                        >
                            Edit
                        </button>
                    ) : null}
                </div>

                {/* Profile Content */}
                {isActiveTab == "Profile" ? (
                    <div className="p-8">
                        <div className="flex items-start space-x-12">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full flex items-center justify-center">
                                    <img src={Profile} alt="Profile img" className="w-32 h-32 bg-gray-300 rounded-full border-4 border-black flex items-center justify-center" />
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="flex-1 space-y-6">
                                {/* Name */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-black">{user?.name}</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-lg text-black">{user?.email}</span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </div>
                                    <span className="text-lg text-black">{user?.location.address.split(" ").slice(0, 7).join(" ")}
                                    </span>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg text-black">{user?.phone}</span>
                                </div>

                                {/* Logout Button */}
                                <div className="pt-6">
                                    <button
                                        onClick={handleLogout}
                                        className="px-8 py-3 cursor-pointer hover:bg-gray-300 hover:z-[100] hover:shadow-xl  hover:scale-105 
            transition-all duration-300 ease-in-out border-2 border-black rounded-full text-black font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isActiveTab == "MyWorks" ? (
                    <div className="w-full p-5">
                        {/* Header */}
                        <div className="grid grid-cols-6 border-b pb-2 font-semibold text-lg">
                            <div>Work</div>
                            <div>Date</div>
                            <div>Worker</div>
                            <div>Status</div>
                            <div>Payment</div>
                            <div>Action</div>
                        </div>

                        {/* Row or Empty Message */}
                        {paginatedData.length > 0 ? (
                            paginatedData.map((work) => (
                                <div
                                    key={work._id}
                                    className="grid grid-cols-6 items-center bg-gray-50 rounded-lg p-3 my-3 shadow-sm"
                                >
                                    <div className="font-bold">{work.service || "Cleaning"}</div>
                                    <div>
                                        {work.createdAt
                                            ? new Date(work.createdAt).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "No date"}
                                    </div>
                                    <div>{work.workerName || "Name"}</div>
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
                                    <div>{work.wage || "InitialPayment"}</div>
                                    {work.status === "Pending" ? (
                                        <button
                                            onClick={() => HandleCancelWork(work._id as string)}
                                            className="px-3 py-1 rounded bg-red-100 hover:bg-red-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    ) : work.status == "Canceled" || work.status == "Completed" && work.paymentStatus == "Completed" ? (
                                        <button
                                            className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300"
                                        >
                                            Info
                                        </button>
                                    ) : work.status == "Completed" && work.paymentStatus == "Pending" ? (
                                        <button
                                            onClick={() => {
                                                setIsPaymentModal(true);
                                                setAmount(Number(work.wage));
                                                setWorkId(work._id as string);
                                            }}
                                            className="px-3 py-1 rounded bg-orange-100 hover:bg-orange-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300"
                                        >
                                            Pay
                                        </button>
                                    ) : work.status == "Accepted" ? (
                                        <button
                                            className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-500 hover:rounded-full cursor-pointer font-semibold transition-all duration-300 border border-gray-300"
                                        >
                                            Processing
                                        </button>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">No work history found.</div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && paginatedData.length > 0 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1 rounded disabled:opacity-50"
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 border rounded-full ${currentPage === page ? "bg-gray-900 text-white" : ""
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-2 py-1 rounded disabled:opacity-50"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>

                ) : isActiveTab == "Edit" ? (
                    <EditUserModal onClose={Close} setEdit={setIsEdit} />
                ) : isActiveTab == "Wallet" ? (
                    <Wallet history={wallet?.transactions} balance={wallet?.balance} />
                ) : null}
                {isPaymentModal ? (
                    <PaymentModal Amount={amount as number} workId={workId as string} onClose={closeModal} />
                ) : null}
            </div>
        </div>
    );
};


export default ProfileSection;