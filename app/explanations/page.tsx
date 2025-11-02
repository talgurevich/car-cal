"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ExplanationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowRight className="rotate-180" size={20} />
            <span>חזרה למחשבון</span>
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            הסברים ופרטים
          </h1>
          <p className="text-xl text-gray-700">
            מדריך מלא להבנת כל השדות והחישובים
          </p>
        </motion.div>

        {/* Input Fields Explanations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">📝</span>
            שדות הקלט
          </h2>

          <div className="space-y-6">
            <ExplanationCard
              title="שם התרחיש"
              description="שם מזהה לתרחיש שלך - לדוגמה: 'טסלה 2024' או 'יונדאי יוניק 2023'. השם יעזור לך לזהות את התרחיש בהיסטוריית החישובים."
            />

            <ExplanationCard
              title="שנתון"
              description="שנת ייצור הרכב. שדה זה משפיע על החישוב של עלות התחזוקה החודשית - רכבים ישנים יותר דורשים בדרך כלל תחזוקה יקרה יותר."
            />

            <ExplanationCard
              title="מחיר הרכב"
              description="מחיר הרכב בשקלים (כולל מע״מ). מחיר זה משמש לחישוב התשלום החודשי על ההלוואה ושווי השימוש של רכב חברה."
            />

            <ExplanationCard
              title="תקופת מימון"
              description="מספר השנים שבהן תממן את הרכב (1-7 שנים). ככל שתקופת המימון ארוכה יותר, התשלום החודשי יהיה נמוך יותר אך סך הריבית ששולמה יהיה גבוה יותר."
            />

            <ExplanationCard
              title="ריבית שנתית"
              description="אחוז הריבית השנתית על ההלוואה. למשל, 0.05 = 5% ריבית שנתית. ריבית טיפוסית בשנת 2025 נעה בין 3-7%."
            />

            <ExplanationCard
              title="ק״מ שנתי"
              description="מספר הקילומטרים הצפוי שתנסע בשנה. נתון זה משמש לחישוב עלות האנרגיה (חשמל או דלק) השנתית."
            />

            <ExplanationCard
              title="צריכת חשמל (kWh/100km)"
              description="רלוונטי לרכבים חשמליים והיברידיים. צריכה טיפוסית: 15-20 kWh/100km. משפיע ישירות על עלות האנרגיה."
            />

            <ExplanationCard
              title="צריכת דלק (ק״מ/ליטר)"
              description="רלוונטי לרכבים בנזין והיברידיים. צריכה טיפוסית: 12-18 ק״מ/ליטר. משפיע ישירות על עלות הדלק."
            />

            <ExplanationCard
              title="מחיר חשמל בבית (₪/kWh)"
              description="מחיר החשמל לטעינה בבית. טיפוסי: 0.5-0.7 ₪/kWh. זול יותר מטעינה ציבורית."
            />

            <ExplanationCard
              title="מחיר חשמל ציבורי (₪/kWh)"
              description="מחיר החשמל בתחנות טעינה ציבוריות. טיפוסי: 2-3 ₪/kWh."
            />

            <ExplanationCard
              title="אחוז טעינה בבית"
              description="אחוז הטעינות שתבצע בבית לעומת טעינה ציבורית. למשל, 0.7 = 70% טעינה בבית. ככל שהאחוז גבוה יותר, העלות נמוכה יותר."
            />

            <ExplanationCard
              title="מחיר דלק (₪/ליטר)"
              description="מחיר הדלק הנוכחי לליטר. טיפוסי בשנת 2025: 6-7 ₪/ליטר."
            />

            <ExplanationCard
              title="תחזוקה חודשית"
              description="עלות תחזוקה ממוצעת לחודש (שירותים, צמיגים, בלמים וכו'). המערכת מציעה ערכים מומלצים לפי סוג הרכב וגילו."
            />

            <ExplanationCard
              title="ביטוח חודשי"
              description="עלות הביטוח החודשית. תלוי בגיל הנהג, סוג הרכב וכיסויים. טיפוסי: 200-600 ₪/חודש."
            />

            <ExplanationCard
              title="ערך הרכב אחרי ירידת ערך %"
              description="אחוז ממחיר הרכב שיישאר בסוף תקופת הניתוח. טיפוסי: 30-50% לאחר 3-5 שנים. רכבים חשמליים נוטים לשמור ערך טוב יותר."
            />

            <ExplanationCard
              title="תוספת מעסיק ברוטו לשכר החודשי"
              description="הסכום הברוטו שהמעסיק מוכן לשלם לך במקום רכב חברה. סכום זה חייב במס הכנסה, ביטוח לאומי ומס בריאות."
            />

            <ExplanationCard
              title="תקופת ניתוח (שנים)"
              description="פרק הזמן שבו אתה מעוניין לבחון את העלויות. טיפוסי: 3-5 שנים. לדוגמה, אם תקופת הניתוח היא 3 שנים, המערכת תחשב את כל העלויות על פני 36 חודשים."
            />

            <ExplanationCard
              title="מדרגת מס"
              description="מדרגת מס ההכנסה שלך (ללא ביטוח לאומי ומס בריאות). טווח: 10%-50%. מדרגות 2025: 10%, 14%, 20%, 31%, 35%, 47%, 50%."
            />

            <ExplanationCard
              title="ביטוח לאומי"
              description="שיעור ביטוח לאומי. המערכת מציעה ערכים טיפוסיים לפי מדרגת המס שלך. טיפוסי: 0.4%-7%."
            />

            <ExplanationCard
              title="מס בריאות"
              description="שיעור מס בריאות. המערכת מציעה ערכים טיפוסיים לפי מדרגת המס שלך. טיפוסי: 3.1%-5%."
            />

            <ExplanationCard
              title="שווי שימוש חודשי (רכב חברה)"
              description="אופציונלי - אם תשאיר ריק, המערכת תחשב אוטומטית לפי נוסחאות רשות המסים. אם תמלא, המערכת תשתמש בערך שהזנת. שווי השימוש משמש לחישוב המס שתשלם על רכב חברה."
            />
          </div>
        </motion.div>

        {/* Output Fields Explanations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            שדות הפלט - רכב אישי
          </h2>

          <div className="space-y-6">
            <ExplanationCard
              title="תוספת ברוטו חודשית"
              description="הסכום הברוטו שהמעסיק משלם לך לפני ניכוי מסים. זהו הסכום המקורי שהוזן בשדה 'תוספת מעסיק'."
            />

            <ExplanationCard
              title="מס הכנסה / ביטוח לאומי / מס בריאות"
              description="פירוט הניכויים מהתוספת הברוטו. כל שורה מציגה את האחוז והסכום שמנוכה."
            />

            <ExplanationCard
              title="תוספת נטו חודשית"
              description="הסכום שבפועל נשאר לך בכיס לאחר כל הניכויים. זהו הסכום שתוכל להשתמש בו לתשלום עלויות הרכב."
            />

            <ExplanationCard
              title="לעומת רכב חברה: חיסכון של"
              description="הסכום שאתה חוסך בכל חודש לעומת רכב חברה. זהו המס שהיית משלם על שווי השימוש של רכב חברה."
            />

            <ExplanationCard
              title="תוספת בפועל לאחר חיסכון"
              description="סכום התוספת נטו בתוספת החיסכון מול רכב חברה. זהו הסכום האפקטיבי שיש לך לכיסוי עלויות."
            />

            <ExplanationCard
              title="עלות חודשית"
              description="סך כל העלויות החודשיות: תשלום להלוואה + אנרגיה + תחזוקה + ביטוח."
            />

            <ExplanationCard
              title="ערך הרכב אחרי ירידת ערך"
              description="ערך המכירה המשוער של הרכב בסוף תקופת הניתוח. סכום זה מחושב כאחוז ממחיר הקנייה המקורי."
            />
          </div>
        </motion.div>

        {/* Company Car Explanations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">🚗</span>
            שדות הפלט - רכב חברה
          </h2>

          <div className="space-y-6">
            <ExplanationCard
              title="שווי שימוש חודשי"
              description="הסכום שרשות המסים קובעת כהכנסה חייבת עבור השימוש ברכב החברה. מחושב לפי 2.48% ממחיר הרכב (עד תקרה של ₪583,100) עם הנחות לרכבים חשמליים (₪1,350) והיברידיים (₪560)."
            />

            <ExplanationCard
              title="עלות מס חודשית"
              description="המס שבפועל תשלם כל חודש על שווי השימוש. מחושב כשווי השימוש כפול סך שיעורי המס שלך (הכנסה + ביטוח לאומי + בריאות)."
            />

            <ExplanationCard
              title="סה״כ עלות מס"
              description="סך כל המס ששולם על רכב החברה לאורך תקופת הניתוח (עלות מס חודשית × מספר חודשים)."
            />

            <ExplanationCard
              title="עלות נטו"
              description="העלות הכוללת של רכב חברה לאורך התקופה. מוצג כמספר שלילי כי זוהי עלות."
            />
          </div>
        </motion.div>

        {/* Company Car Taxable Value Calculation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">📐</span>
            איך מחושב שווי שימוש ברכב חברה?
          </h2>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 shadow-lg">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                לפי רשות המיסים, שווי השימוש החודשי ברכב חברה הוא <strong className="text-purple-700">2.48%</strong> ממחיר הרכב
                (עד תקרה של <strong className="text-purple-700">₪583,100</strong> לשנת 2025).
              </p>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-800">הנחות לפי סוג רכב:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong className="text-green-700">רכב חשמלי:</strong> הנחה חודשית של ₪1,350
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <div>
                      <strong className="text-blue-700">רכב היברידי:</strong> הנחה חודשית של ₪560
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <div>
                      <strong className="text-gray-700">רכב בנזין:</strong> ללא הנחה
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">דוגמה לחישוב - רכב חשמלי במחיר ₪200,000:</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-700">מחיר הרכב:</span>
                    <span className="font-semibold">₪200,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-700">שווי שימוש בסיס (2.48%):</span>
                    <span className="font-semibold">₪4,960</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-green-700">הנחה רכב חשמלי:</span>
                    <span className="font-semibold text-green-600">-₪1,350</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold">שווי שימוש סופי:</span>
                    <span className="font-bold text-purple-700 text-lg">₪3,610</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">דוגמה לחישוב - רכב בנזין במחיר ₪150,000:</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-700">מחיר הרכב:</span>
                    <span className="font-semibold">₪150,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-700">שווי שימוש בסיס (2.48%):</span>
                    <span className="font-semibold">₪3,720</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold">שווי שימוש סופי:</span>
                    <span className="font-bold text-purple-700 text-lg">₪3,720</span>
                  </div>
                  <p className="text-xs text-gray-500 italic mt-2">(ללא הנחה - רכב בנזין)</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  שימו לב:
                </h4>
                <p className="text-sm text-yellow-800">
                  אם המעסיק מספק גם דלק או חשמל לרכב, יש להוסיף את שווי הדלק/חשמל לשווי השימוש החודשי.
                  המחשבון הנוכחי מניח שאתה משלם בעצמך על האנרגיה.
                </p>
              </div>

              <div className="text-xs text-gray-500 italic border-t pt-3">
                <strong>מקור:</strong> מחשבון רשות המסים -
                <a
                  href="https://secapp.taxes.gov.il/mm_usecar10/UseCarScreen.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline mr-1"
                >
                  https://secapp.taxes.gov.il/mm_usecar10/UseCarScreen.aspx
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calculation Methodology */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">🧮</span>
            שיטת החישוב
          </h2>

          <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">רכב אישי:</h3>
              <p className="text-gray-700 leading-relaxed">
                החישוב לוקח את סך התוספת נטו שקיבלת (לאחר מסים) לאורך התקופה, מחסיר את סך העלויות (הלוואה, אנרגיה, תחזוקה, ביטוח), ומוסיף את ערך המכירה המשוער של הרכב בסוף התקופה.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">רכב חברה:</h3>
              <p className="text-gray-700 leading-relaxed">
                החישוב מחשב את המס שתשלם על שווי השימוש לאורך התקופה. אין עלויות נוספות כי החברה משלמת על הכל (הלוואה, אנרגיה, תחזוקה, ביטוח), ואין ערך שיורי כי הרכב לא שלך.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg text-blue-900 mb-2">💡 טיפ:</h3>
              <p className="text-blue-800">
                המחשבון עוזר לך להשוות בין שתי האפשרויות ולקבל החלטה מושכלת. זכור לקחת בחשבון גם גורמים נוספים כמו נוחות, גמישות, וערך אישי.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-lg font-semibold"
          >
            <ArrowRight className="rotate-180" size={24} />
            <span>חזרה למחשבון</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

interface ExplanationCardProps {
  title: string;
  description: string;
}

function ExplanationCard({ title, description }: ExplanationCardProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
