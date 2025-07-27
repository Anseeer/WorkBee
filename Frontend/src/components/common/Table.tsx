// import React, { useState, useMemo, useEffect } from 'react';
// import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
// import { fetchUsers, setIsActive } from '../../services/adminService';
// import { toast } from 'react-toastify';
// import type { Iuser } from '../../types/IUser';

// const Table: React.FC = () => {
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [users, setUsers] = useState<Iuser[]>([]);

//     const itemsPerPage = 5;

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetchUsers();
//                 setUsers(res.data.data);
//             } catch (err: unknown) {
//                 toast.error("Failed to fetch users");
//                 console.log(err)
//             }
//         };
//         fetchData();
//     }, [])

//     const filteredUsers = useMemo(() => {
//         return users.filter(user =>
//             user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.phone.includes(searchTerm) ||
//             user.location.address.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [users, searchTerm]);

//     const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentUsers = filteredUsers.slice(startIndex, endIndex);

//     const handleToggle = async (id: string) => {
//         try {
//             await setIsActive(id);
//             const updatedUsers = users.map(user =>
//                 user.id === id ? { ...user, isActive: !user.isActive } : user
//             );
//             setUsers(updatedUsers);
//         } catch (error: unknown) {
//             toast.error("Failed to toggle");
//             console.log(error)
//         }
//     };

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     const ToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => (
//         <div
//             className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${isActive ? 'bg-green-500' : 'bg-red-500'
//                 }`}
//             onClick={onToggle}
//         >
//             <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//             />
//         </div>
//     );

//     return (
//         <div className="w-full max-w-7xl mx-auto p-5">
//             <div className='border-2 m-5  border-green-700 rounded p-5 '>

//                 {/* Search Bar */}
//                 <div className="mb-4">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                         <input
//                             type="text"
//                             placeholder="search by name, email, phone, location, category"
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-hidden rounded-lg border border-gray-200">
//                     <table className="w-full">
//                         <thead className="bg-[#8FC39D]">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Id</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Name</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Email</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Phone</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Location</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">isActive</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {currentUsers.map((user, index) => (
//                                 <tr key={`${user.id}-${index}`} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id.slice(0, 10)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.location.address.split(" ").slice(0, 3).join(" ")}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <ToggleSwitch
//                                             isActive={user.isActive}
//                                             onToggle={() => handleToggle(user.id)}
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="mt-4 flex items-center justify-between">
//                     <div className="text-sm text-gray-700">
//                         Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <button
//                             onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//                             disabled={currentPage === 1}
//                             className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             <ChevronLeft className="h-4 w-4" />
//                         </button>

//                         {[1, 2, 3, 4].map((page) => (
//                             <button
//                                 key={page}
//                                 onClick={() => handlePageChange(page)}
//                                 className={`px-3 py-2 rounded-md border text-sm ${currentPage === page
//                                     ? 'bg-green-700 text-white border-black-700'
//                                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                                     } ${page > totalPages ? 'hidden' : ''}`}
//                             >
//                                 {page === 2 && totalPages > 4 ? '...' : page}
//                             </button>
//                         ))}

//                         <button
//                             onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
//                             disabled={currentPage === totalPages}
//                             className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             <ChevronRight className="h-4 w-4" />
//                         </button>
//                     </div>
//                 </div>

//             </div>

//         </div>
//     );
// };

// export default Table;

// components/DataTable.tsx

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';


export interface Column<T> {
    key: keyof T;
    label: string;
    render?: (item: T) => React.ReactNode;
}


interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKeys?: (keyof T)[];
    itemsPerPage?: number;
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    searchKeys = [],
    itemsPerPage = 5,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            searchKeys.some((key) =>
                String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm, searchKeys]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    return (
        <div className="w-full max-w-7xl mx-auto p-2">

            <div className="border-2 m-5  border-green-700 rounded-2xl p-5 ">
                {/* Search */}
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-[#8FC39D]">
                            <tr>
                                {columns.map((col) => (
                                    <th key={String(col.key)} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, i) => (
                                <tr key={item.id + '-' + i} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {col.render ? col.render(item) : String(item[col.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 rounded-md border text-sm ${currentPage === i + 1
                                    ? 'bg-green-700 text-white'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

