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
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    searchKeys = [],
    itemsPerPage = 5,
    onRowClick,
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

            <div className="border-2 border-green-700 rounded-2xl m-5  p-5 ">
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
                                <tr onClick={() => onRowClick?.(item)} key={item.id + '-' + i} className="hover:bg-gray-50">
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

