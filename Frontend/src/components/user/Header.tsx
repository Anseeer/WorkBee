import { useEffect, useState } from 'react';
import { Bell, Menu, MessageSquare, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import { logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../slice/userSlice';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        axios.get("/auth/verify", { withCredentials: true })
            .then(() => setIsLogged(true))
            .catch(() => setIsLogged(false));
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logout Successfull");
            dispatch(logout());
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {!isLogged ? (
                            // Before Login
                            <>
                                <button onClick={() => navigate('/register')} className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                                    Sign up / Login
                                </button>
                                <button onClick={() => navigate('/workers/landing')} className="bg-white border-2 border-green-700 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:border-green-550 hover:bg-gray-50 transition-all duration-200">
                                    Become Worker
                                </button>
                            </>
                        ) : (
                            // After Login - Icons
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <Bell className="h-6 w-6" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <MessageSquare className="h-6 w-6" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <User className="h-6 w-6" onClick={() => handleLogout()} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
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
                                // Before Login - Mobile
                                <>
                                    <button className="text-gray-700 hover:text-green-700 font-medium text-left transition-colors">
                                        Sign up / Login
                                    </button>
                                    <button className="bg-white border-2 border-green-700 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:border-green-550 hover:bg-gray-50 transition-all duration-200 w-fit">
                                        Become Worker
                                    </button>
                                </>
                            ) : (
                                // After Login - Mobile
                                <div className="flex flex-col space-y-3">
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                        <Bell className="h-5 w-5" />
                                        <span>Notifications</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                        <MessageSquare className="h-5 w-5" />
                                        <span>Messages</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
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