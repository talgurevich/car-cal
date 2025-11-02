"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScenarioForm from "@/components/ScenarioForm";
import ResultsCard from "@/components/ResultsCard";
import CalculationHistory from "@/components/CalculationHistory";
import { ScenarioInput, calculateScenario, CalculationResult } from "@/lib/formulas";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Save, Download, Upload, BookOpen } from "lucide-react";

interface HistoryItem {
  scenario: ScenarioInput;
  calculation: CalculationResult;
  timestamp: string;
}

export default function Home() {
  const [results, setResults] = useState<{
    scenario: ScenarioInput;
    calculation: CalculationResult;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedScenario, setSavedScenario] = useState<ScenarioInput | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load saved data and history on mount
  useEffect(() => {
    const saved = localStorage.getItem("carCalculatorScenario");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedScenario(parsed);
      } catch (e) {
        console.error("Failed to load saved scenario", e);
      }
    }

    const savedHistory = localStorage.getItem("carCalculatorHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [results]);

  const handleCalculate = (data: ScenarioInput) => {
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsCalculating(true);
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculation = calculateScenario(data);
      setResults({ scenario: data, calculation });

      // Add to history
      const newHistoryItem: HistoryItem = {
        scenario: data,
        calculation,
        timestamp: new Date().toISOString(),
      };

      setHistory((prevHistory) => {
        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 10); // Keep last 10
        localStorage.setItem("carCalculatorHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });

      setIsCalculating(false);
      toast.success("החישוב הושלם!", {
        icon: "🎉",
        duration: 2000,
      });
    }, 500);
  };

  const handleLoadScenario = (scenario: ScenarioInput) => {
    setSavedScenario(scenario);
    toast.success("התרחיש נטען!", {
      icon: "📂",
      duration: 2000,
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (results) {
      localStorage.setItem("carCalculatorScenario", JSON.stringify(results.scenario));
      toast.success("התרחיש נשמר!", {
        icon: "💾",
        duration: 2000,
      });
    }
  };

  const handleExport = () => {
    if (results) {
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `car-calculation-${results.scenario.name}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("התוצאות יוצאו!", {
        icon: "📥",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            כלי תכנון פיננסי
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
          >
            השוואת עלויות רכב
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed"
          >
            קבלו החלטה מושכלת: האם לקחת את <span className="font-semibold text-blue-600">תוספת המעסיק</span> או להשאיר את <span className="font-semibold text-purple-600">רכב החברה</span>?
          </motion.p>

          {/* Explanations Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6"
          >
            <Link href="/explanations">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-purple-300"
              >
                <BookOpen size={20} />
                <span className="font-medium">הסברים ופרטים על החישובים</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Action Buttons */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300"
              >
                <Save size={20} />
                <span className="font-medium">שמור תרחיש</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Download size={20} />
                <span className="font-medium">ייצא תוצאות</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-2 lg:order-1">
          <ScenarioForm onSubmit={handleCalculate} defaultValues={savedScenario || undefined} />
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
          <AnimatePresence mode="wait">
            {isCalculating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-center text-gray-500 py-12">
                  <div className="mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mx-auto h-20 w-20 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    מחשב...
                  </h3>
                  <p className="text-gray-500">
                    מעבד את הנתונים עבור התרחיש שלך
                  </p>
                </div>
              </motion.div>
            ) : results ? (
              <ResultsCard key="results" scenario={results.scenario} results={results.calculation} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-center text-gray-500 py-12">
                  <div className="mb-6">
                    <svg
                      className="mx-auto h-20 w-20 text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    מוכנים לחישוב?
                  </h3>
                  <p className="text-gray-500">
                    מלאו את הטופס מימין ולחצו על חישוב לקבלת תוצאות מותאמות אישית
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History Section */}
      <CalculationHistory history={history} onLoadScenario={handleLoadScenario} />

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center text-sm text-gray-500"
      >
        <p>כל החישובים הם הערכות. העלויות בפועל עשויות להשתנות בהתאם לתנאי השוק.</p>
        <p className="mt-2 text-xs">
          <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">Ctrl+S</kbd> לשמירה •
          <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 mr-2">Ctrl+E</kbd> לייצוא
        </p>
      </motion.div>
      </div>
    </>
  );
}
