import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";

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
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages?: number;
    onRowClick?: (item: T) => void;
    advancedFilterKeys?: (keyof T)[];
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    currentPage,
    setCurrentPage,
    totalPages = 1,
    searchKeys = [],
    onRowClick,
    advancedFilterKeys,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showSortOptions, setShowSortOptions] = useState(false);

    // 🔍 Basic search
    const searchedData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((item) =>
            searchKeys.some((key) =>
                String(item[key] ?? "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm, searchKeys]);

    const sortedData = useMemo(() => {
        if (!sortKey) return searchedData;
        const sorted = [...searchedData].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === "number" && typeof valB === "number") {
                return sortOrder === "asc" ? valA - valB : valB - valA;
            }
            return sortOrder === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
        return sorted;
    }, [searchedData, sortKey, sortOrder]);

    return (
        <div className="w-full max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto p-2 sm:p-4">
            <div className="border-2 border-green-700 rounded-2xl m-5 p-4">
                {/* 🔍 Search + Advanced Sort */}
                <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-700 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* ⚙️ Sort Dropdown (only if advancedFilterKeys provided) */}
                    {advancedFilterKeys && advancedFilterKeys.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowSortOptions((prev) => !prev)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50"
                            >
                                <ArrowUpDown className="h-4 w-4 text-gray-600" />
                                Sort
                            </button>

                            {showSortOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <div className="p-2 border-b border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Sort by</p>
                                        {advancedFilterKeys.map((key) => (
                                            <button
                                                key={String(key)}
                                                onClick={() => {
                                                    setSortKey(key);
                                                    setShowSortOptions(false);
                                                }}
                                                className={`block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 ${sortKey === key ? "bg-green-50 text-green-700" : ""
                                                    }`}
                                            >
                                                {String(key).charAt(0).toUpperCase() +
                                                    String(key).slice(1)}
                                            </button>
                                        ))}
                                    </div>

                                    {sortKey && (
                                        <div className="p-2">
                                            <p className="text-xs text-gray-500 mb-1">Order</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSortOrder("asc")}
                                                    className={`flex-1 px-3 py-1.5 text-sm rounded-md border ${sortOrder === "asc"
                                                        ? "bg-green-600 text-white border-green-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    Asc
                                                </button>
                                                <button
                                                    onClick={() => setSortOrder("desc")}
                                                    className={`flex-1 px-3 py-1.5 text-sm rounded-md border ${sortOrder === "desc"
                                                        ? "bg-green-600 text-white border-green-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    Desc
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 🧾 Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-[#8FC39D]">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className="px-4 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item, i) => (
                                    <tr
                                        onClick={() => onRowClick?.(item)}
                                        key={item.id + "-" + i}
                                        className="hover:bg-gray-50 cursor-pointer"
                                    >
                                        {columns.map((col, index) => (
                                            <td
                                                key={String(col.key)}
                                                className={`px-4 py-2 text-sm text-gray-800 break-words ${index >= 3 ? "hidden sm:table-cell" : ""
                                                    }`}
                                            >
                                                {col.render ? col.render(item) : String(item[col.key] ?? "")}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 📄 Pagination */}
                <div className="mt-4 flex items-center justify-center sm:justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1.5 rounded-md text-sm border ${currentPage === i + 1
                                    ? "bg-green-700 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
