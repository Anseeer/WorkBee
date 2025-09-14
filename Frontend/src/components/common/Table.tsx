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
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages?: number | undefined;
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
    data,
    currentPage,
    setCurrentPage,
    columns,
    totalPages,
    searchKeys = [],
    onRowClick,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');


    const filteredData = useMemo(() => {
        return data.filter((item) =>
            searchKeys.some((key) =>
                String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm, searchKeys]);


    return (
        <div className="w-full max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90vw] mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
            {/* Responsive container width and padding */}
            <div className="border-2 border-green-700 rounded-2xl m-2 sm:m-4 md:m-5 p-3 sm:p-4 md:p-5">
                {/* Responsive margin and padding */}
                <div className="mb-2 sm:mb-3 md:mb-4 relative">
                    {/* Responsive margin */}
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                    {/* Responsive search icon size and positioning */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 md:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 text-xs sm:text-sm md:text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Responsive input padding, font size, and height */}
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-[#8FC39D]">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className="px-2 sm:px-4 md:px-6 py-1 sm:py-2 text-left text-xs sm:text-sm md:text-base font-medium text-gray-900"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                {/* Responsive header cell padding and font size */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, i) => (
                                    <tr
                                        onClick={() => onRowClick?.(item)}
                                        key={item.id + '-' + i}
                                        className="hover:bg-gray-50"
                                    >
                                        {columns.map((col, index) => (
                                            <td
                                                key={String(col.key)}
                                                className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base text-gray-900 break-words ${index >= 3 ? 'hidden sm:table-cell' : ''}`}
                                            >
                                                {col.render ? col.render(item) : String(item[col.key])}
                                            </td>
                                        ))}
                                        {/* Responsive cell padding, font size, text wrapping, and conditional column visibility */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 text-center text-gray-500"
                                    >
                                        {/* Responsive padding */}
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-gray-300 mb-2 sm:mb-3 md:mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {/* Responsive icon size and margin */}
                                            <span className="text-base sm:text-lg md:text-xl font-medium">No data found</span>
                                            {/* Responsive text size */}
                                            <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-1 sm:mt-2">There are currently no records to display.</p>
                                            {/* Responsive text size and margin */}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-2 sm:mt-3 md:mt-4 flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                    {/* Responsive margin, layout, and spacing */}
                    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                        {/* Responsive spacing */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 sm:p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5" />
                            {/* Responsive icon size */}
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 rounded-md border text-xs sm:text-sm md:text-base ${currentPage === i + 1
                                    ? 'bg-green-700 text-white'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        {/* Responsive button padding and font size */}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages as number, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 sm:p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5" />
                            {/* Responsive icon size */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

