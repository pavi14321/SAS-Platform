import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ShoppingBag,
  Store,
  CreditCard,
  Package,
  Globe,
  Star,
  Sun,
  Moon,
  Paintbrush
} from "lucide-react";

export default function SaasLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  
  // Theme States
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState("violet"); // Options: violet, emerald, cyan, rose

  // Only lock scroll for the mobile mobile overlay menu when it's open, 
  // letting the regular page content scroll perfectly under the sticky header.
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  // Dynamic Theme Class Mapping
  const themeStyles = {
    violet: {
      text: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
      border: "border-violet-200 dark:border-violet-800",
      focus: "focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400",
      gradient: "from-violet-600 to-orange-500",
      accentBg: "bg-violet-50 dark:bg-violet-950/40",
      cardBorder: "hover:border-violet-300 dark:hover:border-violet-700",
      pricingCard: "border-violet-600 dark:border-violet-400 bg-violet-50/50 dark:bg-violet-950/20 shadow-violet-100 dark:shadow-none",
      badge: "text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-300 dark:bg-violet-950/50 dark:border-violet-800"
    },
    emerald: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
      border: "border-emerald-200 dark:border-emerald-800",
      focus: "focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400",
      gradient: "from-emerald-600 to-cyan-500",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/40",
      cardBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
      pricingCard: "border-emerald-600 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-emerald-100 dark:shadow-none",
      badge: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800"
    },
    cyan: {
      text: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600",
      border: "border-cyan-200 dark:border-cyan-800",
      focus: "focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400",
      gradient: "from-cyan-600 to-indigo-500",
      accentBg: "bg-cyan-50 dark:bg-cyan-950/40",
      cardBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
      pricingCard: "border-cyan-600 dark:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-cyan-100 dark:shadow-none",
      badge: "text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-950/50 dark:border-cyan-800"
    },
    rose: {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
      border: "border-rose-200 dark:border-rose-800",
      focus: "focus-visible:ring-rose-600 dark:focus-visible:ring-rose-400",
      gradient: "from-rose-600 to-amber-500",
      accentBg: "bg-rose-50 dark:bg-rose-950/40",
      cardBorder: "hover:border-rose-300 dark:hover:border-rose-700",
      pricingCard: "border-rose-600 dark:border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 shadow-rose-100 dark:shadow-none",
      badge: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-950/50 dark:border-rose-800"
    }
  };

  const currentTheme = themeStyles[colorTheme];

  const navLinks = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const features = [
    {
      icon: Store,
      title: "Build a storefront that converts",
      desc: "Pick a theme, drag in your products, and customize colors and layout visually. Mobile-ready and checkout-optimized from the first click.",
    },
    {
      icon: CreditCard,
      title: "Get paid, your way",
      desc: "Accept cards, wallets, and cash on delivery where supported. Payouts land in your bank on a steady schedule, no chasing invoices.",
    },
    {
      icon: Package,
      title: "Inventory that stays in sync",
      desc: "Stock updates in real time across every channel you sell on, so you never oversell a product that's already gone.",
    },
    {
      icon: Globe,
      title: "Sell on every channel",
      desc: "Your storefront, social shops, marketplaces, and in-person sales — all from one dashboard, all staying in sync automatically.",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Pick a theme & add products",
      desc: "Start from a ready-made theme, drop in your catalog, and your store looks finished before lunch.",
    },
    {
      n: "02",
      title: "Connect payments & shipping",
      desc: "Link a payment provider and your shipping carriers in a few clicks — no developer required.",
    },
    {
      n: "03",
      title: "Go live and start selling",
      desc: "Flip the switch. Orders, payments, and inventory all flow through the same place from day one.",
    },
  ];

  const stats = [
    { value: "$2.4M+", label: "processed in sales by sellers on the platform" },
    { value: "35%", label: "higher checkout conversion than a default cart" },
    { value: "< 2 min", label: "to launch a store from a theme" },
    { value: "99.99%", label: "uptime, even during your biggest sale" },
  ];

  const testimonials = [
    {
      quote: "Switched our storefront over on a Sunday afternoon. Orders didn't skip a beat, and checkout conversion jumped almost overnight.",
      name: "Founder",
      role: "Handmade goods brand",
    },
    {
      quote: "Inventory used to be a guessing game across three channels. Now it's just correct, everywhere, all the time.",
      name: "Store Manager",
      role: "Apparel brand",
    },
    {
      quote: "Support tickets about 'where's my order' dropped by half once tracking started updating itself.",
      name: "Operations Lead",
      role: "Electronics seller",
    },
  ];

  const plans = [
    {
      name: "Starter",
      blurb: "For new sellers testing an idea",
      monthly: 0,
      annualMonthly: 0,
      features: ["Up to 25 products", "Standard checkout", "2% transaction fee", "Community support"],
      cta: "Start for free",
      highlighted: false,
    },
    {
      name: "Growth",
      blurb: "For sellers scaling up",
      monthly: 19,
      annualMonthly: 15,
      features: [
        "Unlimited products",
        "Custom domain",
        "Abandoned cart recovery",
        "0.5% transaction fee",
        "Priority support",
      ],
      cta: "Start free trial",
      highlighted: true,
    },
    {
      name: "Scale",
      blurb: "For high-volume, multi-channel sellers",
      monthly: null,
      annualMonthly: null,
      features: [
        "Everything in Growth",
        "Multi-currency & multi-location stock",
        "Dedicated onboarding",
        "Lowest transaction fees",
        "SLA-backed support",
      ],
      cta: "Talk to us",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: "Do I need to know how to code to build my store?",
      a: "No. Pick a theme, drag in your products, and customize colors and layout visually. Custom code is available if you ever want it, but it's never required to launch.",
    },
    {
      q: "How do payments and payouts work?",
      a: "Connect a payment provider in a few minutes. Customers pay by card, wallet, or cash on delivery where supported, and payouts land in your bank on a regular schedule based on your plan.",
    },
    {
      q: "Can I sell on Instagram or marketplaces too?",
      a: "Yes. Connect your catalog once and it syncs to social shops and marketplace channels, with inventory staying accurate everywhere automatically.",
    },
    {
      q: "What happens to my data if I switch plans or cancel?",
      a: "Your products, orders, and customer data are always yours. You can export everything at any time, during your subscription or after.",
    },
  ];

  return (
    <div className={`font-body ${darkMode ? "dark bg-neutral-950 text-neutral-50" : "bg-neutral-50 text-neutral-900"} min-h-screen w-full transition-colors duration-300`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght=500;600;700&family=Inter:wght=400;500;600;700&family=JetBrains+Mono:wght=500&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono-label { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; }

        @keyframes travel {
          0% { left: 1%; opacity: 0; transform: translateY(-50%) scale(0.8); }
          8% { opacity: 1; transform: translateY(-50%) scale(1); }
          92% { opacity: 1; transform: translateY(-50%) scale(1); }
          100% { left: 97%; opacity: 0; transform: translateY(-50%) scale(0.8); }
        }
        .travel-dot { animation: travel 5s ease-in-out infinite; }

        @keyframes pulseNode {
          0%, 100% { box-shadow: 0 0 0 0 rgba(100,100,100,0.2); }
          50% { box-shadow: 0 0 0 7px rgba(100,100,100,0); }
        }
        .pulse-node { animation: pulseNode 2.2s ease-in-out infinite; }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
      `}</style>

      {/* ---------- STICKY & TRANSPARENT MENU HEADER ---------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-50/70 dark:bg-neutral-950/70 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <a href="#top" className={`flex items-center gap-2.5 focus:outline-none ${currentTheme.focus} rounded-md`}>
            <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center shrink-0`}>
              <span className="w-3 h-3 rounded-sm bg-white/90 dark:bg-neutral-950/90"></span>
            </span>
            <span className="font-display font-bold text-lg tracking-tight">Your Brand</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors focus:outline-none ${currentTheme.focus} rounded-sm`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Configuration Actions & CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* 4-Color Theme Selector */}
            <div className="flex items-center gap-1.5 bg-neutral-200/60 dark:bg-neutral-900/80 p-1 rounded-full border border-neutral-300/40 dark:border-neutral-800">
              {["violet", "emerald", "cyan", "rose"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColorTheme(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    c === "violet" ? "bg-violet-500" : c === "emerald" ? "bg-emerald-500" : c === "cyan" ? "bg-cyan-500" : "bg-rose-500"
                  } ${colorTheme === c ? "scale-125 ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-neutral-950" : "opacity-80 hover:opacity-100"}`}
                  title={`${c} theme`}
                />
              ))}
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 rounded-lg bg-neutral-100 dark:bg-neutral-900 transition-colors"
              title="Toggle Light/Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors px-2 py-2">
              Log in
            </Link>
            <Link
              to="/signup"
              className={`text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors text-white ${currentTheme.bg} ${currentTheme.focus}`}
            >
              Start selling
            </Link>
          </div>

          {/* Mobile UI Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 rounded-lg bg-neutral-100 dark:bg-neutral-900 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={`p-2 -mr-2 text-neutral-900 dark:text-neutral-50 focus:outline-none ${currentTheme.focus} rounded-md z-50`}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ---------- MOBILE OVERLAY MENU ---------- */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 backdrop-blur-xl bg-neutral-50/90 dark:bg-neutral-950/90 px-6 py-6 flex flex-col justify-between h-[calc(100vh-4rem)] overflow-y-auto transition-colors">
          <div className="space-y-6">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3.5 text-lg font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-200/60 dark:border-neutral-800/60"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="space-y-2.5">
              <p className="text-xs font-mono-label uppercase text-neutral-400 flex items-center gap-1.5">
                <Paintbrush size={12} /> Color Customizer
              </p>
              <div className="grid grid-cols-4 gap-2">
                {["violet", "emerald", "cyan", "rose"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorTheme(c)}
                    className={`py-2 px-3 text-xs capitalize font-medium rounded-lg border text-center transition-all ${
                      colorTheme === c 
                        ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 font-semibold border-transparent" 
                        : "bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pb-6 mt-8">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center text-sm font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl py-3 bg-white/40 dark:bg-neutral-900/40 shadow-sm">
              Log in
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className={`text-center text-sm font-semibold rounded-xl py-3 shadow-md text-white ${currentTheme.bg}`}>
              Start selling
            </Link>
          </div>
        </div>
      )}

      {/* ---------- REST OF PAGE CONTENT (SCROLLS NATURALLY) ---------- */}
      <section id="top" className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div
          className="absolute -top-10 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl pointer-events-none float-slow"
          style={{ background: "radial-gradient(circle, currentColor, transparent 70%)" }}
        ></div>

        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          <div>
            <span className={`font-mono-label inline-flex items-center gap-2 text-xs uppercase ${currentTheme.badge} px-3 py-1.5 rounded-full`}>
              <ShoppingBag size={13} /> E-commerce, made simple
            </span>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.08] tracking-tight mt-5 text-neutral-900 dark:text-neutral-50">
              Open a store that actually sells.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
              Build a storefront, take payments, manage inventory, and sell across channels — all
              from one place, built for people who'd rather sell than fight software.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/signup"
                className={`inline-flex items-center justify-center gap-2 text-white font-semibold text-sm px-6 py-3.5 rounded-lg transition-colors ${currentTheme.bg} ${currentTheme.focus}`}
              >
                Start selling — no card needed <ArrowRight size={16} />
              </Link>
              <a
                href="#how"
                className={`inline-flex items-center justify-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 px-6 py-3.5 rounded-lg hover:border-neutral-900 dark:hover:border-neutral-400 transition-colors focus:outline-none ${currentTheme.focus}`}
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="hidden sm:block relative bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
              <p className="font-mono-label text-[11px] uppercase text-neutral-400 mb-6">Live store pipeline</p>
              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-neutral-200 dark:border-neutral-800"></div>
                <div className={`travel-dot absolute top-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${currentTheme.gradient}`}></div>
                <div className="relative grid grid-cols-4 gap-3">
                  {["Build", "Stock", "Sell", "Ship"].map((label, i) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <div className={`w-11 h-11 rounded-full bg-neutral-50 dark:bg-neutral-900 border-2 ${currentTheme.border} flex items-center justify-center font-display font-semibold text-sm ${currentTheme.text}`}>
                        {i + 1}
                      </div>
                      <span className="mt-3 text-xs font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sm:hidden bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <p className="font-mono-label text-[11px] uppercase text-neutral-400 mb-5">Live store</p>
              <div className="relative pl-2">
                <div className="absolute left-[1.05rem] top-2 bottom-2 border-l-2 border-dashed border-neutral-200 dark:border-neutral-800"></div>
                <div className="space-y-5">
                  {["Build", "Stock", "Sell", "Ship"].map((label, i) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className={`w-9 h-9 shrink-0 rounded-full bg-neutral-50 dark:bg-neutral-900 border-2 ${currentTheme.border} flex items-center justify-center font-display font-semibold text-xs ${currentTheme.text}`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES SECTION ---------- */}
      <section id="features" className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-xl">
          <span className={`font-mono-label text-xs uppercase ${currentTheme.text}`}>What it actually does</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mt-3 text-neutral-900 dark:text-neutral-50">
            Everything between "idea" and "sold."
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7 ${currentTheme.cardBorder} hover:shadow-md transition-all`}>
                <div className={`w-11 h-11 rounded-xl ${currentTheme.accentBg} border ${currentTheme.border} flex items-center justify-center ${currentTheme.text}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-semibold text-lg mt-5 text-neutral-900 dark:text-neutral-50">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- HOW IT WORKS SECTION ---------- */}
      <section id="how" className="bg-white dark:bg-neutral-900/20 border-y border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-xl mx-auto text-center">
            <span className={`font-mono-label text-xs uppercase ${currentTheme.text}`}>Three steps, start to finish</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mt-3 text-neutral-900 dark:text-neutral-50">
              Set it up once. Sell from anywhere.
            </h2>
          </div>

          <div className="mt-14 relative grid sm:grid-cols-3 gap-10 sm:gap-6">
            <div className="hidden sm:block absolute top-6 left-[16.5%] right-[16.5%] border-t-2 border-dashed border-neutral-200 dark:border-neutral-800"></div>
            {steps.map((s) => (
              <div key={s.n}>
                <div className="w-12 h-12 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-display font-bold flex items-center justify-center mx-auto sm:mx-0 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-display font-semibold text-lg mt-5 text-neutral-900 dark:text-neutral-50">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto sm:mx-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STATS STRIP ---------- */}
      <section className="bg-neutral-900 dark:bg-neutral-900 border-b border-neutral-800 text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-3xl sm:text-4xl text-white">{s.value}</p>
                <p className="mt-2 text-sm text-neutral-400 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS SECTION ---------- */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-xl">
          <span className={`font-mono-label text-xs uppercase ${currentTheme.text}`}>From sellers already on it</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mt-3 text-neutral-900 dark:text-neutral-50">
            Less guesswork. More orders out the door.
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7 flex flex-col">
              <div className={`flex gap-0.5 ${currentTheme.text}`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- PRICING SECTION ---------- */}
      <section id="pricing" className="bg-white dark:bg-neutral-900/20 border-y border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-xl mx-auto text-center">
            <span className={`font-mono-label text-xs uppercase ${currentTheme.text}`}>Simple pricing</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mt-3 text-neutral-900 dark:text-neutral-50">
              Pay for what your store actually needs.
            </h2>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!annual ? "text-neutral-900 dark:text-neutral-50" : "text-neutral-400"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
              className="w-12 h-7 rounded-full bg-neutral-900 dark:bg-neutral-700 relative transition-colors focus:outline-none"
            >
              <span className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200" style={{ left: annual ? "1.625rem" : "0.25rem" }}></span>
            </button>
            <span className={`text-sm font-medium ${annual ? "text-neutral-900 dark:text-neutral-50" : "text-neutral-400"}`}>
              Annual <span className="text-emerald-600 dark:text-emerald-400">(save ~20%)</span>
            </span>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-5 items-start">
            {plans.map((p) => {
              const price = annual ? p.annualMonthly : p.monthly;
              return (
                <div
                  key={p.name}
                  className={`rounded-2xl p-7 border flex flex-col h-full ${
                    p.highlighted ? currentTheme.pricingCard + " sm:scale-[1.03]" : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40"
                  }`}
                >
                  <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-50">{p.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{p.blurb}</p>
                  <div className="mt-6">
                    {price === null ? (
                      <p className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-50">Custom</p>
                    ) : (
                      <p className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-50">
                        ${price}<span className="text-base font-medium text-neutral-500 dark:text-neutral-400"> /mo</span>
                      </p>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                        <Check size={16} className={`${currentTheme.text} shrink-0 mt-0.5`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className={`mt-7 inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-lg transition-all text-white ${p.highlighted ? currentTheme.bg : "bg-neutral-900 dark:bg-neutral-50 dark:text-neutral-950"}`}>
                    {p.cta} <ArrowUpRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- FAQ SECTION ---------- */}
      <section id="faq" className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto">
          <span className={`font-mono-label text-xs uppercase ${currentTheme.text}`}>Questions</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mt-3 text-neutral-900 dark:text-neutral-50">
            Good to know before you start.
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={item.q} className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900/40 overflow-hidden">
                <button onClick={() => setOpenFaq(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5 focus:outline-none">
                  <span className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isOpen ? "200px" : "0px" }}>
                  <p className="px-5 sm:px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center shrink-0`}>
                  <span className="w-3 h-3 rounded-sm bg-white/90 dark:bg-neutral-950/90"></span>
                </span>
                <span className="font-display font-bold text-lg tracking-tight">Your Brand</span>
              </div>
              <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                The storefront, checkout, and inventory system for sellers who'd rather sell than fight software.
              </p>
            </div>

            {["Product", "Company", "Legal"].map((section, idx) => (
              <div key={section}>
                <p className="font-mono-label text-xs uppercase text-neutral-400 mb-4">{section}</p>
                <ul className="space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                  {idx === 0 && (
                    <>
                      <li><a href="#features" className="hover:text-neutral-900 dark:hover:text-neutral-100">Features</a></li>
                      <li><a href="#how" className="hover:text-neutral-900 dark:hover:text-neutral-100">How it works</a></li>
                      <li><a href="#pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100">Pricing</a></li>
                    </>
                  )}
                  {idx === 1 && (
                    <>
                      <li><a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">About</a></li>
                      <li><a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">Careers</a></li>
                    </>
                  )}
                  {idx === 2 && (
                    <>
                      <li><a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">Privacy</a></li>
                      <li><a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">Terms</a></li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs text-neutral-400">
            <p>© 2026 Your Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}