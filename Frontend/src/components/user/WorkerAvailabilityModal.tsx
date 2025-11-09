import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { IWorker } from "../../types/IWorker";
import type { IWork } from "../../types/IWork";

type BookedSlot = string | { slot: string; jobId?: string };

interface IAvailability {
    availableDates: Array<{
        date: string;
        bookedSlots: BookedSlot[];
    }>;
}

interface WorkerModalProps {
    work: Partial<IWork>;
    worker: IWorker;
    price:string;
    availability: IAvailability;
    onClose: () => void;
    onConfirm: (date: string, slot: string, totalAmount: string, PlatformFee: string, commissionAmount: string) => void;
}

type AvailableSlot = {
    slot: string;
    label: string;
    booked: boolean;
};

const WorkerAvailabilityModal: React.FC<WorkerModalProps> = ({
    work,
    worker,
    price,
    availability,
    onClose,
    onConfirm
}) => {
    console.log("WorkerAvailability:", availability);
    console.log("Worker :", worker);
    console.log("work :", work);
    console.log("Price :", price);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());


    const wage = Number(price) || 0;
    const PlatformFee = wage * 0.05;
    const totalAmount = wage + wage * 0.05;
    const commissionPercentage = Number(worker.subscription?.commission) || 0;
    const commissionAmount = (wage * commissionPercentage) / 100;


    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-CA");
    };

    const handleDateChange = (date: Date) => {
        const dateStr = formatDate(date);
        setSelectedDate(dateStr);
        setSelectedSlot(null);
    };

    const getAvailableSlotsForDate = (date: string): AvailableSlot[] => {
        if (!availability?.availableDates) return [];

        const dayAvailability = availability.availableDates.find(av => {
            return formatDate(new Date(av.date)) === date;
        });

        if (!dayAvailability) return [];

        const allSlots = worker.preferredSchedule || [];

        return allSlots.map(slot => ({
            slot,
            label: slot.charAt(0).toUpperCase() + slot.slice(1),
            booked: dayAvailability.bookedSlots?.some(b =>
                typeof b === "string" ? b === slot : b.slot === slot
            ) ?? false
        }));
    };

    const availableSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];
    const isConfirmDisabled = !selectedDate || !selectedSlot;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const isDateAvailable = (date: Date) => {
        if (!availability?.availableDates) return false;
        const today = new Date();
        const dateStr = formatDate(date);
        return (
            date >= today &&
            availability.availableDates.some(
                av => formatDate(new Date(av.date)) === dateStr
            )
        );
    };

    const isDateSelected = (date: Date) => {
        return selectedDate === formatDate(date);
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);

        const dayOfWeek = (firstDay.getDay() + 6) % 7;
        startDate.setDate(firstDay.getDate() - dayOfWeek);

        const days: Date[] = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const handleDateClick = (date: Date) => {
        if (isDateAvailable(date)) {
            handleDateChange(date);
        }
    };

    const days = getDaysInMonth();


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-70 z-50 p-4">
            <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        Choose your task date and start time:
                    </h1>
                    <button
                        onClick={onClose}
                        className="hover:bg-red-300 bg-red-500 p-2 rounded-full transition-colors mt-4 md:mt-0"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Section - Worker Info & Calendar */}
                    <div className="flex-1">
                        {/* Worker Profile */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                <img
                                    src={worker.profileImage as string}
                                    className="w-full h-full object-cover"
                                    alt={`${worker.name}'s profile`}
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    {worker.name}'s Availability
                                </h2>
                                <p className="text-gray-600">Available dates and time slots</p>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => navigateMonth(-1)} className="p-2 bg-green-900 hover:bg-green-600 text-white rounded-lg">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => navigateMonth(1)} className="p-2 bg-green-900 hover:bg-green-600 text-white rounded-lg">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Days of Week */}
                            <div className="grid grid-cols-7 gap-1 mb-3">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="text-center text-xs sm:text-sm font-bold text-gray-600 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((date, index) => {
                                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                    const isAvailable = isDateAvailable(date);
                                    const isSelected = isDateSelected(date);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDateClick(date)}
                                            disabled={!isAvailable}
                                            className={`
                      h-8 w-8 rounded-lg text-sm font-semibold transition-all duration-200 m-1
                      ${!isCurrentMonth
                                                    ? 'text-gray-300'
                                                    : isSelected
                                                        ? 'bg-green-900 text-white shadow-lg scale-105'
                                                        : isAvailable
                                                            ? 'text-gray-900 hover:bg-green-500 hover:scale-105'
                                                            : 'text-gray-400 cursor-not-allowed'}
                    `}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Summary & Actions */}
                    <div className="w-full md:w-80 flex flex-col">
                        <div className="flex-1">
                            {selectedDate && (
                                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 mb-4 md:mb-6">
                                    <h4 className="font-bold mb-2 text-gray-800">Select a Time Slot</h4>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Available time slots for{' '}
                                        {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>

                                    {availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {availableSlots.map(({ slot, booked, label }) => (
                                                <button
                                                    key={slot}
                                                    disabled={booked}
                                                    onClick={() => !booked && setSelectedSlot(slot)}
                                                    className={`
                          p-3 rounded-lg border text-sm font-medium transition-all
                          ${selectedSlot === slot
                                                            ? 'bg-green-900 text-white border-green-900'
                                                            : 'bg-white border-gray-300'}
                          ${booked
                                                            ? 'opacity-50 cursor-not-allowed text-gray-400'
                                                            : 'hover:bg-green-500 hover:border-green-500'}
                        `}
                                                >
                                                    {label.split(' (')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">No time slots available for this date.</p>
                                    )}
                                </div>
                            )}

                            {selectedDate && selectedSlot && (
                                <div className="rounded-2xl p-4 sm:p-6 mb-4 md:mb-6 border border-blue-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Request Summary
                                    </h3>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span className="font-semibold">{new Date(selectedDate).toDateString()}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Time Slot:</span>
                                            <span className="font-semibold capitalize">
                                                {selectedSlot.replace("-", " ")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Work:</span>
                                            <span className="font-semibold">{work.service}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Worker:</span>
                                            <span className="font-semibold capitalize">{worker.name}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Work location:</span>
                                            <span className="font-semibold capitalize">{work.location?.address}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Price:</span>
                                            <span className="font-semibold">₹{wage.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Platform Fee:</span>
                                            <span className="font-semibold">₹{PlatformFee.toFixed(2)}</span>
                                        </div>


                                        <div className="pt-2 border-t border-blue-200">
                                            <strong>Total amount: ₹{totalAmount.toFixed(2)}</strong>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {!selectedDate && (
                                <div className="rounded-2xl p-4 sm:p-6 mb-4 md:mb-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Getting Started</h3>
                                    <p className="text-gray-600 text-sm">
                                        Select a date from the calendar to see available time slots.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={() =>
                                selectedDate &&
                                selectedSlot &&
                                onConfirm(selectedDate, selectedSlot, totalAmount.toString(), PlatformFee.toString(), commissionAmount.toString())
                            }
                            disabled={isConfirmDisabled}
                            className={`
              w-full py-3 rounded-2xl text-lg font-bold transition-all duration-300
              ${isConfirmDisabled
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-900 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'}
            `}
                        >
                            Confirm Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default WorkerAvailabilityModal;