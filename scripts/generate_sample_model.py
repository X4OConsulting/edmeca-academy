#!/usr/bin/env python3
"""
Generates a sample financial model Excel file for testing the dashboard.
This represents a typical South African mixed-use development project.
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from pathlib import Path

OUTPUT_PATH = Path(__file__).parent.parent / "data" / "sample_financial_model.xlsx"


def style_header(ws, row, max_col):
    header_font = Font(bold=True, color="FFFFFF", size=11)
    header_fill = PatternFill(start_color="1E40AF", end_color="1E40AF", fill_type="solid")
    for col in range(1, max_col + 1):
        cell = ws.cell(row=row, column=col)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center")


def style_label(cell):
    cell.font = Font(bold=True, size=10)
    cell.alignment = Alignment(horizontal="left")


def style_currency(cell):
    cell.number_format = '#,##0'
    cell.alignment = Alignment(horizontal="right")


def style_percent(cell):
    cell.number_format = '0.0%'
    cell.alignment = Alignment(horizontal="right")


def create_project_summary(wb):
    ws = wb.create_sheet("Project Summary")
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 35

    data = [
        ("Project Name", "Greenfield Mixed-Use Development"),
        ("Project Type", "Mixed-Use (Residential & Commercial)"),
        ("Location", "Sandton, Johannesburg, South Africa"),
        ("Total Units", 150),
        ("Gross Lettable Area (sqm)", 22500),
        ("Construction Period (months)", 24),
        ("Developer", "Edmeca Developments (Pty) Ltd"),
        ("Status", "Pre-Development"),
        ("Estimated Completion", "Q4 2028"),
    ]

    ws.cell(row=1, column=1, value="PROJECT SUMMARY").font = Font(bold=True, size=14, color="1E40AF")
    ws.merge_cells('A1:B1')

    for i, (label, value) in enumerate(data, start=3):
        c1 = ws.cell(row=i, column=1, value=label)
        c2 = ws.cell(row=i, column=2, value=value)
        style_label(c1)
        if isinstance(value, (int, float)):
            style_currency(c2)


def create_sources_and_uses(wb):
    ws = wb.create_sheet("Sources & Uses")
    ws.column_dimensions['A'].width = 35
    ws.column_dimensions['B'].width = 20
    ws.column_dimensions['C'].width = 15

    ws.cell(row=1, column=1, value="SOURCES & USES OF FUNDS").font = Font(bold=True, size=14, color="1E40AF")

    # Sources
    ws.cell(row=3, column=1, value="SOURCES OF FUNDING").font = Font(bold=True, size=12)
    style_header(ws, 4, 3)
    ws.cell(row=4, column=1, value="Source")
    ws.cell(row=4, column=2, value="Amount (ZAR)")
    ws.cell(row=4, column=3, value="Percentage")

    sources = [
        ("Senior Debt (Bank Loan)", 210000000, 0.60),
        ("Mezzanine Finance", 52500000, 0.15),
        ("Equity (Developer)", 70000000, 0.20),
        ("Equity (Co-Investor)", 17500000, 0.05),
    ]

    for i, (name, amount, pct) in enumerate(sources, start=5):
        ws.cell(row=i, column=1, value=name)
        c = ws.cell(row=i, column=2, value=amount)
        style_currency(c)
        c = ws.cell(row=i, column=3, value=pct)
        style_percent(c)

    total_row = 5 + len(sources)
    ws.cell(row=total_row, column=1, value="Total Sources").font = Font(bold=True)
    c = ws.cell(row=total_row, column=2, value=350000000)
    style_currency(c)
    c.font = Font(bold=True)
    c = ws.cell(row=total_row, column=3, value=1.0)
    style_percent(c)

    # Uses
    uses_start = total_row + 2
    ws.cell(row=uses_start, column=1, value="USES OF FUNDS").font = Font(bold=True, size=12)
    style_header(ws, uses_start + 1, 3)
    ws.cell(row=uses_start + 1, column=1, value="Use")
    ws.cell(row=uses_start + 1, column=2, value="Amount (ZAR)")
    ws.cell(row=uses_start + 1, column=3, value="Percentage")

    uses = [
        ("Land Acquisition", 55000000, 0.157),
        ("Construction Costs", 195000000, 0.557),
        ("Professional Fees", 24500000, 0.070),
        ("Statutory & Regulatory", 10500000, 0.030),
        ("Finance Costs", 31500000, 0.090),
        ("Marketing & Sales", 8750000, 0.025),
        ("Contingency", 17500000, 0.050),
        ("Developer Fee", 7250000, 0.021),
    ]

    for i, (name, amount, pct) in enumerate(uses, start=uses_start + 2):
        ws.cell(row=i, column=1, value=name)
        c = ws.cell(row=i, column=2, value=amount)
        style_currency(c)
        c = ws.cell(row=i, column=3, value=pct)
        style_percent(c)

    total_row2 = uses_start + 2 + len(uses)
    ws.cell(row=total_row2, column=1, value="Total Uses").font = Font(bold=True)
    c = ws.cell(row=total_row2, column=2, value=350000000)
    style_currency(c)
    c.font = Font(bold=True)


def create_budget(wb):
    ws = wb.create_sheet("Development Budget")
    ws.column_dimensions['A'].width = 35
    ws.column_dimensions['B'].width = 20
    ws.column_dimensions['C'].width = 15

    ws.cell(row=1, column=1, value="DEVELOPMENT BUDGET").font = Font(bold=True, size=14, color="1E40AF")

    style_header(ws, 3, 3)
    ws.cell(row=3, column=1, value="Cost Item")
    ws.cell(row=3, column=2, value="Amount (ZAR)")
    ws.cell(row=3, column=3, value="% of Total")

    items = [
        ("Land Acquisition & Transfer", 55000000, 15.7),
        ("Construction - Residential", 130000000, 37.1),
        ("Construction - Commercial", 65000000, 18.6),
        ("Professional Fees (Architects)", 10500000, 3.0),
        ("Professional Fees (Engineers)", 8750000, 2.5),
        ("Professional Fees (QS)", 5250000, 1.5),
        ("Statutory & Council Fees", 7000000, 2.0),
        ("Regulatory Compliance", 3500000, 1.0),
        ("Finance Costs (Interest)", 24500000, 7.0),
        ("Finance Costs (Arrangement)", 7000000, 2.0),
        ("Marketing & Sales Commission", 8750000, 2.5),
        ("Contingency (5%)", 17500000, 5.0),
        ("Developer Fee", 7250000, 2.1),
    ]

    for i, (name, amount, pct) in enumerate(items, start=4):
        ws.cell(row=i, column=1, value=name)
        c = ws.cell(row=i, column=2, value=amount)
        style_currency(c)
        ws.cell(row=i, column=3, value=pct)

    total_row = 4 + len(items)
    ws.cell(row=total_row, column=1, value="TOTAL DEVELOPMENT COST").font = Font(bold=True)
    c = ws.cell(row=total_row, column=2, value=350000000)
    style_currency(c)
    c.font = Font(bold=True)
    ws.cell(row=total_row, column=3, value=100.0).font = Font(bold=True)


def create_debt_schedule(wb):
    ws = wb.create_sheet("Debt Schedule")
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 18

    ws.cell(row=1, column=1, value="DEBT SCHEDULE").font = Font(bold=True, size=14, color="1E40AF")

    # Key terms
    terms = [
        ("Senior Debt Amount", 210000000),
        ("Mezzanine Debt Amount", 52500000),
        ("Interest Rate (Senior)", 0.115),
        ("Interest Rate (Mezzanine)", 0.145),
        ("Loan Term (months)", 30),
        ("LTV Ratio", 0.55),
        ("LTC Ratio", 0.60),
        ("Interest Coverage Ratio", 2.8),
        ("Debt Yield", 0.095),
    ]

    for i, (label, value) in enumerate(terms, start=3):
        c1 = ws.cell(row=i, column=1, value=label)
        style_label(c1)
        c2 = ws.cell(row=i, column=2, value=value)
        if isinstance(value, float) and value < 1:
            style_percent(c2)
        else:
            style_currency(c2)

    # Quarterly schedule
    q_start = len(terms) + 5
    ws.cell(row=q_start, column=1, value="QUARTERLY DEBT SERVICE").font = Font(bold=True, size=12)

    headers = ["Period", "Drawdown", "Repayment", "Interest Expense", "DSCR"]
    style_header(ws, q_start + 1, len(headers))
    for j, h in enumerate(headers, 1):
        ws.cell(row=q_start + 1, column=j, value=h)
        ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = 18

    quarterly_data = [
        ("Q1 2026", 35000000, 0, 4025000, 0),
        ("Q2 2026", 45000000, 0, 6037500, 0),
        ("Q3 2026", 50000000, 0, 8337500, 0),
        ("Q4 2026", 40000000, 0, 10350000, 0),
        ("Q1 2027", 30000000, 0, 11712500, 1.15),
        ("Q2 2027", 10000000, 0, 12362500, 1.25),
        ("Q3 2027", 0, 20000000, 12075000, 1.45),
        ("Q4 2027", 0, 40000000, 11500000, 1.55),
        ("Q1 2028", 0, 50000000, 10350000, 1.65),
        ("Q2 2028", 0, 60000000, 8625000, 1.80),
        ("Q3 2028", 0, 50000000, 6900000, 1.95),
        ("Q4 2028", 0, 42500000, 4743750, 2.10),
    ]

    for i, (period, draw, repay, interest, dscr) in enumerate(quarterly_data, start=q_start + 2):
        ws.cell(row=i, column=1, value=period)
        c = ws.cell(row=i, column=2, value=draw)
        style_currency(c)
        c = ws.cell(row=i, column=3, value=repay)
        style_currency(c)
        c = ws.cell(row=i, column=4, value=interest)
        style_currency(c)
        if dscr > 0:
            ws.cell(row=i, column=5, value=dscr)


def create_cashflow(wb):
    ws = wb.create_sheet("Cash Flow")
    ws.column_dimensions['A'].width = 28

    ws.cell(row=1, column=1, value="CASH FLOW PROJECTIONS").font = Font(bold=True, size=14, color="1E40AF")

    periods = ["Period", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026",
               "Q1 2027", "Q2 2027", "Q3 2027", "Q4 2027",
               "Q1 2028", "Q2 2028", "Q3 2028", "Q4 2028"]

    revenue = ["Revenue", 0, 0, 0, 5000000,
               15000000, 35000000, 55000000, 65000000,
               75000000, 80000000, 60000000, 45000000]

    opex = ["Operating Costs", 2000000, 2500000, 3000000, 3500000,
            4000000, 4500000, 5000000, 5500000,
            5000000, 4500000, 3500000, 2500000]

    noi = ["Net Operating Income"]
    for r, o in zip(revenue[1:], opex[1:]):
        noi.append(r - o)

    debt_service = ["Debt Service", 4025000, 6037500, 8337500, 10350000,
                    11712500, 12362500, 32075000, 51500000,
                    60350000, 68625000, 56900000, 47243750]

    cash_after = ["Cash After Debt Service"]
    for n, d in zip(noi[1:], debt_service[1:]):
        cash_after.append(n - d)

    cumulative = ["Cumulative Cash Flow"]
    running = 0
    for c in cash_after[1:]:
        running += c
        cumulative.append(running)

    rows_data = [periods, [], revenue, opex, [], noi, [], debt_service, [], cash_after, [], cumulative]

    style_header(ws, 3, len(periods))
    for j, p in enumerate(periods, 1):
        ws.cell(row=3, column=j, value=p)
        if j > 1:
            ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = 15

    for row_idx, row_data in enumerate(rows_data, start=3):
        if not row_data:
            continue
        for col_idx, value in enumerate(row_data, start=1):
            cell = ws.cell(row=row_idx + rows_data.index(row_data), column=col_idx, value=value)
            if col_idx == 1 and isinstance(value, str):
                style_label(cell)
            elif isinstance(value, (int, float)) and col_idx > 1:
                style_currency(cell)

    # Write rows properly
    current_row = 4
    for row_data in rows_data[1:]:
        if not row_data:
            current_row += 1
            continue
        for col_idx, value in enumerate(row_data, start=1):
            cell = ws.cell(row=current_row, column=col_idx, value=value)
            if col_idx == 1:
                style_label(cell)
            elif isinstance(value, (int, float)):
                style_currency(cell)
        current_row += 1


def create_returns(wb):
    ws = wb.create_sheet("Returns Analysis")
    ws.column_dimensions['A'].width = 35
    ws.column_dimensions['B'].width = 20

    ws.cell(row=1, column=1, value="RETURNS ANALYSIS").font = Font(bold=True, size=14, color="1E40AF")

    metrics = [
        ("PROJECT RETURNS", None),
        ("Project IRR", 0.185),
        ("Equity IRR", 0.245),
        ("Net Present Value (ZAR)", 42500000),
        ("Equity Multiple", 1.85),
        ("Return on Investment", 0.225),
        ("Cash on Cash Return", 0.195),
        ("Payback Period (months)", 28),
        ("", None),
        ("DEVELOPMENT METRICS", None),
        ("Gross Development Value (GDV)", 435000000),
        ("Total Development Cost (TDC)", 350000000),
        ("Development Profit", 85000000),
        ("Development Margin", 0.195),
        ("Profit on Cost", 0.243),
        ("Profit on GDV", 0.195),
        ("", None),
        ("VALUATION METRICS", None),
        ("Residual Value", 380000000),
        ("Cap Rate", 0.085),
        ("Yield on Cost", 0.092),
        ("Peak Equity Required", 87500000),
    ]

    current_row = 3
    for label, value in metrics:
        if value is None and label:
            ws.cell(row=current_row, column=1, value=label).font = Font(bold=True, size=12, color="1E40AF")
            current_row += 1
            continue
        if not label:
            current_row += 1
            continue

        c1 = ws.cell(row=current_row, column=1, value=label)
        style_label(c1)
        c2 = ws.cell(row=current_row, column=2, value=value)
        if isinstance(value, float) and abs(value) < 10:
            style_percent(c2)
        elif isinstance(value, (int, float)):
            style_currency(c2)
        current_row += 1


def create_sensitivity(wb):
    ws = wb.create_sheet("Sensitivity Analysis")
    ws.column_dimensions['A'].width = 30

    ws.cell(row=1, column=1, value="SENSITIVITY ANALYSIS").font = Font(bold=True, size=14, color="1E40AF")

    headers = ["Scenario", "IRR", "NPV (ZAR)", "DSCR Min", "LTV", "Profit Margin"]
    style_header(ws, 3, len(headers))
    for j, h in enumerate(headers, 1):
        ws.cell(row=3, column=j, value=h)
        ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = 18

    scenarios = [
        ("Base Case", 0.185, 42500000, 1.15, 0.55, 0.195),
        ("Cost Overrun (+10%)", 0.145, 28000000, 1.05, 0.58, 0.145),
        ("Revenue Decrease (-10%)", 0.130, 18500000, 1.00, 0.60, 0.130),
        ("Interest Rate +2%", 0.160, 35000000, 1.08, 0.55, 0.175),
        ("Delayed Sales (6 months)", 0.155, 32000000, 1.10, 0.55, 0.185),
        ("Best Case (+5% Revenue)", 0.215, 55000000, 1.25, 0.52, 0.230),
        ("Worst Case (Combined)", 0.095, 5000000, 0.90, 0.65, 0.085),
    ]

    for i, (name, irr, npv, dscr, ltv, margin) in enumerate(scenarios, start=4):
        ws.cell(row=i, column=1, value=name)
        c = ws.cell(row=i, column=2, value=irr)
        style_percent(c)
        c = ws.cell(row=i, column=3, value=npv)
        style_currency(c)
        ws.cell(row=i, column=4, value=dscr)
        c = ws.cell(row=i, column=5, value=ltv)
        style_percent(c)
        c = ws.cell(row=i, column=6, value=margin)
        style_percent(c)


def main():
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    create_project_summary(wb)
    create_sources_and_uses(wb)
    create_budget(wb)
    create_debt_schedule(wb)
    create_cashflow(wb)
    create_returns(wb)
    create_sensitivity(wb)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    wb.save(str(OUTPUT_PATH))
    print(f"Sample financial model saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
