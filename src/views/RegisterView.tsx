import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User as UserIcon, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterView() {
  const { login, navigate } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (res.status === 211 || res.ok) {
        const data = await res.json();
        login(data.token, data.user);
        navigate('home');
      } else {
        const err = await res.json();
        setErrorMessage(err.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage('Failed to connect with fullstack server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4" id="register-view-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/40 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-sans text-xl font-black mx-auto">
            A
          </div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-50">Create Premium Account</h1>
          <p className="text-xs text-zinc-400">Join our e-commerce platform and unlock global express delivery.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                required
              />
              <UserIcon className="absolute left-3.5 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                required
              />
              <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Choose Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                required
              />
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-zinc-400" />
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 cursor-pointer"
          >
            {loading ? 'Creating Account...' : (
              <>
                <ShieldCheck className="h-4.5 w-4.5" />
                Agree & Register Account
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('login')}
              className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Log In
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
