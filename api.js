import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Check, 
  ArrowLeft,
  Apple,
  Sparkles,
  Heart,
  Droplet
} from 'lucide-react';

function PatientLogin() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    try {
      // Force match email to lowercase just in case
      await loginUser(email.toLowerCase().trim(), password);
      if (rememberMe) {
        localStorage.setItem('rememberedPatientEmail', email);
      } else {
        localStorage.removeItem('rememberedPatientEmail');
      }
      navigate('/patient-dashboard', { replace: true });
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepopulate email if remembered
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedPatientEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden relative">
      
      {/* Soft Glowing Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      {/* Left side: Premium Patient Illustration Background */}
      <div className="hidden md:flex md:col-span-6 lg:col-span-7 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/patient-login-bg.png" 
            alt="Patient Salad Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/85 to-slate-950/95 mix-blend-multiply"></div>
        </div>
        
        {/* Medical pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2v2h-2V0zm0 4h2v2h-2V4zm0 4h2v2h-2V8zm0 12h2v2h-2v-2zm0 12h2v2h-2v-2zm4 4h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zM0 40h2v2H0v-2zm0 4h2v2H0v-2zm0 4h2v2H0v-2zm0 12h2v2H0v-2zm0 12h2v2H0v-2zm4 4h2v2H0v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Floating Nutrition/Medical Badges */}
        <div className="absolute z-10 top-1/4 left-1/4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-2.5 animate-bounce shadow-xl" style={{ animationDuration: '6s' }}>
          <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
            <Apple size={16} />
          </div>
          <span className="text-xs font-extrabold tracking-wide">Nutrition Checked</span>
        </div>

        <div className="absolute z-10 bottom-1/3 right-1/4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-2.5 animate-bounce shadow-xl" style={{ animationDuration: '8s', animationDelay: '1s' }}>
          <div className="p-1.5 bg-rose-500 rounded-lg text-white">
            <Heart size={16} />
          </div>
          <span className="text-xs font-extrabold tracking-wide">Heart Healthy</span>
        </div>

        <div className="absolute z-10 top-1/2 right-12 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-2.5 animate-bounce shadow-xl" style={{ animationDuration: '7s', animationDelay: '2s' }}>
          <div className="p-1.5 bg-blue-500 rounded-lg text-white">
            <Droplet size={16} />
          </div>
          <span className="text-xs font-extrabold tracking-wide">Stay Hydrated</span>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-2 z-10">
          <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-white leading-none">NUTRIPLANNER</h1>
            <span className="text-[9px] font-bold text-success-400">PATIENT HUB</span>
          </div>
        </div>

        {/* Image Grid Mask & Typography */}
        <div className="my-auto space-y-8 z-10 max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-300" />
              <span>Inpatient Portal Access</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight">
              Clinical Nutrition <br />
              Tailored For Your Recovery.
            </h2>
            <p className="text-xs lg:text-sm text-slate-250 leading-relaxed font-medium">
              View your personalized diet plan, trace meal delivery statuses from the clinical kitchen, record daily water metrics, and view real-time feedback notes from your attending doctor and dietician.
            </p>
          </div>

          {/* Photo gallery thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300" 
                alt="Organic salad bowl" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300" 
                alt="Patient doctor advice" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=300" 
                alt="Vibrant healthy smoothie" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 flex justify-between text-[10px] text-slate-300 border-t border-white/10 pt-4">
          <span>St. Jude Medical Logistics System</span>
          <span>HIPAA Compliant Security</span>
        </div>
      </div>

      {/* Right side: Glassmorphism Login Form */}
      <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-between p-8 md:p-12 lg:p-16 relative">
        
        {/* Back button */}
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <Link to="/login" className="text-xs font-extrabold text-primary-600 hover:text-primary-700">Clinician Sign-in</Link>
        </div>

        {/* Main Card */}
        <div className="my-auto space-y-6 max-w-md w-full mx-auto">
          
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Access Your Personalized Diet Plan</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Log in with your hospital-provided email and password.</p>
          </div>

          {errMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-250/30 rounded-xl text-rose-600 dark:text-rose-455 text-xs font-semibold animate-fade-in">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{errMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Patient ID / Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-1.5">Patient ID / Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. patient@hospital.com"
                className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-slate-50/50 hover:bg-white focus:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-950 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-primary-500 focus:outline-none rounded-xl transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-primary-600 hover:text-primary-750 dark:text-primary-400">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs md:text-sm bg-slate-50/50 hover:bg-white focus:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-950 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-primary-500 focus:outline-none rounded-xl transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-550 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="relative flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 peer-checked:bg-primary-650 peer-checked:border-primary-650 rounded-md transition-all flex items-center justify-center">
                  {rememberMe && <Check size={10} className="text-white" />}
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-2">Remember me on this browser</span>
              </label>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-bold text-xs md:text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 active:scale-[0.99] rounded-xl shadow-lg shadow-primary-500/10 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              ) : "Sign In to Portal"}
            </button>

          </form>
        </div>

        {/* Footer */}
        <div className="text-center md:text-left text-[10px] text-slate-400 dark:text-slate-550">
          Inpatient catering credentials are provided by the admissions desk. If you need help, please call clinical extension 410.
        </div>

      </div>

    </div>
  );
}

export default PatientLogin;
