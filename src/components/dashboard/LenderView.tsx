"use client";

import { DashboardData } from "@/types/dashboard";
import { formatCurrency, formatPercent, formatRatio } from "@/lib/format";
import MetricCard from "./MetricCard";
import BarChart from "./BarChart";
import GaugeChart from "./GaugeChart";
import DataTable from "./DataTable";
import RiskIndicator from "./RiskIndicator";

interface LenderViewProps {
  data: DashboardData;
}

export default function LenderView({ data }: LenderViewProps) {
  const { debt_metrics, returns, equity, risk_assessment, cashflow, sensitivity } = data;

  // DSCR chart data
  const dscrData = debt_metrics.dscr_values.map((v, i) => ({
    label: cashflow.periods[i + (cashflow.periods.length - debt_metrics.dscr_values.length)] || `Period ${i + 1}`,
    value: v,
    color: v >= 1.3 ? "bg-emerald-500" : v >= 1.1 ? "bg-amber-500" : "bg-red-500",
  }));

  // Cash flow for lender review
  const cashflowRows: (string | number)[][] = [];
  const maxPeriods = Math.min(cashflow.periods.length, 12);
  for (let i = 0; i < maxPeriods; i++) {
    cashflowRows.push([
      cashflow.periods[i],
      formatCurrency(cashflow.revenue[i] || 0, true),
      formatCurrency(cashflow.net_operating_income[i] || 0, true),
      formatCurrency(cashflow.debt_service[i] || 0, true),
      formatCurrency(cashflow.cash_after_debt[i] || 0, true),
    ]);
  }

  // Sensitivity scenarios
  const sensitivityRows = sensitivity.scenarios.map((s) => [
    s.name as string,
    typeof s.irr === "number" ? formatPercent(s.irr * 100) : "N/A",
    typeof s.dscr_min === "number" ? formatRatio(s.dscr_min) : "N/A",
    typeof s.ltv === "number" ? formatPercent(s.ltv * 100) : "N/A",
  ]);

  // Debt drawdown vs repayment schedule
  const scheduleData: { label: string; value: number; color?: string }[] = [];
  const drawdownLen = debt_metrics.debt_drawdown_schedule.length;
  const repayLen = debt_metrics.repayment_schedule.length;
  const maxLen = Math.max(drawdownLen, repayLen);
  for (let i = 0; i < maxLen; i++) {
    const draw = debt_metrics.debt_drawdown_schedule[i] || 0;
    const repay = debt_metrics.repayment_schedule[i] || 0;
    const period = cashflow.periods[i] || `Period ${i + 1}`;
    if (draw > 0) {
      scheduleData.push({ label: `${period} (Draw)`, value: draw, color: "bg-blue-400" });
    }
    if (repay > 0) {
      scheduleData.push({ label: `${period} (Repay)`, value: repay, color: "bg-emerald-400" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Lender Header */}
      <div className="rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <h2 className="text-xl font-bold">Lender Dashboard</h2>
        <p className="text-slate-300 text-sm mt-1">
          Debt coverage analysis, risk metrics, and loan security indicators
        </p>
      </div>

      {/* Critical Lender Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Loan-to-Value (LTV)"
          value={debt_metrics.ltv_ratio > 0 ? formatPercent(debt_metrics.ltv_ratio) : "N/A"}
          subtitle="Target: < 65%"
          color={debt_metrics.ltv_ratio <= 65 ? "green" : debt_metrics.ltv_ratio <= 75 ? "amber" : "red"}
        />
        <MetricCard
          label="Loan-to-Cost (LTC)"
          value={debt_metrics.ltc_ratio > 0 ? formatPercent(debt_metrics.ltc_ratio) : "N/A"}
          subtitle="Target: < 70%"
          color={debt_metrics.ltc_ratio <= 70 ? "green" : debt_metrics.ltc_ratio <= 80 ? "amber" : "red"}
        />
        <MetricCard
          label="DSCR (Minimum)"
          value={debt_metrics.dscr_min > 0 ? formatRatio(debt_metrics.dscr_min) : "N/A"}
          subtitle="Covenant: >= 1.20x"
          color={debt_metrics.dscr_min >= 1.2 ? "green" : debt_metrics.dscr_min >= 1.0 ? "amber" : "red"}
        />
        <MetricCard
          label="Interest Coverage"
          value={debt_metrics.icr > 0 ? formatRatio(debt_metrics.icr) : "N/A"}
          subtitle="Target: > 2.0x"
          color={debt_metrics.icr >= 2.0 ? "green" : debt_metrics.icr >= 1.5 ? "amber" : "red"}
        />
      </div>

      {/* Debt Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard
          label="Senior Debt"
          value={formatCurrency(debt_metrics.senior_debt, true)}
          subtitle={`Interest: ${debt_metrics.interest_rate > 0 ? formatPercent(debt_metrics.interest_rate) : "N/A"}`}
          color="blue"
        />
        <MetricCard
          label="Mezzanine Debt"
          value={formatCurrency(debt_metrics.mezzanine_debt, true)}
          color="amber"
        />
        <MetricCard
          label="Total Debt"
          value={formatCurrency(debt_metrics.total_debt, true)}
          subtitle={`Peak: ${formatCurrency(debt_metrics.peak_debt, true)}`}
          color="slate"
        />
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GaugeChart
          value={debt_metrics.ltv_ratio}
          max={100}
          label="LTV Ratio (%)"
          formatValue={(v) => formatPercent(v)}
          thresholds={[
            { value: 0, color: "text-emerald-600", label: "<60% Low" },
            { value: 60, color: "text-amber-600", label: "60-75% Med" },
            { value: 75, color: "text-red-600", label: ">75% High" },
          ]}
        />
        <GaugeChart
          value={debt_metrics.dscr_min}
          max={3}
          label="DSCR (Min)"
          formatValue={(v) => formatRatio(v)}
          thresholds={[
            { value: 0, color: "text-red-600", label: "<1.1x Weak" },
            { value: 1.1, color: "text-amber-600", label: "1.1-1.3x OK" },
            { value: 1.3, color: "text-emerald-600", label: ">1.3x Strong" },
          ]}
        />
        <GaugeChart
          value={debt_metrics.debt_yield}
          max={15}
          label="Debt Yield (%)"
          formatValue={(v) => formatPercent(v)}
          thresholds={[
            { value: 0, color: "text-red-600", label: "<7% Low" },
            { value: 7, color: "text-amber-600", label: "7-10% OK" },
            { value: 10, color: "text-emerald-600", label: ">10% Strong" },
          ]}
        />
        <GaugeChart
          value={equity.debt_equity_ratio}
          max={5}
          label="Debt/Equity Ratio"
          formatValue={(v) => formatRatio(v)}
          thresholds={[
            { value: 0, color: "text-emerald-600", label: "<2x Low" },
            { value: 2, color: "text-amber-600", label: "2-3x Med" },
            { value: 3, color: "text-red-600", label: ">3x High" },
          ]}
        />
      </div>

      {/* Security & Coverage */}
      <div className="grid md:grid-cols-2 gap-4">
        <RiskIndicator
          level={risk_assessment.level}
          score={risk_assessment.score}
          maxScore={risk_assessment.max_score}
          factors={risk_assessment.factors}
        />

        {/* Loan Security Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Loan Security Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Project Value</span>
              <span className="text-sm font-semibold">{formatCurrency(returns.total_revenue, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Debt Exposure</span>
              <span className="text-sm font-semibold">{formatCurrency(debt_metrics.total_debt, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Equity Buffer</span>
              <span className="text-sm font-semibold text-emerald-600">{formatCurrency(equity.total_equity, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Development Profit Coverage</span>
              <span className="text-sm font-semibold">{formatCurrency(returns.development_profit, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Residual Value</span>
              <span className="text-sm font-semibold">{formatCurrency(returns.residual_value, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Loan Term</span>
              <span className="text-sm font-semibold">{debt_metrics.loan_term_months} months</span>
            </div>
          </div>
        </div>
      </div>

      {/* DSCR Trend */}
      {dscrData.length > 0 && (
        <BarChart
          data={dscrData}
          title="DSCR Over Time (Debt Service Coverage Ratio)"
          formatValue={(v) => formatRatio(v)}
          horizontal={false}
          maxValue={Math.max(...dscrData.map((d) => d.value), 2.5)}
        />
      )}

      {/* Cash Flow Table */}
      {cashflowRows.length > 0 && (
        <DataTable
          title="Cash Flow Summary (Lender View)"
          headers={["Period", "Revenue", "NOI", "Debt Service", "Cash After Debt"]}
          rows={cashflowRows}
        />
      )}

      {/* Sensitivity Analysis */}
      {sensitivityRows.length > 0 && (
        <DataTable
          title="Sensitivity Analysis - Stress Testing"
          headers={["Scenario", "IRR", "DSCR (Min)", "LTV"]}
          rows={sensitivityRows}
          highlightLast
        />
      )}

      {/* Debt Schedule */}
      {scheduleData.length > 0 && (
        <BarChart
          data={scheduleData}
          title="Debt Drawdown & Repayment Schedule"
          formatValue={(v) => formatCurrency(v, true)}
        />
      )}
    </div>
  );
}
