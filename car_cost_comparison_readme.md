# 🚗 Car Cost Comparison Calculator
*A Next.js web app for comparing employer car benefits vs. owning your own vehicle.*

---

## 🧭 Overview
This project helps employees decide whether it’s more cost-effective to keep a **company car** or take a **cash allowance** and buy their own vehicle (electric, hybrid, or gasoline).  

It calculates monthly ownership costs, loan payments, energy/fuel expenses, residual value, and the overall net financial outcome — making it easy to compare scenarios visually and transparently.

---

## 🎯 Goals
- Provide **clear and transparent** financial comparisons.  
- Support **multiple powertrains** (electric, hybrid, ICE).  
- Allow users to **simulate their real-world data** (km, energy cost, etc).  
- Offer full **Hebrew RTL** and **English** support.  
- Visualize results simply and intuitively.

---

## 🥮 Core Features

### 1. Input Form
Collects:
- Vehicle name, price, and type (electric/hybrid/ICE)
- Finance term (years) and APR
- Annual kilometers driven
- Energy or fuel consumption
- Electricity and fuel prices
- Monthly maintenance/insurance
- Residual value %
- Employer allowance (₪/month)
- Analysis horizon (years)

### 2. Calculations
The app computes:
- **Loan payment (PMT formula)**
- **Monthly operating cost** (energy + maintenance)
- **Total monthly cost**
- **Residual value** at end of period
- **Net benefit after N months**

  ```text
  Net = (employer_allowance × months)
        − (monthly_total_cost × months)
        + residual_value
  ```

### 3. Results & Comparison
- Single-scenario summary  
- Multi-vehicle comparison view  
- Bar chart: *Net after N months*  
- Color indicator (green/red) for profitability

### 4. Language & Units
- Fully bilingual 🇮🇱 / 🇺🇸  
- RTL layout for Hebrew  
- Currency in ₪ (no decimals)

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript |
| **UI / Styling** | TailwindCSS + shadcn/ui |
| **Forms / Validation** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Internationalization** | next-intl (Hebrew/English) |
| **Storage** | localStorage (for scenarios) |
| **Deployment** | Vercel |

---

## 🗂️ Pages

| Route | Description |
|--------|--------------|
| `/` | Main calculator (single scenario) |
| `/compare` | Side-by-side comparison table |
| `/about` | Explanation of formulas and logic |
| `/api/health` | Basic health check endpoint |

---

## 🧠 Data Model

```ts
export type Powertrain = "electric" | "hybrid" | "ice";

export interface ScenarioInput {
  name: string;
  powertrain: Powertrain;
  price: number;
  financeYears: number;
  apr: number;
  annualKm: number;
  kwhPer100?: number;
  kmPerLiter?: number;
  elecHomePrice: number;
  elecPublicPrice: number;
  homeChargeShare: number;
  fuelPrice: number;
  monthlyMaint: number;
  residualPct: number;
  employerAllowance: number;
  horizonYears: number;
}
```

---

## 🔢 Key Formulas

```ts
// Monthly payment
const pmt = (apr, years, principal) => {
  const r = apr / 12;
  const n = years * 12;
  return r === 0 ? principal / n : (r * principal) / (1 - Math.pow(1 + r, -n));
};

// Monthly energy cost
const monthlyEnergy = (s) => {
  if (s.powertrain === "electric") {
    const kwhYear = (s.annualKm / 100) * (s.kwhPer100 ?? 0);
    const home = kwhYear * s.homeChargeShare * s.elecHomePrice;
    const pub = kwhYear * (1 - s.homeChargeShare) * s.elecPublicPrice;
    return (home + pub) / 12;
  }
  const litersYear = s.kmPerLiter ? s.annualKm / s.kmPerLiter : 0;
  return (litersYear * s.fuelPrice) / 12;
};
```

---

## 💡 UX Notes
- Live updates as inputs change.  
- Default values tuned for Israeli conditions.  
- “How we calculate” page for transparency.  
- Save, duplicate, or share scenarios via URL parameters.  

---

## 🚀 Future Enhancements
- Sensitivity sliders (±10 % on fuel/energy costs).  
- Export comparison to CSV/Excel.  
- PWA support (offline mode).  
- Dark/light themes.  
- Optional backend for user history and saved scenarios.  

---

## 🏁 Next Steps

1. **Initialize the project**
   ```bash
   npx create-next-app carcalc --ts --tailwind
   ```

2. **Install dependencies**
   ```bash
   npm install react-hook-form zod recharts next-intl shadcn/ui clsx
   ```

3. **Create base components**
   - `ScenarioForm.tsx`
   - `ResultsCard.tsx`
   - `CompareTable.tsx`
   - `lib/formulas.ts`

4. **Implement core pages**
   - `/` – single scenario  
   - `/compare` – multiple comparison  
   - `/about` – documentation  

5. **Add RTL + deploy**
   - Verify Hebrew layout and number formatting  
   - Deploy on **Vercel**

---

## 🧾 License
MIT — free for personal and educational use.

---