// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useWorkerDetails } from '../context/WorkerDetailContext';

// const WorkerDetails: React.FC = () => {
//     const today = new Date();
//     const month = today.getMonth() + 1;
//     const year = today.getFullYear();
//     const [currentMonth, setCurrentMonth] = useState(month);
//     const [currentYear, setCurrentYear] = useState(year);
//     const [showAllCategories, setShowAllCategories] = useState(false);
//     const [showAllServices, setShowAllServices] = useState(false);

//     const { selectedDetails } = useWorkerDetails();

//     const workerData = selectedDetails;
//     console.log("WorkerData :", workerData)
//     if (!workerData) return <div>No worker selected</div>;

//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];

//     const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

//     const getDaysInMonth = (month: number, year: number) => {
//         return new Date(year, month + 1, 0).getDate();
//     };

//     const getFirstDayOfMonth = (month: number, year: number) => {
//         const firstDay = new Date(year, month, 1).getDay();
//         return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
//     };

//     const generateCalendarDays = () => {
//         const daysInMonth = getDaysInMonth(currentMonth, currentYear);
//         const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
//         const days = [];

//         // Add empty cells for days before the first day of the month
//         for (let i = 0; i < firstDay; i++) {
//             days.push(null);
//         }

//         // Add days of the month
//         for (let day = 1; day <= daysInMonth; day++) {
//             days.push(day);
//         }

//         return days;
//     };

//     const navigateMonth = (direction: 'prev' | 'next') => {
//         if (direction === 'prev') {
//             if (currentMonth === 0) {
//                 setCurrentMonth(11);
//                 setCurrentYear(currentYear - 1);
//             } else {
//                 setCurrentMonth(currentMonth - 1);
//             }
//         } else {
//             if (currentMonth === 11) {
//                 setCurrentMonth(0);
//                 setCurrentYear(currentYear + 1);
//             } else {
//                 setCurrentMonth(currentMonth + 1);
//             }
//         }
//     };

//     const calendarDays = generateCalendarDays();

//     return (
//         <div className="max-h-[550PX] h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//             <div className="h-[550px] overflow-y-auto bg-gray-100 p-4">
//                 {/* Main Container */}
//                 <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//                     {/* Top Section */}
//                     <div className="bg-gradient-to-r from-green-50 to-indigo-50 p-8">
//                         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                             {/* Profile Image Section */}
//                             <div className="lg:col-span-1">
//                                 <div className="text-center">
//                                     <h3 className="text-lg font-semibold mb-6 text-gray-700">Profile Image</h3>
//                                     <div className="w-52 h-52 mx-auto border-2 border-gray-200 rounded-xl flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//                                         <div className="text-center">
//                                             <div className="w-20 h-20 mx-auto mb-4 border-4 border-gray-800 rounded-full bg-white shadow-md"></div>
//                                             <div className="w-20 h-10 mx-auto border-4 border-gray-800 border-t-0 rounded-b-full bg-white shadow-md"></div>
//                                         </div>
//                                     </div>
//                                     <h4 className="text-xl font-bold mt-6 text-gray-800">{workerData.name}</h4>
//                                 </div>
//                             </div>

//                             {/* Categories Section */}
//                             <div className="lg:col-span-1">
//                                 <h3 className="text-lg font-semibold mb-6 text-gray-700">Categories</h3>
//                                 <div className="space-y-4">
//                                     {(showAllCategories ? workerData.categories : workerData.categories.slice(0, 4)).map((category, index) => (
//                                         <div key={index} className="bg-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                             <span className="text-lg font-medium text-gray-800">{category}</span>
//                                         </div>
//                                     ))}
//                                     {workerData.categories.length > 4 && (
//                                         <button
//                                             onClick={() => setShowAllCategories(!showAllCategories)}
//                                             className="text-green-600 hover:text-green-800 font-medium cursor-pointer transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md w-full text-left"
//                                         >
//                                             {showAllCategories ? 'show less...' : 'view more...'}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Services Section */}
//                             <div className="lg:col-span-1">
//                                 <h3 className="text-lg font-semibold mb-6 text-gray-700">Services</h3>
//                                 <div className="space-y-4">
//                                     {(showAllServices ? workerData.services : workerData.services.slice(0, 4)).map((service, index) => (
//                                         <div
//                                             key={index}
//                                             className="bg-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500"
//                                         >
//                                             <span className="text-lg font-medium text-gray-800">{service}</span>
//                                         </div>
//                                     ))}
//                                     {workerData.services.length > 4 && (
//                                         <button
//                                             onClick={() => setShowAllServices(!showAllServices)}
//                                             className="text-green-600 hover:text-green-800 font-medium cursor-pointer transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md w-full text-left"
//                                         >
//                                             {showAllServices ? 'show less...' : 'view more...'}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>


//                             {/* Availability Calendar */}
//                             <div className="lg:col-span-1">
//                                 <h3 className="text-lg font-semibold mb-6 text-gray-700">Availability</h3>
//                                 <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//                                     {/* Calendar Header */}
//                                     <div className="flex items-center justify-between mb-6">
//                                         <button
//                                             onClick={() => navigateMonth('prev')}
//                                             className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
//                                         >
//                                             <ChevronLeft className="w-5 h-5 text-orange-500" />
//                                         </button>
//                                         <h4 className="font-bold text-gray-800">
//                                             {months[currentMonth]} {currentYear}
//                                         </h4>
//                                         <button
//                                             onClick={() => navigateMonth('next')}
//                                             className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
//                                         >
//                                             <ChevronRight className="w-5 h-5 text-orange-500" />
//                                         </button>
//                                     </div>

//                                     {/* Days of Week */}
//                                     <div className="grid grid-cols-7 gap-1 mb-3">
//                                         {daysOfWeek.map((day) => (
//                                             <div key={day} className="text-center text-sm font-semibold p-2 text-gray-600">
//                                                 {day}
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Calendar Days */}
//                                     <div className="grid grid-cols-7 gap-1">
//                                         {calendarDays.map((day, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`text-center p-2 text-sm font-medium transition-all duration-200 ${day === null
//                                                     ? ''
//                                                     : day === 9 || day === 10
//                                                         ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105'
//                                                         : 'hover:bg-gray-100 cursor-pointer rounded-lg hover:shadow-sm'
//                                                     }`}
//                                             >
//                                                 {day}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Details Section */}
//                     <div className="p-8 bg-gradient-to-r from-green-50 to-indigo-50 ">
//                         <div className="border-b border-gray-200 pb-4 mb-8">
//                             <h2 className="text-2xl font-bold text-gray-800">Details</h2>
//                         </div>

//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             {/* Left Column */}
//                             <div className="space-y-6">
//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Full Name</h3>
//                                     <p className="text-lg font-bold text-gray-800">{workerData.name}</p>
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Email</h3>
//                                     <p className="text-green-600 underline hover:text-green-800 cursor-pointer font-medium">{workerData.email}</p>
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Phone</h3>
//                                     <p className="text-lg font-semibold text-gray-800">{workerData.phone}</p>
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Location</h3>
//                                     <p className="text-lg font-semibold text-gray-800 capitalize">{workerData.location.address}</p>
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Age</h3>
//                                     <p className="text-lg font-semibold text-gray-800">{workerData.age}</p>
//                                 </div>
//                             </div>

//                             {/* Middle Column */}
//                             <div className="space-y-6">
//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Minimum Hour Per Day</h3>
//                                     <p className="text-lg font-semibold text-gray-800">{workerData.minHours}</p>
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Work Type</h3>
//                                     <p className="text-lg font-semibold text-gray-800">{workerData.workType.map((item) => item + ' ')}</p>
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-4 text-gray-600 uppercase text-sm tracking-wide">How Can I Help</h3>
//                                     <p className="text-sm leading-relaxed text-gray-700 font-medium">
//                                         {workerData.bio}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Right Column */}
//                             <div className="space-y-6">
//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Total Works</h3>
//                                     {/* <p className="text-3xl font-bold text-green-700">{workerData.}</p> */}
//                                 </div>

//                                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
//                                     <h3 className="font-semibold mb-3 text-gray-600 uppercase text-sm tracking-wide">Completed Works</h3>
//                                     {/* <p className="text-3xl font-bold text-green-700">{workerData.completedWorks}</p> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WorkerDetails;

import { MapPin, Clock, Phone, Mail, Calendar, User, CheckCircle } from 'lucide-react';
import { useWorkerDetails } from '../context/WorkerDetailContext';



const WorkerDetails = () => {
    const { selectedDetails } = useWorkerDetails();
 


    const worker = selectedDetails?.worker;
    const availability = selectedDetails?.availability;


    if (!worker || !availability) return <div>No worker selected</div>;

    // Extract all available dates
    const availableDates = availability.availableDates.map(dateObj => new Date(dateObj.date));
    const month = availableDates[0].getMonth();
    const year = availableDates[0].getFullYear();

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const days = [];

        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);

        return days;
    };

    const availableDays = availableDates.map(d => d.getDate());
    const calendarDays = generateCalendarDays();

    const colorMap: Record<string, { bg: string; text: string }> = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const StatCard = ({ icon: Icon, label, value, color = "blue" }: any) => {
        const colors = colorMap[color] || colorMap.blue;
        return (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[560px] bg-gray-50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

                        {/* Profile Section */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={
                                        typeof worker.profileImage === "string"
                                            ? worker.profileImage
                                            : worker.profileImage instanceof File
                                                ? URL.createObjectURL(worker.profileImage)
                                                : "/default-avatar.png" // fallback
                                    }
                                    alt="Worker Profile"
                                    className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-white"
                                />


                                {worker.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <h1 className="text-xl font-bold text-gray-900">{worker.name}</h1>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${worker.isVerified
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {worker.isVerified ? 'Verified' : 'Pending Approval'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{worker.location.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <User className="w-3 h-3" />
                                        <span>{worker.age} years old</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Min {worker.minHours}/day</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="flex space-x-4">
                            <StatCard icon={Calendar} label="Total Works" value="26" color="blue" />
                            <StatCard icon={CheckCircle} label="Completed" value="22" color="green" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="h-100 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium text-gray-900">{worker.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium text-gray-900">{worker.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">How Can I Help</h2>
                                <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
                            </div>

                            {/* Work Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Minimum Hours Per Day</p>
                                        <p className="font-medium text-gray-900">{worker.minHours}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Working Hours</p>
                                        <p className="font-medium text-gray-900">{worker.workType.join(', ')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories & Services */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-3">
                                        {worker.categories.map((category, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-gray-800 font-medium">{category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                                    <div className="space-y-3">
                                        {worker.services.map((service, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-800 font-medium">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Calendar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="text-center mb-4">
                                        <h4 className="font-semibold text-gray-900">{month} {year}</h4>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="text-center text-xs font-medium p-2 text-gray-600">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((day, index) => (
                                            <div
                                                key={index}
                                                className={`text-center p-2 text-sm font-medium rounded-lg transition-colors ${day === null
                                                    ? ''
                                                    : availableDays.includes(day)
                                                        ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600'
                                                        : 'text-gray-400 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Account Status */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Subscription</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${worker.subscription.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {worker.subscription.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Account Status</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${worker.isAccountBuilt
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {worker.isAccountBuilt ? 'Complete' : 'Incomplete'}
                                            </span>
                                        </div>
                                    </div>
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
