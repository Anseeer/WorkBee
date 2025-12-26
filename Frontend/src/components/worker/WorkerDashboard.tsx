import { useEffect, useState } from "react";
import type { IAvailability } from "../../types/IAvailability";
import type { IWallet } from "../../types/IWallet";
import type { IWorker } from "../../types/IWorker";
import { fetchAssignedWorks, fetchRequestedWorks, fetchWorkerEarnings } from "../../services/workerService";
import { Calendar } from "../../utilities/Calendar";
import type { IWork } from "../../types/IWork";
import EarningsChart from "./EarningChart";

interface props {
    worker: IWorker;
    wallet: IWallet;
    availability: IAvailability;
}

const WorkerDashboard = ({ worker, wallet, availability }: props) => {
    const [jobRequest, setJobRequest] = useState<number | undefined>();
    const [availabilities, setAvailabilities] = useState<IAvailability>();
    const [assignedWorks, setAssignedWorks] = useState<IWork[]>([]);
    const [filter, setFilter] = useState<'monthly' | 'yearly'>('monthly');
    const [earningsData, setEarningsData] = useState<[]>([]);

    useEffect(() => {
        if (availability) {
            setAvailabilities(availability);
        }
    }, [availability]);

    useEffect(() => {
        const fetchData = async () => {
            if (!worker?._id) return;
            try {
                const pendings = await fetchRequestedWorks();
                const assigned = await fetchAssignedWorks();
                const earningsDate = await fetchWorkerEarnings(filter);
                setEarningsData(earningsDate.earnings);
                setAssignedWorks(assigned.assignedWorks);
                setJobRequest(pendings.pendingWorks.length);
            } catch (error) {
                console.error("Error fetching workers:", error);
            }
        };

        fetchData();
    }, [filter, worker._id]);

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={worker.profileImage as string}
                            alt="Worker"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <h1 className="text-2xl font-bold  text-gray-800">Hello, {worker?.name}</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                            <p className="text-sm text-green-800">Completed Works</p>
                            <h2 className="text-2xl font-bold text-green-900">{worker.completedWorks}</h2>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                            <p className="text-sm text-green-800">Job Requests</p>
                            <h2 className="text-2xl font-bold text-green-900">{jobRequest}</h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 ">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Assigned Work</h3>
                        <div className="space-y-4 max-h-[365px] overflow-y-auto">
                            {assignedWorks.map((work, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{work.service}</p>
                                        <p className="text-sm text-gray-600">Assigned: {work.sheduleDate} {work.sheduleTime}</p>
                                    </div>
                                    <p className="text-lg font-bold text-green-600">₹{work.wagePerHour}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className=" bg-white rounded-xl shadow-sm border border-gray-200 p-3 grid grid-cols-1 sm:grid-cols-1  gap-4">
                        <div className="bg-green-50 p-10 rounded-lg shadow text-center">
                            <h2 className="text-md text-green-800">Wallet Balance</h2>
                            <h2 className="text-2xl font-bold text-green-900">₹{wallet.balance}</h2>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Calendar availability={availabilities as IAvailability} />
                    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Earnings Over Time</h3>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as "monthly" | "yearly")}
                            className="border border-gray-300 rounded px-2 py-1 my-1 text-sm">
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <EarningsChart filter={filter} rawData={earningsData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
