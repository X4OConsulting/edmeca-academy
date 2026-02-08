"use client";

interface RiskIndicatorProps {
  level: string;
  score: number;
  maxScore: number;
  factors: string[];
}

const levelColors: Record<string, { bg: string; text: string; ring: string; bar: string }> = {
  Low: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", bar: "bg-emerald-500" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", bar: "bg-amber-500" },
  High: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", bar: "bg-orange-500" },
  "Very High": { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", bar: "bg-red-500" },
};

export default function RiskIndicator({ level, score, maxScore, factors }: RiskIndicatorProps) {
  const colors = levelColors[level] || levelColors["Medium"];
  const percentage = (score / maxScore) * 100;

  return (
    <div className={`rounded-xl border p-5 ${colors.bg} ring-1 ${colors.ring}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Risk Assessment</h3>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${colors.text} ${colors.bg}`}>
          {level} Risk
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Risk Score</span>
          <span>{score} / {maxScore}</span>
        </div>
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {factors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Risk Factors:</p>
          <ul className="space-y-1">
            {factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.bar}`} />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {factors.length === 0 && (
        <p className="text-xs text-emerald-600 font-medium">
          No significant risk factors identified. Project metrics are within acceptable ranges.
        </p>
      )}
    </div>
  );
}
