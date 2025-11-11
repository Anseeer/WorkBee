import { useEffect, useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import { fetchWorkerByWorkDetails } from '../../services/workerService';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Store';
import type { IWorker } from '../../types/IWorker';
import WorkerAvailabilityModal from './WorkerAvailabilityModal';
import type { IAvailability } from '../../types/IAvailability';
import { fetchAvailability } from '../../services/userService';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WorkDraftThunk, workerDetails } from '../../slice/workDraftSlice';
import { StarRatingDisplay } from '../common/StartRating';

interface FilterState {
    selectedDate: string;
    selectedTimeSlots: string[];
    maxPrice: number;
    minRating: number;
    minCompletedWorks: number;
}


const WorkerListing = () => {
    const workDetails = useSelector((state: RootState) => state?.work);
    const userDetails = useSelector((state: RootState) => state?.user?.user);
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [price, setPrice] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState<IWorker[]>([]);
    const [availability, setAvailability] = useState<IAvailability | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>({
        selectedDate: "",
        selectedTimeSlots: [],
        maxPrice: 10000,
        minRating: 0,
        minCompletedWorks: 0,
    });


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<IWorker | null>(null);

    const timeSlots = [
        { value: "morning", label: "Morning (9am - 1pm)" },
        { value: "afternoon", label: "Afternoon (1pm - 5pm)" },
        { value: "evening", label: "Evening (5pm - 9pm)" },
        { value: "full-day", label: "Full Day (9am - 5pm)" },
    ];

    useEffect(() => {
        const fetchWorkers = async () => {
            if (!workDetails?.categoryId || !workDetails?.serviceId) return;

            const fetchDetails = {
                categoryId: workDetails.categoryId,
                serviceId: workDetails.serviceId,
                location: {
                    lat: workDetails.location.lat,
                    lng: workDetails.location.lng,
                    pincode: workDetails.location.pincode,
                    address: workDetails.location.address,
                },
            };

            const res = await fetchWorkerByWorkDetails(fetchDetails);
            setWorkers(res.data.workers);
            setFilteredWorkers(res.data.workers);
        };

        fetchWorkers();
    }, [workDetails]);

    useEffect(() => {
        let updated = [...workers];

        if (filters.selectedTimeSlots.length > 0) {
            updated = updated.filter(worker =>
                worker.preferredSchedule.some(slot =>
                    filters.selectedTimeSlots.includes(slot)
                )
            );
        }

        updated = updated.filter(worker => {
            const price = getWorkerServicePrice(worker, workDetails.serviceId);
            if (price === null) return false;
            return price <= filters.maxPrice;
        });

        updated = updated.filter(worker =>
            Number(worker.ratings.average || 0) >= filters.minRating
        );

        updated = updated.filter(worker =>
            (worker.completedWorks || 0) >= filters.minCompletedWorks
        );

        setFilteredWorkers(updated);
        setCurrentPage(1);
    }, [filters, workDetails.serviceId, workers]);


    const handleTimeSlotChange = (timeSlot: string) => {
        setFilters(prev => ({
            ...prev,
            selectedTimeSlots: prev.selectedTimeSlots.includes(timeSlot)
                ? prev.selectedTimeSlots.filter(slot => slot !== timeSlot)
                : [...prev.selectedTimeSlots, timeSlot]
        }));
    };

    const handleSelectWorker = async (worker: IWorker, price: string) => {
        setSelectedWorker(worker);
        setPrice(price);
        setIsModalOpen(true);
        const availabilityResponse = await fetchAvailability(worker.id);
        setAvailability(availabilityResponse.data.data);

    };

    const Close = () => {
        setIsModalOpen(false)
    }

    const [triggerDraft, setTriggerDraft] = useState(false);

    useEffect(() => {
        if (triggerDraft) {
            dispatch(WorkDraftThunk(workDetails));
            setTriggerDraft(false);
            navigate('/home')
        }
    }, [triggerDraft, workDetails, dispatch, navigate]);

    const Confirm = async (date: string, slot: string, PlatformFee: string, commissionAmount: string) => {
        try {
            await dispatch(workerDetails({
                date,
                slot,
                PlatformFee,
                commission: commissionAmount,
                workerId: selectedWorker?.id,
                workerName: selectedWorker?.name,
                userName: userDetails?.name,
                wagePerHour: price,
                userId: userDetails?.id
            }));

            toast.success("Requested");
            setIsModalOpen(false);
            setTriggerDraft(true);
        } catch (error) {
            toast.error("Failed to request job");
            console.error("Error Response:", error);
        }
    };

    const getWorkerServicePrice = (worker: IWorker, serviceId: string) => {
        return worker.services.find(s => s.serviceId === serviceId)?.price ?? null;
    };

    const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedWorkers = filteredWorkers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-10 animate-fadeInUp">
            <div className="flex flex-col md:flex-row justify-between gap-6 animate-fadeInDown">

                {/* Sidebar */}
                <div className="w-full md:w-80 flex-shrink-0 animate-slideInRight">
                    <div className="bg-white border-2 border-green-600 rounded-3xl p-4 sm:p-6 animate-fadeInScale">
                        <h3 className="text-lg font-semibold mb-4 text-green-700">Choose your slot</h3>
                        <div className="space-y-3">
                            {timeSlots.map((slot) => (
                                <label key={slot.value} className="flex items-center space-x-3 cursor-pointer animate-fadeInUp">
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedTimeSlots.includes(slot.value)}
                                        onChange={() => handleTimeSlotChange(slot.value)}
                                        className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-green-500 text-green-600"
                                    />
                                    <span className="text-sm text-gray-700">{slot.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price Range Filter */}
                        <div className="my-6 border-t border-gray-200" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-700 mb-3">Max Price</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Up to ₹{filters.maxPrice}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={1000}
                                    step={50}
                                    value={filters.maxPrice}
                                    onChange={(e) =>
                                        setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))
                                    }
                                    className="w-full cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="my-6 border-t border-gray-200" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-700 mb-3">Minimum Rating</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">{filters.minRating.toFixed(1)} ⭐</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={5}
                                    step={0.5}
                                    value={filters.minRating}
                                    onChange={(e) =>
                                        setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))
                                    }
                                    className="w-full bg-green-800 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Worker List */}
                <div className="flex-1 animate-fadeInUp">
                    <div className="max-w-full space-y-4">
                        {paginatedWorkers.length > 0 ? (
                            paginatedWorkers.map((worker, index) => {
                                const price = getWorkerServicePrice(worker, workDetails.serviceId);

                                return (
                                    <div
                                        key={worker.id}
                                        className="bg-white border-2 border-green-600 rounded-3xl p-4 sm:p-6 animate-fadeInUp"
                                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "backwards" }}
                                    >
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                                            {/* Profile Image + Button */}
                                            <div className="flex flex-col items-center flex-shrink-0 animate-zoomIn">
                                                <img
                                                    src={worker.profileImage as string}
                                                    className="w-20 h-20 bg-gray-300 rounded-full object-cover"
                                                    alt={worker.name}
                                                />
                                                <button
                                                    onClick={() => handleSelectWorker(worker, price?.toString() as string)}
                                                    className="bg-green-800 mt-3 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-700 transition-colors animate-scaleIn"
                                                >
                                                    Select
                                                </button>
                                            </div>

                                            {/* Worker Details */}
                                            <div className="flex-1 animate-fadeInUp">

                                                {/* Name + Price */}
                                                <div className="flex justify-between items-center w-full">
                                                    <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>

                                                    <h3 className="text-lg font-semibold text-green-700">
                                                        {price !== null ? `₹${price}/hour` : "N/A"}
                                                    </h3>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-600">Rating:</span>
                                                    <StarRatingDisplay rating={worker.ratings.average || 0} />
                                                    <span className="text-xs text-gray-600">
                                                        ({worker.ratings.average.toFixed(1)}/5)
                                                    </span>
                                                </div>

                                                {/* Info Row */}
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2 animate-fadeInUp">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{worker.location.address}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <User className="w-3 h-3" />
                                                        <span>{worker.age} years old</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                                        <span>{worker.completedWorks ?? 0} completed works</span>
                                                    </div>
                                                </div>

                                                {/* Bio */}
                                                <div className="border-2 border-gray-300 rounded-2xl p-4 mt-3 animate-fadeInScale">
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        How Can I Help:
                                                    </p>
                                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                        {worker.bio}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center py-10 animate-fadeInDown">
                                No workers found matching your criteria.
                            </p>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-6 animate-slideIn">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-full ${currentPage === i + 1
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                        } animate-scaleIn`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedWorker && (
                <div >
                    <WorkerAvailabilityModal
                        work={workDetails}
                        price={price}
                        worker={selectedWorker}
                        availability={availability as IAvailability}
                        onClose={Close}
                        onConfirm={Confirm}
                    />
                </div>
            )}
        </div>
    );

};

export default WorkerListing;