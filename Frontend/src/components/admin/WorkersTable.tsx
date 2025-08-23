import { useEffect, useState } from 'react';
import { fetchAvailability, fetchWorkers, setIsActiveWorkers } from '../../services/adminService';
import { DataTable, type Column } from '../common/Table';
import type { IWorker } from '../../types/IWorker';
import { useWorkerDetails } from '../context/WorkerDetailContext';
import type { IAvailability } from '../../types/IAvailability';

const WorkersTable = () => {
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPage,setTotalPage] = useState(0);
    const { setSelectedDetails } = useWorkerDetails()

    const FetchAvailability = async (id: string): Promise<IAvailability> => {
        try {
            const response = await fetchAvailability(id);
            return response.data.data as IAvailability;
        } catch (error) {
            console.error("Failed to fetch availability:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWorkers(currentPage,5);
            setWorkers(res.data.data.workers);
            setTotalPage(res.data.data.totalPage);

        };
        fetchData();
    }, [currentPage]);

    const handleToggle = async (id: string) => {
        try {
            await setIsActiveWorkers(id);
            setWorkers(prev =>
                prev.map(worker =>
                    worker.id === id ? { ...worker, isActive: !worker.isActive } : worker
                )
            );
            return;
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };



    const columns: Column<IWorker>[] = [
        { key: 'id', label: 'ID', render: (u) => u.id.slice(0, 10) },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'location',
            label: 'Location',
            render: (u) => u.location.address.split(' ').slice(0, 3).join(' ')
        },
        {
            key: 'isActive',
            label: 'Active',
            render: (u) => (
                <div

                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(u.id);
                    }}
                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </div >
            )
        }
    ];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <DataTable<IWorker>
                data={workers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPage}
                columns={columns}
                searchKeys={['name', 'email', 'phone']}
                onRowClick={async (worker) => {
                    try {
                        const availabilityData = await FetchAvailability(worker.id);
                        setSelectedDetails({
                            worker,
                            availability: availabilityData,
                            error: null,
                            wallet: null
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }}



            />
        </div>
    );
};

export default WorkersTable;
