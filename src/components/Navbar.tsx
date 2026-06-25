import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_PRODUCTS } from '../data/products';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  User as UserIcon, 
  ChevronDown, 
  Package, 
  Heart, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  Plane,
  Camera,
  Mic,
  Gift,
  Shirt,
  Smartphone,
  Laptop,
  Home as HomeIcon,
  Compass,
  Coins,
  Settings,
  Mail,
  Lock,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { 
    user, 
    cart, 
    pincode, 
    setPincode, 
    navigate, 
    logout,
    setSearch,
    login
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userDropdown, setUserDropdown] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempPincode, setTempPincode] = useState('600001');
  const [tempCity, setTempCity] = useState('Chennai');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Travel Segment State
  const [activeSegment, setActiveSegment] = useState<'shopping' | 'travel'>('shopping');
  const [showTravelModal, setShowTravelModal] = useState(false);

  // Camera & voice smart triggers
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Dynamic animated placeholders
  const placeholders = [
    "Search watches...",
    "Search premium mobiles...",
    "Search running shoes...",
    "Search home decor...",
    "Search beauty products...",
    "Search laptops..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Fake auth credentials state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Flipkart style OTP verification states
  const [loginStep, setLoginStep] = useState<'input' | 'otp' | 'password'>('input');
  const [otpVal, setOtpVal] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [enteredPassword, setEnteredPassword] = useState('');

  // Handle OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const autocompleteRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate autocomplete suggestions as the user types
  useEffect(() => {
    if (!searchVal.trim()) {
      setSuggestions(["iPhone 15 Pro", "MacBook Air M3", "Puma Sneakers", "Nivia Football", "Cosmic Watches"]);
      return;
    }

    const query = searchVal.toLowerCase();
    const matches = INDIAN_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    ).map(p => p.name);

    const uniqueMatches = Array.from(new Set(matches)).slice(0, 5);

    if (uniqueMatches.length === 0) {
      setSuggestions([`Search for "${searchVal}"`, "Mobiles", "Laptops", "Fashion", "Appliances"]);
    } else {
      setSuggestions(uniqueMatches);
    }
  }, [searchVal]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearch(searchVal.trim());
      navigate('products');
      setShowSuggestions(false);
      toast.success(`Showing results for "${searchVal}"`);
    }
  };

  const selectSuggestion = (sug: string) => {
    setSearchVal(sug);
    setSearch(sug);
    navigate('products');
    setShowSuggestions(false);
    toast.success(`Search: ${sug}`);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPincode.trim() || tempPincode.length !== 6) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    const cleanCity = tempCity.trim() || "Chennai";
    setPincode(`Deliver to: ${cleanCity} ${tempPincode.trim()}`);
    setShowLocationModal(false);
    toast.success(`Delivery address updated to ${cleanCity} - ${tempPincode}`);
  };

  const resetLoginStates = () => {
    setLoginStep('input');
    setOtpVal(['', '', '', '']);
    setGeneratedOtp('');
    setOtpTimer(0);
    setEnteredPassword('');
  };

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
            <p className="text-xs font-bold text-zinc-900">SmartBuy Security Verification</p>
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

  const handleVerifyOtp = (e: React.FormEvent) => {
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

    const name = loginName.trim() || (loginEmail.toLowerCase().includes('admin') ? "Shop Admin" : "Amit Kumar");
    login(loginEmail, name);
    setShowLoginModal(false);
    resetLoginStates();
    toast.success(`Welcome back, ${name}! Verification complete ✓`);
  };

  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword) {
      toast.error("Please enter your password");
      return;
    }
    const name = loginName.trim() || (loginEmail.toLowerCase().includes('admin') ? "Shop Admin" : "Amit Kumar");
    login(loginEmail, name);
    setShowLoginModal(false);
    resetLoginStates();
    toast.success(`Welcome back, ${name}! Password verified successfully ✓`);
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpVal];
    newOtp[index] = cleanVal;
    setOtpVal(newOtp);

    // Auto focus next input
    if (cleanVal && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpVal[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const categories = [
    { name: 'For You', icon: Sparkles, color: 'text-amber-400' },
    { name: 'Fashion', icon: Shirt, color: 'text-pink-400' },
    { name: 'Mobiles', icon: Smartphone, color: 'text-cyan-400' },
    { name: 'Beauty', icon: Sparkles, color: 'text-rose-400' },
    { name: 'Electronics', icon: Laptop, color: 'text-emerald-400' },
    { name: 'Home', icon: HomeIcon, color: 'text-orange-400' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#11327c] via-[#2874f0] to-[#164cbd] text-white shadow-xl flex flex-col transition-all duration-300">
        
        {/* ROW 1: BRAND SPLIT SWITCH & CORE ACTIONS */}
        <div className="w-full max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Segmented control: Flipkart/SmartBuy vs Travel (Matches screenshot exactly) */}
          <div className="flex items-center bg-black/20 p-1 rounded-full border border-white/10 shrink-0">
            <button
              onClick={() => {
                setActiveSegment('shopping');
                navigate('home');
              }}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight flex items-center gap-1 transition-all cursor-pointer ${
                activeSegment === 'shopping' 
                  ? 'bg-yellow-400 text-yellow-950 shadow-md scale-103' 
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-600 inline-block animate-pulse" />
              SmartBuy
            </button>
            <button
              onClick={() => {
                setActiveSegment('travel');
                setShowTravelModal(true);
              }}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight flex items-center gap-1 transition-all cursor-pointer ${
                activeSegment === 'travel' 
                  ? 'bg-rose-500 text-white shadow-md scale-103' 
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Plane className="h-3.5 w-3.5 text-rose-300" />
              Travel
            </button>
          </div>

          {/* Centered Desktop Logo & Tagline */}
          <div 
            onClick={() => { setSearchVal(''); setSearch(''); navigate('home'); }}
            className="hidden sm:flex items-center gap-2.5 cursor-pointer select-none group"
            id="navbar-smartbuy-logo"
          >
            <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-yellow-400 to-[#FF9900] text-yellow-950 shadow-md group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="h-5 w-5 fill-yellow-950 stroke-[2.5]" />
              <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-white fill-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-sans text-base font-black tracking-tight text-white uppercase italic">
                  Smart<span className="text-yellow-400">Buy</span>
                </span>
                <span className="bg-yellow-400 text-yellow-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">PLUS</span>
              </div>
              <span className="text-[8px] font-black text-emerald-300 tracking-widest uppercase mt-0.5">India's Bazaar</span>
            </div>
          </div>

          {/* Actions: Search, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Account Info */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1 text-[11px] font-black uppercase hover:bg-white/10 px-2.5 py-1.5 rounded-full border border-white/10 cursor-pointer"
                  id="user-menu-trigger"
                >
                  <UserIcon className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Dropdown Options */}
                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white text-zinc-800 rounded-2xl shadow-2xl border border-zinc-150 overflow-hidden z-50"
                    >
                      <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Active Account</p>
                        <p className="font-black text-xs text-zinc-800 truncate">{user.email}</p>
                      </div>
                      <div className="p-1 flex flex-col text-xs font-semibold">
                        <button
                          onClick={() => { setUserDropdown(false); navigate('orders'); }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded-xl text-left text-zinc-700"
                        >
                          <Package className="h-4 w-4 text-zinc-400" /> My Orders
                        </button>
                        <button
                          onClick={() => { setUserDropdown(false); navigate('wishlist'); }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded-xl text-left text-zinc-700"
                        >
                          <Heart className="h-4 w-4 text-zinc-400" /> Wishlist
                        </button>
                        <button
                          onClick={() => { setUserDropdown(false); navigate('profile'); }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded-xl text-left text-zinc-700"
                        >
                          <Coins className="h-4 w-4 text-yellow-500 fill-yellow-500" /> SuperCoins
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => { setUserDropdown(false); navigate('admin'); }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-amber-50 text-amber-700 rounded-xl text-left font-black uppercase tracking-wider"
                          >
                            <Settings className="h-4 w-4 text-amber-500" /> Admin Panel
                          </button>
                        )}
                        <hr className="border-zinc-100 my-1" />
                        <button
                          onClick={() => { setUserDropdown(false); logout(); toast.success("Logged out successfully"); }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-rose-50 rounded-xl text-left text-rose-600 font-extrabold"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => { setIsSignUp(false); setShowLoginModal(true); }}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all shrink-0"
                id="header-login-btn"
              >
                Login
              </button>
            )}

            {/* Shopping Cart Button */}
            <button 
              onClick={() => navigate('cart')}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
              id="header-cart-icon"
            >
              <ShoppingBag className="h-5 w-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-yellow-950 text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-[#11327c] animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* ROW 2: LOCATION SELECTOR BAR (Matches "📍 621012 | Add address" style) */}
        <div 
          onClick={() => setShowLocationModal(true)}
          className="w-full bg-[#0f2c6e] border-t border-b border-white/5 py-1.5 px-4 flex items-center gap-1 text-xs cursor-pointer select-none hover:bg-[#133580] transition-all"
          id="location-strip"
        >
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-zinc-300">
            <p className="flex items-center gap-1 text-[11px] font-bold">
              <span className="text-emerald-400 font-mono">📍 {pincode.match(/\d+/)?.[0] || '600001'}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/90 truncate">{pincode.replace("Deliver to: ", "")}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 inline" />
            </p>
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest shrink-0">Change PIN</span>
          </div>
        </div>

        {/* ROW 3: ROUNDED SEARCH BAR WITH CAMERA/MIC */}
        <div className="w-full max-w-7xl mx-auto px-4 pb-2.5 pt-1.5" id="header-search-wrapper">
          <div ref={autocompleteRef} className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-full overflow-hidden px-3.5 py-2 shadow-inner border border-zinc-150">
              <Search className="h-4 w-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder={placeholders[placeholderIndex]}
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-transparent text-zinc-900 text-xs font-semibold outline-none pl-2.5 pr-12 placeholder-zinc-400"
              />
              <div className="absolute right-3 flex items-center gap-2 text-zinc-400">
                <Camera 
                  onClick={(e) => { e.stopPropagation(); setShowCameraModal(true); }} 
                  className="h-4 w-4 hover:text-zinc-600 cursor-pointer" 
                />
                <Mic 
                  onClick={(e) => { e.stopPropagation(); setShowVoiceModal(true); }} 
                  className="h-4 w-4 hover:text-zinc-600 cursor-pointer" 
                />
              </div>
            </form>

            {/* Suggestions Overlay */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white text-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 text-xs"
                >
                  <div className="p-2.5 bg-zinc-50 border-b border-zinc-100 text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                    {searchVal ? "Matching Products" : "Trending on SmartBuy India"}
                  </div>
                  <ul>
                    {suggestions.map((sug, idx) => (
                      <li 
                        key={idx}
                        onClick={() => selectSuggestion(sug)}
                        className="px-4 py-2.5 hover:bg-zinc-100 cursor-pointer flex items-center gap-2 border-b border-zinc-50 last:border-b-0 font-semibold"
                      >
                        <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{sug}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ROW 4: SCROLLABLE CATEGORY CHIPS */}
        <div className="w-full bg-gradient-to-r from-[#11327c] via-[#2874f0] to-[#164cbd] border-t border-white/5 py-1.5 px-4 overflow-x-auto scrollbar-none flex items-center gap-4 text-xs select-none" id="header-categories-carousel">
          <div className="max-w-7xl mx-auto flex items-center gap-6 shrink-0 pr-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSearch(cat.name === 'For You' ? '' : cat.name);
                    navigate('home');
                    toast.success(`Filter: ${cat.name}`);
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/5 transition-all text-white font-black text-[10px] uppercase tracking-wider cursor-pointer whitespace-nowrap"
                >
                  <Icon className={`h-3 w-3 ${cat.color}`} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

      </header>

      {/* ✈️ TRAVEL MODAL BOOKING */}
      <AnimatePresence>
        {showTravelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowTravelModal(false); setActiveSegment('shopping'); }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-150 overflow-hidden"
            >
              <button 
                onClick={() => { setShowTravelModal(false); setActiveSegment('shopping'); }}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
                  <Plane className="h-10 w-10 text-rose-500 fill-rose-100 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-rose-950 uppercase tracking-tight">SmartBuy Travel Bookings</h4>
                    <p className="text-[10px] text-rose-700 leading-normal font-semibold">Get flat 25% discount or pay entirely using your accumulated SuperCoins!</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">From (Origin)</label>
                    <input type="text" defaultValue="Chennai (MAA)" className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">To (Destination)</label>
                    <input type="text" defaultValue="New Delhi (DEL)" className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-xs font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Departure Date</label>
                      <input type="date" defaultValue="2026-07-01" className="w-full mt-1 border border-zinc-200 rounded-xl p-2.5 text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Travelers</label>
                      <select className="w-full mt-1 border border-zinc-200 rounded-xl p-2.5 text-xs font-semibold">
                        <option>1 Adult, Economy</option>
                        <option>2 Adults, Economy</option>
                        <option>1 Adult, Business</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toast.success("Flight booking initiated! Checking live airline inventory...");
                    setShowTravelModal(false);
                    setActiveSegment('shopping');
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase py-3 rounded-2xl shadow-md tracking-wider transition-all cursor-pointer"
                >
                  Search Flights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📷 CAMERA SCANNER MODAL */}
      <AnimatePresence>
        {showCameraModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCameraModal(false)}
              className="fixed inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-zinc-950 text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-zinc-800 text-center space-y-4"
            >
              <button 
                onClick={() => setShowCameraModal(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <Camera className="h-12 w-12 text-yellow-400 mx-auto animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider">Smart Visual Matcher</h3>
              <p className="text-[11px] text-zinc-400">Scan product barcodes or snap photos of objects to search prices instantly.</p>
              
              <div className="h-44 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center text-zinc-600 text-xs font-semibold bg-zinc-900/50">
                BARCODE SCANNER ENGINE READY
              </div>

              <button
                onClick={() => {
                  toast.success("Scanning completed! Matching objects with local SmartBuy list...");
                  setShowCameraModal(false);
                }}
                className="w-full bg-yellow-400 text-yellow-950 font-black text-xs uppercase py-2.5 rounded-xl"
              >
                Capture Photo
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎤 VOICE SEARCH MODAL */}
      <AnimatePresence>
        {showVoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVoiceModal(false)}
              className="fixed inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-indigo-950 text-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-indigo-900 text-center space-y-4"
            >
              <button 
                onClick={() => setShowVoiceModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <Mic className="h-12 w-12 text-rose-400 mx-auto animate-bounce" />
              <h3 className="text-xs font-black uppercase tracking-wider">Listening closely...</h3>
              <p className="text-[11px] text-indigo-200">Say what you want to search (e.g. "Buy premium running shoes")</p>
              
              <div className="flex justify-center gap-1.5 h-6 items-center">
                <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-5 bg-rose-400 rounded-full animate-pulse [animation-delay:0.1s]" />
                <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-6 bg-rose-400 rounded-full animate-pulse [animation-delay:0.3s]" />
              </div>

              <button
                onClick={() => {
                  setSearchVal("Sneakers");
                  setSearch("Sneakers");
                  navigate('home');
                  setShowVoiceModal(false);
                  toast.success("Voice recognition matched 'Sneakers'!");
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase py-2.5 rounded-xl border border-white/5"
              >
                Speak Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOCATION MODAL */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-zinc-100"
            >
              <button 
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight mb-2">Change Delivery Pincode</h3>
              <p className="text-[11px] text-zinc-400 mb-4">Enter your 6-digit Indian PIN code to check shipping speeds and delivery estimates.</p>
              
              <form onSubmit={handleSaveLocation} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">City Name</label>
                  <input 
                    type="text" 
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    placeholder="e.g. Chennai"
                    className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Pincode (6 Digits)</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={tempPincode}
                    onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 600001"
                    className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-bold tracking-widest text-emerald-600 focus:border-emerald-600 outline-none text-center"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-extrabold text-xs uppercase py-2.5 rounded-lg shadow-md tracking-wider transition-all cursor-pointer"
                >
                  Save & Continue
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGIN / SIGN UP MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowLoginModal(false);
                resetLoginStates();
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-zinc-800 rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl flex border border-zinc-100 dark:border-zinc-800"
            >
              {/* Green Left Banner */}
              <div className="hidden sm:flex flex-col justify-between bg-gradient-to-b from-[#2874f0] to-[#1a5dbf] text-white p-8 w-44 text-left">
                <div>
                  <h3 className="text-xl font-black">
                    {loginStep === 'otp' ? "Verify" : isSignUp ? "Sign Up" : "Login"}
                  </h3>
                  <p className="text-xs text-blue-100 mt-3 leading-relaxed font-semibold">
                    {loginStep === 'otp' 
                      ? "Enter the 4-digit OTP sent to your email or device."
                      : isSignUp 
                        ? "Get access to your Orders, Wishlist, Recommendations & claim SuperCoins!" 
                        : "Get access to your Orders, Wishlist and Recommendations"}
                  </p>
                </div>
                <div className="text-[22px] font-black italic tracking-wider text-white/30 select-none">
                  SmartBuy
                </div>
              </div>

              {/* Form panel */}
              <div className="flex-1 p-8 text-left relative bg-white dark:bg-zinc-950">
                <button 
                  onClick={() => {
                    setShowLoginModal(false);
                    resetLoginStates();
                  }}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                {loginStep === 'input' && (
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
                      {isSignUp ? "Create Flipkart Account" : "Flipkart Login"}
                    </h4>

                    <div className="space-y-4">
                      {isSignUp && (
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="Enter your name"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            className="w-full mt-1 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 text-xs focus:border-[#2874f0] outline-none transition-all"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address or 10-digit Mobile Number</label>
                        <div className="relative mt-1">
                          <input 
                            type="text" 
                            required
                            placeholder="Enter Email / Mobile number"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 pl-10 text-xs focus:border-[#2874f0] outline-none transition-all font-semibold"
                          />
                          <Smartphone className="absolute left-3 top-3.5 h-4.5 w-4.5 text-zinc-400" />
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        By continuing, you agree to Flipkart's <span className="text-[#2874f0] hover:underline cursor-pointer">Terms of Use</span> and <span className="text-[#2874f0] hover:underline cursor-pointer">Privacy Policy</span>.
                      </p>

                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={() => triggerOtpSend(loginEmail)}
                          className="w-full bg-[#fb641b] hover:bg-[#e15210] text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow-md tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="h-4 w-4" />
                          Request OTP
                        </button>

                        {!isSignUp && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!loginEmail) {
                                toast.error("Please enter your email or mobile first");
                                return;
                              }
                              setLoginStep('password');
                            }}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#2874f0] font-extrabold text-xs uppercase py-3 rounded-xl shadow-sm tracking-wider transition-all cursor-pointer"
                          >
                            Use Password
                          </button>
                        )}
                      </div>

                      {/* Sandbox Quick accounts */}
                      <div className="pt-4 border-t border-dashed border-zinc-150 dark:border-zinc-850 space-y-2">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          ⚡ Sandbox Quick Accounts
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginEmail("customer@example.com");
                              setLoginName("Amit Kumar");
                              toast.success("Filled: Amit Kumar (Customer)");
                            }}
                            className="text-[10px] py-2 px-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-100 transition-colors"
                          >
                            Amit (Customer)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLoginEmail("admin@example.com");
                              setLoginName("Shop Admin");
                              toast.success("Filled: Shop Admin");
                            }}
                            className="text-[10px] py-2 px-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-100 transition-colors"
                          >
                            Shop Admin (Admin)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loginStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Verify OTP
                    </h4>

                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Please enter the 4-digit verification code sent to <strong className="text-zinc-800 dark:text-white font-semibold">{loginEmail}</strong>
                    </p>

                    {/* Numeric Input Boxes */}
                    <div className="flex gap-3 justify-center py-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          pattern="\d*"
                          value={otpVal[idx]}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl focus:border-[#2874f0] outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#fb641b] hover:bg-[#e15210] text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow-md tracking-wider transition-all cursor-pointer"
                    >
                      Verify & Proceed
                    </button>

                    <div className="flex justify-between items-center text-xs text-zinc-500 pt-1">
                      {otpTimer > 0 ? (
                        <p className="font-medium">Resend OTP in <span className="font-mono text-[#fb641b] font-bold">{otpTimer}s</span></p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerOtpSend(loginEmail)}
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
                  <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Login with Password
                    </h4>

                    <p className="text-xs text-zinc-500">
                      Enter account password for <strong className="text-zinc-800 dark:text-white">{loginEmail}</strong>
                    </p>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
                      <div className="relative mt-1">
                        <input 
                          type="password" 
                          required
                          placeholder="Enter your password"
                          value={enteredPassword}
                          onChange={(e) => setEnteredPassword(e.target.value)}
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 pl-10 text-xs focus:border-[#2874f0] outline-none"
                        />
                        <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-zinc-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#fb641b] hover:bg-[#e15210] text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow-md tracking-wider transition-all cursor-pointer"
                    >
                      Log In Securely
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => triggerOtpSend(loginEmail)}
                        className="text-[#2874f0] text-xs font-bold hover:underline cursor-pointer"
                      >
                        Login via OTP instead
                      </button>
                    </div>
                  </form>
                )}

                {loginStep === 'input' && (
                  <div className="mt-6 text-center text-[11px] text-zinc-500">
                    {isSignUp ? (
                      <p>
                        Already have an account?{" "}
                        <button 
                          type="button"
                          onClick={() => {
                            setIsSignUp(false);
                            resetLoginStates();
                          }} 
                          className="text-[#2874f0] font-black hover:underline cursor-pointer"
                        >
                          Login here
                        </button>
                      </p>
                    ) : (
                      <p>
                        New to Flipkart?{" "}
                        <button 
                          type="button"
                          onClick={() => {
                            setIsSignUp(true);
                            resetLoginStates();
                          }} 
                          className="text-[#2874f0] font-black hover:underline cursor-pointer"
                        >
                          Create an account
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
