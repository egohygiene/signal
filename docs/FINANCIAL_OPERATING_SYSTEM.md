# Financial Operating System (FOS)
## Architecture Specification — v1.0

---

# Overview

The Financial Operating System (FOS) defines a structured, extensible taxonomy for categorizing, tagging, and operating a personal finance system.

This document serves as:

- A reference architecture for financial dashboard applications
- A standardized category taxonomy
- A tag-based intent layer specification
- A framework supporting both stabilization and expansion modes
- A foundation for automation, analytics, and visualization

This specification is implementation-agnostic and may be adapted across budgeting tools, custom dashboards, or financial automation systems.

---

# Core Design Principles

1. Categories define **what** a transaction represents.
2. Tags define **why** the transaction exists in the system.
3. The system must function under low-cognition conditions.
4. The system must scale with income growth.
5. The taxonomy must support automation and reporting.
6. All transactions must map to a defined category.
7. No financial data should exist outside the structured system.

---

# Tag System (Intent Layer)

Tags operate orthogonally to categories.

## Essential
Non-negotiable costs required to maintain housing, utilities, transportation, and basic autonomy.

## Health
Spending directly tied to physical or mental health stabilization.

## Debt
Payments reducing outstanding liabilities (minimum or accelerated).

## Growth
Spending that increases long-term earning potential or net worth.

## Discretionary
Lifestyle spending that improves quality of life but is optional.

## Sinking Fund
Planned future expenses accumulated gradually over time.

## One Time
Non-recurring or event-based transactions.

## Tax Deductible
Overlay tag for reporting and tax optimization.

---

# Category Architecture

Categories are grouped into structural domains.

---

## 1. Infrastructure (Autonomy-Preserving Core)

- Rent
- Mortgage
- Electricity
- Heat / Propane / Oil
- Water / Sewer
- Trash Collection
- Internet
- Cellular Phone
- Landline Phone
- Car Insurance
- Medical Insurance
- Homeowner / Renters Insurance
- Vehicle Registration
- Vehicle Excise Tax
- Loan Payment (minimums)
- Credit Card Payment (minimums)
- Student Loan
- Vehicle Loan

Primary Tag: Essential / Debt

---

## 2. Stability & Maintenance

- Car Repairs / Maintenance
- Home Repairs / Maintenance
- Identity & Privacy Protection
- Veterinary Expenses
- Website Domains
- Professional Development / Education
- Software Subscriptions (work-related)
- Bank Charges / Monthly Fees
- Accountant
- Attorney

Primary Tag: Essential / Growth / Sinking Fund (context-dependent)

---

## 3. Health

- Counseling / Therapy
- Gym Membership
- Massage
- Prescription Medication
- Over-the-Counter Medication
- Co-payments
- Optical / Eyeglasses / Contacts
- Orthodonture
- Out-of-Pocket Dental

Primary Tag: Health

---

## 4. Food

- Groceries
- Restaurants
- Lunch at Work
- Subscription Food Deliveries
- Farm Share

Primary Tag:
- Groceries → Essential
- Restaurants → Discretionary

---

## 5. Lifestyle

- Entertainment
- Hobbies
- Friends
- Clothes
- Gaming Purchases
- Gaming Subscriptions
- Streaming Services
- Newspaper / Magazine
- Periodicals
- Vacation
- Tattoo
- Tailor
- Shoeshine / Repair
- Personal Grooming Services

Primary Tag: Discretionary / Sinking Fund

---

## 6. Housing Optional / Extended Services

- Landscaping
- Snow Removal
- Pest Control
- Pool Expenses
- House Cleaning
- Alarm System
- Composting Service

Primary Tag: Sinking Fund / Discretionary

---

## 7. Transportation

- Fuel / Gas
- Parking
- Tolls
- Rideshare (Uber, Lyft)
- Public Transportation
- OnStar
- Vehicle Lease

Primary Tag: Essential / Discretionary

---

## 8. Children (Future-Ready)

- Child Support
- Children’s Allowance
- Children’s Babysitting
- Children’s Books / Supplies
- Children’s Day Care
- Children’s Lessons
- Children’s Nanny
- Children’s School Lunch
- Children’s Sports
- Children’s Summer Camp
- Children’s Tuition
- Children’s Tutoring

Primary Tag: Essential / Sinking Fund

---

## 9. Financial & Investment (Expansion Domain)

- IRA
- Personal Investments
- Precious Metals
- Primary Crypto Wallet
- Crypto Trading
- Experimental Crypto Investments
- Alternative Investments
- Event Trading
- Gambling

Primary Tag: Growth / Speculative

---

## 10. Administrative & Miscellaneous

- Government
- Real Estate Taxes
- Donations
- Cloud Storage
- Financial Planner
- Uncategorized (Review Required)

Primary Tag: Contextual

---

# Operational Modes

---

## Mode 1 — Stabilization

Active Domains:
- Infrastructure
- Health
- Minimum Debt
- Core Stability

Inactive:
- Growth allocations
- Speculative investing
- Non-essential discretionary expansion

Condition:
Cash Flow ≥ Fixed Essentials + Minimum Debt

---

## Mode 2 — Expansion

Activated when:
Income exceeds baseline obligations.

Re-enable:
- Percentage-based allocation models
- Investment contributions
- Accelerated debt reduction
- Long-term growth buckets

---

# Governance Rules

1. Every transaction must map to a defined category.
2. Uncategorized transactions must be reviewed weekly.
3. New categories require architectural review.
4. Tag intent must reflect financial role, not emotion.
5. Quarterly structure audit recommended.
6. Annual simplification pass encouraged.

---

# Implementation Notes

- Categories should be stored as structured enums or database entities.
- Tags should support many-to-many relationships with transactions.
- Budget logic should support both fixed-amount and percentage-based models.
- Hidden categories may remain available for future activation.
- System must support future scalability without taxonomy rewrite.

---

# Status

Architecture Stable  
Ready for Expense Integration  
Ready for Automation Layer