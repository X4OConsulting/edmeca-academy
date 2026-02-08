export interface DashboardData {
  metadata: {
    source_file: string;
    file_name: string;
    last_refreshed: string;
    sheets_found: string[];
  };
  project_summary: {
    project_name: string;
    project_type: string;
    location: string;
    total_units: number;
    total_gla: number;
    project_duration_months: number;
  };
  sources_and_uses: {
    sources: FundingItem[];
    uses: FundingItem[];
  };
  debt_metrics: {
    senior_debt: number;
    mezzanine_debt: number;
    total_debt: number;
    interest_rate: number;
    loan_term_months: number;
    ltv_ratio: number;
    ltc_ratio: number;
    dscr_min: number;
    dscr_avg: number;
    dscr_values: number[];
    icr: number;
    debt_yield: number;
    peak_debt: number;
    debt_drawdown_schedule: number[];
    repayment_schedule: number[];
    interest_schedule: number[];
    covenant_headroom: number;
  };
  cashflow: {
    periods: string[];
    revenue: number[];
    operating_costs: number[];
    net_operating_income: number[];
    debt_service: number[];
    cash_after_debt: number[];
    cumulative_cashflow: number[];
  };
  returns: {
    irr_project: number;
    irr_equity: number;
    npv: number;
    equity_multiple: number;
    roi: number;
    cash_on_cash: number;
    development_margin: number;
    development_profit: number;
    total_revenue: number;
    total_cost: number;
    residual_value: number;
    cap_rate: number;
    yield_on_cost: number;
    profit_on_cost: number;
    profit_on_gdv: number;
    peak_equity: number;
    payback_period: number;
  };
  budget: {
    line_items: BudgetItem[];
    total_budget: number;
    contingency: number;
    contingency_pct: number;
    land_cost: number;
    construction_cost: number;
    professional_fees: number;
    finance_costs: number;
    statutory_costs: number;
    marketing_costs: number;
    other_costs: number;
  };
  sensitivity: {
    scenarios: SensitivityScenario[];
    variables: string[];
  };
  equity: {
    total_equity: number;
    equity_percentage: number;
    debt_equity_ratio: number;
  };
  risk_assessment: {
    score: number;
    level: string;
    factors: string[];
    max_score: number;
  };
}

export interface FundingItem {
  name: string;
  amount: number;
  percentage: number;
}

export interface BudgetItem {
  name: string;
  amount: number;
  percentage: number;
}

export interface SensitivityScenario {
  name: string;
  [key: string]: string | number;
}

export type DashboardTab =
  | "summary"
  | "lender"
  | "funder"
  | "devmanager";
