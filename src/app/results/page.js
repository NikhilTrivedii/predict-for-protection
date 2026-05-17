"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { Heart, Download, AlertCircle, CheckCircle, Activity, ChevronLeft } from "lucide-react";
import { generatePDF } from "@/utils/pdfGenerator";

// Fallback mock logic if Python server isn't running
const fallbackMockPrediction = (data) => {
  let risk_score = 0.35;
  const age = Number(data.age) || 50;
  const chol = Number(data.chol) || 200;
  const trestbps = Number(data.trestbps) || 120;
  
  if (age > 60) risk_score += 0.2;
  if (chol > 240) risk_score += 0.2;
  if (trestbps > 140) risk_score += 0.15;
  
  risk_score = Math.max(0.05, Math.min(0.95, risk_score));
  
  return {
    risk_percentage: (risk_score * 100).toFixed(1),
    is_high_risk: risk_score > 0.5,
    shap_values: [
      { feature: "Age", value: (age - 50) * 0.005 },
      { feature: "Cholesterol", value: (chol - 200) * 0.002 },
      { feature: "Blood Pressure", value: (trestbps - 120) * 0.003 },
    ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    recommendations: [
      {
        category: "Diet & Nutrition",
        title: "Heart Healthy Indian Diet",
        dos: [
          "Include fibrous vegetables like Bhindi (Okra) and Baingan.",
          "Eat green leafy vegetables (Palak, Methi, Sarson).",
          "Use whole grains (Oats, Bajra, Jowar Roti)."
        ],
        donts: [
          "Strictly limit salt to less than 1500mg daily (avoid Achar/Pickles).",
          "Avoid deep-fried Indian snacks (Samosa, Pakora).",
          "Limit full-fat dairy (Malai, excessive Ghee)."
        ],
        time_guide: "Have a light dinner at least 2 hours before sleeping."
      },
      {
        category: "Exercise & Activity",
        title: "Daily Cardiovascular Routine",
        dos: [
          "Brisk walking in the morning or evening.",
          "Light Yoga (Pranayama, Anulom Vilom)."
        ],
        donts: [
          "Avoid heavy weightlifting or intense isometric exercises.",
          "Do not exercise immediately after a heavy meal."
        ],
        time_guide: "30-40 minutes per day, at least 5 days a week."
      }
    ]
  };
};

export default function Results() {
  const router = useRouter();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Patient");

  useEffect(() => {
    const rawData = sessionStorage.getItem("medicalData");
    if (!rawData) {
      router.push("/dashboard");
      return;
    }
    
    const parsedData = JSON.parse(rawData);
    setData(parsedData);
    
    // Attempt to fetch from Python Backend
    fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: Number(parsedData.age) || 50,
        sex: Number(parsedData.sex) || 1,
        cp: Number(parsedData.cp) || 0,
        trestbps: Number(parsedData.trestbps) || 120,
        chol: Number(parsedData.chol) || 200,
        fbs: Number(parsedData.fbs) || 0,
        restecg: Number(parsedData.restecg) || 0,
        thalach: Number(parsedData.thalach) || 150,
        exang: Number(parsedData.exang) || 0,
        oldpeak: Number(parsedData.oldpeak) || 0,
        slope: Number(parsedData.slope) || 1,
        ca: Number(parsedData.ca) || 0,
        thal: Number(parsedData.thal) || 2
      })
    })
    .then(res => res.json())
    .then(data => {
      setResult(data);
      setLoading(false);
    })
    .catch(err => {
      console.warn("Python backend unreachable, using fallback mock", err);
      setResult(fallbackMockPrediction(parsedData));
      setLoading(false);
    });
  }, [router]);

  const handleDownload = () => {
    generatePDF("pdf-report-content", `${userName}_Heart_Report.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ef] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-heading">Analyzing medical indicators...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#2d2a26] font-body relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="medical-grid opacity-30" />

      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <span className="font-heading font-bold text-lg">
              Predict<span className="text-rose-500">For</span>Protection
            </span>
          </a>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <ChevronLeft size={16} /> Edit Data
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              className="bg-white/60 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              placeholder="Enter Patient Name"
            />
          </div>
          <button onClick={handleDownload} className="btn-primary !py-2.5 flex items-center gap-2">
            <Download size={18} /> {t.results.downloadBtn}
          </button>
        </div>

        {/* --- PDF EXPORT CONTAINER --- */}
        <div id="pdf-report-content" className="bg-[#f8f4ef] rounded-3xl p-8 relative">
          
          {/* Header */}
          <div className="text-center mb-12 border-b border-gray-200 pb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Cardiovascular Risk Assessment</h1>
            <p className="text-gray-500">Patient: {userName} | Generated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Left: Risk Ring */}
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
              <h2 className="font-heading font-bold text-xl mb-6">{t.results.riskScore}</h2>
              
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={result.is_high_risk ? "#ef4444" : "#10b981"} 
                    strokeWidth="8" 
                    strokeDasharray={`${(result.risk_percentage / 100) * 283} 283`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-heading font-bold" style={{ color: result.is_high_risk ? "#ef4444" : "#10b981" }}>
                    {result.risk_percentage}%
                  </span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${result.is_high_risk ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                {result.is_high_risk ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                {result.is_high_risk ? t.results.highRisk : t.results.lowRisk}
              </div>
            </div>

            {/* Right: SHAP Explainability Waterfall */}
            <div className="glass-card p-8">
              <h2 className="font-heading font-bold text-xl mb-2 flex items-center gap-2">
                <Activity className="text-rose-500" size={20} /> {t.results.shapTitle}
              </h2>
              <p className="text-xs text-gray-500 mb-6">Red increases risk, Green decreases risk.</p>
              
              <div className="space-y-4">
                {result.shap_values.map((shap, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-gray-700">{shap.feature}</span>
                      <span className={shap.value > 0 ? "text-red-500" : "text-emerald-500"}>
                        {shap.value > 0 ? "+" : ""}{(shap.value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      {/* Midpoint is 50% */}
                      <div className="w-1/2 flex justify-end">
                        {shap.value < 0 && (
                          <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${Math.min(100, Math.abs(shap.value) * 500)}%` }} />
                        )}
                      </div>
                      <div className="w-1/2 flex justify-start">
                        {shap.value > 0 && (
                          <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${Math.min(100, shap.value * 500)}%` }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="font-heading font-bold text-2xl mb-6 border-b border-gray-200 pb-2">{t.results.recommendations}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white/60 border border-rose-500/10 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                  <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">{rec.category}</div>
                  <h3 className="font-heading font-bold text-xl mb-4 text-gray-800">{rec.title}</h3>
                  
                  <div className="space-y-4 flex-1">
                    {/* Do's */}
                    {rec.dos && rec.dos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 mb-2">
                          <CheckCircle size={16} /> Recommended
                        </h4>
                        <ul className="space-y-1.5">
                          {rec.dos.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Don'ts */}
                    {rec.donts && rec.donts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 flex items-center gap-1.5 mb-2">
                          <AlertCircle size={16} /> Avoid
                        </h4>
                        <ul className="space-y-1.5">
                          {rec.donts.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Time Guide */}
                  {rec.time_guide && (
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <div className="text-sm font-semibold text-amber-700 flex items-center gap-1.5 mb-1">
                        ⏱️ Guidelines & Timing
                      </div>
                      <p className="text-sm text-gray-600">{rec.time_guide}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
