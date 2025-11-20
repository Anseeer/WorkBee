import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../common/Table';
import type { IWork } from '../../types/IWork';
import { fetchWorks } from '../../services/adminService';
import { StatusBadge } from '../../utilities/StatusBadge';
import WorkInfoModal from '../common/WorkInfo';
import { formatId } from '../../utilities/RwapId';

const WorksTable = () => {
    const [works, setWorks] = useState<(IWork & { id: string })[]>([]);
    const [selectedWork, setSelectedWork] = useState<boolean | string>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWorks(currentPage, 6);
            const mappedWorks = res.data.data.paginatedWorks
                .filter((work: IWork) => work.status !== "Pending")
                .map((work: IWork) => ({
                    ...work,
                    id: work._id || '',
                }));

            setWorks(mappedWorks);
            setTotalPage(res.data.data.totalPage);
        };

        fetchData();
    }, [currentPage]);

    const HandleSelectedWork = (id: string) => {
        setSelectedWork(id);
    }

    const closeWorkInfo = () => {
        setSelectedWork(false);
    }

    const columns: Column<IWork>[] = [
        { key: 'id', label: 'ID', render: (u) => formatId("WORK", u?._id as string) },
        { key: 'service', label: 'WORK', render: (u) => u.service.split(' ').slice(0, 3).join(' ') },
        { key: 'userName', label: 'CUSTOMER' },
        { key: 'workerName', label: 'WORKER' },
        { key: 'status', label: 'STATUS', render: (u) => <StatusBadge status={u.status} /> },
        { key: 'platformFee', label: 'FEE', render: (u) => <span className="text-green-700 font-semibold">₹{u.platformFee}</span> },
        { key: 'commission', label: 'COMMISSION', render: (u) => <span className="text-green-700 font-semibold">₹{u.commission || 0}</span> },
        { key: 'sheduleDate', label: 'DATE' },
        {
            key: 'id',
            label: 'INFO',
            render: (u) => (
                <button
                    onClick={() => HandleSelectedWork(u.id as string)}
                    className="px-2 py-1 bg-green-800 text-white text-xs rounded hover:bg-green-600 transition"
                >
                    Work Info
                </button>
            ),
        },
    ];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <DataTable
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPage}
                data={works}
                columns={columns}
                searchKeys={['service', 'workerName', 'userName', 'location']}
                advancedFilterKeys={['service', 'workerName', 'userName', 'status', 'commission', 'platformFee', 'sheduleDate']}
            />

            {selectedWork && <WorkInfoModal closeModal={closeWorkInfo} workId={selectedWork as string} />}
        </div>
    );
};

export default WorksTable;
