import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';

function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    try {
      const loggedUser = await loginUser(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      if (loggedUser.role === 'Patient') {
        navigate('/patient-dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepopulate email if remembered
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden relative">
      
      {/* Soft Glowing Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-success-500/10 dark:bg-success-500/5 blur-[120px] pointer-events-none"></div>

      {/* Left side: Premium Clinician Illustration Background */}
      <div className="hidden md:flex md:col-span-6 lg:col-span-7 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/clinician-login-bg.png" 
            alt="Clinician Office Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-slate-950/90 mix-blend-multiply"></div>
        </div>

        {/* Brand Header */}
        <div className="flex items-center gap-2 z-10">
          <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-white leading-none">NUTRIPLANNER</h1>
            <span className="text-[9px] font-bold text-success-400">CLINICAL SOLUTIONS</span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="my-auto space-y-6 z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Clinician & Staff Console
          </span>
          <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight">
            Advanced Meal Logistics <br />
            & Medical Validation.
          </h2>
          <p className="text-xs lg:text-sm text-slate-200 leading-relaxed font-medium">
            Access dietician planning panels, doctor approvals dashboard, and real-time kitchen preparation tickets. Designed to enhance inpatient recovery rates and guarantee clinical compliance.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Allergen Safety</span>
              <p className="text-lg font-black text-white mt-1">100% Automated</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">System Latency</span>
              <p className="text-lg font-black text-white mt-1">Real-time Sync</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 flex justify-between text-[10px] text-slate-350 border-t border-white/10 pt-4">
          <span>NutriPlanner clinical suite v2.4</span>
          <span>Secured HIPAA Gateway</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-between p-8 md:p-12 lg:p-16 relative z-10">
        
        {/* Navigation links */}
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <span>Back to Home</span>
          </Link>
          <Link to="/patient-login" className="text-xs font-extrabold text-primary-600 hover:text-primary-700">Patient Sign-in</Link>
        </div>

        {/* Form Container */}
        <div className="my-auto space-y-6 max-w-md w-full mx-auto">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clinician Portal</h3>
            <p className="text-xs text-slate-400 dark:text-slate-505 font-semibold">Enter your authorized hospital email to sign in.</p>
          </div>

          {errMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-250/30 rounded-xl text-rose-600 dark:text-rose-455 text-xs font-semibold animate-fade-in">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{errMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. dietician@hospital.com"
                className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-slate-50/55 hover:bg-white focus:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-950 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-primary-500 focus:outline-none rounded-xl transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Password</label>
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
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs md:text-sm bg-slate-50/55 hover:bg-white focus:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-950 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-primary-500 focus:outline-none rounded-xl transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-550 hover:text-slate-650"
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
                <div className="w-4 h-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 peer-checked:bg-primary-600 peer-checked:border-primary-600 rounded-md transition-all flex items-center justify-center">
                  {rememberMe && <Check size={10} className="text-white" />}
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-2">Remember me on this machine</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-bold text-xs md:text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 active:scale-[0.99] rounded-xl shadow-lg shadow-primary-500/10 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              ) : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-450">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center md:text-left text-[10px] text-slate-450 dark:text-slate-550">
          This system is intended only for authorized hospital clinicians and staff. Unauthorized access is strictly prohibited and subject to auditing.
        </div>

      </div>

    </div>
  );
}

export default Login;
