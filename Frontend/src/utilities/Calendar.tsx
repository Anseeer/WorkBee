
import { useEffect, useState } from "react";
import type { IAvailability } from "../types/IAvailability";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
    availability: IAvailability;
}

export const Calendar = ({ availability }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getAvailableDaysForMonth = (date: dayjs.Dayjs): number[] => {
        const month = date.month();
        const year = date.year();
        const today = dayjs().startOf('day');

        return (availability?.availableDates || [])
            .filter(d => {
                const availableDate = dayjs(d.date).startOf('day');
                return (
                    availableDate.year() === year &&
                    availableDate.month() === month &&
                    availableDate.isSameOrAfter(today)
                );
            })
            .map(d => dayjs(d.date).date());
    };

    useEffect(() => {
        const generateCalendar = (date: dayjs.Dayjs) => {
            const startOfMonth = date.startOf("month");
            const startDay = startOfMonth.day();

            const daysInMonth = date.daysInMonth();
            const days: (number | null)[] = [];

            for (let i = 0; i < startDay; i++) {
                days.push(null);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                days.push(i);
            }
            setCalendarDays(days);
        };
        generateCalendar(currentDate);
    }, [currentDate, availability]);

    const goToPreviousMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const goToNextMonth = () => {
        setCurrentDate(currentDate.add(1, "month"));
    };

    const month = currentDate.format("MMMM");
    const year = currentDate.format("YYYY");
    const availableDays = getAvailableDaysForMonth(currentDate);


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6  top-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
                <div className="flex gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center mb-4">
                    <h4 className="font-semibold text-gray-900">{month} {year}</h4>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs font-medium p-2 text-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`text-center p-2 text-sm font-medium rounded-lg transition-colors ${day === null
                                ? ""
                                : availableDays.includes(day)
                                    ? "bg-green-700 text-white shadow-sm"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {day !== null ? day : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};
