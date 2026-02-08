"use client";

interface DataTableProps {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
  highlightLast?: boolean;
  compact?: boolean;
}

export default function DataTable({
  title,
  headers,
  rows,
  highlightLast = false,
  compact = false,
}: DataTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`${compact ? "px-3 py-2" : "px-5 py-3"} text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    i > 0 ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isLast = i === rows.length - 1;
              return (
                <tr
                  key={i}
                  className={`border-b border-gray-50 ${
                    highlightLast && isLast
                      ? "bg-blue-50 font-semibold"
                      : i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/50"
                  }`}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`${compact ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm"} text-gray-700 ${
                        j > 0 ? "text-right font-mono" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
