"use client";

import { useForm } from "react-hook-form";
import { ScenarioInput, Powertrain } from "@/lib/formulas";
import { motion } from "framer-motion";
import { Info, Zap, DollarSign, Gauge, Fuel, Wrench, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface ScenarioFormProps {
  onSubmit: (data: ScenarioInput) => void;
  defaultValues?: Partial<ScenarioInput>;
}

// Tooltip component for help text
function Tooltip({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        aria-label="More information"
      >
        <Info size={16} />
      </button>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-64 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-6"
        >
          {text}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-4" />
        </motion.div>
      )}
    </div>
  );
}

export default function ScenarioForm({ onSubmit, defaultValues }: ScenarioFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScenarioInput>({
    defaultValues: {
      name: defaultValues?.name ?? "הרכב שלי",
      year: defaultValues?.year ?? new Date().getFullYear(),
      powertrain: defaultValues?.powertrain ?? "electric",
      price: defaultValues?.price ?? 200000,
      financeYears: defaultValues?.financeYears ?? 5,
      apr: defaultValues?.apr ?? 0.05,
      annualKm: defaultValues?.annualKm ?? 20000,
      kwhPer100: defaultValues?.kwhPer100 ?? 15,
      kmPerLiter: defaultValues?.kmPerLiter ?? 15,
      elecHomePrice: defaultValues?.elecHomePrice ?? 0.5,
      elecPublicPrice: defaultValues?.elecPublicPrice ?? 1.5,
      homeChargeShare: defaultValues?.homeChargeShare ?? 0.8,
      fuelPrice: defaultValues?.fuelPrice ?? 7,
      monthlyMaint: defaultValues?.monthlyMaint ?? 500,
      monthlyInsurance: defaultValues?.monthlyInsurance ?? 300,
      residualPct: defaultValues?.residualPct ?? 40,
      employerAllowance: defaultValues?.employerAllowance ?? 3000,
      horizonYears: defaultValues?.horizonYears ?? 3,
      taxBracket: defaultValues?.taxBracket ?? 0.47,
      nationalInsurance: defaultValues?.nationalInsurance ?? 0.07,
      healthTax: defaultValues?.healthTax ?? 0.05,
      companyCarTaxableValue: defaultValues?.companyCarTaxableValue,
    },
  });

  const powertrain = watch("powertrain");
  const year = watch("year");
  const price = watch("price");
  const taxBracket = watch("taxBracket");

  // Auto-suggest ביטוח לאומי and מס בריאות based on tax bracket
  const getSuggestedNationalInsurance = (bracket: number) => {
    // ביטוח לאומי is typically around 7% for employees
    // Lower for low incomes, capped at high incomes
    if (bracket <= 0.14) return 0.0004; // Very low income - minimal
    if (bracket <= 0.20) return 0.035; // Low income
    if (bracket <= 0.31) return 0.07; // Standard rate
    return 0.07; // Capped at high incomes
  };

  const getSuggestedHealthTax = (bracket: number) => {
    // מס בריאות: 3.1% up to average wage, 5% above
    if (bracket <= 0.14) return 0.031; // Low income
    if (bracket <= 0.20) return 0.031; // Up to average wage
    return 0.05; // Above average wage
  };

  // Calculate suggested maintenance cost based on car age, type, and price
  const getSuggestedMaintenance = () => {
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - (year || currentYear);

    // Base maintenance by powertrain type and age
    let baseMaintenance = 500;

    if (powertrain === "electric") {
      if (carAge <= 3) baseMaintenance = 400;
      else if (carAge <= 5) baseMaintenance = 550;
      else baseMaintenance = 800;
    } else if (powertrain === "hybrid") {
      if (carAge <= 3) baseMaintenance = 550;
      else if (carAge <= 5) baseMaintenance = 750;
      else baseMaintenance = 1000;
    } else { // ice
      if (carAge <= 3) baseMaintenance = 650;
      else if (carAge <= 5) baseMaintenance = 900;
      else baseMaintenance = 1250;
    }

    // Adjust by car price (luxury cars cost more to maintain)
    if (price && price > 250000) {
      baseMaintenance *= 1.3;
    } else if (price && price < 150000) {
      baseMaintenance *= 0.8;
    }

    return Math.round(baseMaintenance);
  };

  // Update form when defaultValues change (e.g., loading from history)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 card-hover"
    >
      {/* Header */}
      <div className="border-b-2 border-gradient-to-r from-blue-500 to-purple-600 pb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">פרטי הרכב</h2>
        <p className="text-gray-600 mt-2">הזינו את המפרט והפרטים הפיננסיים של הרכב</p>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">1</span>
          </div>
          <h3 className="font-semibold text-gray-700">מידע בסיסי</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם הרכב</label>
            <input
              {...register("name", { required: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="למשל, טסלה מודל 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שנתון</label>
            <input
              type="number"
              {...register("year", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג מנוע</label>
            <select {...register("powertrain")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              <option value="electric">⚡ חשמלי</option>
              <option value="hybrid">🔋 היברידי</option>
              <option value="ice">⛽ בנזין</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">2</span>
          </div>
          <h3 className="font-semibold text-gray-700">פרטים פיננסיים</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מחיר (₪)</label>
            <input
              type="number"
              {...register("price", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">משך המימון (שנים)</label>
            <input
              type="number"
              {...register("financeYears", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              ריבית שנתית
              <span className="text-xs text-gray-500 mr-1">(0.05 = 5%)</span>
              <Tooltip text="ריבית שנתית - שיעור הריבית השנתי על הלוואת הרכב. לדוגמה, 0.05 מייצג ריבית של 5% בשנה." />
            </label>
            <input
              type="number"
              step="0.01"
              {...register("apr", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">3</span>
          </div>
          <h3 className="font-semibold text-gray-700">שימוש ויעילות</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">קילומטרים שנתיים</label>
            <input
              type="number"
              {...register("annualKm", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {(powertrain === "electric" || powertrain === "hybrid") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                קוט"ש ל-100 ק"מ
                <Tooltip text="קצב צריכת אנרגיה - כמה קילו-וואט-שעות הרכב שלך צורך ב-100 קילומטר. רכבים חשמליים טיפוסיים נעים בין 12-20 קוט״ש/100 ק״מ." />
              </label>
              <input
                type="number"
                step="0.1"
                {...register("kwhPer100", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          {(powertrain === "ice" || powertrain === "hybrid") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ק"מ לליטר</label>
              <input
                type="number"
                step="0.1"
                {...register("kmPerLiter", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}
        </div>
      </div>

      {/* Energy Costs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-yellow-600 font-semibold text-sm">4</span>
          </div>
          <h3 className="font-semibold text-gray-700">עלויות אנרגיה ודלק</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
          {(powertrain === "electric" || powertrain === "hybrid") && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">חשמל בית (₪/קוט"ש)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("elecHomePrice", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">טעינה ציבורית (₪/קוט"ש)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("elecPublicPrice", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  אחוז טעינה בבית
                  <span className="text-xs text-gray-500 mr-1">(0-1)</span>
                  <Tooltip text="אחוז הטעינה המתבצעת בבית לעומת תחנות ציבוריות. 0.8 משמעותו 80% טעינה בבית, 20% ציבורי. טעינה בבית בדרך כלל זולה יותר." />
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  {...register("homeChargeShare", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </>
          )}

          {(powertrain === "ice" || powertrain === "hybrid") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">מחיר דלק (₪/ליטר)</label>
              <input
                type="number"
                step="0.1"
                {...register("fuelPrice", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}
        </div>
      </div>

      {/* Other Costs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-semibold text-sm">5</span>
          </div>
          <h3 className="font-semibold text-gray-700">עלויות נוספות ופרטים</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              אחזקה חודשית (₪)
              <Tooltip text={`עלות אחזקה חודשית משוערת בהתאם לגיל הרכב (${new Date().getFullYear() - (year || new Date().getFullYear())} שנים), סוג המנוע, ומחיר הרכב. רכבים חשמליים זולים יותר לתחזוקה, רכבים ישנים יותר יקרים יותר.`} />
            </label>
            <input
              type="number"
              {...register("monthlyMaint", { required: true, valueAsNumber: true })}
              placeholder={`מומלץ: ₪${getSuggestedMaintenance()}`}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400 placeholder:font-medium"
            />
            <p className="text-xs text-gray-500 mt-1">
              רכב בן {new Date().getFullYear() - (year || new Date().getFullYear())} שנים •
              {powertrain === "electric" && " חשמלי - תחזוקה נמוכה"}
              {powertrain === "hybrid" && " היברידי - תחזוקה בינונית"}
              {powertrain === "ice" && " בנזין - תחזוקה גבוהה"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ביטוח ורישוי חודשי (₪)</label>
            <input
              type="number"
              {...register("monthlyInsurance", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              ערך שיורי %
              <Tooltip text="ערך המכירה החזוי של הרכב כאחוז ממחיר הרכישה לאחר תקופת הניתוח. בדרך כלל 30-50% לאחר 3-5 שנים." />
            </label>
            <input
              type="number"
              {...register("residualPct", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              תוספת מעסיק ברוטו לשכר החודשי (₪/חודש)
              <Tooltip text="זהו הסכום הברוטו שהמעסיק מוסיף לשכר החודשי שלך כתחליף לרכב חברה. הסכום הזה יתווסף למשכורת הגולמית שלך, ולכן יחויב במס הכנסה ודמי ביטוח לאומי לפי המדרגה שלך." />
            </label>
            <input
              type="number"
              {...register("employerAllowance", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              מדרגת מס הכנסה שולית
              <Tooltip text="המדרגה השולית של מס הכנסה בלבד (לא כולל ביטוח לאומי ומס בריאות). מדרגות המס בישראל: 10%, 14%, 20%, 31%, 35%, 47%, 50%." />
            </label>
            <select
              {...register("taxBracket", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value={0.10}>10% - מדרגה ראשונה</option>
              <option value={0.14}>14% - מדרגה שנייה</option>
              <option value={0.20}>20% - מדרגה שלישית</option>
              <option value={0.31}>31% - מדרגה רביעית</option>
              <option value={0.35}>35% - מדרגה חמישית</option>
              <option value={0.47}>47% - מדרגה שישית (ברירת מחדל)</option>
              <option value={0.50}>50% - מדרגה שביעית</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              ביטוח לאומי
              <span className="text-xs text-gray-500 mr-1">(0.07 = 7%)</span>
              <Tooltip text="שיעור ניכוי ביטוח לאומי לשכירים. בדרך כלל כ-7% למשכורות רגילות, נמוך יותר להכנסות נמוכות. השדה מתעדכן אוטומטית לפי מדרגת המס אך ניתן לשנות ידנית." />
            </label>
            <input
              type="number"
              step="0.001"
              {...register("nationalInsurance", { required: true, valueAsNumber: true })}
              placeholder={`מומלץ: ${(getSuggestedNationalInsurance(taxBracket || 0.47) * 100).toFixed(1)}%`}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              מומלץ: {(getSuggestedNationalInsurance(taxBracket || 0.47) * 100).toFixed(1)}% לפי מדרגת המס
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              מס בריאות
              <span className="text-xs text-gray-500 mr-1">(0.05 = 5%)</span>
              <Tooltip text="שיעור מס בריאות: 3.1% עד השכר הממוצע במשק, 5% מעל השכר הממוצע. השדה מתעדכן אוטומטית לפי מדרגת המס אך ניתן לשנות ידנית." />
            </label>
            <input
              type="number"
              step="0.001"
              {...register("healthTax", { required: true, valueAsNumber: true })}
              placeholder={`מומלץ: ${(getSuggestedHealthTax(taxBracket || 0.47) * 100).toFixed(1)}%`}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              מומלץ: {(getSuggestedHealthTax(taxBracket || 0.47) * 100).toFixed(1)}% לפי מדרגת המס
            </p>
          </div>
        </div>
      </div>

      {/* Company Car Value */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">6</span>
          </div>
          <h3 className="font-semibold text-gray-700">רכב חברה (אופציונלי)</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 mr-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              שווי שימוש חודשי (₪)
              <Tooltip text="שווי השימוש החודשי ברכב חברה לפי רשות המסים. אם תשאיר ריק, המערכת תחשב אוטומטית לפי מחיר הרכב, שנתון וסוג המנוע (2.48% מהמחיר עם הנחות לחשמלי/היברידי). אם יש לך שווי שימוש ספציפי מהמעסיק, הזן אותו כאן." />
            </label>
            <input
              type="number"
              {...register("companyCarTaxableValue", { valueAsNumber: true })}
              placeholder="אוטומטי - מחושב לפי מחיר הרכב"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              השאר ריק לחישוב אוטומטי לפי רשות המסים
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Period */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-sm">7</span>
          </div>
          <h3 className="font-semibold text-gray-700">תקופת הניתוח</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אופק הניתוח (שנים)</label>
            <input
              type="number"
              {...register("horizonYears", { required: true, valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          חשב תוצאות
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.button>
    </motion.form>
  );
}
