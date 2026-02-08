"use client";

import { DashboardData } from "@/types/dashboard";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import MetricCard from "./MetricCard";
import BarChart from "./BarChart";
import DataTable from "./DataTable";

interface DevManagerViewProps {
  data: DashboardData;
}

export default function DevManagerView({ data }: DevManagerViewProps) {
  const { project_summary, budget, returns, cashflow, sources_and_uses } = data;

  // Budget breakdown chart
  const budgetCategories = [
    { label: "Land", value: budget.land_cost, color: "bg-blue-500" },
    { label: "Construction", value: budget.construction_cost, color: "bg-emerald-500" },
    { label: "Professional Fees", value: budget.professional_fees, color: "bg-purple-500" },
    { label: "Finance Costs", value: budget.finance_costs, color: "bg-amber-500" },
    { label: "Statutory", value: budget.statutory_costs, color: "bg-cyan-500" },
    { label: "Marketing", value: budget.marketing_costs, color: "bg-pink-500" },
    { label: "Contingency", value: budget.contingency, color: "bg-orange-500" },
    { label: "Other", value: budget.other_costs, color: "bg-gray-500" },
  ].filter((c) => c.value > 0);

  // Full budget line items table
  const budgetRows = budget.line_items.map((item) => [
    item.name,
    formatCurrency(item.amount, true),
    `${item.percentage.toFixed(1)}%`,
  ]);
  if (budgetRows.length > 0) {
    budgetRows.push(["TOTAL", formatCurrency(budget.total_budget, true), "100.0%"]);
  }

  // Revenue schedule
  const revenueData = cashflow.periods.map((p, i) => ({
    label: p,
    value: cashflow.revenue[i] || 0,
  }));

  // Cost schedule
  const costData = cashflow.periods.map((p, i) => ({
    label: p,
    value: cashflow.operating_costs[i] || 0,
    color: "bg-red-400",
  }));

  // Funding sources for drawdown planning
  const fundingRows = sources_and_uses.sources.map((s) => [
    s.name,
    formatCurrency(s.amount, true),
    s.percentage > 0 ? formatPercent(s.percentage * 100) : "—",
  ]);

  // Uses breakdown
  const usesRows = sources_and_uses.uses.map((u) => [
    u.name,
    formatCurrency(u.amount, true),
    u.percentage > 0 ? formatPercent(u.percentage * 100) : "—",
  ]);

  // Cost per unit / per sqm
  const costPerUnit = project_summary.total_units > 0
    ? budget.total_budget / project_summary.total_units
    : 0;
  const costPerSqm = project_summary.total_gla > 0
    ? budget.total_budget / project_summary.total_gla
    : 0;
  const revenuePerUnit = project_summary.total_units > 0
    ? returns.total_revenue / project_summary.total_units
    : 0;
  const revenuePerSqm = project_summary.total_gla > 0
    ? returns.total_revenue / project_summary.total_gla
    : 0;
  const constructionPerSqm = project_summary.total_gla > 0
    ? budget.construction_cost / project_summary.total_gla
    : 0;

  return (
    <div className="space-y-6">
      {/* Dev Manager Header */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
        <h2 className="text-xl font-bold">Development Manager Dashboard</h2>
        <p className="text-emerald-200 text-sm mt-1">
          Budget tracking, cost analysis, and project delivery metrics
        </p>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Budget"
          value={formatCurrency(budget.total_budget, true)}
          subtitle={`${budget.line_items.length} cost items`}
          color="blue"
          size="lg"
        />
        <MetricCard
          label="Construction Cost"
          value={formatCurrency(budget.construction_cost, true)}
          subtitle={budget.total_budget > 0 ? `${((budget.construction_cost / budget.total_budget) * 100).toFixed(0)}% of budget` : undefined}
          color="green"
          size="lg"
        />
        <MetricCard
          label="Contingency"
          value={formatCurrency(budget.contingency, true)}
          subtitle={budget.contingency_pct > 0 ? `${budget.contingency_pct.toFixed(1)}% of total` : undefined}
          color={budget.contingency_pct >= 5 ? "green" : "amber"}
          size="lg"
        />
        <MetricCard
          label="Duration"
          value={`${project_summary.project_duration_months} months`}
          subtitle={project_summary.project_type}
          color="purple"
          size="lg"
        />
      </div>

      {/* Unit Economics */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Unit Economics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {project_summary.total_units > 0 && (
            <>
              <div className="text-center p-3 rounded-lg bg-blue-50">
                <p className="text-xs text-gray-500 mb-1">Total Units</p>
                <p className="text-lg font-bold text-blue-600">{formatNumber(project_summary.total_units)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-gray-500 mb-1">Cost / Unit</p>
                <p className="text-lg font-bold text-gray-700">{formatCurrency(costPerUnit, true)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-emerald-50">
                <p className="text-xs text-gray-500 mb-1">Revenue / Unit</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(revenuePerUnit, true)}</p>
              </div>
            </>
          )}
          {project_summary.total_gla > 0 && (
            <>
              <div className="text-center p-3 rounded-lg bg-purple-50">
                <p className="text-xs text-gray-500 mb-1">Cost / sqm</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(costPerSqm)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50">
                <p className="text-xs text-gray-500 mb-1">Build Cost / sqm</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency(constructionPerSqm)}</p>
              </div>
            </>
          )}
          {project_summary.total_gla > 0 && (
            <div className="text-center p-3 rounded-lg bg-cyan-50">
              <p className="text-xs text-gray-500 mb-1">Revenue / sqm</p>
              <p className="text-lg font-bold text-cyan-600">{formatCurrency(revenuePerSqm)}</p>
            </div>
          )}
          {project_summary.total_gla > 0 && (
            <div className="text-center p-3 rounded-lg bg-indigo-50">
              <p className="text-xs text-gray-500 mb-1">GLA</p>
              <p className="text-lg font-bold text-indigo-600">{formatNumber(project_summary.total_gla)} sqm</p>
            </div>
          )}
        </div>
      </div>

      {/* Budget Category Breakdown */}
      {budgetCategories.length > 0 && (
        <BarChart
          data={budgetCategories}
          title="Budget by Category"
          formatValue={(v) => formatCurrency(v, true)}
        />
      )}

      {/* Detailed Budget Table */}
      {budgetRows.length > 0 && (
        <DataTable
          title="Detailed Development Budget"
          headers={["Cost Item", "Amount (ZAR)", "% of Total"]}
          rows={budgetRows}
          highlightLast
        />
      )}

      {/* Profitability Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="GDV"
          value={formatCurrency(returns.total_revenue, true)}
          subtitle="Gross Development Value"
          color="green"
        />
        <MetricCard
          label="Development Profit"
          value={formatCurrency(returns.development_profit, true)}
          color="blue"
        />
        <MetricCard
          label="Profit on Cost"
          value={returns.profit_on_cost > 0 ? formatPercent(returns.profit_on_cost) : "N/A"}
          color="purple"
        />
        <MetricCard
          label="Profit on GDV"
          value={returns.profit_on_gdv > 0 ? formatPercent(returns.profit_on_gdv) : "N/A"}
          color="amber"
        />
      </div>

      {/* Revenue Schedule */}
      {revenueData.filter((d) => d.value > 0).length > 0 && (
        <BarChart
          data={revenueData}
          title="Revenue Schedule"
          formatValue={(v) => formatCurrency(v, true)}
          horizontal={false}
        />
      )}

      {/* Cost Schedule */}
      {costData.filter((d) => d.value > 0).length > 0 && (
        <BarChart
          data={costData}
          title="Operating Cost Schedule"
          formatValue={(v) => formatCurrency(v, true)}
          horizontal={false}
        />
      )}

      {/* Sources & Uses Tables */}
      <div className="grid md:grid-cols-2 gap-4">
        {fundingRows.length > 0 && (
          <DataTable
            title="Funding Sources"
            headers={["Source", "Amount", "%"]}
            rows={fundingRows}
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

      {/* Key Milestones / Finance Costs */}
      <div className="grid md:grid-cols-2 gap-4">
        <MetricCard
          label="Land Cost"
          value={formatCurrency(budget.land_cost, true)}
          subtitle={budget.total_budget > 0 ? `${((budget.land_cost / budget.total_budget) * 100).toFixed(1)}% of budget` : undefined}
          color="slate"
        />
        <MetricCard
          label="Finance Costs"
          value={formatCurrency(budget.finance_costs, true)}
          subtitle={budget.total_budget > 0 ? `${((budget.finance_costs / budget.total_budget) * 100).toFixed(1)}% of budget` : undefined}
          color="amber"
        />
      </div>
    </div>
  );
}
