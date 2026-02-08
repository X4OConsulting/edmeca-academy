"use client";

import { DashboardData } from "@/types/dashboard";
import { formatCurrency, formatPercent, formatRatio, formatNumber } from "@/lib/format";
import MetricCard from "./MetricCard";
import BarChart from "./BarChart";
import RiskIndicator from "./RiskIndicator";

interface SummaryViewProps {
  data: DashboardData;
}

export default function SummaryView({ data }: SummaryViewProps) {
  const { project_summary, returns, debt_metrics, budget, equity, risk_assessment, sources_and_uses } = data;

  const sourcesData = sources_and_uses.sources.map((s) => ({
    label: s.name,
    value: s.amount,
  }));

  const budgetBreakdown = [
    { label: "Land", value: budget.land_cost },
    { label: "Construction", value: budget.construction_cost },
    { label: "Professional Fees", value: budget.professional_fees },
    { label: "Finance Costs", value: budget.finance_costs },
    { label: "Statutory", value: budget.statutory_costs },
    { label: "Marketing", value: budget.marketing_costs },
    { label: "Contingency", value: budget.contingency },
    { label: "Other", value: budget.other_costs },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h2 className="text-2xl font-bold">{project_summary.project_name}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-blue-100 text-sm">
          {project_summary.project_type && <span>{project_summary.project_type}</span>}
          {project_summary.location && <span>{project_summary.location}</span>}
          {project_summary.total_units > 0 && <span>{formatNumber(project_summary.total_units)} Units</span>}
          {project_summary.total_gla > 0 && <span>{formatNumber(project_summary.total_gla)} sqm GLA</span>}
          {project_summary.project_duration_months > 0 && (
            <span>{project_summary.project_duration_months} months</span>
          )}
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Development Value"
          value={formatCurrency(returns.total_revenue, true)}
          subtitle="Gross Development Value"
          color="blue"
          size="lg"
        />
        <MetricCard
          label="Total Development Cost"
          value={formatCurrency(returns.total_cost, true)}
          subtitle={`${budget.line_items.length} line items`}
          color="slate"
          size="lg"
        />
        <MetricCard
          label="Development Profit"
          value={formatCurrency(returns.development_profit, true)}
          subtitle={returns.development_margin > 0 ? `${formatPercent(returns.development_margin)} margin` : undefined}
          color="green"
          size="lg"
        />
        <MetricCard
          label="Project IRR"
          value={returns.irr_project > 0 ? formatPercent(returns.irr_project * 100) : "N/A"}
          subtitle={returns.irr_equity > 0 ? `Equity IRR: ${formatPercent(returns.irr_equity * 100)}` : undefined}
          color="purple"
          size="lg"
        />
      </div>

      {/* Capital Structure & Risk */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Capital Structure Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Capital Structure</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Senior Debt</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(debt_metrics.senior_debt, true)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Mezzanine</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatCurrency(debt_metrics.mezzanine_debt, true)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Equity</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(equity.total_equity, true)}
                </p>
              </div>
            </div>

            {/* Stack bar */}
            <div className="mt-4">
              <div className="h-6 rounded-full overflow-hidden flex">
                {debt_metrics.senior_debt > 0 && returns.total_cost > 0 && (
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(debt_metrics.senior_debt / returns.total_cost) * 100}%` }}
                    title={`Senior Debt: ${formatPercent((debt_metrics.senior_debt / returns.total_cost) * 100)}`}
                  />
                )}
                {debt_metrics.mezzanine_debt > 0 && returns.total_cost > 0 && (
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(debt_metrics.mezzanine_debt / returns.total_cost) * 100}%` }}
                    title={`Mezzanine: ${formatPercent((debt_metrics.mezzanine_debt / returns.total_cost) * 100)}`}
                  />
                )}
                {equity.total_equity > 0 && returns.total_cost > 0 && (
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(equity.total_equity / returns.total_cost) * 100}%` }}
                    title={`Equity: ${formatPercent((equity.total_equity / returns.total_cost) * 100)}`}
                  />
                )}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Debt: {formatPercent(100 - equity.equity_percentage)}</span>
                <span>Equity: {formatPercent(equity.equity_percentage)}</span>
              </div>
            </div>
          </div>

          {/* Key Ratios */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="LTV Ratio"
              value={debt_metrics.ltv_ratio > 0 ? formatPercent(debt_metrics.ltv_ratio) : "N/A"}
              color="blue"
              size="sm"
            />
            <MetricCard
              label="DSCR (Min)"
              value={debt_metrics.dscr_min > 0 ? formatRatio(debt_metrics.dscr_min) : "N/A"}
              color={debt_metrics.dscr_min >= 1.2 ? "green" : debt_metrics.dscr_min >= 1.0 ? "amber" : "red"}
              size="sm"
            />
            <MetricCard
              label="Equity Multiple"
              value={returns.equity_multiple > 0 ? formatRatio(returns.equity_multiple) : "N/A"}
              color="purple"
              size="sm"
            />
            <MetricCard
              label="Debt-Equity Ratio"
              value={equity.debt_equity_ratio > 0 ? formatRatio(equity.debt_equity_ratio) : "N/A"}
              color="slate"
              size="sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <RiskIndicator
            level={risk_assessment.level}
            score={risk_assessment.score}
            maxScore={risk_assessment.max_score}
            factors={risk_assessment.factors}
          />

          {sourcesData.length > 0 && (
            <BarChart
              data={sourcesData}
              title="Sources of Funding"
              formatValue={(v) => formatCurrency(v, true)}
            />
          )}
        </div>
      </div>

      {/* Budget Breakdown */}
      {budgetBreakdown.length > 0 && (
        <BarChart
          data={budgetBreakdown}
          title="Development Budget Breakdown"
          formatValue={(v) => formatCurrency(v, true)}
        />
      )}
    </div>
  );
}
