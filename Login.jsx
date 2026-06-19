import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, ShieldAlert, CheckCircle2, ArrowLeft, Key, Lock, Mail } from 'lucide-react';

function ForgotPassword() {
  const { requestOtp, resetPasswordWithOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    try {
      const data = await requestOtp(email);
      setDemoOtpCode(data.demoOtp || '');
      setSuccessMsg("OTP generated and sent to console logs!");
      setStep(2);
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrMsg(null);

    if (newPassword !== confirmPassword) {
      setErrMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordWithOtp(email, otp, newPassword);
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md space-y-6 p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-2xl animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 mb-3">
            <HeartPulse size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">Recover access using email authentication</p>
        </div>

        {/* Notifications */}
        {errMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-250/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold animate-fade-in">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{errMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Input Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dietician@hospital.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-bold text-xs md:text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-xl shadow-lg transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              ) : "Send Reset OTP"}
            </button>
          </form>
        )}

        {/* Step 2 & 3: Input OTP & Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Demo Helper Box */}
            {demoOtpCode && (
              <div className="p-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-200/40 dark:border-primary-900/30 rounded-xl text-primary-700 dark:text-primary-400 text-[11px] leading-relaxed">
                <span className="font-bold">Demo helper</span>: The backend generated the following 6-digit OTP code for your request: <span className="font-extrabold text-sm underline tracking-wider">{demoOtpCode}</span>.
              </div>
            )}

            {/* OTP Code */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Verification OTP Code</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-bold text-xs md:text-sm text-white bg-success-600 hover:bg-success-700 disabled:bg-success-400 rounded-xl shadow-lg transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              ) : "Reset and Update Password"}
            </button>
          </form>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link to="/login" className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800">
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
