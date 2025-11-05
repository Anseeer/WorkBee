import { useEffect, useState } from 'react';
import { fetchWorkDetails } from '../../services/workerService';
import type { IWork } from '../../types/IWork';
import { toast } from 'react-toastify';
import { rateWorker } from '../../services/userService';

interface props {
    onClose: () => void;
    workId: string;
}

export const WorkerRatingModal = ({ onClose, workId }: props) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [work, setWork] = useState<IWork>();

    const handleRating = (rate: number) => {
        setRating(rate);
        console.log(`Selected rating: ${rate}`);
    };

    const handleSubmit = async () => {
        console.log(`Selected rating: ${rating}`);
        try {
            await rateWorker(work?.workerId.toString() as string, rating)
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Error in rating worker")
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const work = await fetchWorkDetails(workId);
            setWork(work.data);
        }
        fetchData();
    }, [workId])

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Worker Profile Section */}
                <div className="flex items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Rating</h2>
                    </div>
                </div>

                {/* Message to User */}
                <p className="text-gray-700 mb-6">
                    We value your feedback! Please rate {work?.workerName}'s work to help us ensure top-quality service.
                </p>

                {/* Star Rating System */}
                <div className="flex justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(rating)}
                            className="focus:outline-none"
                        >
                            <svg
                                className={`w-8 h-8 ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded transition ${rating < 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                        onClick={handleSubmit}
                        disabled={rating < 1}
                    >
                        Submit Rating
                    </button>
                </div>
            </div>
        </div >
    );
};