import { useEffect } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    useEffect(() => {
        console.error('Application Error:', error);
        console.error('Error Stack:', error.stack);
    }, [error]);

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        className="animate-bounce"
                    >
                        <ellipse cx="60" cy="65" rx="25" ry="30" fill="#064e3b" />

                        <ellipse cx="60" cy="55" rx="23" ry="8" fill="#f0fdf4" opacity="0.3" />
                        <ellipse cx="60" cy="70" rx="23" ry="8" fill="#f0fdf4" opacity="0.3" />

                        <ellipse
                            cx="35"
                            cy="50"
                            rx="20"
                            ry="25"
                            fill="#059669"
                            opacity="0.6"
                            transform="rotate(-20 35 50)"
                        />

                        <ellipse
                            cx="85"
                            cy="50"
                            rx="20"
                            ry="25"
                            fill="#059669"
                            opacity="0.6"
                            transform="rotate(20 85 50)"
                        />

                        <circle cx="60" cy="40" r="15" fill="#064e3b" />

                        <circle cx="55" cy="38" r="3" fill="white" />
                        <circle cx="65" cy="38" r="3" fill="white" />
                        <path
                            d="M 55 40 Q 55 42 54 43"
                            stroke="#047857"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 65 40 Q 65 42 66 43"
                            stroke="#047857"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                        />

                        <path
                            d="M 55 47 Q 60 44 65 47"
                            stroke="#047857"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />

                        <path
                            d="M 52 28 Q 48 20 46 15"
                            stroke="#064e3b"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <circle cx="46" cy="15" r="2.5" fill="#064e3b" />

                        <path
                            d="M 68 28 Q 72 20 74 15"
                            stroke="#064e3b"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <circle cx="74" cy="15" r="2.5" fill="#064e3b" />

                        <path
                            d="M 60 90 L 60 100"
                            stroke="#064e3b"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    Buzz! Something Went Wrong
                </h1>

                <p className="text-gray-600 mb-6">
                    Our little bee encountered an unexpected problem. Don't worry, we're on it!
                </p>


                <div className="flex gap-3 justify-center">
                    <button
                        onClick={resetErrorBoundary}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white hover:bg-gray-50 text-emerald-600 font-medium rounded-lg border-2 border-emerald-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    If this problem persists, please contact support
                </p>
            </div>
        </div>
    );
};

export default ErrorFallback;