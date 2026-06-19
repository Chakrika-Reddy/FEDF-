import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ChefHat, 
  ArrowRight,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    { q: "Is this system HIPAA compliant?", a: "Yes. NutriPlanner employs state-of-the-art encryption algorithms and strict Role Based Access Controls to protect sensitive Electronic Health Records (EHR) and patient medical logs." },
    { q: "How does the Allergy Checker work?", a: "During the meal plan construction, the system cross-references the patient's medical history allergens with the raw ingredients listed in the food templates, instantly blocking matches." },
    { q: "Can kitchen staff update stock directly?", a: "Absolutely. The integrated inventory system supports real-time stock management, auto-deducting raw ingredients as meal orders are prepared and warning of low levels." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 scroll-smooth">
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-600 text-white rounded-lg shadow-md shadow-primary-500/20">
              <HeartPulse size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-800 dark:text-white leading-none tracking-tight">NUTRIPLANNER</h1>
              <span className="text-[9px] font-medium text-success-600 dark:text-success-500">DIETARY SOLUTIONS</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="#services" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Services</a>
            <a href="#preview" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Dashboard</a>
            <a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/patient-login" className="px-3 py-2 text-xs font-extrabold text-primary-600 hover:text-primary-750 dark:text-primary-400">
              Patient Portal
            </Link>
            <Link to="/login" className="px-3 py-2 text-xs font-bold text-slate-650 dark:text-slate-350 hover:text-slate-900 transition-colors">
              Clinician Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/10 rounded-xl transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 py-4 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-fade-in">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Features</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Services</a>
            <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Dashboard</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300">FAQ</a>
            <hr className="border-slate-150 dark:border-slate-800" />
            <div className="flex flex-col gap-2">
              <Link to="/patient-login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-xs font-extrabold bg-primary-50 dark:bg-primary-950/20 text-primary-600 rounded-xl">Patient Portal</Link>
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 text-xs font-bold border border-slate-200 dark:border-slate-850 text-slate-750 dark:text-slate-255 rounded-xl">Clinician Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 text-xs font-bold text-white bg-primary-600 rounded-xl">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary-50/20 via-transparent to-transparent dark:from-primary-950/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200/40 dark:border-primary-900/30 text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Sparkles size={12} className="text-primary-500 animate-pulse" />
              <span>Next-Gen Inpatient Meal Logistics</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Smart Nutrition <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-600 dark:from-primary-400 dark:to-success-500">Planning For Better</span> <br />
              Patient Care.
            </h2>

            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Integrate clinical patient profiles, automatic allergen detection algorithms, and real-time kitchen tracking into a single unified logistics system. Empower your dietician and doctor workflows.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register" className="flex items-center gap-2 px-6 py-3 font-bold text-xs md:text-sm text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/10 active:scale-[0.98] rounded-xl transition-all">
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="px-6 py-3 font-bold text-xs md:text-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all">
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Right graphics */}
          <div className="relative flex justify-center">
            {/* Visual Blob background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-success-500 rounded-full blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>

            {/* Dashboard Mockup Image */}
            <div className="relative w-full max-w-md p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
              <img 
                src="/bg-hero.png" 
                alt="Healthcare & Nutrition Dashboard Illustration" 
                className="w-full h-auto object-cover rounded-xl shadow-inner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Platform capabilities</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Designed For Clinical Kitchen Accuracy</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Eliminate manual mistakes in inpatient catering logistics with deep validation rules.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl hover:-translate-y-1 transition-transform">
              <Activity className="text-primary-600 dark:text-primary-400 mb-4" size={24} />
              <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Automated Allergy Blocks</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">System instantly triggers alerts and blocks meal planning orders if the selected template contains allergens matched to the patient profile.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl hover:-translate-y-1 transition-transform">
              <ChefHat className="text-success-600 dark:text-success-500 mb-4" size={24} />
              <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Kitchen Workflow Tracker</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Prepare meals on a kanban status board (Pending, Preparing, Ready, Delivered) with auto inventory stock reduction and low stock alerts.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl hover:-translate-y-1 transition-transform">
              <ShieldCheck className="text-sky-600 dark:text-sky-400 mb-4" size={24} />
              <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Role Based Approvals</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Enforce strict clinical compliance: dieticians design, doctors approve, kitchen staff cook. Full auditable history logs maintained.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            {/* SVG Illustration */}
            <svg viewBox="0 0 200 200" className="w-full max-w-xs text-primary-500" fill="currentColor">
              <path d="M 40,80 A 40,40 0 0,0 80,120 A 40,40 0 0,0 120,80 A 40,40 0 0,0 80,40 A 40,40 0 0,0 40,80 Z" className="text-primary-100 dark:text-primary-950/40" />
              <rect x="75" y="75" width="50" height="70" rx="4" className="text-primary-500" />
              <line x1="85" y1="90" x2="115" y2="90" stroke="white" strokeWidth="2" />
              <line x1="85" y1="105" x2="105" y2="105" stroke="white" strokeWidth="2" />
              <circle cx="140" cy="130" r="25" className="text-success-500" />
              <path d="M 133,130 L 138,135 L 147,125" stroke="white" strokeWidth="2.5" fill="none" />
            </svg>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] font-bold text-success-600 dark:text-success-500 uppercase tracking-widest">Enterprise Support</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Advanced AI Meal Recommendation Engine</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Input patient conditions (Diabetes, Kidney failure, Celiac) and receive dietary guidelines mapped to macro targets. The AI engine explains clinical decisions to assist dietician builders.
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <Clock className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Reduces dietician building overhead by up to 60%.</p>
              </div>
              <div className="flex gap-3 items-start">
                <TrendingUp className="text-success-600 dark:text-success-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Integrates caloric targets automatically from inpatient body metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <MessageSquare className="text-primary-600 mx-auto" size={24} />
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Trusted by Medical Experts</h3>
            <p className="text-xs text-slate-500">Hear from chief dieticians and hospital medical directors.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded-2xl shadow-sm">
              <p className="text-xs italic text-slate-500 dark:text-slate-300 leading-relaxed mb-4">
                "NutriPlanner completely revolutionized our hospital food preparation pipeline. The automated checks prevent allergen incidents entirely."
              </p>
              <h5 className="text-xs font-bold text-slate-800 dark:text-white">Dr. Sarah Mitchell</h5>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Chief Medical Officer, St. Jude Medical</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded-2xl shadow-sm">
              <p className="text-xs italic text-slate-500 dark:text-slate-300 leading-relaxed mb-4">
                "The drag and drop style meal scheduler is a joy to use. My kitchen staff receives approved tickets instantly with zero communication lag."
              </p>
              <h5 className="text-xs font-bold text-slate-800 dark:text-white">Jane Doe (RD)</h5>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Lead Dietician, Hope General Hospital</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-20 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <HelpCircle className="text-success-600 mx-auto" size={24} />
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about the planning logistics.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-905 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl">
                <h4 className="font-bold text-xs md:text-sm text-slate-850 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 text-slate-400 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-primary-500" size={18} />
            <span className="text-xs font-black text-white tracking-wider">NUTRIPLANNER SYSTEM</span>
          </div>
          <p className="text-[10px]">© 2026 NutriPlanner Systems Inc. All rights reserved. HIPAA Compliant.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
