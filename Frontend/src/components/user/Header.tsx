import { useEffect, useState } from 'react';
import { Bell, Menu, MessageSquare, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import { logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../slice/userSlice';
import { API_ROUTES } from '../../constant/api.routes';
import Loader from '../common/Loader';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isLogged, setIsLogged] = useState<boolean | null>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        axios.get("/auth/verify", { withCredentials: true })
            .then((res) => {
                setIsLogged(res.data.role === "User");
            })
            .catch(() => setIsLogged(false));
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logout Successful");
            dispatch(logout());
            setIsLogged(false);
            setIsMobileMenuOpen(false);
            navigate(API_ROUTES.USER.LOGIN, { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleProfile = () => {
        if (!isProfileOpen) {
            navigate('/profile', { replace: true });
            setIsProfileOpen(true)
        } else {
            navigate('/', { replace: true });
            setIsProfileOpen(false);
        }
    };
    const handleMessage = () => {
        if (!isMessageOpen) {
            navigate('/message', { replace: true });
            setIsMessageOpen(true)
        } else {
            navigate('/', { replace: true });
            setIsMessageOpen(false);
        }
    };

    const handleNavigate = (path: string) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <header className="bg-white border-b border-gray-200 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 onClick={()=> navigate('/')} className="merienda-text text-3xl text-green-900">WorkBee</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {isLogged === null ? (
                            <Loader />
                        ) : !isLogged ? (
                            <>
                                <button
                                    onClick={() => handleNavigate(API_ROUTES.USER.LOGIN)}
                                    className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                                    Sign up / Login
                                </button>
                                <button
                                    onClick={() => handleNavigate(API_ROUTES.WORKER.LANDING)}
                                    className="bg-white border-2 border-green-700 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:border-green-550 hover:bg-gray-50 transition-all duration-200">
                                    Become Worker
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <Bell className="h-6 w-6 cursor-pointer" />
                                </button>
                                <button
                                    onClick={handleMessage}
                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <MessageSquare className="h-6 w-6 cursor-pointer" />
                                </button>
                                <button
                                    onClick={handleProfile}
                                    className="p-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
                                    <User className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 hover:text-gray-900 p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-60">
                        <div className="flex flex-col space-y-4">
                            {!isLogged ? (
                                <>
                                    <button
                                        onClick={() => handleNavigate(API_ROUTES.USER.LOGIN)}
                                        className="text-gray-700 hover:text-green-700 font-medium text-left transition-colors">
                                        Sign up / Login
                                    </button>
                                    <button
                                        onClick={() => handleNavigate(API_ROUTES.WORKER.LANDING)}
                                        className="bg-white border-2 border-green-700 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:border-green-550 hover:bg-gray-50 transition-all duration-200 w-fit">
                                        Become Worker
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                        <Bell className="h-5 w-5" />
                                        <span>Notifications</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                        <MessageSquare className="h-5 w-5" />
                                        <span>Messages</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                        <User className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
