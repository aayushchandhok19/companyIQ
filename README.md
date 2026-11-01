# CompanyIQ – AI-Powered Corporate Financial Analytics Platform

CompanyIQ is an institutional-grade corporate financial intelligence platform engineered to ingest, analyze, visualize, and interpret authentic corporate financial data from official regulatory filing repositories, including the **U.S. Securities and Exchange Commission (SEC EDGAR)** and the **Ministry of Corporate Affairs (MCA) / National Stock Exchange of India (NSE) / BSE India**.

---

## 🏛️ Authentic Regulatory Data Integrations

CompanyIQ does **not** simulate, hallucinate, or fabricate financial numbers:
1. **US Public Enterprises (SEC EDGAR)**:
   - Live integration via SEC Company Facts XBRL API (`https://data.sec.gov/api/xbrl/companyfacts/`) and CIK Lookup.
   - Compliant HTTP User-Agent protocol with backend proxy caching to safeguard against CORS restrictions.
   - Genuine Form 10-K and 10-Q statements for companies such as Apple Inc. (CIK: 0000320193), Microsoft (CIK: 0000789019), Tesla (CIK: 0001318605), Amazon, Alphabet, and Meta.
2. **Indian Public & MCA Disclosures**:
   - Audited Ind-AS financial statements conforming to Schedule III presentation requirements.
   - Verified Corporate Identification Numbers (CINs) for premier enterprises such as:
     - **Tata Motors Limited** (CIN: `L28920MH1945PLC004520`, NSE: `TATAMOTORS`, BSE: `500570`)
     - **Reliance Industries Limited** (CIN: `L17110MH1973PLC019786`, NSE: `RELIANCE`, BSE: `500325`)
     - **Infosys Limited** (CIN: `L85110KA1981PLC013115`, NSE: `INFY`, BSE: `500209`)
     - **HDFC Bank Limited** (CIN: `L65920MH1994PLC080618`, NSE: `HDFCBANK`, BSE: `500180`)
3. **Four-Tier Data Confidence Architecture**:
   - **Official Reported Data**: Extracted directly from audited regulatory statements.
   - **Calculated from Reported Data**: Deterministic arithmetic derivations (EBITDA, Free Cash Flow, Net Margins, Ratios).
   - **Estimated using Disclosed Assumptions**: Explicitly labeled behavioral segregations (e.g. fixed vs variable overheads).
   - **Unavailable / Undisclosed**: Preserved as blank/hyphen to guarantee zero data fabrication.

---

## 📊 Core Features & Analytical Modules

1. **Company Search Engine**: Instant lookup by legal name, ticker, exchange, sector, or CIK/CIN with disambiguation cards.
2. **Complete Financial Statements**:
   - Profit & Loss Statement (Operating Revenue, COGS, Gross Profit, Operating Profit, EBITDA, EBIT, PBT, Tax, PAT, EPS).
   - Audited Balance Sheet with automatic double-entry equation validation ($\text{Total Assets} \equiv \text{Liabilities} + \text{Equity}$).
   - Cash Flow Statement with Free Cash Flow conversion ($\text{Operating CF} - \text{CapEx}$).
3. **Expense Intelligence**: Disclosed segregation into Fixed Overhead, Variable Production, and Other Disclosed Expenses with estimation methodology disclosure.
4. **20+ Financial Ratios**:
   - Profitability: Gross Margin, Operating Margin, EBITDA Margin, Net Profit Margin, ROA, ROE, ROCE.
   - Liquidity: Current Ratio, Quick Ratio, Cash Ratio.
   - Solvency: Debt-to-Equity, Interest Coverage, Debt-to-Assets.
   - Efficiency: Asset Turnover, Inventory Turnover, Receivables Turnover, Payables Turnover.
   - Growth: YoY Revenue Growth, Net Profit Growth, EBITDA Growth, Asset Growth, CAGR.
5. **12 Interactive Recharts Visualizations**:
   - Revenue vs Expenses, Net Profit vs Operating Profit, Revenue Growth Over Time, Quarterly Trends, Expense Breakdown, Fixed vs Variable, EBITDA Trend, Cash Flow Analysis, Assets vs Liabilities, Debt vs Equity, Profit Margins, and YoY Performance.
6. **Server-Side AI Financial Analyst (Gemini 3.8 Flash)**:
   - Grounded strictly in reported numbers.
   - Generates Executive Briefings, Health Ratings (0-100), Profitability Assessment, Working Capital Liquidity, Solvency & Leverage, Strengths, Weaknesses, Warning Signs, and Strategic Recommendations.
7. **Econometric Predictive Forecasting**: Ordinary Least Squares (OLS) trendline regression with 80% and 95% confidence intervals, and Base, Bull, and Bear scenario modeling.
8. **Peer Comparison Engine**: Side-by-side benchmarking with ratio-normalized metrics across international accounting frameworks.
9. **Financial Document Analyzer & XBRL Ingestion**: Upload Annual Report PDFs, Excel/CSV datasets, or XBRL XML to extract tables and audit balance sheet totals.
10. **Exportable Dossier & CSV**: One-click printable PDF dossier generation and CSV data table downloads.

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js 20+
- npm or bun

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
\`\`\`bash
# GEMINI_API_KEY: Server-side Gemini AI model calls
GEMINI_API_KEY="your_gemini_api_key_here"

# PORT (default: 3000)
PORT=3000
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Run Unit Tests (Pure Logic)
\`\`\`bash
npm run test # or npx --yes tsx --test src/utils/financialFormulas.test.ts
\`\`\`

### 5. Launch Full-Stack Server
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000` in your browser.

---

## 🛠️ Production Build & Deployment

\`\`\`bash
npm run build
npm start
\`\`\`
The application starts the production Express server serving the compiled Vite bundle and backend API endpoints.
