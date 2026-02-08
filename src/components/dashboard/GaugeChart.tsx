"use client";

interface GaugeChartProps {
  value: number;
  min?: number;
  max: number;
  label: string;
  thresholds?: { value: number; color: string; label: string }[];
  formatValue?: (v: number) => string;
}

export default function GaugeChart({
  value,
  min = 0,
  max,
  label,
  thresholds,
  formatValue = (v) => v.toFixed(2),
}: GaugeChartProps) {
  const range = max - min;
  const percentage = Math.min(Math.max(((value - min) / range) * 100, 0), 100);

  let color = "text-blue-600";
  let bgGradient = "from-blue-500 to-blue-600";
  if (thresholds) {
    for (const t of thresholds) {
      if (value >= t.value) {
        color = t.color;
        if (t.color.includes("green") || t.color.includes("emerald")) bgGradient = "from-emerald-500 to-emerald-600";
        else if (t.color.includes("amber") || t.color.includes("yellow")) bgGradient = "from-amber-500 to-amber-600";
        else if (t.color.includes("red")) bgGradient = "from-red-500 to-red-600";
      }
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
      <p className="text-xs font-medium text-gray-500 mb-3">{label}</p>
      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bgGradient} transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={`text-2xl font-bold ${color}`}>{formatValue(value)}</p>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      {thresholds && (
        <div className="flex gap-2 justify-center mt-2 flex-wrap">
          {thresholds.map((t, i) => (
            <span key={i} className={`text-[10px] ${t.color}`}>
              {t.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
