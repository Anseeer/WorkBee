import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../common/Table';
import type { IWork } from '../../types/IWork';
import { fetchWorks } from '../../services/adminService';
import { StatusBadge } from '../../utilities/StatusBadge';

const WorksTable = () => {
    const [works, setWorks] = useState<(IWork & { id: string })[]>([]);
    const [selectedWork, setSelectedWork] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWorks(currentPage, 5);
            const mappedWorks = res.data.data.paginatedWorks.map((work: IWork) => ({
                ...work,
                id: work._id || '',
            }));

            setWorks(mappedWorks);
            setTotalPage(res.data.data.totalPage);
        };
        fetchData();
    }, [currentPage]);

    const HandleSelectedWork = ()=>{
        setSelectedWork(true);
        console.log(selectedWork)
    }

    const columns: Column<IWork>[] = [
        { key: 'service', label: 'Work', render: (u) => u.service.split(' ').slice(0, 3).join(' ') },
        { key: 'userName', label: 'User' },
        { key: 'workerName', label: 'Worker' },
        { key: 'status', label: 'Status', render: (u) => <StatusBadge status={u.status} /> },
        { key: 'paymentStatus', label: 'Payment', render: (u) => <StatusBadge status={u.paymentStatus} /> },
        { key: 'wage', label: 'wage', render: (u) => '₹' + u.wage },
        { key: 'platformFee', label: 'Fee', render: (u) => <span className="text-green-700 font-semibold">₹{u.platformFee}</span> },
        {
            key: 'location',
            label: 'Location',
            render: (u) => u.location.address.split(' ').slice(0, 3).join(' ')
        },
        { key: 'sheduleDate', label: 'Date' },
        {
            key: 'id',
            label: 'Info',
            render: () => (
                <button
                    onClick={() => HandleSelectedWork()}
                    className="px-2 py-1 bg-green-700 text-white text-xs rounded hover:bg-green-800 transition"
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
            />
        </div>
    );
};

export default WorksTable;
