import React, { useState } from 'react';
import { X, Cloud, CloudOff, CheckCircle2, Copy, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SUPABASE_SQL_SCHEMA } from '../../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, isCloudConnected, signInWithEmail, signUpWithEmail, signOut, continueAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (isSignUp) {
      const res = await signUpWithEmail(email, password, name);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Account created successfully! Check your email to confirm or sign in.');
      }
    } else {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Welcome back! Connected to Supabase Cloud.');
        setTimeout(() => onClose(), 800);
      }
    }
    setLoading(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-charcoal-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-lime-500/15 dark:text-lime-400 border border-emerald-500/20 dark:border-lime-500/30 flex items-center justify-center">
            {isCloudConnected ? <Cloud className="w-6 h-6" /> : <CloudOff className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isCloudConnected ? (user ? 'Supabase Account' : 'Cloud Database Sync') : 'Cloud Database Setup'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isCloudConnected 
                ? 'Your app is connected to Supabase PostgreSQL.' 
                : 'Currently running in Local Demo Mode with LocalStorage.'}
            </p>
          </div>
        </div>

        {/* Logged in state */}
        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" /> Logged In
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200">Email: <span className="font-mono text-emerald-700 dark:text-lime-400 font-semibold">{user.email}</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Profile data & logs sync automatically with Supabase cloud tables.</p>
            </div>
            
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40 transition-all text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : isCloudConnected ? (
          /* Cloud connected, prompt for email login */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full brand-btn-primary text-sm py-3"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Supabase Account' : 'Sign In to Supabase'}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-600 dark:text-lime-400 hover:underline font-semibold"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => {
                  continueAsGuest();
                  onClose();
                }}
                className="hover:text-slate-800 dark:hover:text-slate-200"
              >
                Continue as Guest
              </button>
            </div>
          </form>
        ) : (
          /* Cloud NOT configured yet - Guide user on how to add .env */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-lime-400 text-sm font-semibold">
                <Sparkles className="w-4 h-4" /> Guest / Demo Mode Active
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                The app is currently saving your workouts, water logs, steps, BMI history, and profile locally in your browser.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                To connect to a live Supabase PostgreSQL database:
              </p>
              <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside space-y-1 pl-1">
                <li>Create a free project at <span className="text-emerald-700 dark:text-lime-300 font-mono">supabase.com</span>.</li>
                <li>Copy your <strong className="text-slate-900 dark:text-white">Project URL</strong> and <strong className="text-slate-900 dark:text-white">anon key</strong>.</li>
                <li>Paste them into your project&apos;s <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-charcoal-800 text-emerald-700 dark:text-lime-400 font-mono text-[11px]">.env</code> file.</li>
              </ol>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                className="text-xs text-emerald-600 dark:text-lime-400 hover:underline font-semibold flex items-center gap-1.5"
              >
                {showSqlGuide ? 'Hide Supabase SQL Schema' : 'View & Copy Supabase SQL Table Schema'}
              </button>
              
              {showSqlGuide && (
                <div className="mt-2 p-3 bg-slate-100 dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 rounded-xl relative">
                  <button
                    onClick={handleCopySql}
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-[11px] rounded bg-white dark:bg-charcoal-800 hover:bg-slate-200 dark:hover:bg-charcoal-700 text-slate-700 dark:text-lime-300 border border-slate-300 dark:border-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                  <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto max-h-48 pt-6">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                continueAsGuest();
                onClose();
              }}
              className="w-full brand-btn-primary text-sm py-2.5"
            >
              Continue in Demo Mode
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
