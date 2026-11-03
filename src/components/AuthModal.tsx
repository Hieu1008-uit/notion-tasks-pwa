import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ArrowRight, ShieldCheck, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { User as UserType } from '../types';
import { ApiClient } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

type AuthMethod = 'options' | 'google' | 'phone' | 'email';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<AuthMethod>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone form state
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Google quick sign in custom name/email
  const [googleEmail, setGoogleEmail] = useState('hieuv.uit@gmail.com');

  if (!isOpen) return null;

  const handleFinishLogin = (user: UserType) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#34d399', '#f59e0b']
    });
    onLogin(user);
    onClose();
  };

  // 1. Google 1-click sign-in
  const handleGoogleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cleanEmail = googleEmail.trim() || 'user.uit@gmail.com';
      const cleanName = cleanEmail.split('@')[0];
      const res = await ApiClient.loginGoogle(cleanEmail, cleanName);
      handleFinishLogin(res.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Phone sign-in
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setErrorMsg(null);
    setOtpStep(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.loginPhone(phone.trim());
      handleFinishLogin(res.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Xác thực OTP thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Email & password sign-in / registration
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (tab === 'register') {
        const res = await ApiClient.register(name.trim() || email.split('@')[0], email.trim(), password);
        handleFinishLogin(res.user);
      } else {
        const res = await ApiClient.login(email.trim(), password);
        handleFinishLogin(res.user);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Thao tác thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col gap-5 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {tab === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Đồng bộ dữ liệu đa thiết bị & đám mây
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Đăng nhập vs Đăng ký */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Đăng ký mới
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* METHOD 1: Quick Options List */}
        {method === 'options' && (
          <div className="space-y-3">
            {/* Google 1-Click Sign-In */}
            <button
              onClick={() => handleGoogleSignIn()}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-center gap-3 shadow-xs hover:scale-[1.01] active:scale-[0.99] group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Tiếp tục với Google / Gmail
              </span>
            </button>

            {/* Custom Gmail address entry */}
            <div className="flex items-center gap-1.5 px-2">
              <span className="text-[11px] text-slate-400">Tùy chọn Gmail:</span>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="tenban@gmail.com"
                className="text-[11px] font-mono px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-[11px] text-slate-400 font-medium">hoặc</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Phone option */}
            <button
              onClick={() => setMethod('phone')}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Đăng nhập bằng Số điện thoại</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Email & Password option */}
            <button
              onClick={() => setMethod('email')}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Sử dụng Email & Mật khẩu</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* METHOD 2: Phone Login Form */}
        {method === 'phone' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => { setMethod('options'); setOtpStep(false); }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              ← Quay lại các phương thức khác
            </button>

            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label htmlFor="auth-phone" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Số điện thoại của bạn
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center">
                      🇻🇳 +84
                    </span>
                    <input
                      id="auth-phone"
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                >
                  Gửi mã xác thực (OTP)
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <label htmlFor="auth-otp" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Nhập mã OTP (6 số gửi đến {phone})
                  </label>
                  <input
                    id="auth-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456 (demo: nhập số bất kỳ)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold tracking-widest text-center text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? 'Đang xác thực...' : 'Xác nhận & Hoàn tất'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* METHOD 3: Email & Password Form (Semantic & compliant with modern-web-guidance) */}
        {method === 'email' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setMethod('options')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              ← Quay lại các phương thức khác
            </button>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {tab === 'register' && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password"
                    type="password"
                    name="password"
                    autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoading ? 'Đang xử lý...' : (tab === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản')}</span>
              </button>
            </form>
          </div>
        )}

        {/* Security & Sync note */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mã hóa đầu cuối</span>
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Đồng bộ tức thì lên đám mây</span>
          </span>
        </div>
      </div>
    </div>
  );
};
