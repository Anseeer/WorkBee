import { useEffect, useState } from 'react';
import { fetchUsers, setIsActiveUsers } from '../../services/adminService';
import type { Iuser } from '../../types/IUser';
import { DataTable, type Column } from '../common/Table';
import ConfirmModal from '../common/ConfirmToogle.tsx';
import { formatId } from '../../utilities/RwapId.ts';

const UserTable = () => {
    const [users, setUsers] = useState<Iuser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<"toggle" | "delete" | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const openConfirm = (id: string, type: "toggle" | "delete") => {
        setSelectedId(id);
        setConfirmType(type);
        setConfirmOpen(true);
    };

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
        { key: 'id', label: 'ID', render: (u) => formatId("USER", u.id) },
        { key: 'name', label: 'NAME' },
        { key: 'email', label: 'EMAIL' },
        { key: 'phone', label: 'PHONE' },
        {
            key: 'location',
            label: 'LOCATION',
            render: (u) => u.location.address.split(' ').slice(0, 3).join(' ')
        },
        {
            key: "isActive",
            label: "ACTIVE",
            render: (u) => (
                <div
                    onClick={() => openConfirm(u.id, "toggle")}
                    className={`cursor-pointer w-11 h-6 rounded-full flex items-center 
                ${u.isActive ? "bg-green-500" : "bg-red-500"}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform 
                    ${u.isActive ? "translate-x-6" : "translate-x-1"}`}
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
            {confirmOpen && (
                <ConfirmModal
                    title={
                        confirmType === "delete"
                            ? "Delete User?"
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

export default UserTable;
