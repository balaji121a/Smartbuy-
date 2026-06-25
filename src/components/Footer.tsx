import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950 py-12 transition-colors">
      
      {/* Core values */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-900 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Express Store Delivery</h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Frictionless dispatch and multi-vendor tracking logs.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Buyer Protection Guarantee</h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Full refund if items do not match seller specifications.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">100% Verified Vendors</h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Sellers approved under strict physical & commercial review.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-baseline font-display text-xl font-black uppercase tracking-tight cursor-pointer select-none" onClick={() => navigate('home')}>
            <span className="text-zinc-800 dark:text-zinc-100">Smart</span>
            <span className="text-yellow-500">Buy</span>
            <span className="text-yellow-500 text-2xl font-black">.</span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 leading-relaxed">
            Multi-vendor digital retail space designed to connect trusted stores directly with regional and global consumers.
          </p>
        </div>

        {/* Directory Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Services</h4>
          <ul className="mt-4 space-y-2 text-xs text-zinc-400 dark:text-zinc-500">
            <li><button onClick={() => navigate('shop')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">Explore Stores</button></li>
            <li><button onClick={() => navigate('pricing')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">Vendor Pricing</button></li>
            <li><button onClick={() => navigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">SmartBuy Plus Benefits</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Support</h4>
          <ul className="mt-4 space-y-2 text-xs text-zinc-400 dark:text-zinc-500">
            <li><button onClick={() => navigate('orders')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">Order History</button></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Seller Terms of Use</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Frictionless Dispute logs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Accepted Gateways</h4>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 leading-relaxed">
            We support Visa, Mastercard, Apple Pay, Stripe, Razorpay, and direct Cash on Delivery options.
          </p>
          <div className="flex gap-2 mt-4 text-zinc-400 dark:text-zinc-600">
            <CreditCard className="h-6 w-10 border border-zinc-200 dark:border-zinc-800 p-1 rounded bg-white dark:bg-zinc-900" />
            <div className="text-[10px] font-black tracking-tighter uppercase px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-emerald-500">stripe</div>
            <div className="text-[10px] font-black tracking-tighter uppercase px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sky-500">razorpay</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} SmartBuy Plus Multi-Vendor Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
