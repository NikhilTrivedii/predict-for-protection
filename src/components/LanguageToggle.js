"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 p-1 bg-white/30 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
      <button
        onClick={() => toggleLanguage("en")}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
          lang === "en"
            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggleLanguage("hi")}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
          lang === "hi"
            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
