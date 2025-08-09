import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchWorkerByWorkDetails } from '../../services/workerService';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Store';

interface Worker {
    id: number;
    name: string;
    completedJobs: number;
    rating: number;
    hourlyRate: number;
    profileImage: string;
    description: string;
    availability: string[];
}

interface FilterState {
    selectedDate: string;
    selectedTimeSlots: string[];
    priceRange: {
        min: number;
        max: number;
    };
}


const WorkerListing = () => {
const workDetails = useSelector((state: RootState) => state?.work);

useEffect(() => {
  const fetchWorkers = async () => {
    if (!workDetails?.categoryId || !workDetails?.serviceId) return;

    const fetchDetails = {
      categoryId: workDetails.categoryId,
      serviceId: workDetails.serviceId,
      workType: workDetails.workType,
      size: workDetails.size,
      location: {
        lat: workDetails.location.lat,
        lng: workDetails.location.lng,
        pincode: workDetails.location.pincode,
        address: workDetails.location.address,
      },
    };
    const workers = await fetchWorkerByWorkDetails(fetchDetails);
    console.log("Fetched Workers:", workers);
  };

  fetchWorkers();
}, [workDetails]);


    const [filters, setFilters] = useState<FilterState>({
        selectedDate: '',
        selectedTimeSlots: [],
        priceRange: {
            min: 10,
            max: 150
        }
    });

    const workers: Worker[] = [
        {
            id: 1,
            name: "John Smith",
            completedJobs: 156,
            rating: 4.8,
            hourlyRate: 25,
            profileImage: "",
            description: "Professional cleaner with 5+ years experience. Specialized in deep cleaning and organization.",
            availability: ["morning", "afternoon"]
        },
        {
            id: 2,
            name: "Sarah Johnson",
            completedJobs: 203,
            rating: 4.9,
            hourlyRate: 30,
            profileImage: "",
            description: "Expert in home maintenance and repair work. Quick, reliable, and detail-oriented.",
            availability: ["afternoon", "evening"]
        },
        {
            id: 3,
            name: "Mike Wilson",
            completedJobs: 89,
            rating: 4.7,
            hourlyRate: 22,
            profileImage: "",
            description: "Handyman services including furniture assembly, painting, and minor repairs.",
            availability: ["morning", "evening"]
        }
    ];

    const dateOptions = [
        { value: 'today', label: 'Today' },
        { value: 'within3days', label: 'Within 3 day' },
        { value: 'withinweek', label: 'With in week' },
        { value: 'choose', label: 'Choose' }
    ];

    const timeSlots = [
        { value: 'morning', label: 'Morning ( 8am - 12 pm )' },
        { value: 'afternoon', label: 'Afternoon ( 12pm - 5pm )' },
        { value: 'evening', label: 'Evening ( 5pm - 9pm )' }
    ];

    const handleDateChange = (date: string) => {
        setFilters(prev => ({
            ...prev,
            selectedDate: prev.selectedDate === date ? '' : date
        }));
    };

    const handleTimeSlotChange = (timeSlot: string) => {
        setFilters(prev => ({
            ...prev,
            selectedTimeSlots: prev.selectedTimeSlots.includes(timeSlot)
                ? prev.selectedTimeSlots.filter(slot => slot !== timeSlot)
                : [...prev.selectedTimeSlots, timeSlot]
        }));
    };


    return (
        <div className="flex justify-between py-10 px-20 bg-gray-50 min-h-screen">
            {/* Filter Sidebar */}
            <div className="w-80 flex-shrink-0 mr-6">
                <div className="bg-white border-2 border-green-600 rounded-3xl p-6">
                    {/* Date Filter */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-green-900">Date</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {dateOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleDateChange(option.value)}
                                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${filters.selectedDate === option.value
                                        ? 'bg-green-700 text-white border-gray-900'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-4"></div>
                    </div>

                    {/* Time of Day Filter */}
                    <div className="mb-8">
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
                        <div className="border-t border-gray-200 mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Worker */}
            <div className="flex-1">
                <div className="max-w-3xl space-y-4">
                    {workers.map((worker) => (
                        <div
                            key={worker.id}
                            className="bg-white border-2 border-green-600 rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-6">
                                {/* Profile + Button */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                                    <button className="bg-green-800 mt-3 text-white px-5 py-1 rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                                        Select
                                    </button>
                                </div>

                                {/* Worker Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                                    <p className="text-sm text-gray-600">No. of Completed</p>
                                    <p className="text-sm text-gray-600 mb-2">Rating</p>

                                    {/* Description */}
                                    <div className="border-2 border-gray-300 rounded-2xl p-4">
                                        <p className="text-sm font-medium text-gray-900 mb-1">How Can I Help:</p>
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {worker.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-medium">
                        1
                    </button>
                    <span className="text-gray-400 text-sm">...</span>
                    <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 text-sm">
                        3
                    </button>
                    <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 text-sm">
                        4
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>


            <style >{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    );
};

export default WorkerListing;