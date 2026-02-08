"use client";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "amber" | "red" | "purple" | "slate";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  green: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  red: "from-red-500 to-red-600",
  purple: "from-purple-500 to-purple-600",
  slate: "from-slate-500 to-slate-600",
};

const bgColorMap = {
  blue: "bg-blue-50 border-blue-200",
  green: "bg-emerald-50 border-emerald-200",
  amber: "bg-amber-50 border-amber-200",
  red: "bg-red-50 border-red-200",
  purple: "bg-purple-50 border-purple-200",
  slate: "bg-slate-50 border-slate-200",
};

export default function MetricCard({
  label,
  value,
  subtitle,
  trend,
  color = "blue",
  size = "md",
}: MetricCardProps) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className={`rounded-xl border p-4 ${bgColorMap[color]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {trend && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              trend === "up"
                ? "bg-emerald-100 text-emerald-700"
                : trend === "down"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "–"}
          </span>
        )}
      </div>
      <p className={`${textSize} font-bold mt-1 bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
