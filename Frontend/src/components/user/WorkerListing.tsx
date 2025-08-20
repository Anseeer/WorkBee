/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface FilterState {
    selectedDate: string;
    selectedTimeSlots: string[];
}

const WorkerListing = () => {
    const workDetails = useSelector((state: RootState) => state?.work);
    const userDetails = useSelector((state: RootState) => state?.user.user);
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [filteredWorkers, setFilteredWorkers] = useState<IWorker[]>([]);
    const [availability, setAvailability] = useState<IAvailability | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>({
        selectedDate: '',
        selectedTimeSlots: [],
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
                workType: workDetails.workType,
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
    console.log('Worker ::', workers)
    useEffect(() => {
        if (filters.selectedTimeSlots.length === 0) {
            setFilteredWorkers(workers);
        } else {
            const newFilteredWorkers = workers.filter(worker =>
                worker.preferredSchedule.some(scheduleSlot =>
                    filters.selectedTimeSlots.includes(scheduleSlot)
                )
            );
            setFilteredWorkers(newFilteredWorkers);
        }
        setCurrentPage(1);
    }, [filters.selectedTimeSlots, workers]);

    const handleTimeSlotChange = (timeSlot: string) => {
        setFilters(prev => ({
            ...prev,
            selectedTimeSlots: prev.selectedTimeSlots.includes(timeSlot)
                ? prev.selectedTimeSlots.filter(slot => slot !== timeSlot)
                : [...prev.selectedTimeSlots, timeSlot]
        }));
    };

    const handleSelectWorker = async (worker: IWorker) => {
        setSelectedWorker(worker);
        setIsModalOpen(true);
        const availabilityResponse = await fetchAvailability(worker.id);
        console.log(availabilityResponse.data.data.availableDates)
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
    }, [triggerDraft, workDetails, dispatch]);

    const Confirm = async (date: string, slot: string) => {
        await dispatch(workerDetails({
            date,
            slot,
            workerId: selectedWorker?.id,
            workerName: selectedWorker?.name,
            userName: userDetails?.name
        }));
        toast.success("Requested");
        setIsModalOpen(false);
        setTriggerDraft(true); // Will run useEffect after workDetails updates
    };

    const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedWorkers = filteredWorkers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex justify-between py-10 px-20 bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 mr-6">
                <div className="bg-white border-2 border-green-600 rounded-3xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">Time of day</h3>
                    <div className="space-y-3">
                        {timeSlots.map((slot) => (
                            <label key={slot.value} className="flex items-center space-x-3 cursor-pointer">
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
                </div>
            </div>

            {/* Worker List */}
            <div className="flex-1">
                <div className="max-w-3xl space-y-4">
                    {paginatedWorkers.length > 0 ? (
                        paginatedWorkers.map((worker) => (
                            <div
                                key={worker.id}
                                className="bg-white border-2 border-green-600 rounded-3xl p-6"
                            >
                                <div className="flex items gap-6">
                                    {/* Profile Image + Button */}
                                    <div className="flex flex-col items-center   flex-shrink-0">
                                        <img
                                            src={worker.profileImage as string}
                                            className="w-20 h-20 bg-gray-300 rounded-full object-cover"
                                            alt={worker.name}
                                        />
                                        <button
                                            onClick={() => handleSelectWorker(worker)}
                                            className="bg-green-800 mt-3 text-white px-5 py-1 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                                        >
                                            Select
                                        </button>
                                    </div>

                                    {/* Worker Details */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {worker.name}
                                        </h3>

                                        {/* Info Row */}
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
                                            <div className="flex items-center pace-y-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{worker.location.address}</span>
                                            </div>
                                            <div className="flex items-center space-y-1">
                                                <User className="w-3 h-3" />
                                                <span>{worker.age} years old</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                                <span>{worker.completedWorks ?? 0} completed works</span>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div className="border-2 border-gray-300 rounded-2xl p-4 mt-3">
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
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">
                            No workers found matching your criteria.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedWorker && (
                <WorkerAvailabilityModal worker={selectedWorker} availability={availability as IAvailability} onClose={Close} onConfirm={Confirm} />
            )}
        </div>
    );
};

export default WorkerListing;
