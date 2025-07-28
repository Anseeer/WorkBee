import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkerDetails } from '../context/WorkerDetailContext';

const WorkerDetails: React.FC = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const [currentMonth, setCurrentMonth] = useState(month);
    const [currentYear, setCurrentYear] = useState(year);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);

    const { selectedDetails } = useWorkerDetails();

    const workerData = selectedDetails;
    console.log("WorkerData :", workerData)
    if (!workerData) return <div>No worker selected</div>;

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="max-h-[550PX] h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="h-[550px] overflow-y-auto bg-gray-100 p-4">
                {/* Main Container */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Top Section */}
                    <div className="bg-gradient-to-r from-green-50 to-indigo-50 p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Profile Image Section */}
                            <div className="lg:col-span-1">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-6 text-gray-700">Profile Image</h3>
                                    <div className="w-52 h-52 mx-auto border-2 border-gray-200 rounded-xl flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 border-4 border-gray-800 rounded-full bg-white shadow-md"></div>
                                            <div className="w-20 h-10 mx-auto border-4 border-gray-800 border-t-0 rounded-b-full bg-white shadow-md"></div>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold mt-6 text-gray-800">{workerData.name}</h4>
                                </div>
                            </div>

                            {/* Categories Section */}
                            <div className="lg:col-span-1">
                                <h3 className="text-lg font-semibold mb-6 text-gray-700">Categories</h3>
                                <div className="space-y-4">
                                    {(showAllCategories ? workerData.categories : workerData.categories.slice(0, 4)).map((category, index) => (
                                        <div key={index} className="bg-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                            <span className="text-lg font-medium text-gray-800">{category}</span>
                                        </div>
                                    ))}
                                    {workerData.categories.length > 4 && (
                                        <button
                                            onClick={() => setShowAllCategories(!showAllCategories)}
                                            className="text-green-600 hover:text-green-800 font-medium cursor-pointer transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md w-full text-left"
                                        >
                                            {showAllCategories ? 'show less...' : 'view more...'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Services Section */}
                            <div className="lg:col-span-1">
                                <h3 className="text-lg font-semibold mb-6 text-gray-700">Services</h3>
                                <div className="space-y-4">
                                    {(showAllServices ? workerData.services : workerData.services.slice(0, 4)).map((service, index) => (
                                        <div
                                            key={index}
                                            className="bg-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500"
                                        >
                                            <span className="text-lg font-medium text-gray-800">{service}</span>
                                        </div>
                                    ))}
                                    {workerData.services.length > 4 && (
                                        <button
                                            onClick={() => setShowAllServices(!showAllServices)}
                                            className="text-green-600 hover:text-green-800 font-medium cursor-pointer transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md w-full text-left"
                                        >
                                            {showAllServices ? 'show less...' : 'view more...'}
                                        </button>
                                    )}
                                </div>
                            </div>


                            {/* Availability Calendar */}
                            <div className="lg:col-span-1">
                                <h3 className="text-lg font-semibold mb-6 text-gray-700">Availability</h3>
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <button
                                            onClick={() => navigateMonth('prev')}
                                            className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-orange-500" />
                                        </button>
                                        <h4 className="font-bold text-gray-800">
                                            {months[currentMonth]} {currentYear}
                                        </h4>
                                        <button
                                            onClick={() => navigateMonth('next')}
                                            className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                                        >
                                            <ChevronRight className="w-5 h-5 text-orange-500" />
                                        </button>
                                    </div>

                                    {/* Days of Week */}
                                    <div className="grid grid-cols-7 gap-1 mb-3">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="text-center text-sm font-semibold p-2 text-gray-600">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar Days */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((day, index) => (
                                            <div
                                                key={index}
                                                className={`text-center p-2 text-sm font-medium transition-all duration-200 ${day === null
                                                    ? ''
                                                    : day === 9 || day === 10
                                                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105'
                                                        : 'hover:bg-gray-100 cursor-pointer rounded-lg hover:shadow-sm'
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 bg-gradient-to-r from-green-50 to-indigo-50 ">
                        <div className="border-b border-gray-200 pb-4 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Details</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Full Name</h3>
                                    <p className="text-lg font-bold text-gray-800">{workerData.name}</p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Email</h3>
                                    <p className="text-green-600 underline hover:text-green-800 cursor-pointer font-medium">{workerData.email}</p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Phone</h3>
                                    <p className="text-lg font-semibold text-gray-800">{workerData.phone}</p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Location</h3>
                                    <p className="text-lg font-semibold text-gray-800 capitalize">{workerData.location.address}</p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Age</h3>
                                    <p className="text-lg font-semibold text-gray-800">{workerData.age}</p>
                                </div>
                            </div>

                            {/* Middle Column */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Minimum Hour Per Day</h3>
                                    <p className="text-lg font-semibold text-gray-800">{workerData.minHours}</p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Work Type</h3>
                                    <p className="text-lg font-semibold text-gray-800">{workerData.workType.map((item) => item + ' ')}</p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-4 text-gray-600 uppercase text-sm tracking-wide">How Can I Help</h3>
                                    <p className="text-sm leading-relaxed text-gray-700 font-medium">
                                        {workerData.bio}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Total Works</h3>
                                    {/* <p className="text-3xl font-bold text-green-700">{workerData.}</p> */}
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                                    <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Completed Works</h3>
                                    {/* <p className="text-3xl font-bold text-green-700">{workerData.completedWorks}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDetails;