#!/usr/bin/env python3
"""
Financial Model Dashboard - Data Refresh Script

Reads an Excel financial model and extracts key metrics for:
- Lenders (DSCR, LTV, debt coverage, risk indicators)
- Funders/Investors (IRR, NPV, ROI, equity returns)
- Development Managers (budget tracking, cost breakdown, timeline)

Outputs a standardized JSON file consumed by the Next.js dashboard.

Usage:
    python refresh_data.py <path_to_excel_file>
    python refresh_data.py  (uses path from config.json)
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime

import pandas as pd
import numpy as np
import openpyxl

DATA_DIR = Path(__file__).parent.parent / "data"
CONFIG_PATH = DATA_DIR / "config.json"
OUTPUT_PATH = DATA_DIR / "dashboard_data.json"


def load_config():
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}


def save_config(config):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


def safe_float(value, default=0.0):
    """Safely convert a value to float."""
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return default
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def safe_str(value, default=""):
    if value is None:
        return default
    return str(value).strip()


def read_sheet_as_dict(wb, sheet_name):
    """Read a sheet and return it as a list of rows (list of lists)."""
    if sheet_name not in wb.sheetnames:
        return None
    ws = wb[sheet_name]
    rows = []
    for row in ws.iter_rows(values_only=True):
        rows.append(list(row))
    return rows


def find_value_in_sheet(rows, label_substring, value_col=1):
    """Find a value by searching for a label substring in the first column."""
    if rows is None:
        return None
    label_substring_lower = label_substring.lower()
    for row in rows:
        if row and row[0] and label_substring_lower in str(row[0]).lower():
            if len(row) > value_col and row[value_col] is not None:
                return row[value_col]
    return None


def find_row_values(rows, label_substring):
    """Find all values in a row by searching for a label substring."""
    if rows is None:
        return []
    label_substring_lower = label_substring.lower()
    for row in rows:
        if row and row[0] and label_substring_lower in str(row[0]).lower():
            return [v for v in row[1:] if v is not None]
    return []


def extract_project_summary(wb):
    """Extract high-level project summary data."""
    summary = {}
    for sheet_name in ["Project Summary", "Summary", "Overview", "Dashboard", "Inputs"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is not None:
            summary["project_name"] = safe_str(
                find_value_in_sheet(rows, "project name")
                or find_value_in_sheet(rows, "development name")
                or find_value_in_sheet(rows, "scheme name"),
                "Financial Model"
            )
            summary["project_type"] = safe_str(
                find_value_in_sheet(rows, "project type")
                or find_value_in_sheet(rows, "development type")
                or find_value_in_sheet(rows, "property type"),
                "Development"
            )
            summary["location"] = safe_str(
                find_value_in_sheet(rows, "location")
                or find_value_in_sheet(rows, "address")
                or find_value_in_sheet(rows, "site"),
                ""
            )
            summary["total_units"] = safe_float(
                find_value_in_sheet(rows, "total units")
                or find_value_in_sheet(rows, "number of units")
                or find_value_in_sheet(rows, "units")
            )
            summary["total_gla"] = safe_float(
                find_value_in_sheet(rows, "gross lettable area")
                or find_value_in_sheet(rows, "gla")
                or find_value_in_sheet(rows, "total area")
                or find_value_in_sheet(rows, "sqm")
            )
            summary["project_duration_months"] = safe_float(
                find_value_in_sheet(rows, "duration")
                or find_value_in_sheet(rows, "project period")
                or find_value_in_sheet(rows, "construction period"),
                24
            )
            break
    return summary


def extract_sources_and_uses(wb):
    """Extract Sources & Uses of funds."""
    sources = []
    uses = []

    for sheet_name in ["Sources & Uses", "Sources and Uses", "Funding", "Capital Structure", "Sources_Uses"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is None:
            continue

        section = None
        for row in rows:
            if not row or not row[0]:
                continue
            label = str(row[0]).strip().lower()

            if "source" in label:
                section = "sources"
                continue
            elif "use" in label or "application" in label:
                section = "uses"
                continue

            if section == "sources" and len(row) > 1 and row[1] is not None:
                sources.append({
                    "name": safe_str(row[0]),
                    "amount": safe_float(row[1]),
                    "percentage": safe_float(row[2]) if len(row) > 2 else 0
                })
            elif section == "uses" and len(row) > 1 and row[1] is not None:
                uses.append({
                    "name": safe_str(row[0]),
                    "amount": safe_float(row[1]),
                    "percentage": safe_float(row[2]) if len(row) > 2 else 0
                })
        if sources or uses:
            break

    return {"sources": sources, "uses": uses}


def extract_debt_metrics(wb):
    """Extract debt/lending metrics critical for lenders."""
    metrics = {
        "senior_debt": 0,
        "mezzanine_debt": 0,
        "total_debt": 0,
        "interest_rate": 0,
        "loan_term_months": 0,
        "ltv_ratio": 0,
        "ltc_ratio": 0,
        "dscr_min": 0,
        "dscr_avg": 0,
        "dscr_values": [],
        "icr": 0,
        "debt_yield": 0,
        "peak_debt": 0,
        "debt_drawdown_schedule": [],
        "repayment_schedule": [],
        "interest_schedule": [],
        "covenant_headroom": 0,
    }

    for sheet_name in ["Debt", "Debt Schedule", "Loan", "Financing", "Debt Service",
                        "Senior Debt", "Funding"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is None:
            continue

        metrics["senior_debt"] = safe_float(
            find_value_in_sheet(rows, "senior debt")
            or find_value_in_sheet(rows, "senior loan")
            or find_value_in_sheet(rows, "bank loan")
        )
        metrics["mezzanine_debt"] = safe_float(
            find_value_in_sheet(rows, "mezzanine")
            or find_value_in_sheet(rows, "mezz")
            or find_value_in_sheet(rows, "junior debt")
        )
        metrics["interest_rate"] = safe_float(
            find_value_in_sheet(rows, "interest rate")
            or find_value_in_sheet(rows, "rate")
            or find_value_in_sheet(rows, "cost of debt")
        )
        metrics["loan_term_months"] = safe_float(
            find_value_in_sheet(rows, "loan term")
            or find_value_in_sheet(rows, "term")
            or find_value_in_sheet(rows, "tenor")
        )
        metrics["ltv_ratio"] = safe_float(
            find_value_in_sheet(rows, "ltv")
            or find_value_in_sheet(rows, "loan to value")
        )
        metrics["ltc_ratio"] = safe_float(
            find_value_in_sheet(rows, "ltc")
            or find_value_in_sheet(rows, "loan to cost")
        )

        dscr_values = find_row_values(rows, "dscr")
        if not dscr_values:
            dscr_values = find_row_values(rows, "debt service coverage")
        metrics["dscr_values"] = [safe_float(v) for v in dscr_values if safe_float(v) > 0]
        if metrics["dscr_values"]:
            metrics["dscr_min"] = min(metrics["dscr_values"])
            metrics["dscr_avg"] = sum(metrics["dscr_values"]) / len(metrics["dscr_values"])

        metrics["icr"] = safe_float(
            find_value_in_sheet(rows, "interest coverage")
            or find_value_in_sheet(rows, "icr")
        )
        metrics["debt_yield"] = safe_float(
            find_value_in_sheet(rows, "debt yield")
        )

        drawdown = find_row_values(rows, "drawdown")
        if not drawdown:
            drawdown = find_row_values(rows, "disbursement")
        metrics["debt_drawdown_schedule"] = [safe_float(v) for v in drawdown]

        repayment = find_row_values(rows, "repayment")
        if not repayment:
            repayment = find_row_values(rows, "principal")
        metrics["repayment_schedule"] = [safe_float(v) for v in repayment]

        interest = find_row_values(rows, "interest expense")
        if not interest:
            interest = find_row_values(rows, "interest paid")
        metrics["interest_schedule"] = [safe_float(v) for v in interest]

        break

    metrics["total_debt"] = metrics["senior_debt"] + metrics["mezzanine_debt"]
    if metrics["debt_drawdown_schedule"]:
        cumulative = []
        running = 0
        for d in metrics["debt_drawdown_schedule"]:
            running += d
            cumulative.append(running)
        metrics["peak_debt"] = max(cumulative) if cumulative else metrics["total_debt"]
    else:
        metrics["peak_debt"] = metrics["total_debt"]

    return metrics


def extract_cashflow(wb):
    """Extract cash flow projections."""
    cashflow = {
        "periods": [],
        "revenue": [],
        "operating_costs": [],
        "net_operating_income": [],
        "debt_service": [],
        "cash_after_debt": [],
        "cumulative_cashflow": [],
    }

    for sheet_name in ["Cash Flow", "Cashflow", "Cash Flows", "CF", "Projections",
                        "Operating Cashflow"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is None:
            continue

        period_labels = find_row_values(rows, "period")
        if not period_labels:
            period_labels = find_row_values(rows, "month")
        if not period_labels:
            period_labels = find_row_values(rows, "year")
        cashflow["periods"] = [safe_str(p) for p in period_labels]

        revenue = find_row_values(rows, "revenue")
        if not revenue:
            revenue = find_row_values(rows, "total income")
        if not revenue:
            revenue = find_row_values(rows, "gross income")
        if not revenue:
            revenue = find_row_values(rows, "sales")
        cashflow["revenue"] = [safe_float(v) for v in revenue]

        opex = find_row_values(rows, "operating cost")
        if not opex:
            opex = find_row_values(rows, "operating expense")
        if not opex:
            opex = find_row_values(rows, "total expense")
        if not opex:
            opex = find_row_values(rows, "expenses")
        cashflow["operating_costs"] = [safe_float(v) for v in opex]

        noi = find_row_values(rows, "net operating income")
        if not noi:
            noi = find_row_values(rows, "noi")
        if not noi:
            noi = find_row_values(rows, "net income")
        cashflow["net_operating_income"] = [safe_float(v) for v in noi]

        ds = find_row_values(rows, "debt service")
        if not ds:
            ds = find_row_values(rows, "total debt service")
        cashflow["debt_service"] = [safe_float(v) for v in ds]

        cad = find_row_values(rows, "cash after debt")
        if not cad:
            cad = find_row_values(rows, "free cash flow")
        if not cad:
            cad = find_row_values(rows, "net cash flow")
        cashflow["cash_after_debt"] = [safe_float(v) for v in cad]

        cumcf = find_row_values(rows, "cumulative")
        cashflow["cumulative_cashflow"] = [safe_float(v) for v in cumcf]

        break

    # Generate periods if not found
    if not cashflow["periods"] and cashflow["revenue"]:
        cashflow["periods"] = [f"Period {i+1}" for i in range(len(cashflow["revenue"]))]

    # Calculate cumulative if not in sheet
    if not cashflow["cumulative_cashflow"] and cashflow["cash_after_debt"]:
        cumulative = []
        running = 0
        for v in cashflow["cash_after_debt"]:
            running += v
            cumulative.append(running)
        cashflow["cumulative_cashflow"] = cumulative

    return cashflow


def extract_returns(wb):
    """Extract return metrics for funders/investors."""
    returns = {
        "irr_project": 0,
        "irr_equity": 0,
        "npv": 0,
        "equity_multiple": 0,
        "roi": 0,
        "cash_on_cash": 0,
        "development_margin": 0,
        "development_profit": 0,
        "total_revenue": 0,
        "total_cost": 0,
        "residual_value": 0,
        "cap_rate": 0,
        "yield_on_cost": 0,
        "profit_on_cost": 0,
        "profit_on_gdv": 0,
        "peak_equity": 0,
        "payback_period": 0,
    }

    for sheet_name in ["Returns", "Returns Analysis", "Summary", "KPIs", "Feasibility",
                        "Viability", "Investment Summary", "Project Summary"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is None:
            continue

        returns["irr_project"] = safe_float(
            find_value_in_sheet(rows, "project irr")
            or find_value_in_sheet(rows, "ungeared irr")
            or find_value_in_sheet(rows, "irr")
        )
        returns["irr_equity"] = safe_float(
            find_value_in_sheet(rows, "equity irr")
            or find_value_in_sheet(rows, "geared irr")
            or find_value_in_sheet(rows, "levered irr")
        )
        returns["npv"] = safe_float(
            find_value_in_sheet(rows, "npv")
            or find_value_in_sheet(rows, "net present value")
        )
        returns["equity_multiple"] = safe_float(
            find_value_in_sheet(rows, "equity multiple")
            or find_value_in_sheet(rows, "multiple")
        )
        returns["roi"] = safe_float(
            find_value_in_sheet(rows, "return on investment")
            or find_value_in_sheet(rows, "roi")
        )
        returns["cash_on_cash"] = safe_float(
            find_value_in_sheet(rows, "cash on cash")
            or find_value_in_sheet(rows, "cash-on-cash")
        )
        returns["development_margin"] = safe_float(
            find_value_in_sheet(rows, "development margin")
            or find_value_in_sheet(rows, "margin")
        )
        returns["development_profit"] = safe_float(
            find_value_in_sheet(rows, "development profit")
            or find_value_in_sheet(rows, "profit")
            or find_value_in_sheet(rows, "net profit")
        )
        returns["total_revenue"] = safe_float(
            find_value_in_sheet(rows, "total revenue")
            or find_value_in_sheet(rows, "gdv")
            or find_value_in_sheet(rows, "gross development value")
            or find_value_in_sheet(rows, "total sales")
        )
        returns["total_cost"] = safe_float(
            find_value_in_sheet(rows, "total cost")
            or find_value_in_sheet(rows, "total development cost")
            or find_value_in_sheet(rows, "tdc")
        )
        returns["residual_value"] = safe_float(
            find_value_in_sheet(rows, "residual value")
            or find_value_in_sheet(rows, "terminal value")
            or find_value_in_sheet(rows, "exit value")
        )
        returns["cap_rate"] = safe_float(
            find_value_in_sheet(rows, "cap rate")
            or find_value_in_sheet(rows, "capitalisation rate")
            or find_value_in_sheet(rows, "exit yield")
        )
        returns["yield_on_cost"] = safe_float(
            find_value_in_sheet(rows, "yield on cost")
            or find_value_in_sheet(rows, "yoc")
        )
        returns["profit_on_cost"] = safe_float(
            find_value_in_sheet(rows, "profit on cost")
        )
        returns["profit_on_gdv"] = safe_float(
            find_value_in_sheet(rows, "profit on gdv")
            or find_value_in_sheet(rows, "profit on revenue")
        )
        returns["peak_equity"] = safe_float(
            find_value_in_sheet(rows, "peak equity")
            or find_value_in_sheet(rows, "maximum equity")
        )
        returns["payback_period"] = safe_float(
            find_value_in_sheet(rows, "payback")
            or find_value_in_sheet(rows, "payback period")
        )
        break

    return returns


def extract_budget(wb):
    """Extract development budget breakdown."""
    budget = {
        "line_items": [],
        "total_budget": 0,
        "contingency": 0,
        "contingency_pct": 0,
        "land_cost": 0,
        "construction_cost": 0,
        "professional_fees": 0,
        "finance_costs": 0,
        "statutory_costs": 0,
        "marketing_costs": 0,
        "other_costs": 0,
    }

    for sheet_name in ["Budget", "Development Budget", "Cost Summary", "Uses",
                        "Development Cost", "Costs", "Cost Breakdown"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is None:
            continue

        for row in rows:
            if not row or not row[0] or row[0] is None:
                continue
            label = str(row[0]).strip()
            if not label or label.lower() in ["item", "description", "cost item", "category"]:
                continue
            amount = safe_float(row[1] if len(row) > 1 else 0)
            if amount == 0:
                continue

            budget["line_items"].append({
                "name": label,
                "amount": amount,
                "percentage": safe_float(row[2]) if len(row) > 2 else 0,
            })

            label_lower = label.lower()
            if "land" in label_lower or "site" in label_lower or "acquisition" in label_lower:
                budget["land_cost"] += amount
            elif "construct" in label_lower or "building" in label_lower or "build" in label_lower:
                budget["construction_cost"] += amount
            elif "professional" in label_lower or "fee" in label_lower or "architect" in label_lower or "engineer" in label_lower:
                budget["professional_fees"] += amount
            elif "financ" in label_lower or "interest" in label_lower or "debt" in label_lower:
                budget["finance_costs"] += amount
            elif "statutory" in label_lower or "council" in label_lower or "permit" in label_lower or "regulatory" in label_lower:
                budget["statutory_costs"] += amount
            elif "marketing" in label_lower or "sales" in label_lower or "agent" in label_lower:
                budget["marketing_costs"] += amount
            elif "contingency" in label_lower:
                budget["contingency"] += amount
            else:
                budget["other_costs"] += amount

        break

    budget["total_budget"] = sum(item["amount"] for item in budget["line_items"])
    if budget["total_budget"] > 0 and budget["contingency"] > 0:
        budget["contingency_pct"] = (budget["contingency"] / budget["total_budget"]) * 100

    # Calculate percentages if not provided
    for item in budget["line_items"]:
        if item["percentage"] == 0 and budget["total_budget"] > 0:
            item["percentage"] = round((item["amount"] / budget["total_budget"]) * 100, 1)

    return budget


def extract_sensitivity(wb):
    """Extract sensitivity analysis data."""
    sensitivity = {
        "scenarios": [],
        "variables": [],
    }

    for sheet_name in ["Sensitivity", "Sensitivity Analysis", "Scenarios", "Risk Analysis"]:
        rows = read_sheet_as_dict(wb, sheet_name)
        if rows is None:
            continue

        headers = None
        for row in rows:
            if not row or not row[0]:
                continue
            if headers is None:
                headers = [safe_str(h) for h in row]
                continue

            scenario = {"name": safe_str(row[0])}
            for i, header in enumerate(headers[1:], 1):
                if i < len(row):
                    scenario[header.lower().replace(" ", "_")] = safe_float(row[i])
            sensitivity["scenarios"].append(scenario)
        break

    return sensitivity


def compute_derived_metrics(data):
    """Compute additional metrics from extracted data."""
    returns = data["returns"]
    debt = data["debt_metrics"]
    budget = data["budget"]
    cashflow = data["cashflow"]

    # Compute profit metrics if missing
    if returns["development_profit"] == 0 and returns["total_revenue"] > 0 and returns["total_cost"] > 0:
        returns["development_profit"] = returns["total_revenue"] - returns["total_cost"]

    if returns["development_margin"] == 0 and returns["total_revenue"] > 0:
        returns["development_margin"] = (returns["development_profit"] / returns["total_revenue"]) * 100

    if returns["profit_on_cost"] == 0 and returns["total_cost"] > 0:
        returns["profit_on_cost"] = (returns["development_profit"] / returns["total_cost"]) * 100

    if returns["profit_on_gdv"] == 0 and returns["total_revenue"] > 0:
        returns["profit_on_gdv"] = (returns["development_profit"] / returns["total_revenue"]) * 100

    # Total cost from budget if not in returns
    if returns["total_cost"] == 0 and budget["total_budget"] > 0:
        returns["total_cost"] = budget["total_budget"]

    # LTV from debt and value
    if debt["ltv_ratio"] == 0 and debt["total_debt"] > 0 and returns["total_revenue"] > 0:
        debt["ltv_ratio"] = (debt["total_debt"] / returns["total_revenue"]) * 100

    # LTC from debt and cost
    if debt["ltc_ratio"] == 0 and debt["total_debt"] > 0 and returns["total_cost"] > 0:
        debt["ltc_ratio"] = (debt["total_debt"] / returns["total_cost"]) * 100

    # DSCR from cashflow (only for periods with positive NOI - i.e., operational phase)
    if not debt["dscr_values"] and cashflow["net_operating_income"] and cashflow["debt_service"]:
        dscr_vals = []
        for noi, ds in zip(cashflow["net_operating_income"], cashflow["debt_service"]):
            if ds > 0 and noi > 0:
                dscr_vals.append(round(noi / ds, 2))
        debt["dscr_values"] = dscr_vals
        if dscr_vals:
            debt["dscr_min"] = min(dscr_vals)
            debt["dscr_avg"] = round(sum(dscr_vals) / len(dscr_vals), 2)

    # Equity calculation
    total_equity = returns["total_cost"] - debt["total_debt"]
    if total_equity > 0:
        data["equity"] = {
            "total_equity": total_equity,
            "equity_percentage": round((total_equity / returns["total_cost"]) * 100, 1) if returns["total_cost"] > 0 else 0,
            "debt_equity_ratio": round(debt["total_debt"] / total_equity, 2) if total_equity > 0 else 0,
        }
    else:
        data["equity"] = {
            "total_equity": 0,
            "equity_percentage": 0,
            "debt_equity_ratio": 0,
        }

    # Normalize ratios to percentages (values stored as 0-1 in Excel become 0-100)
    def to_pct(val):
        """Convert a ratio (0-1) to percentage (0-100) if it looks like a ratio."""
        if 0 < val <= 1:
            return val * 100
        return val

    debt["ltv_ratio"] = to_pct(debt["ltv_ratio"])
    debt["ltc_ratio"] = to_pct(debt["ltc_ratio"])
    debt["interest_rate"] = to_pct(debt["interest_rate"])
    debt["debt_yield"] = to_pct(debt["debt_yield"])

    # Keep all positive DSCR values for charting (includes ramp-up periods)
    debt["dscr_values"] = [v for v in debt["dscr_values"] if v > 0]
    # For min/avg, use stabilized periods only (DSCR >= 0.8 indicates operational phase)
    stabilized = [v for v in debt["dscr_values"] if v >= 0.8]
    if stabilized:
        debt["dscr_min"] = min(stabilized)
        debt["dscr_avg"] = round(sum(stabilized) / len(stabilized), 2)
    elif debt["dscr_values"]:
        debt["dscr_min"] = min(debt["dscr_values"])
        debt["dscr_avg"] = round(sum(debt["dscr_values"]) / len(debt["dscr_values"]), 2)

    # Risk indicators for lenders
    risk_score = 0  # 0 = low risk, higher = more risk
    risk_factors = []

    if debt["dscr_min"] > 0:
        if debt["dscr_min"] < 1.1:
            risk_score += 3
            risk_factors.append("DSCR below 1.10x - very tight debt coverage")
        elif debt["dscr_min"] < 1.2:
            risk_score += 2
            risk_factors.append("DSCR below 1.20x - tight debt coverage")
        elif debt["dscr_min"] < 1.3:
            risk_score += 1
            risk_factors.append("DSCR below 1.30x - moderate debt coverage")

    if debt["ltv_ratio"] > 0:
        if debt["ltv_ratio"] > 80:
            risk_score += 3
            risk_factors.append("LTV above 80% - high leverage")
        elif debt["ltv_ratio"] > 70:
            risk_score += 2
            risk_factors.append("LTV above 70% - moderate leverage")
        elif debt["ltv_ratio"] > 60:
            risk_score += 1
            risk_factors.append("LTV above 60% - standard leverage")

    if debt["ltc_ratio"] > 0:
        if debt["ltc_ratio"] > 75:
            risk_score += 2
            risk_factors.append("LTC above 75% - high cost leverage")
        elif debt["ltc_ratio"] > 65:
            risk_score += 1
            risk_factors.append("LTC above 65% - moderate cost leverage")

    if returns["development_margin"] > 0 and returns["development_margin"] < 15:
        risk_score += 2
        risk_factors.append("Development margin below 15%")

    if budget["contingency_pct"] > 0 and budget["contingency_pct"] < 5:
        risk_score += 2
        risk_factors.append("Contingency below 5% of total budget")

    if risk_score <= 2:
        risk_level = "Low"
    elif risk_score <= 5:
        risk_level = "Medium"
    elif risk_score <= 8:
        risk_level = "High"
    else:
        risk_level = "Very High"

    data["risk_assessment"] = {
        "score": risk_score,
        "level": risk_level,
        "factors": risk_factors,
        "max_score": 13,
    }

    return data


def process_financial_model(excel_path):
    """Main processing function - reads Excel and outputs JSON."""
    excel_path = Path(excel_path)

    if not excel_path.exists():
        raise FileNotFoundError(f"Excel file not found: {excel_path}")

    if not excel_path.suffix.lower() in [".xlsx", ".xlsm", ".xls"]:
        raise ValueError(f"File is not an Excel file: {excel_path}")

    print(f"Reading financial model: {excel_path}")
    wb = openpyxl.load_workbook(str(excel_path), data_only=True, read_only=True)

    print(f"Sheets found: {wb.sheetnames}")

    data = {
        "metadata": {
            "source_file": str(excel_path),
            "file_name": excel_path.name,
            "last_refreshed": datetime.now().isoformat(),
            "sheets_found": wb.sheetnames,
        },
        "project_summary": extract_project_summary(wb),
        "sources_and_uses": extract_sources_and_uses(wb),
        "debt_metrics": extract_debt_metrics(wb),
        "cashflow": extract_cashflow(wb),
        "returns": extract_returns(wb),
        "budget": extract_budget(wb),
        "sensitivity": extract_sensitivity(wb),
    }

    wb.close()

    # Compute derived metrics
    data = compute_derived_metrics(data)

    # Save output
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Dashboard data saved to: {OUTPUT_PATH}")

    # Update config
    config = load_config()
    config["excel_path"] = str(excel_path.resolve())
    config["last_refreshed"] = data["metadata"]["last_refreshed"]
    save_config(config)

    return data


def main():
    if len(sys.argv) > 1:
        excel_path = sys.argv[1]
    else:
        config = load_config()
        excel_path = config.get("excel_path")
        if not excel_path:
            print("Error: No Excel file path provided and no path in config.", file=sys.stderr)
            print("Usage: python refresh_data.py <path_to_excel_file>", file=sys.stderr)
            sys.exit(1)

    try:
        data = process_financial_model(excel_path)
        print("Refresh complete.")
        print(f"Project: {data['project_summary'].get('project_name', 'N/A')}")
        print(f"Sheets processed: {len(data['metadata']['sheets_found'])}")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
