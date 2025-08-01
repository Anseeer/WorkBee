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
                                        <p className="text-sm text-gray-600 mb-2">Work Type</p>
                                        <p className="font-medium text-gray-900">{worker.workType.join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Preferred Schedule</p>
                                        <p className="font-medium text-gray-900">{worker.preferredSchedule.join(', ')}</p>
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
