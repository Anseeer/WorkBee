import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
            {/* Big 404 text */}
            <h1 className="text-9xl font-extrabold text-green-900 mb-6">404</h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-lg text-center mb-8 max-w-lg">
                The page you’re looking for doesn’t exist or may have been moved.
                Let’s get you back on track.
            </p>

            {/* Home button */}
            <Link
                to="/"
                className="flex items-center px-6 py-3 bg-green-900 text-white rounded-full font-medium hover:bg-green-800 transition shadow-lg"
            >
                <Home className="w-5 h-5 mr-2" />
                Go Back Home
            </Link>

        </div>
    );
};

export default NotFoundPage;
