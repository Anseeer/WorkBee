import { useEffect, useState } from 'react';
import { fetchUsers, setIsActiveUsers } from '../../services/adminService';
import type { Iuser } from '../../types/IUser';
import { DataTable, type Column } from '../common/Table';

const UserTable = () => {
    const [users, setUsers] = useState<Iuser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchUsers(currentPage, 6);
            setUsers(res.data.data.users);
            setTotalPages(res.data.data.totalPage);
        };
        fetchData();
    }, [currentPage]);

    const handleToggle = async (id: string) => {
        try {
            await setIsActiveUsers(id);
            setUsers(prev =>
                prev.map(user =>
                    user.id === id ? { ...user, isActive: !user.isActive } : user
                )
            );
            return;
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };

    const columns: Column<Iuser>[] = [
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
                    onClick={() => handleToggle(u.id)}
                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <DataTable
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                itemsPerPage={6}
                data={users}
                columns={columns}
                searchKeys={['name', 'email', 'phone']}
                advancedFilterKeys={['name', 'email', 'phone', 'isActive', 'location']}
            />
        </div>
    );
};

export default UserTable;
