
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { IWorker } from '../../types/IWorker';
import type { IWork } from '../../types/IWork';
import { fetchAssignedWorks, fetchRequestedWorks, fetchWorkerEarnings } from '../../services/workerService';
import { Calendar } from '../../utilities/Calendar';
import type { IAvailability } from '../../types/IAvailability';
import EarningsChart from './Earnings';
import type { IWallet } from '../../types/IWallet';
import { Briefcase, Clock, Wallet, CalendarDays } from 'lucide-react';
import AnimatedNumber from '../../utilities/AnimatedNumber';

interface props {
    worker: IWorker;
    availability: IAvailability;
    wallet: IWallet;
}

type Filter = "monthly" | "yearly";

const WorkerDashboard = ({ worker, availability, wallet }: props) => {

    const [assignedworks, setAssignedWorks] = useState<IWork[]>([]);
    const [requestedWorks, setRequestedWorks] = useState<IWork[]>([]);
    const [earnings, setEarnings] = useState<any[]>([]);
    const [filter, setFilter] = useState<Filter>("monthly");

    useEffect(() => {
        if (!worker) return;

        const fetchInitial = async () => {
            const assigned = await fetchAssignedWorks();
            const requested = await fetchRequestedWorks();

            setAssignedWorks(assigned.assignedWorks);
            setRequestedWorks(requested.requestedWorks);
        };

        fetchInitial();
    }, [worker]);

    useEffect(() => {
        const fetchEarnings = async () => {
            const res = await fetchWorkerEarnings(filter);
            setEarnings(res.earnings);
        };

        fetchEarnings();
    }, [filter]);


    const StatCard = ({ icon: Icon, label, value, bgColor, textColor }: any) => (
        <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}>
            <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-medium ${textColor}`}>{label}</p>
                <Icon className={textColor} size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white animate-fadeInUp">
            <div className="container mx-auto p-6 max-w-7xl">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 animate-fadeInDown">
                    <div className="flex items-center space-x-4">
                        <div className="relative animate-zoomIn">
                            <img
                                src={worker.profileImage as string}
                                alt="Worker"
                                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="animate-fadeInUp">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Hello, {worker.name}!
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Welcome back to your dashboard
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Work */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: Briefcase, label: "Completed Works", value: worker.completedWorks, bgColor: "bg-blue-50", textColor: "text-blue-600" },
                                { icon: Clock, label: "Job Requests", value: requestedWorks.length, bgColor: "bg-orange-50", textColor: "text-orange-600" },
                                { icon: Wallet, label: "Wallet Balance", value: wallet.balance, bgColor: "bg-green-50", textColor: "text-green-600", prefix: "₹" } // only Wallet has prefix
                            ].map((stat, index) => {
                                const { prefix = "", value, ...rest } = stat as { icon: any; label: string; value: number; bgColor: string; textColor: string; prefix?: string };

                                return (
                                    <div key={index} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                                        <StatCard {...rest} value={<AnimatedNumber value={value} prefix={prefix} />} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Assigned Work Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-y-auto p-6 max-h-[400px] flex flex-col animate-fadeInScale">
                            <div className="flex items-center justify-between mb-6 animate-slideInRight">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Briefcase className="text-blue-600" size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Assigned Work</h3>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                {assignedworks.length > 0 ? (
                                    <div className="space-y-3 h-auto overflow-y-auto">
                                        {assignedworks.map((work, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all animate-fadeInUp"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 mb-2">{work.service}</h4>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span className="flex items-center space-x-1">
                                                                <CalendarDays size={14} />
                                                                <span>{work.sheduleDate}</span>
                                                            </span>
                                                            <span className="flex items-center space-x-1">
                                                                <Clock size={14} />
                                                                <span>{work.sheduleTime}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="text-xs text-gray-500 mb-1">Payment</p>
                                                        <p className="text-xl font-bold text-green-600">₹{work.wagePerHour}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fadeInUp">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                            <Briefcase className="text-gray-400" size={32} />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Assigned Work</h4>
                                        <p className="text-gray-500 text-sm max-w-xs">
                                            You don't have any assigned work at the moment. New assignments will appear here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeInDown" style={{ animationDelay: "0.2s" }}>
                            {earnings && earnings.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Earnings Overview</h3>
                                        <select
                                            id="filter"
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value as Filter)}
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>

                                    <EarningsChart filter={filter} rawData={earnings} />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                    <p className="text-sm font-medium">No earnings data available</p>
                                    <p className="text-xs">Once earnings start coming in, you'll see them here.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Calendar & Chart */}
                    <div className="space-y-6">
                        <Calendar availability={availability} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;