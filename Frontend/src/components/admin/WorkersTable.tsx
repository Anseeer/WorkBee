import { useEffect, useState } from 'react';
import { fetchAvailability, fetchWorkers, setIsActiveWorkers } from '../../services/adminService';
import { DataTable, type Column } from '../common/Table';
import type { IWorker } from '../../types/IWorker';
import { useWorkerDetails } from '../context/WorkerDetailContext';
import type { IAvailability } from '../../types/IAvailability';
import ConfirmModal from '../common/ConfirmToogle';

const WorkersTable = () => {
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const { setSelectedDetails } = useWorkerDetails()
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<"toggle" | "delete" | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const openConfirm = (id: string, type: "toggle" | "delete") => {
        setSelectedId(id);
        setConfirmType(type);
        setConfirmOpen(true);
    };

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
            const res = await fetchWorkers(currentPage, 6);
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
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'location',
            label: 'Location',
            render: (u) => u.location.address.split(' ').slice(0, 3).join(' ')
        },
        {
            key: "isActive",
            label: "Active",
            render: (u) => (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        openConfirm(u.id, "toggle")
                    }}

                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center 
                ${u.isActive ? "bg-green-500" : "bg-red-500"}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform 
                    ${u.isActive ? "translate-x-6" : "translate-x-1"}`}
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
                itemsPerPage={6}
                columns={columns}
                searchKeys={['name', 'email', 'phone']}
                advancedFilterKeys={['name', 'email', 'phone', 'location', 'isActive']}
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
            {confirmOpen && (
                <ConfirmModal
                    title={
                        confirmType === "delete"
                            ? "Delete Worker?"
                            : "Confirm Status Change"
                    }
                    message={
                        confirmType === "delete"
                            ? "This action cannot be undone. Are you sure?"
                            : "Do you want to update the status?"
                    }
                    confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        if (selectedId) {
                            if (confirmType === "toggle") handleToggle(selectedId);
                        }
                        setConfirmOpen(false);
                    }}
                />
            )}

        </div>
    );
};

export default WorkersTable;
