import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  Heart, 
  Ticket, 
  Headphones, 
  Mail, 
  ChevronRight, 
  CreditCard, 
  MapPin, 
  Settings, 
  Lock, 
  Globe, 
  Bell, 
  Info, 
  LogOut, 
  Coins, 
  Award, 
  Briefcase,
  User as UserIcon,
  MessageSquare,
  HelpCircle,
  X,
  CheckCircle2,
  Trash2,
  Plus,
  AlertTriangle,
  Smartphone,
  Save,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function ProfileView() {
  const { user, logout, navigate, updateUser } = useApp();

  // Active sub-modal / view state
  const [activeModal, setActiveModal] = useState<'profile' | 'addresses' | 'cards' | 'notifications' | null>(null);

  // Form states for Profile Editing
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');

  // Form states for Saved Cards
  const [savedCards, setSavedCards] = useState<{ id: string; number: string; name: string; expiry: string; type: string }[]>([]);
  const [cardNo, setCardNo] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Notification toggles
  const [notifs, setNotifs] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    push: true
  });

  // Sync form states with user context
  useEffect(() => {
    if (user) {
      setFormName(user.name || '');
      setFormEmail(user.email || '');
      setFormPhone(user.phone || '');
      setFormAddress(user.address || '');
      setFormPincode(user.pincode || '');
      setFormCity(user.city || '');
      setFormState(user.state || '');
    }
  }, [user]);

  // Load and save credit cards from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`sb_cards_${user.email}`);
      if (saved) {
        setSavedCards(JSON.parse(saved));
      } else {
        const defaultCards = [
          { id: '1', number: '•••• •••• •••• 5678', name: user.name || 'Amit Kumar', expiry: '11/29', type: 'Visa' }
        ];
        setSavedCards(defaultCards);
        localStorage.setItem(`sb_cards_${user.email}`, JSON.stringify(defaultCards));
      }

      const savedNotifs = localStorage.getItem(`sb_notifs_${user.email}`);
      if (savedNotifs) {
        setNotifs(JSON.parse(savedNotifs));
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-150 dark:border-zinc-850 p-6 max-w-md mx-auto shadow-sm" id="profile-unauth">
        <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/10 text-[#2874F0] flex items-center justify-center border border-blue-100 dark:border-blue-900/20 mb-4 animate-bounce">
          <UserIcon className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Please Login</h3>
        <p className="text-xs text-zinc-400 mt-1.5 max-w-xs font-medium leading-relaxed">
          You must be signed in to access orders, rewards balances, and account delivery specifications.
        </p>
        <button
          onClick={() => navigate('login')}
          className="mt-5 rounded-full bg-[#2874F0] text-white px-6 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-blue-600 cursor-pointer shadow transition-all hover:scale-103"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleGridAction = (action: string, targetView?: any) => {
    if (targetView) {
      navigate(targetView);
      toast.success(`Opening ${action}`);
    } else {
      toast.success(`${action} dashboard is fully ready!`);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (formPhone && !/^\d{10}$/.test(formPhone.replace(/\s+/g, ''))) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (formPincode && !/^\d{6}$/.test(formPincode.replace(/\s+/g, ''))) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }

    updateUser({
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim(),
      pincode: formPincode.trim(),
      city: formCity.trim(),
      state: formState.trim()
    });

    toast.success("Profile saved and verified successfully! ✓", {
      icon: '👤',
      duration: 3000
    });
    setActiveModal(null);
  };

  const handleSaveAddresses = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAddress.trim() || !formCity.trim() || !formState.trim() || !formPincode.trim()) {
      toast.error("Please fill all address fields.");
      return;
    }
    if (!/^\d{6}$/.test(formPincode.replace(/\s+/g, ''))) {
      toast.error("Invalid 6-digit PIN code");
      return;
    }

    updateUser({
      address: formAddress.trim(),
      city: formCity.trim(),
      state: formState.trim(),
      pincode: formPincode.trim()
    });

    toast.success("Delivery Address updated securely! ✓", {
      icon: '📍'
    });
    setActiveModal(null);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNo = cardNo.replace(/\s+/g, '');
    if (cleanNo.length < 15 || cleanNo.length > 16) {
      toast.error("Please enter a valid Card Number (15 or 16 digits)");
      return;
    }
    if (!cardHolder.trim()) {
      toast.error("Please enter Card Holder Name");
      return;
    }
    if (!cardExpiry.includes('/')) {
      toast.error("Expiry date format must be MM/YY");
      return;
    }

    const type = cleanNo.startsWith('4') ? 'Visa' : cleanNo.startsWith('5') ? 'Mastercard' : 'RuPay';
    const formattedNumber = `•••• •••• •••• ${cleanNo.slice(-4)}`;
    const newObj = {
      id: Math.random().toString(),
      number: formattedNumber,
      name: cardHolder.trim(),
      expiry: cardExpiry.trim(),
      type
    };

    const updated = [...savedCards, newObj];
    setSavedCards(updated);
    localStorage.setItem(`sb_cards_${user.email}`, JSON.stringify(updated));
    setCardNo('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');
    toast.success("Payment Card saved to account! ✓", { icon: '💳' });
  };

  const handleDeleteCard = (id: string) => {
    const filtered = savedCards.filter(c => c.id !== id);
    setSavedCards(filtered);
    localStorage.setItem(`sb_cards_${user.email}`, JSON.stringify(filtered));
    toast.success("Card removed successfully.");
  };

  const handleSaveNotifs = (key: keyof typeof notifs) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    localStorage.setItem(`sb_notifs_${user.email}`, JSON.stringify(updated));
    toast.success("Preferences updated", { duration: 1000 });
  };

  const languages = ["हिंदी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "ಕನ್ನಡ", "+8 more"];

  return (
    <div className="max-w-4xl mx-auto pb-24 text-left font-sans px-3 sm:px-4 space-y-4" id="profile-view-root">
      
      {/* 1. INCOMPLETE PROFILE ALERTER (Direct User Ask: Profile completion first) */}
      {!user.profileCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-orange-500 to-[#fb641b] text-white rounded-2xl p-4.5 shadow-md space-y-3 relative overflow-hidden"
          id="profile-incomplete-alerter"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5.5 w-5.5 text-yellow-300 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-black uppercase tracking-wider">Action Required: Complete Profile</h4>
              <p className="text-[11px] text-orange-50 font-semibold leading-relaxed">
                உங்களுடைய Delivery Address மற்றும் Mobile Phone இன்னும் சரியாக அமைக்கப்படவில்லை. விரைவான டெலிவரி செய்ய உடனே பூர்த்தி செய்யுங்கள்!
              </p>
              <p className="text-[10px] text-orange-100 font-bold">
                Please configure your address & phone number to unlock order placements, SuperCoin discounts & secure delivery options.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('profile')}
            className="w-full bg-white text-[#fb641b] hover:bg-zinc-50 font-extrabold text-[10px] uppercase py-2.5 rounded-xl transition-all shadow cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <UserIcon className="h-3.5 w-3.5" />
            Fill In Delivery Details Now ✓
          </button>
        </motion.div>
      )}

      {/* Two Column Grid layout for laptops, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Identity, Actions, Language, and Activity logs) */}
        <div className="md:col-span-2 space-y-4">
          
          {/* 2. TOP ACCOUNT HEADER CARD */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white leading-none flex items-center gap-2">
                  {user.name}
                  {user.profileCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />}
                </h2>
                <p className="text-[9px] text-zinc-400 font-bold uppercase truncate max-w-[180px]">{user.email}</p>
                {user.phone && <p className="text-[10px] text-zinc-500 font-bold font-mono">📱 +91 {user.phone}</p>}
                
                <span className="inline-block text-[10px] text-[#2874F0] font-black uppercase tracking-wider mt-1.5 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                  {user.profileCompleted ? "SmartBuy Verified Profile ✓" : "Incomplete Profile ⚠️"}
                </span>
              </div>
              
              {/* SuperCoin rewards pill */}
              <button 
                onClick={() => handleGridAction('SuperCoins rewards')}
                className="flex items-center gap-1.5 bg-zinc-950 text-white dark:bg-zinc-800 rounded-full px-3 py-1.5 shadow-sm hover:bg-zinc-800 transition-colors"
              >
                <Coins className="h-4 w-4 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-xs font-mono font-black text-yellow-400">{user.superCoins !== undefined ? user.superCoins : 240}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Coins</span>
              </button>
            </div>

            {/* Black Membership promo details */}
            <div className="bg-zinc-950 dark:bg-zinc-950 text-zinc-100 rounded-xl p-3.5 relative overflow-hidden border border-zinc-850 shadow-inner">
              <div className="absolute right-0 bottom-0 opacity-10 font-black text-7xl select-none italic tracking-tight text-white">
                PLUS
              </div>
              <div className="relative z-10 space-y-2 text-left">
                <h4 className="text-[9px] font-black text-yellow-400 uppercase tracking-widest leading-none">Flipkart BLACK membership</h4>
                <p className="text-[11px] font-bold text-zinc-300 leading-snug">
                  Get Early Access, and 15% bank offer with Flipkart BLACK.
                </p>
                <button
                  onClick={() => toast.success("Flipkart BLACK exclusive trial activated!")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-zinc-950 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer shadow transition-transform hover:scale-103"
                >
                  Explore BLACK
                </button>
              </div>
            </div>
          </div>

          {/* Admin Panel Quick Access Banner */}
          {user.role === 'admin' && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Control Station Center</h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-tight">Manage catalog, incoming orders, and customers.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('admin')}
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all shrink-0 hover:scale-103"
              >
                Enter Dashboard
              </button>
            </div>
          )}

          {/* 3. ACTIONS GRID (Responsive 4-column row on laptop screens) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleGridAction('My Orders', 'orders')}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-3.5 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors shadow-sm text-left group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition-transform">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-none font-sans">Orders</p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 leading-none">Tracking</p>
              </div>
            </button>

            <button
              onClick={() => handleGridAction('Wishlist', 'wishlist')}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-3.5 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors shadow-sm text-left group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-pink-50 dark:bg-pink-950/20 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100 dark:border-pink-900/30 group-hover:scale-105 transition-transform">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-none font-sans">Wishlist</p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 leading-none">Favorites</p>
              </div>
            </button>

            <button
              onClick={() => handleGridAction('My Coupons')}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-3.5 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors shadow-sm text-left group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30 group-hover:scale-105 transition-transform">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-none font-sans">Coupons</p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 leading-none">Discounts</p>
              </div>
            </button>

            <button
              onClick={() => handleGridAction('Help Center')}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-3.5 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors shadow-sm text-left group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/30 group-hover:scale-105 transition-transform">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-none font-sans">Help Center</p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 leading-none">Support</p>
              </div>
            </button>
          </div>

          {/* 7. TRY FLIPKART IN YOUR LANGUAGE */}
          <div className="space-y-1.5 text-left">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider pl-1">Try Flipkart in your language</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((l, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    toast.success(`Language set to ${l}!`);
                  }}
                  className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-150 dark:border-zinc-800 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer dark:text-zinc-300"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* 8. MY ACTIVITY SECTION */}
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider pl-1 mb-1.5">My Activity</p>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toast("Opening Reviews...")}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Reviews</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={() => toast("Opening Questions & Answers...")}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4.5 w-4.5 text-zinc-500 shrink-0" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Questions & Answers</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Settings lists, Finance offers, and Configuration panels) */}
        <div className="space-y-4">
          
          {/* 6. REAL ACCOUNT SETTINGS ACTIONS */}
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider pl-1 mb-1.5">Account Settings</p>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-sm">
              
              <button
                onClick={() => setActiveModal('profile')}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4.5 w-4.5 text-[#2874F0] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Edit Profile</span>
                    <span className="text-[8px] text-zinc-400 font-extrabold uppercase">Name, email & phone number</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!user.profileCompleted && <span className="h-2 w-2 rounded-full bg-[#fb641b] animate-ping" />}
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </div>
              </button>

              <button
                onClick={() => setActiveModal('addresses')}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Saved Addresses</span>
                    <span className="text-[8px] text-zinc-400 font-extrabold uppercase">Manage shipping destinations</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={() => setActiveModal('cards')}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Saved Cards & Wallet</span>
                    <span className="text-[8px] text-zinc-400 font-extrabold uppercase">Manage secure payment card details</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={() => setActiveModal('notifications')}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-4.5 w-4.5 text-orange-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Notification Settings</span>
                    <span className="text-[8px] text-zinc-400 font-extrabold uppercase">Toggles for SMS, WhatsApp & Push alerts</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>

            </div>
          </div>

          {/* 5. FINANCE OPTIONS */}
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider pl-1 mb-1.5">Finance Options</p>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toast("Flipkart Personal Loan portal is online & verified!")}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-amber-500 fill-amber-50 dark:fill-amber-950/20 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">Personal Loan</p>
                    <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">Upto ₹10,00,000</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={() => toast("Flipkart EMI portal is fully operational!")}
                className="flex items-center justify-between p-3.5 w-full hover:bg-zinc-50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">SmartBuy EMI</p>
                    <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">Unlock ₹1 Lakh | No Cost EMI</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* 4. EMAIL VERIFICATION BANNER */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-3 flex items-center justify-between gap-3 shadow-sm text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8.5 w-8.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0 leading-none">
                <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate">Email Settings</p>
                <p className="text-[9px] text-zinc-400 font-semibold mt-1 truncate">Get tracking updates</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal('profile');
                toast.success("Ready to configure email details!");
              }}
              className="bg-blue-50 dark:bg-blue-950/40 text-[#2874F0] border border-blue-100 dark:border-blue-900/40 font-black text-[9px] uppercase px-2.5 py-1.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shrink-0 cursor-pointer"
            >
              Update
            </button>
          </div>

          {/* 9. LOG OUT CTA ROW */}
          <button
            onClick={() => { logout(); toast.success("Logged out successfully"); }}
            className="w-full bg-white dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 border border-rose-200 dark:border-rose-900/40 hover:border-rose-300 font-black text-xs uppercase py-3 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log Out from Account
          </button>

        </div>

      </div>


      {/* ====================================================================
         MODALS DRAWER PORTAL SECTION
         ==================================================================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs">
            {/* Modal Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveModal(null)}
            />

            {/* Modal content container */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-white dark:bg-zinc-950 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-850 z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between p-4.5 border-b border-zinc-100 dark:border-zinc-850 bg-white dark:bg-zinc-950 shrink-0">
                <div className="text-left">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    {activeModal === 'profile' && "Edit Profile Details"}
                    {activeModal === 'addresses' && "Saved Delivery Addresses"}
                    {activeModal === 'cards' && "Saved Cards & Wallet"}
                    {activeModal === 'notifications' && "Notification Preferences"}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-semibold">
                    {activeModal === 'profile' && "Update name, email, and verification details"}
                    {activeModal === 'addresses' && "Manage locations and shipping coordinates"}
                    {activeModal === 'cards' && "Link credit, debit, or RuPay cards securely"}
                    {activeModal === 'notifications' && "Control message channels for tracking alerts"}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body (Scrollable form) */}
              <div className="p-5 overflow-y-auto flex-1 text-left space-y-5 bg-zinc-50 dark:bg-zinc-900/40">

                {/* MODAL 1: EDIT PROFILE */}
                {activeModal === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Email Address</label>
                      <input 
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors"
                        placeholder="yourname@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Mobile Phone Number *</label>
                        <input 
                          type="tel"
                          required
                          maxLength={10}
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors font-mono"
                          placeholder="10-digit mobile phone"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">ZIP / PIN Code *</label>
                        <input 
                          type="text"
                          required
                          maxLength={6}
                          value={formPincode}
                          onChange={(e) => setFormPincode(e.target.value.replace(/\D/g, ''))}
                          className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors font-mono"
                          placeholder="e.g. 600001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Street Address *</label>
                      <textarea 
                        required
                        rows={2}
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors leading-relaxed"
                        placeholder="Door number, building, street, locality details"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">City *</label>
                        <input 
                          type="text"
                          required
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors"
                          placeholder="e.g. Chennai"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">State *</label>
                        <input 
                          type="text"
                          required
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs font-semibold outline-none focus:border-[#2874f0] transition-colors"
                          placeholder="e.g. Tamil Nadu"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#fb641b] hover:bg-[#e15210] text-white font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-md tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="h-4.5 w-4.5" />
                      Save & Complete Profile
                    </button>
                  </form>
                )}


                {/* MODAL 2: SAVED ADDRESSES */}
                {activeModal === 'addresses' && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                      Your primary delivery and package tracking location is currently bound to:
                    </p>

                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <p className="font-black text-zinc-800 dark:text-white">{user.name}</p>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
                          {user.address || "No address configured yet"}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400">
                          {user.city && `${user.city}, `}
                          {user.state && `${user.state} `}
                          - <strong className="font-mono text-zinc-800 dark:text-zinc-100">{user.pincode || "N/A"}</strong>
                        </p>
                        {user.phone && (
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pt-1">
                            Mobile: +91 {user.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-4">
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase mb-3">Update Shipping Destination</h4>
                      <form onSubmit={handleSaveAddresses} className="space-y-3">
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-400">Street Address</label>
                          <input 
                            type="text"
                            required
                            value={formAddress}
                            onChange={(e) => setFormAddress(e.target.value)}
                            className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0]"
                            placeholder="Enter delivery address"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400">City</label>
                            <input 
                              type="text"
                              required
                              value={formCity}
                              onChange={(e) => setFormCity(e.target.value)}
                              className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0]"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400">PIN Code</label>
                            <input 
                              type="text"
                              required
                              maxLength={6}
                              value={formPincode}
                              onChange={(e) => setFormPincode(e.target.value.replace(/\D/g, ''))}
                              className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0] font-mono"
                              placeholder="6-digit"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-400">State</label>
                          <input 
                            type="text"
                            required
                            value={formState}
                            onChange={(e) => setFormState(e.target.value)}
                            className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0]"
                            placeholder="State"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#2874F0] hover:bg-blue-600 text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <MapPin className="h-4 w-4" />
                          Update Primary Address
                        </button>
                      </form>
                    </div>
                  </div>
                )}


                {/* MODAL 3: SAVED CARDS & WALLET */}
                {activeModal === 'cards' && (
                  <div className="space-y-4">
                    
                    {/* Visual cards list */}
                    {savedCards.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic font-medium text-center py-4">No cards linked to this account yet.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {savedCards.map((card) => (
                          <div 
                            key={card.id} 
                            className="bg-gradient-to-tr from-zinc-900 via-zinc-850 to-zinc-950 text-white p-4.5 rounded-2xl border border-zinc-800 shadow-lg relative overflow-hidden"
                          >
                            {/* Decorative background blur shapes */}
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                            <div className="absolute right-4 bottom-4 w-12 h-8 bg-amber-400/20 rounded blur-md pointer-events-none" />
                            
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{card.type} Card</p>
                                <p className="text-sm font-mono tracking-widest font-bold mt-2">{card.number}</p>
                              </div>
                              <button 
                                onClick={() => handleDeleteCard(card.id)}
                                className="text-zinc-500 hover:text-red-400 p-1 rounded-full hover:bg-white/5 cursor-pointer transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex justify-between items-end mt-5">
                              <div>
                                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Card Holder</p>
                                <p className="text-xs font-black truncate max-w-[180px]">{card.name}</p>
                              </div>
                              <div>
                                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Expires</p>
                                <p className="text-xs font-mono font-bold">{card.expiry}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add card form */}
                    <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-4">
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase mb-3 flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Link New Payment Card
                      </h4>

                      <form onSubmit={handleAddCard} className="space-y-3">
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-400">Card Number</label>
                          <input 
                            type="text"
                            required
                            maxLength={16}
                            value={cardNo}
                            onChange={(e) => setCardNo(e.target.value.replace(/\D/g, ''))}
                            className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0] font-mono"
                            placeholder="e.g. 4321 0987 6543 2109"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-400">Cardholder Name</label>
                          <input 
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0]"
                            placeholder="Name as printed on card"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 font-sans">Expiry (MM/YY)</label>
                            <input 
                              type="text"
                              required
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0] font-mono"
                              placeholder="MM/YY"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 font-sans">CVV Security Code</label>
                            <input 
                              type="password"
                              required
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-[#2874f0] font-mono"
                              placeholder="•••"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="h-4 w-4 text-yellow-400" />
                          Link Secure Card
                        </button>
                      </form>
                    </div>

                  </div>
                )}


                {/* MODAL 4: NOTIFICATION PREFERENCES */}
                {activeModal === 'notifications' && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                      Toggle active communication channels to receive delivery tracking updates, promotional codes, and SuperCoin reports:
                    </p>

                    <div className="space-y-2.5">
                      {[
                        { key: 'sms', label: 'SMS Notifications', desc: 'Instant OTP codes & dispatch alerts via cellular SMS', icon: Smartphone, color: 'text-indigo-600' },
                        { key: 'email', label: 'Email Order Reports', desc: 'Secure invoices, coupon sheets & detailed shipping reports', icon: Mail, color: 'text-blue-600' },
                        { key: 'push', label: 'Push App Alerts', desc: 'Live tracker notifications and price-drop notifications', icon: Bell, color: 'text-orange-500' },
                        { key: 'whatsapp', label: 'WhatsApp Live Alerts', desc: 'Opt-in WhatsApp messages for immediate dispatch feedback', icon: MessageSquare, color: 'text-emerald-500' }
                      ].map((pref) => {
                        const Icon = pref.icon;
                        const isChecked = notifs[pref.key as keyof typeof notifs];
                        return (
                          <div 
                            key={pref.key}
                            onClick={() => handleSaveNotifs(pref.key as keyof typeof notifs)}
                            className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850/30 transition-colors shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 ${pref.color}`}>
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none">{pref.label}</p>
                                <p className="text-[10px] text-zinc-400 mt-1 font-semibold leading-tight">{pref.desc}</p>
                              </div>
                            </div>

                            {/* Custom animated switch */}
                            <div className={`w-10 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${isChecked ? 'bg-emerald-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'}`}>
                              <motion.div 
                                layout 
                                className="w-5.5 h-5.5 rounded-full bg-white shadow-md" 
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
