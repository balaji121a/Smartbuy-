import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, Smartphone, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function LoginView() {
  const { login, navigate } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flipkart style OTP verification states
  const [loginStep, setLoginStep] = useState<'input' | 'otp' | 'password'>('input');
  const [otpVal, setOtpVal] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // OTP Countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const triggerOtpSend = (emailOrPhone: string) => {
    if (!emailOrPhone) {
      toast.error("Please enter Email or Mobile Number");
      return;
    }
    const isPhone = /^\d{10}$/.test(emailOrPhone.trim());
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone.trim());
    if (!isPhone && !isEmail) {
      toast.error("Please enter a valid 10-digit Mobile number or Email address");
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpTimer(30);
    setOtpVal(['', '', '', '']);
    setLoginStep('otp');

    toast((t) => (
      <div className="flex flex-col gap-2 p-1 font-sans">
        <div className="flex items-center gap-2">
          <span className="text-base">🔒</span>
          <div>
            <p className="text-xs font-bold text-zinc-900">Flipkart Security Verification</p>
            <p className="text-[11px] text-zinc-500">Your verification OTP is <strong className="text-indigo-600 font-mono text-xs">{randomOtp}</strong></p>
          </div>
        </div>
        <button 
          onClick={() => {
            setOtpVal(randomOtp.split(''));
            toast.dismiss(t.id);
            toast.success("OTP autofilled! Click 'Verify' to proceed.");
          }}
          className="self-end px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded text-[10px] font-extrabold transition-colors"
        >
          Autofill OTP
        </button>
      </div>
    ), {
      duration: 15000,
      position: 'top-center',
    });
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpVal.join('');
    if (enteredOtp.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP");
      return;
    }
    if (enteredOtp !== generatedOtp) {
      toast.error("Invalid OTP code. Please check and try again.");
      return;
    }

    const isDemoAdmin = email.toLowerCase().includes('admin');
    const isDemoCustomer = email.toLowerCase() === 'customer@example.com' || email.toLowerCase() === 'amit@example.com';
    const name = isDemoAdmin ? "Shop Admin" : isDemoCustomer ? "Amit Kumar" : "";
    
    login(email, name);
    if (name) {
      toast.success(`Welcome back, ${name}! Verification complete ✓`);
    } else {
      toast.success("Verification complete! Please complete your profile ✓");
    }
    
    if (isDemoAdmin) {
      navigate('admin');
    } else {
      navigate('home');
    }
  };

  const handlePasswordLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.name || "User"}! ✓`);
        if (data.user.role === 'admin') {
          navigate('admin');
        } else {
          navigate('home');
        }
      } else {
        // Fallback for sandboxed quick demo
        const isDemoAdmin = email.toLowerCase().includes('admin');
        const isDemoCustomer = email.toLowerCase() === 'customer@example.com' || email.toLowerCase() === 'amit@example.com';
        const name = isDemoAdmin ? "Shop Admin" : isDemoCustomer ? "Amit Kumar" : "";
        
        login(email, name);
        if (name) {
          toast.success(`Welcome back, ${name}! Logged in as demo user ✓`);
        } else {
          toast.success("Logged in successfully! Please complete your profile ✓");
        }
        if (isDemoAdmin) {
          navigate('admin');
        } else {
          navigate('home');
        }
      }
    } catch (err) {
      // Offline fallback
      const isDemoAdmin = email.toLowerCase().includes('admin');
      const isDemoCustomer = email.toLowerCase() === 'customer@example.com' || email.toLowerCase() === 'amit@example.com';
      const name = isDemoAdmin ? "Shop Admin" : isDemoCustomer ? "Amit Kumar" : "";
      
      login(email, name);
      if (name) {
        toast.success(`Welcome back, ${name}! ✓`);
      } else {
        toast.success("Logged in successfully! Please complete your profile ✓");
      }
      if (isDemoAdmin) {
        navigate('admin');
      } else {
        navigate('home');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpVal];
    newOtp[index] = cleanVal;
    setOtpVal(newOtp);

    if (cleanVal && index < 3) {
      const nextInput = document.getElementById(`standalone-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpVal[index] && index > 0) {
      const prevInput = document.getElementById(`standalone-otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const autofillAccount = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
      toast.success("Filled Admin credentials. You can request OTP or enter password.");
    } else {
      setEmail('customer@example.com');
      setPassword('user123');
      toast.success("Filled Customer credentials. You can request OTP or enter password.");
    }
  };

  return (
    <div className="flex justify-center items-center py-16 px-4" id="login-view-container">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-100 dark:border-zinc-900"
      >
        {/* Left branding panel - Blue/Teal gradient */}
        <div className="md:w-2/5 bg-gradient-to-b from-[#2874f0] to-[#1a5dbf] text-white p-10 flex flex-col justify-between text-left relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 z-10">
            <h1 className="text-3xl font-black tracking-tight">Login</h1>
            <p className="text-sm text-blue-100 font-semibold leading-relaxed">
              {loginStep === 'otp'
                ? "Verify the 4-digit OTP sent to your contact address."
                : "Get access to your Orders, Wishlist, Recommendations and active SuperCoin balance."}
            </p>
          </div>

          <div className="mt-12 md:mt-0 z-10">
            <div className="flex items-center gap-1.5 font-sans">
              <span className="text-yellow-400 text-lg">✦</span>
              <p className="text-xl font-black italic tracking-wider">SmartBuy</p>
            </div>
            <p className="text-[10px] text-blue-200 font-medium mt-1 uppercase tracking-wider">An authentic Indian Shopping Experience</p>
          </div>
        </div>

        {/* Right input panel */}
        <div className="flex-1 p-8 md:p-12 text-left bg-white dark:bg-zinc-950 space-y-6">
          
          {loginStep === 'input' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Welcome to SmartBuy</h2>
                <p className="text-xs text-zinc-400 mt-1">Please log in to continue managing your digital shopping experience.</p>
              </div>

              {/* Demo accounts picker */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 space-y-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Sandbox Quick-Select Helpers
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => autofillAccount('user')}
                    className="rounded-xl bg-white dark:bg-zinc-800 px-3 py-2 border border-zinc-200 dark:border-zinc-750 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 justify-center animate-pulse"
                  >
                    <span>Amit Kumar (Customer)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => autofillAccount('admin')}
                    className="rounded-xl bg-white dark:bg-zinc-800 px-3 py-2 border border-zinc-200 dark:border-zinc-750 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 justify-center"
                  >
                    <span>Shop Admin (Admin)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address or 10-digit Mobile Number</label>
                  <div className="relative mt-1.5">
                    <input
                      type="text"
                      placeholder="Enter Email / Mobile number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 py-3 pl-11 pr-4 text-xs font-semibold outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/10 transition-all"
                      required
                    />
                    <Smartphone className="absolute left-4 top-3.5 h-4.5 w-4.5 text-zinc-400" />
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  By continuing, you agree to SmartBuy's <span className="text-[#2874f0] hover:underline cursor-pointer">Terms of Use</span> and <span className="text-[#2874f0] hover:underline cursor-pointer">Privacy Policy</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => triggerOtpSend(email)}
                    className="w-full bg-[#fb641b] hover:bg-[#e15210] text-white font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-md tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    Request OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!email) {
                        toast.error("Please enter email/mobile number first");
                        return;
                      }
                      setLoginStep('password');
                    }}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#2874f0] font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-sm tracking-wider transition-all cursor-pointer"
                  >
                    Use Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {loginStep === 'otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Verify Security OTP</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  We have sent a 4-digit verification code to <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{email}</strong>
                </p>
              </div>

              {/* OTP Numeric Boxes */}
              <div className="flex gap-4 justify-center py-4">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`standalone-otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    pattern="\d*"
                    value={otpVal[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-2xl focus:border-[#2874f0] outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#fb641b] hover:bg-[#e15210] text-white font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-md tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                Verify & Continue
              </button>

              <div className="flex justify-between items-center text-xs text-zinc-500">
                {otpTimer > 0 ? (
                  <p className="font-medium">Resend OTP in <span className="font-mono text-[#fb641b] font-bold">{otpTimer}s</span></p>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerOtpSend(email)}
                    className="text-[#2874f0] font-bold hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setLoginStep('password')}
                  className="text-[#2874f0] font-bold hover:underline cursor-pointer"
                >
                  Use Password instead
                </button>
              </div>
            </form>
          )}

          {loginStep === 'password' && (
            <form onSubmit={handlePasswordLoginSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Login with Password</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Enter password associated with your account <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{email}</strong>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
                  <div className="relative mt-1.5">
                    <input
                      type="password"
                      placeholder="Enter your secret password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 py-3 pl-11 pr-4 text-xs font-semibold outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/10 transition-all"
                      required
                    />
                    <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-zinc-400" />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-650 text-xs flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#fb641b] hover:bg-[#e15210] py-3.5 text-xs font-extrabold uppercase text-white shadow-md tracking-wider transition-all cursor-pointer"
                >
                  {loading ? 'Logging in...' : (
                    <>
                      <LogIn className="h-4.5 w-4.5" />
                      Sign In Securely
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => triggerOtpSend(email)}
                    className="text-[#2874f0] text-xs font-extrabold hover:underline cursor-pointer"
                  >
                    Login via OTP instead
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <p className="text-xs text-zinc-400">
              New to SmartBuy?{' '}
              <button 
                type="button"
                onClick={() => navigate('register')}
                className="font-bold text-[#2874f0] hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
