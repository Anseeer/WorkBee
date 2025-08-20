import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../common/Table';
import type { IWork } from '../../types/IWork';
import { fetchWorks } from '../../services/adminService';
import { StatusBadge } from '../../utilities/StatusBadge';

const WorksTable = () => {
    const [works, setWorks] = useState<IWork[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWorks();
            setWorks(res.data.data);
        };
        fetchData();
    }, []);

    const columns: Column<IWork>[] = [
        { key: '_id', label: 'ID', render: (u) => '#' + u?._id?.slice(0, 5).toUpperCase() },
        { key: 'service', label: 'Work', render: (u) => u.service.split(' ').slice(0, 3).join(' ') },
        { key: 'userName', label: 'User' },
        { key: 'workerName', label: 'Worker' },
        { key: 'status', label: 'Status', render: (u) => <StatusBadge status={u.status} /> },
        { key: 'paymentStatus', label: 'Payment', render: (u) => <StatusBadge status={u.paymentStatus} /> },
        { key: 'wage', label: 'wage',render: (u) => '₹'+ u.wage },
        {
            key: 'location',
            label: 'Location',
            render: (u) => u.location.address.split(' ').slice(0, 3).join(' ')
        },
        { key: 'sheduleDate', label: 'Date' },


    ];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <DataTable
                data={works}
                columns={columns}
                searchKeys={['service', 'workerName', 'userName', 'location']}
            />
        </div>
    );
};

export default WorksTable;
