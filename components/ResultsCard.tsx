"use client";

import { CalculationResult, ScenarioInput, formatCurrency } from "@/lib/formulas";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface ResultsCardProps {
  scenario: ScenarioInput;
  results: CalculationResult;
}

export default function ResultsCard({ scenario, results }: ResultsCardProps) {
  const isProfitable = results.netBenefit > 0;
  const personalBetter = results.comparison.betterOption === "personal";

  // Data for pie chart (monthly cost breakdown)
  const pieData = [
    { name: "תשלום הלוואה", value: results.monthlyPayment, color: "#3B82F6" },
    { name: "אנרגיה/דלק", value: results.monthlyEnergy, color: "#10B981" },
    { name: "אחזקה", value: scenario.monthlyMaint, color: "#F59E0B" },
    { name: "ביטוח", value: scenario.monthlyInsurance, color: "#EF4444" },
  ];

  // Data for bar chart (overall breakdown)
  const barData = [
    {
      name: "תוספת",
      amount: scenario.employerAllowance * results.totalMonths,
      fill: "#10B981",
    },
    {
      name: "סה״כ עלויות",
      amount: results.monthlyTotal * results.totalMonths,
      fill: "#EF4444",
    },
    {
      name: "ערך הרכב אחרי ירידת ערך",
      amount: results.residualValue,
      fill: "#3B82F6",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 space-y-6 card-hover"
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{scenario.name}</h2>
        <p className="text-sm text-gray-500 mt-1 capitalize flex items-center gap-2">
          {scenario.powertrain === "electric" && "⚡"}
          {scenario.powertrain === "hybrid" && "🔋"}
          {scenario.powertrain === "ice" && "⛽"}
          רכב {scenario.powertrain === "electric" ? "חשמלי" : scenario.powertrain === "hybrid" ? "היברידי" : "בנזין"} • שנתון {scenario.year}
        </p>
      </div>

      {/* Main Comparison Result */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`relative overflow-hidden p-8 rounded-2xl ${
          personalBetter
            ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500'
            : 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500'
        } shadow-2xl`}
      >
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 font-medium mb-2 text-base"
          >
            המלצה לאחר {scenario.horizonYears} שנים
          </motion.p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="text-4xl font-black text-white mb-4 drop-shadow-lg"
          >
            {personalBetter ? '🚗 רכב אישי + תוספת' : '🏢 רכב חברה'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex flex-col items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          >
            <span className="text-white font-semibold text-lg">
              יתרון של {formatCurrency(Math.abs(results.comparison.difference))}
            </span>
            <span className="text-white/80 text-sm">
              (כ-{formatCurrency(Math.abs(results.comparison.monthlyDifference))} לחודש)
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Car Option */}
        <div className={`p-6 rounded-xl border-2 ${personalBetter ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              🚗 רכב אישי
            </h3>
            {personalBetter && <span className="text-2xl">✓</span>}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">תוספת ברוטו חודשית:</span>
              <span className="font-semibold text-gray-500">{formatCurrency(scenario.employerAllowance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-xs">מס הכנסה ({(scenario.taxBracket * 100).toFixed(0)}%):</span>
              <span className="font-semibold text-red-400 text-xs">-{formatCurrency(scenario.employerAllowance * scenario.taxBracket)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-xs">ביטוח לאומי ({(scenario.nationalInsurance * 100).toFixed(1)}%):</span>
              <span className="font-semibold text-red-400 text-xs">-{formatCurrency(scenario.employerAllowance * scenario.nationalInsurance)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-300">
              <span className="text-gray-600 text-xs">מס בריאות ({(scenario.healthTax * 100).toFixed(1)}%):</span>
              <span className="font-semibold text-red-400 text-xs">-{formatCurrency(scenario.employerAllowance * scenario.healthTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">תוספת נטו חודשית:</span>
              <span className="font-semibold text-green-600">+{formatCurrency(results.monthlyAllowanceNet)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500 text-xs italic">לעומת רכב חברה: חיסכון של</span>
              <span className="font-semibold text-blue-600 text-xs">+{formatCurrency(results.companyCar.monthlyTaxCost)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-300">
              <span className="text-gray-600 font-medium">תוספת בפועל לאחר חיסכון:</span>
              <span className="font-semibold text-green-700">+{formatCurrency(results.monthlyAllowanceNet + results.companyCar.monthlyTaxCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">עלות חודשית:</span>
              <span className="font-semibold text-red-600">-{formatCurrency(results.monthlyTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ערך הרכב אחרי ירידת ערך:</span>
              <span className="font-semibold text-blue-600">+{formatCurrency(results.residualValue)}</span>
            </div>
          </div>
        </div>

        {/* Company Car Option */}
        <div className={`p-6 rounded-xl border-2 ${!personalBetter ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              🏢 רכב חברה
            </h3>
            {!personalBetter && <span className="text-2xl">✓</span>}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">שווי שימוש חודשי:</span>
              <span className="font-semibold text-gray-700">{formatCurrency(results.companyCar.monthlyTaxableValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-xs">מס הכנסה ({(scenario.taxBracket * 100).toFixed(0)}%):</span>
              <span className="font-semibold text-red-400 text-xs">-{formatCurrency(results.companyCar.monthlyTaxableValue * scenario.taxBracket)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-xs">ביטוח לאומי ({(scenario.nationalInsurance * 100).toFixed(1)}%):</span>
              <span className="font-semibold text-red-400 text-xs">-{formatCurrency(results.companyCar.monthlyTaxableValue * scenario.nationalInsurance)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-300">
              <span className="text-gray-600 text-xs">מס בריאות ({(scenario.healthTax * 100).toFixed(1)}%):</span>
              <span className="font-semibold text-red-400 text-xs">-{formatCurrency(results.companyCar.monthlyTaxableValue * scenario.healthTax)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-300">
              <span className="text-gray-600 font-medium">עלות חודשית בפועל:</span>
              <span className="font-semibold text-red-600">-{formatCurrency(results.companyCar.monthlyTaxCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">סה"כ לכל התקופה ({results.totalMonths} חודשים):</span>
              <span className="font-semibold text-red-600">-{formatCurrency(results.companyCar.totalTaxCost)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-gray-300">
              <span className="font-bold">עלות נטו:</span>
              <span className="font-bold text-lg text-red-600">
                {formatCurrency(results.companyCar.netCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Car Calculation Explanation */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
        <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          איך מחושב שווי שימוש ברכב חברה?
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            לפי רשות המיסים, שווי השימוש החודשי ברכב חברה הוא <strong>2.48%</strong> ממחיר הרכב (עד תקרה של ₪583,100 לשנת 2025).
          </p>
          {scenario.powertrain === "electric" && (
            <p className="text-green-700 font-medium">
              ✓ רכב חשמלי - הנחה חודשית של ₪1,350
            </p>
          )}
          {scenario.powertrain === "hybrid" && (
            <p className="text-blue-700 font-medium">
              ✓ רכב היברידי - הנחה חודשית של ₪560
            </p>
          )}
          <div className="bg-white p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-2">חישוב:</div>
            <div className="space-y-1 text-sm">
              <div>מחיר הרכב: {formatCurrency(Math.min(scenario.price, 583100))}</div>
              <div>שווי שימוש בסיס (2.48%): {formatCurrency(Math.min(scenario.price, 583100) * 0.0248)}</div>
              {(scenario.powertrain === "electric" || scenario.powertrain === "hybrid") && (
                <div className="text-green-600">
                  הנחה: -{formatCurrency(scenario.powertrain === "electric" ? 1350 : 560)}
                </div>
              )}
              <div className="font-bold pt-2 border-t">
                שווי שימוש סופי: {formatCurrency(results.companyCar.monthlyTaxableValue)}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            * מקור: מחשבון רשות המסים - https://secapp.taxes.gov.il/mm_usecar10/UseCarScreen.aspx
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">💰</span>
          פירוט עלויות חודשיות
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">תשלום הלוואה</span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.monthlyPayment)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">אנרגיה/דלק</span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.monthlyEnergy)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">אחזקה</span>
            <span className="font-semibold text-gray-800">{formatCurrency(scenario.monthlyMaint)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">ביטוח ורישוי</span>
            <span className="font-semibold text-gray-800">{formatCurrency(scenario.monthlyInsurance)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
            <span className="font-bold text-gray-800">סה"כ עלות חודשית</span>
            <span className="font-bold text-xl text-blue-600">{formatCurrency(results.monthlyTotal)}</span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span>
          סיכום פיננסי
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">תוספת חודשית</span>
            <span className="font-semibold text-green-700">{formatCurrency(scenario.employerAllowance)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">תקופת ניתוח</span>
            <span className="font-semibold text-gray-800">{results.totalMonths} חודשים</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">ערך הרכב אחרי ירידת ערך ({scenario.residualPct}%)</span>
            <span className="font-semibold text-blue-700">{formatCurrency(results.residualValue)}</span>
          </div>
        </div>
      </div>

      {/* Calculation Formula */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📐</span>
          איך אנחנו מחשבים
        </h3>

        {/* The Equation */}
        <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
          <div className="text-center space-y-3">
            <div className="text-sm font-medium text-gray-700">נוסחה:</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">Allowance × Months</span>
              <span className="text-gray-500">−</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-semibold">Cost × Months</span>
              <span className="text-gray-500">+</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">Residual</span>
            </div>
          </div>
        </div>

        {/* With Actual Numbers */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-center space-y-3">
            <div className="text-sm font-medium text-gray-700">החישוב שלך:</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-green-600 font-semibold">
                {formatCurrency(scenario.employerAllowance)} × {results.totalMonths}
              </span>
              <span className="text-gray-500">−</span>
              <span className="text-red-600 font-semibold">
                {formatCurrency(results.monthlyTotal)} × {results.totalMonths}
              </span>
              <span className="text-gray-500">+</span>
              <span className="text-blue-600 font-semibold">
                {formatCurrency(results.residualValue)}
              </span>
            </div>
            <div className="text-gray-400 text-xs">=</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-green-600 font-semibold">
                {formatCurrency(scenario.employerAllowance * results.totalMonths)}
              </span>
              <span className="text-gray-500">−</span>
              <span className="text-red-600 font-semibold">
                {formatCurrency(results.monthlyTotal * results.totalMonths)}
              </span>
              <span className="text-gray-500">+</span>
              <span className="text-blue-600 font-semibold">
                {formatCurrency(results.residualValue)}
              </span>
            </div>
            <div className="text-gray-400 text-xs">=</div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(results.netBenefit)}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <details className="group">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <span className="font-medium text-gray-700">הצג פירוט מפורט</span>
            <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </summary>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">סה"כ תוספת שהתקבלה:</span>
            <span className="font-semibold text-green-700">+ {formatCurrency(scenario.employerAllowance * results.totalMonths)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">סה"כ עלויות ששולמו:</span>
            <span className="font-semibold text-red-700">− {formatCurrency(results.monthlyTotal * results.totalMonths)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ערך מכירה חוזרת:</span>
            <span className="font-semibold text-blue-700">+ {formatCurrency(results.residualValue)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>תוצאה נטו:</span>
            <span className={isProfitable ? 'text-green-700' : 'text-red-700'}>
              {formatCurrency(results.netBenefit)}
            </span>
          </div>
        </div>
      </details>

      {/* Total Overview Bar Chart */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📈</span>
          התמונה הפיננסית הכוללת
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
