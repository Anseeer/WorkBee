/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { IWorker } from '../../types/IWorker';
import type { IWork } from '../../types/IWork';
import { fetchAssignedWorks, fetchRequestedWorks, fetchWorkerEarnings } from '../../services/workerService';
import { Calendar } from '../../utilities/Calendar';
import type { IAvailability } from '../../types/IAvailability';
import EarningsChart from './Earnings';
import type { IWallet } from '../../types/IWallet';

interface props {
    worker: IWorker;
    availability: IAvailability;
    wallet: IWallet;
}

type Filter = "monthly" | "yearly";

const WorkerDashboard = ({ worker, availability, wallet }: props) => {

    const [workerId, setWorkerId] = useState('');
    const [assignedworks, setAssignedWorks] = useState<IWork[]>([]);
    const [requestedWorks, setRequestedWorks] = useState<IWork[]>([]);
    const [filter, setFilter] = useState<Filter>("monthly");
    const [earnings, setEarnings] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setWorkerId(worker?.id);
            const assigned = await fetchAssignedWorks(workerId as string);
            const requested = await fetchRequestedWorks(workerId as string);
            const earningsRes = await fetchWorkerEarnings(workerId as string, filter as string);
            setEarnings(earningsRes.earnings);
            setAssignedWorks(assigned.assignedWorks)
            setRequestedWorks(requested.requestedWorks)
        }
        fetchData();
    }, [filter, worker?.id, workerId])


    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={worker.profileImage as string}
                            alt="Worker"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <h1 className="text-2xl font-bold text-gray-800">Hello, {worker.name}</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                            <p className="text-sm text-green-800">Completed Works</p>
                            <h2 className="text-2xl font-bold text-green-900">{worker.completedWorks}</h2>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                            <p className="text-sm text-green-800">Job Requests</p>
                            <h2 className="text-2xl font-bold text-green-900">{requestedWorks.length}</h2>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Assigned Work</h3>
                        <div className="space-y-4 max-h-[360px] overflow-y-auto">
                            {assignedworks.map((work, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{work.service}</p>
                                        <p className="text-sm text-gray-600">Assigned: {work.sheduleDate} {work.sheduleTime}</p>
                                    </div>
                                    <p className="text-lg font-bold text-green-600">₹{work.wage}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="grid grid-cols-1 border border-gray-200 p-3 bg-white sm:grid-cols-1 gap-4">
                        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                            <p className="text-lg text-green-800">Wallet balance</p>
                            <h2 className="text-2xl font-bold text-green-900">₹{wallet.balance}</h2>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Calendar availability={availability} />
                    <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-6">
                        {/* Filter buttons */}
                        <div className="flex space-x-3">
                            <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                                Filter:
                            </label>
                            <select
                                id="filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as Filter)}
                                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                        {/* Chart */}
                        <EarningsChart filter={filter} rawData={earnings} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;