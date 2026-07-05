import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function DataTable({
  columns,
  data,
  loading,
  searchable,
  onSearch,
  pagination,
  onPageChange,
}) {
  const [localSearch, setLocalSearch] = useState("");

  const handleSearch = (val) => {
    setLocalSearch(val);
    onSearch?.(val);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded mb-3 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row._id || i} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
