import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../../constant/api.routes';


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-gray-200 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => navigate(API_ROUTES.WORKER.REGISTER)} className="bg-white border-2 border-green-700 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:border-green-550 hover:bg-gray-50 transition-all duration-200 w-fit">
                            Sign up / Login
                        </button>
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
                            <button onClick={() => navigate(API_ROUTES.WORKER.REGISTER)} className="bg-white border-2 border-green-700 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:border-green-550 hover:bg-gray-50 transition-all duration-200 w-fit">
                                Sign up / Login
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </header>
    );
}