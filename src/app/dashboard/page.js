"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { Activity, Heart, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    age: "", sex: "1", cp: "0", trestbps: "", chol: "", 
    fbs: "0", restecg: "0", thalach: "", exang: "0", 
    oldpeak: "", slope: "1", ca: "0", thal: "2"
  });

  // Load saved data from localStorage when the component mounts (Returning User feature)
  useEffect(() => {
    const saved = localStorage.getItem("userMedicalProfile");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    // Auto-save to localStorage so they never lose progress
    localStorage.setItem("userMedicalProfile", JSON.stringify(updatedData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save to session storage so the results page and PDF generator can access it for this session
    sessionStorage.setItem("medicalData", JSON.stringify(formData));
    // Final save to localStorage for future visits
    localStorage.setItem("userMedicalProfile", JSON.stringify(formData));
    
    // Since we don't have the Python backend running in this pure frontend mock yet,
    // we'll navigate to results and the results page will fetch from the backend.
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#2d2a26] font-body relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="medical-grid opacity-30" />

      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <span className="font-heading font-bold text-lg">
              Predict<span className="text-rose-500">For</span>Protection
            </span>
          </a>
          <LanguageToggle />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 text-sm font-semibold mb-4">
            <Activity size={16} /> {t.dashboard.title}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">{t.dashboard.subtitle}</h1>
          
          {/* Demo Profiles */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => {
                const data = { age: "65", sex: "1", cp: "3", trestbps: "160", chol: "280", fbs: "1", restecg: "2", thalach: "120", exang: "1", oldpeak: "2.5", slope: "2", ca: "2", thal: "3" };
                setFormData(data); localStorage.setItem("userMedicalProfile", JSON.stringify(data));
              }}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 font-semibold text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              🔴 Load High Risk Patient
            </button>
            <button 
              onClick={() => {
                const data = { age: "55", sex: "0", cp: "1", trestbps: "130", chol: "240", fbs: "0", restecg: "1", thalach: "150", exang: "0", oldpeak: "1.0", slope: "1", ca: "1", thal: "2" };
                setFormData(data); localStorage.setItem("userMedicalProfile", JSON.stringify(data));
              }}
              className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 font-semibold text-sm hover:bg-amber-100 transition-colors flex items-center gap-2"
            >
              🟡 Load Borderline Patient
            </button>
            <button 
              onClick={() => {
                const data = { age: "35", sex: "1", cp: "0", trestbps: "115", chol: "180", fbs: "0", restecg: "0", thalach: "180", exang: "0", oldpeak: "0", slope: "0", ca: "0", thal: "0" };
                setFormData(data); localStorage.setItem("userMedicalProfile", JSON.stringify(data));
              }}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-semibold text-sm hover:bg-emerald-100 transition-colors flex items-center gap-2"
            >
              🟢 Load Healthy Patient
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-8">
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dashboard.fields.age}</label>
                    <input type="number" name="age" required value={formData.age} onChange={handleChange} 
                           className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all" />
                  </div>
                  {/* Sex */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dashboard.fields.sex}</label>
                    <select name="sex" value={formData.sex} onChange={handleChange}
                            className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all appearance-none">
                      <option value="1">{t.dashboard.fields.male}</option>
                      <option value="0">{t.dashboard.fields.female}</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Blood Pressure */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dashboard.fields.trestbps}</label>
                    <input type="number" name="trestbps" required value={formData.trestbps} onChange={handleChange} 
                           className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all" />
                  </div>
                  {/* Cholesterol */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dashboard.fields.chol}</label>
                    <input type="number" name="chol" required value={formData.chol} onChange={handleChange} 
                           className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Max Heart Rate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dashboard.fields.thalach}</label>
                    <input type="number" name="thalach" required value={formData.thalach} onChange={handleChange} 
                           className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all" />
                  </div>
                  {/* Oldpeak */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dashboard.fields.oldpeak}</label>
                    <input type="number" step="0.1" name="oldpeak" required value={formData.oldpeak} onChange={handleChange} 
                           className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all" />
                  </div>
                </div>

                {/* Dropdowns for Categorical Data */}
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-200/60">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">{t.dashboard.fields.cp}</label>
                    <select name="cp" value={formData.cp} onChange={handleChange} className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 appearance-none">
                      <option value="0">Typical Angina</option>
                      <option value="1">Atypical Angina</option>
                      <option value="2">Non-anginal Pain</option>
                      <option value="3">Asymptomatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">{t.dashboard.fields.fbs}</label>
                    <select name="fbs" value={formData.fbs} onChange={handleChange} className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 appearance-none">
                      <option value="0">False</option>
                      <option value="1">True</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">{t.dashboard.fields.restecg}</label>
                    <select name="restecg" value={formData.restecg} onChange={handleChange} className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 appearance-none">
                      <option value="0">Normal</option>
                      <option value="1">ST-T Wave Abnormality</option>
                      <option value="2">Left Ventricular Hypertrophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">{t.dashboard.fields.exang}</label>
                    <select name="exang" value={formData.exang} onChange={handleChange} className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 appearance-none">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">{t.dashboard.fields.slope}</label>
                    <select name="slope" value={formData.slope} onChange={handleChange} className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 appearance-none">
                      <option value="0">Upsloping</option>
                      <option value="1">Flat</option>
                      <option value="2">Downsloping</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">{t.dashboard.fields.ca}</label>
                    <select name="ca" value={formData.ca} onChange={handleChange} className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 appearance-none">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg">
                    {t.dashboard.submit} <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-rose-500/10 to-amber-500/5">
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Heart className="text-rose-500" size={20} /> Data Security
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Your medical data is analyzed locally or securely transmitted to our inference engine via encrypted protocols. We do not store your health information after analysis.
              </p>
              <div className="flex gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <Activity size={14} /> End-to-End Encrypted
              </div>
            </div>
            
            <div className="glass-card p-6 overflow-hidden relative">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
              <h3 className="font-heading font-semibold text-lg mb-2">SHAP Explainability</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                After submission, our AI will break down exactly which of these 13 features are increasing or decreasing your risk score using Game Theory mathematics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
