"use client";

import { DashboardData } from "@/types/dashboard";
import { formatCurrency, formatPercent, formatRatio } from "@/lib/format";
import MetricCard from "./MetricCard";
import BarChart from "./BarChart";
import DataTable from "./DataTable";

interface FunderViewProps {
  data: DashboardData;
}

export default function FunderView({ data }: FunderViewProps) {
  const { returns, equity, sources_and_uses, cashflow, sensitivity, debt_metrics } = data;

  // Sources breakdown
  const sourcesData = sources_and_uses.sources.map((s) => ({
    label: s.name,
    value: s.amount,
  }));

  // Uses breakdown
  const usesData = sources_and_uses.uses.map((u) => ({
    label: u.name,
    value: u.amount,
  }));

  // Cash flow chart (revenue vs costs)
  const cfData = cashflow.periods.map((p, i) => ({
    label: p,
    value: cashflow.net_operating_income[i] || 0,
    color: (cashflow.net_operating_income[i] || 0) >= 0 ? "bg-emerald-500" : "bg-red-400",
  }));

  // Cumulative cash flow
  const cumulativeData = cashflow.periods.map((p, i) => ({
    label: p,
    value: cashflow.cumulative_cashflow[i] || 0,
    color: (cashflow.cumulative_cashflow[i] || 0) >= 0 ? "bg-blue-500" : "bg-red-400",
  }));

  // Sensitivity table for investors
  const sensitivityRows = sensitivity.scenarios.map((s) => [
    s.name as string,
    typeof s.irr === "number" ? formatPercent(s.irr * 100) : "N/A",
    typeof s.npv === "number" ? formatCurrency(s.npv as number, true) : "N/A",
    typeof s.profit_margin === "number" ? formatPercent((s.profit_margin as number) * 100) : "N/A",
  ]);

  // Sources & Uses Table
  const sourcesRows = sources_and_uses.sources.map((s) => [
    s.name,
    formatCurrency(s.amount, true),
    s.percentage > 0 ? formatPercent(s.percentage * 100) : "—",
  ]);
  const usesRows = sources_and_uses.uses.map((u) => [
    u.name,
    formatCurrency(u.amount, true),
    u.percentage > 0 ? formatPercent(u.percentage * 100) : "—",
  ]);

  return (
    <div className="space-y-6">
      {/* Funder Header */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
        <h2 className="text-xl font-bold">Funder / Investor Dashboard</h2>
        <p className="text-purple-200 text-sm mt-1">
          Investment returns, equity analysis, and project viability metrics
        </p>
      </div>

      {/* Primary Return Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Project IRR"
          value={returns.irr_project > 0 ? formatPercent(returns.irr_project * 100) : "N/A"}
          subtitle="Ungeared / Project level"
          color="purple"
          size="lg"
        />
        <MetricCard
          label="Equity IRR"
          value={returns.irr_equity > 0 ? formatPercent(returns.irr_equity * 100) : "N/A"}
          subtitle="Geared / Levered return"
          color="blue"
          size="lg"
        />
        <MetricCard
          label="Net Present Value"
          value={returns.npv > 0 ? formatCurrency(returns.npv, true) : "N/A"}
          subtitle="Discounted cash flows"
          color="green"
          size="lg"
        />
        <MetricCard
          label="Equity Multiple"
          value={returns.equity_multiple > 0 ? formatRatio(returns.equity_multiple) : "N/A"}
          subtitle="Total return on equity"
          color="amber"
          size="lg"
        />
      </div>

      {/* Profitability Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Development Profit"
          value={formatCurrency(returns.development_profit, true)}
          color="green"
        />
        <MetricCard
          label="ROI"
          value={returns.roi > 0 ? formatPercent(returns.roi * 100) : "N/A"}
          color="blue"
        />
        <MetricCard
          label="Cash-on-Cash"
          value={returns.cash_on_cash > 0 ? formatPercent(returns.cash_on_cash * 100) : "N/A"}
          color="purple"
        />
        <MetricCard
          label="Payback Period"
          value={returns.payback_period > 0 ? `${returns.payback_period} months` : "N/A"}
          color="slate"
        />
      </div>

      {/* Development Viability */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Development Viability Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Gross Development Value</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(returns.total_revenue, true)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total Development Cost</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(returns.total_cost, true)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Development Margin</p>
            <p className="text-xl font-bold text-emerald-600">
              {returns.development_margin > 0 ? formatPercent(returns.development_margin) : "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Profit on Cost</p>
            <p className="text-xl font-bold text-blue-600">
              {returns.profit_on_cost > 0 ? formatPercent(returns.profit_on_cost) : "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Profit on GDV</p>
            <p className="text-xl font-bold text-purple-600">
              {returns.profit_on_gdv > 0 ? formatPercent(returns.profit_on_gdv) : "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Yield on Cost</p>
            <p className="text-xl font-bold text-amber-600">
              {returns.yield_on_cost > 0 ? formatPercent(returns.yield_on_cost * 100) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Equity Analysis */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Equity Position</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Equity Required</span>
              <span className="text-sm font-bold text-emerald-600">{formatCurrency(equity.total_equity, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Equity as % of Cost</span>
              <span className="text-sm font-semibold">{formatPercent(equity.equity_percentage)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Peak Equity Exposure</span>
              <span className="text-sm font-semibold">
                {returns.peak_equity > 0 ? formatCurrency(returns.peak_equity, true) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Debt/Equity Ratio</span>
              <span className="text-sm font-semibold">{formatRatio(equity.debt_equity_ratio)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Residual Value</span>
              <span className="text-sm font-semibold">{formatCurrency(returns.residual_value, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Cap Rate / Exit Yield</span>
              <span className="text-sm font-semibold">
                {returns.cap_rate > 0 ? formatPercent(returns.cap_rate * 100) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Leverage Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Senior Debt</span>
              <span className="text-sm font-semibold">{formatCurrency(debt_metrics.senior_debt, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mezzanine Debt</span>
              <span className="text-sm font-semibold">{formatCurrency(debt_metrics.mezzanine_debt, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Gearing</span>
              <span className="text-sm font-bold">{formatCurrency(debt_metrics.total_debt, true)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">LTV Ratio</span>
              <span className="text-sm font-semibold">{formatPercent(debt_metrics.ltv_ratio)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">LTC Ratio</span>
              <span className="text-sm font-semibold">{formatPercent(debt_metrics.ltc_ratio)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Interest Rate (Senior)</span>
              <span className="text-sm font-semibold">
                {debt_metrics.interest_rate > 0 ? formatPercent(debt_metrics.interest_rate) : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources & Uses */}
      <div className="grid md:grid-cols-2 gap-4">
        {sourcesData.length > 0 && (
          <BarChart
            data={sourcesData}
            title="Sources of Funding"
            formatValue={(v) => formatCurrency(v, true)}
          />
        )}
        {usesData.length > 0 && (
          <BarChart
            data={usesData}
            title="Uses of Funds"
            formatValue={(v) => formatCurrency(v, true)}
          />
        )}
      </div>

      {/* Sources & Uses Tables */}
      <div className="grid md:grid-cols-2 gap-4">
        {sourcesRows.length > 0 && (
          <DataTable
            title="Sources of Funding"
            headers={["Source", "Amount", "%"]}
            rows={sourcesRows}
            compact
          />
        )}
        {usesRows.length > 0 && (
          <DataTable
            title="Uses of Funds"
            headers={["Use", "Amount", "%"]}
            rows={usesRows}
            compact
          />
        )}
      </div>

      {/* Cash Flow Charts */}
      {cfData.length > 0 && (
        <BarChart
          data={cfData}
          title="Net Operating Income by Period"
          formatValue={(v) => formatCurrency(v, true)}
          horizontal={false}
        />
      )}

      {cumulativeData.length > 0 && (
        <BarChart
          data={cumulativeData}
          title="Cumulative Cash Flow"
          formatValue={(v) => formatCurrency(v, true)}
          horizontal={false}
        />
      )}

      {/* Sensitivity */}
      {sensitivityRows.length > 0 && (
        <DataTable
          title="Scenario Analysis"
          headers={["Scenario", "IRR", "NPV", "Profit Margin"]}
          rows={sensitivityRows}
          highlightLast
        />
      )}
    </div>
  );
}
