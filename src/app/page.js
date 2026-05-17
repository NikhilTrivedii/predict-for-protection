"use client";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

/* ─── Animated Counter ─── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="stat-number">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Scroll Reveal Wrapper ─── */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(35px)",
        transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const STATS = [
    { value: 97, suffix: "%", label: t.stats.accuracy },
    { value: 13, suffix: "+", label: t.stats.indicators },
    { value: 50000, suffix: "+", label: t.stats.records },
    { value: 3, suffix: "", label: t.stats.models },
  ];

  const STEPS = [
    { num: "01", title: t.how.steps[0].title, desc: t.how.steps[0].desc, icon: "📋" },
    { num: "02", title: t.how.steps[1].title, desc: t.how.steps[1].desc, icon: "🧠" },
    { num: "03", title: t.how.steps[2].title, desc: t.how.steps[2].desc, icon: "📊" },
  ];

  return (
    <>
      {/* ── Ambient Background ── */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="medical-grid" />
      <div className="scan-line" />

      {/* ── Rotating Heart Background ── */}
      <div className="heart-bg-container">
        <img
          src="/heart-3d.png"
          alt=""
          className="heart-bg-image"
          aria-hidden="true"
        />
      </div>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav
        className="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ padding: scrollY > 50 ? "10px 0" : "16px 0" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-lg">🫀</span>
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
                Predict<span style={{ color: "var(--accent-rose)" }}>For</span>Protection
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium transition-colors hover:text-rose-500" style={{ color: "var(--text-secondary)" }}>{t.nav.features}</a>
            <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-rose-500" style={{ color: "var(--text-secondary)" }}>{t.nav.howItWorks}</a>
            <a href="#about" className="text-sm font-medium transition-colors hover:text-rose-500" style={{ color: "var(--text-secondary)" }}>{t.nav.about}</a>
            
            <LanguageToggle />
            
            <a href="/dashboard" className="btn-primary text-sm !py-2.5 !px-6 inline-block no-underline">
              {t.nav.startPrediction}
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <div className="section-tag mb-8">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {t.hero.tag}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h1 className="font-heading font-bold leading-[1.08] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
              <span style={{ color: "var(--text-primary)" }}>{t.hero.titleLine1}</span>
              <br />
              <span className="gradient-text">{t.hero.titleLine2}</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {t.hero.description}
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="/dashboard" className="btn-primary text-base no-underline">
                {t.hero.ctaAnalyze}
              </a>
              <a href="#how-it-works" className="btn-secondary text-base no-underline">
                {t.hero.ctaHow}
              </a>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: "var(--text-muted)" }}>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                {t.hero.badge1}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                {t.hero.badge2}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                {t.hero.badge3}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <section className="relative z-10 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-heading font-bold text-3xl md:text-4xl mb-1" style={{ color: "var(--accent-rose)" }}>
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-tag mb-4">
                <span>✦</span> {t.features.tag}
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4" style={{ color: "var(--text-primary)" }}>
                {t.features.title}
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                {t.features.subtitle}
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {t.features.cards.map((f, i) => {
               const colors = ["bg-rose-500/10", "bg-amber-100", "bg-emerald-100", "bg-blue-100"];
               const icons = ["🫀", "🔬", "🧬", "💊"];
               return (
                <Reveal key={i} delay={i * 120}>
                  <div className="glass-card p-8 h-full group">
                    <div className={`feature-icon ${colors[i]} mb-5`}>
                      <span className="relative z-10">{icons[i]}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-3 group-hover:text-rose-500 transition-colors" style={{ color: "var(--text-primary)" }}>
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
               )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-tag mb-4">
                <span>⚡</span> {t.how.tag}
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4" style={{ color: "var(--text-primary)" }}>
                {t.how.title}
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                {t.how.subtitle}
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="glass-card p-8 text-center relative group">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center mx-auto mb-6 text-white font-heading font-bold text-lg shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                    {step.num}
                  </div>
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h3 className="font-heading font-semibold text-lg mb-3" style={{ color: "var(--text-primary)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section id="about" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Reveal>
                <div>
                  <div className="section-tag mb-6">
                    <span>🎯</span> {t.about.tag}
                  </div>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {t.about.titleLine1}
                    <span className="gradient-text">{t.about.titleLine2}</span>
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                    {t.about.desc}
                  </p>
                  <div className="space-y-3">
                    {[t.about.point1, t.about.point2, t.about.point3].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                        <span className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 text-xs flex-shrink-0">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="relative z-10 py-16 px-6" style={{ borderTop: "1px solid var(--border-medium)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--border-medium)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {t.footer.copyright}
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{t.footer.disclaimer}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
