"use client";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  maxValue?: number;
  formatValue?: (v: number) => string;
  horizontal?: boolean;
}

const defaultColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-pink-500",
];

export default function BarChart({
  data,
  title,
  maxValue,
  formatValue = (v) => v.toLocaleString(),
  horizontal = true,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => Math.abs(d.value)));

  if (horizontal) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        {title && <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>}
        <div className="space-y-3">
          {data.map((item, i) => {
            const width = max > 0 ? (Math.abs(item.value) / max) * 100 : 0;
            const isNegative = item.value < 0;
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium truncate mr-2">{item.label}</span>
                  <span className={`font-semibold ${isNegative ? "text-red-600" : "text-gray-800"}`}>
                    {formatValue(item.value)}
                  </span>
                </div>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNegative ? "bg-red-400" : item.color || defaultColors[i % defaultColors.length]
                    }`}
                    style={{ width: `${Math.min(width, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical bar chart
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>}
      <div className="flex items-end gap-2 h-48">
        {data.map((item, i) => {
          const height = max > 0 ? (Math.abs(item.value) / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-600 font-medium">
                {formatValue(item.value)}
              </span>
              <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: "100%" }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-md transition-all duration-500 ${
                    item.value < 0 ? "bg-red-400" : item.color || defaultColors[i % defaultColors.length]
                  }`}
                  style={{ height: `${Math.min(height, 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-500 text-center leading-tight mt-1 truncate w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
