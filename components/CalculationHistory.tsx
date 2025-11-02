"use client";

import { motion } from "framer-motion";
import { ScenarioInput, CalculationResult, formatCurrency } from "@/lib/formulas";
import { History, TrendingUp, TrendingDown, Trash2 } from "lucide-react";

interface HistoryItem {
  scenario: ScenarioInput;
  calculation: CalculationResult;
  timestamp: string;
}

interface CalculationHistoryProps {
  history: HistoryItem[];
  onLoadScenario: (scenario: ScenarioInput) => void;
  onClearHistory: () => void;
}

export default function CalculationHistory({ history, onLoadScenario, onClearHistory }: CalculationHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-16 mb-8"
    >
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              חישובים אחרונים
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            <span>נקה היסטוריה</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.slice(0, 6).map((item, index) => {
            const isProfitable = item.calculation.netBenefit > 0;
            const date = new Date(item.timestamp);

            return (
              <motion.div
                key={item.timestamp}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onLoadScenario(item.scenario)}
                className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {item.scenario.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      שנתון {item.scenario.year} • {date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {isProfitable ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">תוצאה נטו:</span>
                    <span className={`font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(item.calculation.netBenefit))}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">עלות חודשית:</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(item.calculation.monthlyTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">תוספת מעסיק:</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(item.scenario.employerAllowance)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-center text-gray-500 group-hover:text-purple-600 transition-colors">
                    לחץ לטעינה מחדש
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
