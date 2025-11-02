export type Powertrain = "electric" | "hybrid" | "ice";

export interface ScenarioInput {
  name: string;
  year: number; // שנתון - for display only, doesn't affect calculation
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
  monthlyInsurance: number;
  residualPct: number;
  employerAllowance: number;
  horizonYears: number;
  taxBracket: number; // income tax only (0.1 = 10%, 0.31 = 31%, etc.)
  nationalInsurance: number; // ביטוח לאומי (0.07 = 7%)
  healthTax: number; // מס בריאות (0.05 = 5%)
  companyCarTaxableValue?: number; // שווי שימוש חודשי - optional manual override
}

export interface CalculationResult {
  // Personal car (with allowance)
  monthlyPayment: number;
  monthlyEnergy: number;
  monthlyTotal: number;
  residualValue: number;
  netBenefit: number;
  totalMonths: number;
  monthlyAllowanceNet: number; // תוספת נטו לאחר מס
  totalAllowanceNet: number; // סה"כ תוספת נטו

  // Company car calculations
  companyCar: {
    monthlyTaxableValue: number; // שווי שימוש חודשי
    monthlyTaxCost: number; // עלות מס בפועל
    totalTaxCost: number; // סה"כ עלות מס לכל התקופה
    netCost: number; // עלות נטו של רכב חברה (ללא תוספת מעסיק)
  };

  // Comparison
  comparison: {
    difference: number; // הפרש בין אישי לחברה (חיובי = אישי יותר טוב)
    betterOption: "personal" | "company";
    monthlyDifference: number; // הפרש חודשי ממוצע
  };
}

/**
 * Calculate monthly loan payment using PMT formula
 */
export function calculateMonthlyPayment(
  apr: number,
  years: number,
  principal: number
): number {
  // If no financing (cash purchase), no monthly payment
  if (years === 0) {
    return 0;
  }

  const r = apr / 12;
  const n = years * 12;

  if (r === 0) {
    return principal / n;
  }

  return (r * principal) / (1 - Math.pow(1 + r, -n));
}

/**
 * Calculate monthly energy/fuel cost
 */
export function calculateMonthlyEnergy(scenario: ScenarioInput): number {
  if (scenario.powertrain === "electric") {
    const kwhYear = (scenario.annualKm / 100) * (scenario.kwhPer100 ?? 0);
    const homeCost = kwhYear * scenario.homeChargeShare * scenario.elecHomePrice;
    const publicCost = kwhYear * (1 - scenario.homeChargeShare) * scenario.elecPublicPrice;
    return (homeCost + publicCost) / 12;
  }

  if (scenario.powertrain === "hybrid") {
    // For hybrid, split between electric and fuel
    const electricShare = 0.5; // Assume 50% electric, 50% fuel for simplicity
    const kwhYear = (scenario.annualKm / 100) * (scenario.kwhPer100 ?? 0) * electricShare;
    const homeCost = kwhYear * scenario.homeChargeShare * scenario.elecHomePrice;
    const publicCost = kwhYear * (1 - scenario.homeChargeShare) * scenario.elecPublicPrice;
    const electricCost = (homeCost + publicCost) / 12;

    const litersYear = scenario.kmPerLiter
      ? (scenario.annualKm * (1 - electricShare)) / scenario.kmPerLiter
      : 0;
    const fuelCost = (litersYear * scenario.fuelPrice) / 12;

    return electricCost + fuelCost;
  }

  // ICE (gasoline)
  const litersYear = scenario.kmPerLiter ? scenario.annualKm / scenario.kmPerLiter : 0;
  return (litersYear * scenario.fuelPrice) / 12;
}

/**
 * Calculate company car taxable value (שווי שימוש) per month
 * Based on Israeli tax authority rates (2025)
 * Source: https://secapp.taxes.gov.il/mm_usecar10/UseCarScreen.aspx
 */
export function calculateCompanyCarTaxableValue(
  carPrice: number,
  carYear: number,
  powertrain: Powertrain
): number {
  // Price cap for 2025
  const PRICE_CAP = 583100;
  const MONTHLY_RATE = 0.0248; // 2.48% per month

  // Monthly deductions for electric/hybrid vehicles
  const DEDUCTION_ELECTRIC = 1350;
  const DEDUCTION_HYBRID = 560; // Standard hybrid (non-plug-in)

  // Use capped price
  const effectivePrice = Math.min(carPrice, PRICE_CAP);

  // Base taxable value
  let monthlyTaxableValue = effectivePrice * MONTHLY_RATE;

  // Apply deductions for electric/hybrid
  if (powertrain === "electric") {
    monthlyTaxableValue = Math.max(0, monthlyTaxableValue - DEDUCTION_ELECTRIC);
  } else if (powertrain === "hybrid") {
    monthlyTaxableValue = Math.max(0, monthlyTaxableValue - DEDUCTION_HYBRID);
  }

  return monthlyTaxableValue;
}

/**
 * Calculate complete scenario results
 */
export function calculateScenario(scenario: ScenarioInput): CalculationResult {
  // Personal car calculations
  const monthlyPayment = calculateMonthlyPayment(
    scenario.apr,
    scenario.financeYears,
    scenario.price
  );

  const monthlyEnergy = calculateMonthlyEnergy(scenario);
  const monthlyTotal = monthlyPayment + monthlyEnergy + scenario.monthlyMaint + scenario.monthlyInsurance;

  const residualValue = scenario.price * (scenario.residualPct / 100);
  const totalMonths = scenario.horizonYears * 12;

  // Calculate total effective tax rate
  const totalTaxRate = scenario.taxBracket + scenario.nationalInsurance + scenario.healthTax;

  // Calculate NET employer allowance (after income tax + ביטוח לאומי + מס בריאות)
  const monthlyAllowanceNet = scenario.employerAllowance * (1 - totalTaxRate);
  const totalAllowanceNet = monthlyAllowanceNet * totalMonths;

  // Net benefit: what you receive (after tax) minus what you spend, plus residual value
  const netBenefit = totalAllowanceNet - (monthlyTotal * totalMonths) + residualValue;

  // Company car calculations
  // Use manual value if provided, otherwise calculate
  const monthlyTaxableValue = scenario.companyCarTaxableValue ??
    calculateCompanyCarTaxableValue(scenario.price, scenario.year, scenario.powertrain);
  const monthlyTaxCost = monthlyTaxableValue * totalTaxRate;
  const totalTaxCost = monthlyTaxCost * totalMonths;

  // Net cost of company car (negative because it's a cost)
  // You don't get the allowance, but you only pay tax on שווי שימוש
  const companyCarNetCost = -totalTaxCost;

  // Comparison
  const difference = netBenefit - companyCarNetCost;
  const betterOption = difference > 0 ? "personal" : "company";
  const monthlyDifference = difference / totalMonths;

  return {
    monthlyPayment,
    monthlyEnergy,
    monthlyTotal,
    residualValue,
    netBenefit,
    totalMonths,
    monthlyAllowanceNet,
    totalAllowanceNet,
    companyCar: {
      monthlyTaxableValue,
      monthlyTaxCost,
      totalTaxCost,
      netCost: companyCarNetCost,
    },
    comparison: {
      difference,
      betterOption,
      monthlyDifference,
    },
  };
}

/**
 * Format currency in Israeli Shekels (no decimals)
 */
export function formatCurrency(amount: number): string {
  return `₪${Math.round(amount).toLocaleString('he-IL')}`;
}
