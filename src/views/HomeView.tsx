import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_PRODUCTS, Product, TRENDING_DEALS_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles, 
  Flame, 
  Clock, 
  ListFilter, 
  TrendingUp, 
  ArrowUpDown,
  Coins,
  CheckCircle2,
  Gift,
  Tag,
  Ticket,
  Copy,
  Check,
  Compass,
  MessageSquare,
  HelpCircle,
  X,
  Send,
  BadgePercent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function HomeView() {
  const { 
    user, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory,
    setActiveProductDetail,
    navigate,
    addSuperCoins,
    deductSuperCoins
  } = useApp();

  // --- 1. HERO CAROUSEL STATE ---
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselBanners = [
    {
      title: "BIG BILLION DAYS",
      tagline: "MEGA FESTIVAL DEALS ARE LIVE!",
      description: "Flat 80% Off on Electronics, Home Appliances & Fashion. Flat ₹5,000 Instant Discount with HDFC card.",
      bg: "bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-900",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      accent: "text-yellow-400"
    },
    {
      title: "GREAT INDIAN FESTIVAL",
      tagline: "CHRONICLES OF SAVINGS & SPEED",
      description: "Get Free One-Day delivery on Laptops, Mobiles & Accessories. Prime members save up to 15% extra.",
      bg: "bg-gradient-to-r from-orange-950 via-amber-900 to-amber-950",
      image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80",
      accent: "text-[#FF9900]"
    },
    {
      title: "SUPERCOINS FESTIVAL",
      tagline: "TAP COINS, REDEEM MEGA CASHBACK",
      description: "Double your savings by paying with SuperCoins. Apply on checkout and score free premium memberships.",
      bg: "bg-gradient-to-r from-teal-900 via-emerald-950 to-zinc-900",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      accent: "text-emerald-400"
    }
  ];

  // Auto rotate banner carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselBanners.length]);

  const prevBanner = () => {
    setCarouselIndex(prev => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };
  const nextBanner = () => {
    setCarouselIndex(prev => (prev + 1) % carouselBanners.length);
  };

  // --- 2. CATEGORIES ---
  const categoriesList = [
    { name: "Mobiles", emoji: "📱", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&h=120&q=80", badge: "New S24", color: "from-blue-500 to-indigo-600" },
    { name: "Laptops", emoji: "💻", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=120&h=120&q=80", badge: "M3 Air", color: "from-amber-500 to-orange-600" },
    { name: "TVs", emoji: "📺", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=120&h=120&q=80", badge: "Bezel-less", color: "from-rose-500 to-pink-600" },
    { name: "Fashion", emoji: "👕", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&h=120&q=80", badge: "Min 50%", color: "from-emerald-500 to-teal-600" },
    { name: "Appliances", emoji: "🔌", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&h=120&q=80", badge: "Dyson", color: "from-violet-500 to-purple-600" },
    { name: "Books", emoji: "📚", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=120&h=120&q=80", badge: "Top 10", color: "from-cyan-500 to-blue-600" },
    { name: "Grocery", emoji: "🍎", image: "https://images.unsplash.com/photo-1610832958506-ee5633619144?auto=format&fit=crop&w=120&h=120&q=80", badge: "Fresh", color: "from-green-500 to-emerald-600" },
    { name: "Beauty", emoji: "💄", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&h=120&q=80", badge: "Matte", color: "from-fuchsia-500 to-rose-600" },
    { name: "Toys", emoji: "🧸", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=120&h=120&q=80", badge: "Lego", color: "from-yellow-500 to-amber-600" },
    { name: "Sports", emoji: "🏏", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80", badge: "Nivia", color: "from-sky-500 to-indigo-600" }
  ];

  // --- 3. LIGHTNING DEALS COUNTDOWN TIMER ---
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 44, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 44, seconds: 12 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const dealProducts = [
    { prod: INDIAN_PRODUCTS[0], claimed: 78, label: "iPhone 15 Pro Max" },
    { prod: INDIAN_PRODUCTS[1], claimed: 61, label: "Galaxy S24 Ultra" },
    { prod: INDIAN_PRODUCTS[2], claimed: 89, label: "MacBook Air M3" },
    { prod: INDIAN_PRODUCTS[6], claimed: 55, label: "Dyson Vacuum" }
  ];

  // --- 4. FILTERS & SORT STATE ---
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minRating, setMinRating] = useState(0); 
  const [discountThreshold, setDiscountThreshold] = useState(0); 
  const [sortOption, setSortOption] = useState('relevance'); 

  // Auto update filters if Category Nav is clicked
  useEffect(() => {
    if (selectedCategory) {
      setSelectedCats([selectedCategory]);
    } else {
      setSelectedCats([]);
    }
  }, [selectedCategory]);

  const handleCategoryCheckbox = (cat: string) => {
    setSelectedCats(prev => {
      if (prev.includes(cat)) {
        const updated = prev.filter(c => c !== cat);
        if (updated.length === 1) setSelectedCategory(updated[0]);
        else setSelectedCategory(null);
        return updated;
      } else {
        setSelectedCategory(cat);
        return [...prev, cat];
      }
    });
  };

  // Filter & Sort Logic
  const filteredProducts = INDIAN_PRODUCTS.filter(product => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }

    if (selectedCats.length > 0 && !selectedCats.includes(product.category)) {
      return false;
    }

    if (product.price > maxPrice) return false;

    if (minRating > 0 && product.avgRating < minRating) return false;

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    if (discountThreshold > 0 && discount < discountThreshold) return false;

    return true;
  }).sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'top-rated') return b.avgRating - a.avgRating;
    if (sortOption === 'newest') return b.numReviews - a.numReviews; 
    return 0; 
  });

  const clearAllFilters = () => {
    setSelectedCats([]);
    setSelectedCategory(null);
    setMaxPrice(200000);
    setMinRating(0);
    setDiscountThreshold(0);
    setSortOption('relevance');
    toast.success("All Filters Reset!");
  };

  // --- 5. GAMIFIED SUPERCOINS STATE ---
  const [scratchState, setScratchState] = useState<'unscratched' | 'scratching' | 'scratched'>(() => {
    const isScratched = localStorage.getItem('gocart_scratch_played_v1');
    return isScratched ? 'scratched' : 'unscratched';
  });
  const [scratchConfetti, setScratchConfetti] = useState(false);

  // Scratch Card Trigger
  const handleScratchClick = () => {
    if (!user) {
      toast.error("Please login to claim your Daily Scratch Card!");
      return;
    }
    if (scratchState !== 'unscratched') return;
    
    setScratchState('scratching');
    setTimeout(() => {
      setScratchState('scratched');
      addSuperCoins(50);
      setScratchConfetti(true);
      localStorage.setItem('gocart_scratch_played_v1', 'true');
      toast.success("Awesome! You Won 50 SuperCoins! 🌟", {
        icon: '🪙',
        duration: 4000
      });
      setTimeout(() => setScratchConfetti(false), 5000);
    }, 1500);
  };

  // Vouchers state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const vouchersList = [
    { code: "GOCART10", desc: "Flat 10% Off on everything", cost: 20, discount: "10% Off" },
    { code: "MEMBER20", desc: "Exclusive Member 20% Discount", cost: 50, discount: "20% Off" },
    { code: "SUPER50", desc: "Blockbuster Sale 50% Off Voucher", cost: 120, discount: "50% Off" }
  ];

  const [unlockedVouchers, setUnlockedVouchers] = useState<string[]>(() => {
    const stored = localStorage.getItem('gocart_unlocked_vouchers');
    return stored ? JSON.parse(stored) : [];
  });

  const handleRedeemVoucher = (code: string, cost: number) => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }
    if (unlockedVouchers.includes(code)) {
      handleCopyCode(code);
      return;
    }
    if (user.superCoins < cost) {
      toast.error(`Insufficient SuperCoins! You need ${cost} coins, but you have ${user.superCoins}.`);
      return;
    }

    deductSuperCoins(cost);
    const updated = [...unlockedVouchers, code];
    setUnlockedVouchers(updated);
    localStorage.setItem('gocart_unlocked_vouchers', JSON.stringify(updated));
    toast.success(`Code ${code} Unlocked Successfully! ✓`, {
      icon: '🎫',
      style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard! Use it on checkout.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // --- 6. BUDGET SPOTLIGHT STORES ---
  const budgetDeals = [
    { title: "Deals Under ₹499", filterVal: 499, desc: "Bargain Store", bg: "from-[#FFF9E6] to-[#FFF1C5]", text: "text-amber-900" },
    { title: "Deals Under ₹999", filterVal: 999, desc: "Best Sellers", bg: "from-[#F0FDF4] to-[#DCFCE7]", text: "text-green-900" },
    { title: "Deals Under ₹4,999", filterVal: 4999, desc: "Home & Apparel", bg: "from-[#F0F9FF] to-[#E0F2FE]", text: "text-blue-900" },
    { title: "Premium Luxury", filterVal: 200000, desc: "Super Brands", bg: "from-[#FAF5FF] to-[#F3E8FF]", text: "text-purple-900" }
  ];

  const handleBudgetClick = (price: number) => {
    setMaxPrice(price);
    const element = document.getElementById("catalog-grid-top");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    toast.success(`Catalog filtered to price under ₹${price.toLocaleString('en-IN')}`);
  };

  // --- 7. FLIPPI CHATBOT STATE ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'flippi' | 'user', text: string, options?: string[] }>>([
    {
      sender: 'flippi',
      text: "Namaste! 🙏 I am Flippi, your SmartBuy India shopping assistant. How can I help you save big today?",
      options: ["How do I earn SuperCoins? 🪙", "How to apply coupon codes? 🎫", "Tell me about Cash on Delivery 🚚", "Can I return products? 🔄"]
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handlePresetClick = (optionText: string) => {
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: optionText }]);
    
    // Process bot reply
    setTimeout(() => {
      let botReply = "";
      let botOptions: string[] = [];

      if (optionText.includes("SuperCoins")) {
        botReply = "You can earn SuperCoins by scratching our Daily Scratch Card above (gives +50 coins instantly) and by purchasing products! Once you earn enough, exchange them for 10%, 20%, or 50% discount codes right here on the homepage!";
        botOptions = ["Show me coupons 🎟️", "Scratch Card rules 📜"];
      } else if (optionText.includes("coupon codes")) {
        botReply = "Once you unlock coupon codes from our SuperCoin zone (e.g. GOCART10, MEMBER20, or SUPER50), copy the code and enter it on the Cart page in the 'Apply Coupon' box to get instant discounts!";
        botOptions = ["Where is Cart? 🛒", "Other payment options 💳"];
      } else if (optionText.includes("Cash on Delivery")) {
        botReply = "Yes! Cash on Delivery is 100% available on all orders across India. We also support UPI, Netbanking, and Credit Cards with safe, secure, encrypted channels.";
        botOptions = ["What is delivery speed? ⚡", "Main Menu 🏠"];
      } else if (optionText.includes("return products")) {
        botReply = "All products have a super easy 10-day return policy. Simply go to your Profile -> Orders page and click on 'Initiate Return' for a prompt refund!";
        botOptions = ["Main Menu 🏠"];
      } else if (optionText.includes("coupons")) {
        botReply = "Currently, we have: \n- GOCART10 (gives 10% off)\n- MEMBER20 (gives 20% off for Plus Members)\n- SUPER50 (gives a huge 50% off!). Exchange your SuperCoins above to copy them!";
      } else if (optionText.includes("Cart")) {
        botReply = "You can visit the Cart anytime by clicking on the shopping bag icon in the header bar. Your selected products are saved automatically!";
      } else {
        botReply = "Is there anything else I can assist you with in your Indian Bazaar shopping journey? Try exploring our budget spotlights or lightning deals!";
        botOptions = ["How do I earn SuperCoins? 🪙", "How to apply coupon codes? 🎫"];
      }

      setChatMessages(prev => [...prev, { sender: 'flippi', text: botReply, options: botOptions }]);
    }, 800);
  };

  return (
    <div className="space-y-8 text-left" id="home-view-container">

      {/* --- CONFETTI ANIMATION (CSS-based) --- */}
      {scratchConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px] animate-pulse" />
          {Array.from({ length: 100 }).map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const size = Math.random() * 12 + 6;
            const delay = Math.random() * 2;
            const rotation = Math.random() * 360;
            const color = ['bg-yellow-400', 'bg-amber-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][i % 6];
            return (
              <div 
                key={i}
                className={`absolute rounded-xs animate-bounce opacity-90 ${color}`}
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: `rotate(${rotation}deg)`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* --- MULTI-OFFER CONTINUOUS SCROLLING TICKER (Flipkart/Amazon Style) --- */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white overflow-hidden py-2 px-4 rounded-xl flex items-center gap-3 relative shadow-md">
        <div className="bg-white/25 backdrop-blur-xs text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
          <BadgePercent className="h-3.5 w-3.5" />
          Super Deal
        </div>
        <div className="flex-1 overflow-hidden relative h-5">
          <div className="absolute inset-0 flex items-center whitespace-nowrap animate-marquee">
            <span className="text-xs font-black uppercase tracking-wider mx-4 flex items-center gap-2">
              💳 10% Instant Discount on HDFC Credit/Debit Cards & EMI Transactions • Minimum Order value ₹5,000!
            </span>
            <span className="text-xs font-black uppercase tracking-wider mx-4 flex items-center gap-2">
              ⚡ No Cost EMI option starting at just ₹1,999/mo on premium laptops, mobiles, and smart TVs!
            </span>
            <span className="text-xs font-black uppercase tracking-wider mx-4 flex items-center gap-2">
              🪙 REDEEM SUPERCOINS: Unlock flat 50% discount code "SUPER50" on your cart using 120 SuperCoins!
            </span>
            <span className="text-xs font-black uppercase tracking-wider mx-4 flex items-center gap-2">
              🚚 FREE standard courier delivery and safe handovers for all orders above ₹499 in India!
            </span>
          </div>
        </div>
      </div>

      {/* --- HERO BANNER ROTATOR CAROUSEL WITH RUNNING LIGHT NEON BORDER --- */}
      <div className="relative p-[3px] rounded-[28px] overflow-hidden shadow-2xl bg-zinc-950">
        {/* Animated Running Light Laser Border */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] pointer-events-none">
          <motion.div 
            className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,#1E3A8A,#2563EB,#3B82F6,#F59E0B,#1E3A8A)]"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </div>

        <section className="relative z-10 overflow-hidden rounded-[25px] h-[280px] md:h-[350px] group bg-zinc-900">
          <div 
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${carouselBanners[carouselIndex].bg} flex items-center`}
          >
            {/* Banner Hero Image */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-cover bg-center mix-blend-luminosity opacity-40 md:opacity-60 select-none hidden sm:block"
              style={{ backgroundImage: `url('${carouselBanners[carouselIndex].image}')` }}
            />
            {/* Shaded edge mask */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-950/85 to-transparent" />

            {/* Banner text info */}
            <div className="relative z-10 px-8 sm:px-14 md:max-w-2xl text-white space-y-4">
              <span className={`text-[10px] font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full ${carouselBanners[carouselIndex].accent}`}>
                {carouselBanners[carouselIndex].title}
              </span>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-none uppercase font-sans">
                {carouselBanners[carouselIndex].tagline}
              </h1>
              <p className="text-xs text-blue-100 font-semibold leading-relaxed max-w-lg">
                {carouselBanners[carouselIndex].description}
              </p>
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    if (carouselIndex === 0) setSelectedCategory('Mobiles');
                    if (carouselIndex === 1) setSelectedCategory('Laptops');
                    if (carouselIndex === 2) {
                      const el = document.getElementById("supercoin-rewards-hub");
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                    toast.success("Navigating to Promotional Hub!");
                  }}
                  className="bg-[#FF9900] hover:bg-orange-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Shop Now
                </button>
                <button 
                  onClick={() => navigate('profile')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Join Plus Club
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Arrow Controls */}
          <button 
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
            {carouselBanners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${carouselIndex === idx ? 'w-8 bg-[#FF9900]' : 'w-2.5 bg-white/55'}`}
              />
            ))}
          </div>
        </section>
      </div>

      {/* --- PRO-LEVEL CIRCULAR CATEGORIES SECTION (Flipkart Style) --- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Compass className="h-5 w-5 text-[#2874F0]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Featured Categories</h3>
        </div>
        
        <div className="flex gap-6 overflow-x-auto px-4 py-2 -mx-4 scrollbar-none select-none">
          {/* "All Bazaar" Circle */}
          <div 
            onClick={() => { setSelectedCats([]); setSelectedCategory(null); }}
            className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className={`h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ring-4 ${!selectedCategory ? 'ring-[#FF9900]' : 'ring-transparent'}`}>
              <img 
                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=120&h=120&q=80" 
                alt="All Bazaar" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wide text-center ${!selectedCategory ? 'text-[#2874F0] font-black underline decoration-2 underline-offset-4' : 'text-zinc-950 dark:text-white font-extrabold'}`}>
              All Bazaar
            </span>
          </div>

          {/* Main Category Circles */}
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div 
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedCats([cat.name]);
                }}
                className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 relative"
              >
                {/* Small floating badge */}
                <span className="absolute -top-1.5 -right-1 bg-red-500 text-white font-black text-[7px] px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs scale-90">
                  {cat.badge}
                </span>

                <div className={`h-16 w-16 rounded-full bg-gradient-to-tr ${cat.color} flex items-center justify-center overflow-hidden shadow-md transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ring-4 ${isSelected ? 'ring-[#FF9900]' : 'ring-transparent'}`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <span className={`text-[11px] font-extrabold uppercase tracking-wide text-center ${isSelected ? 'text-[#2874F0] font-black underline decoration-2 underline-offset-4' : 'text-zinc-950 dark:text-white font-extrabold'}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- BUDGET SPOTLIGHT STORES --- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Tag className="h-5 w-5 text-[#388E3C]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Budget Store Spotlights</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {budgetDeals.map((deal, idx) => (
            <div
              key={idx}
              onClick={() => handleBudgetClick(deal.filterVal)}
              className={`bg-gradient-to-r ${deal.bg} rounded-2xl p-5 border border-zinc-150 hover:shadow-lg hover:scale-102 transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden text-left`}
            >
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">{deal.desc}</span>
                <h4 className={`text-base font-black ${deal.text} tracking-tight mt-0.5 leading-snug`}>{deal.title}</h4>
              </div>
              <button className="bg-white/85 text-[10px] font-black text-zinc-800 uppercase px-3 py-1 rounded-lg w-max shadow-sm border border-zinc-100 hover:bg-white">
                Shop Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRO-LEVEL GAMIFIED SUPERCOIN REWARDS ZONE --- */}
      <section id="supercoin-rewards-hub" className="bg-zinc-900 text-white rounded-3xl border border-zinc-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Background ambient light bubbles */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Column: Coins dashboard & Scratch game */}
          <div className="flex-1 space-y-6 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 bg-gradient-to-tr from-[#FF9900] to-yellow-400 text-white rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-yellow-300">
                  <Coins className="h-5 w-5 fill-white animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                    SuperCoin <span className="text-yellow-400">Club</span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">Flipkart & Amazon style elite loyalty club</p>
                </div>
              </div>

              {/* Current Coins display */}
              <div className="mt-5 p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Your Balance</p>
                  <p className="text-2xl font-black font-mono text-yellow-400 tracking-wide mt-1">
                    {user ? user.superCoins : "0"} <span className="text-sm font-sans font-bold text-zinc-400">Coins</span>
                  </p>
                </div>
                <div className="text-right text-xs text-zinc-400 max-w-[150px] leading-relaxed">
                  {user ? (
                    <p className="font-semibold text-emerald-400">✓ You are a SmartBuy member! Earn coins on scratch and checkout.</p>
                  ) : (
                    <p className="text-amber-400">⚠️ Login above to claim scratch coins and redeem coupons!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Daily Scratch Card Game Container */}
            <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl p-4.5 space-y-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-yellow-400 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-wider text-yellow-400">Daily Free Scratch Card</h4>
              </div>
              
              {/* The Interactive Scratch Box */}
              <div 
                onClick={handleScratchClick}
                className="relative h-28 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center select-none"
                style={{ background: 'radial-gradient(circle, #333 0%, #1a1a1a 100%)' }}
              >
                {scratchState === 'unscratched' && (
                  <div className="absolute inset-0 bg-zinc-600 border border-zinc-500 flex flex-col items-center justify-center p-4 transition-all hover:bg-zinc-500 text-center">
                    <Gift className="h-8 w-8 text-yellow-300 animate-bounce mb-1" />
                    <span className="text-xs font-black uppercase text-white tracking-widest">TAP TO SCRATCH CARD</span>
                    <span className="text-[9px] text-zinc-300 uppercase mt-0.5 font-semibold">Guaranteed up to 50 SuperCoins</span>
                  </div>
                )}

                {scratchState === 'scratching' && (
                  <div className="absolute inset-0 bg-zinc-500 flex flex-col items-center justify-center p-4 text-center animate-pulse">
                    <span className="text-xs font-black text-yellow-300 tracking-wider animate-ping">SCRATCHING... ⚡</span>
                  </div>
                )}

                {scratchState === 'scratched' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-yellow-600/30 to-yellow-500/10 flex flex-col items-center justify-center p-4 text-center animate-fade">
                    <span className="text-3xl">🎉</span>
                    <h5 className="text-base font-black text-yellow-400 tracking-tight mt-1">YOU WON 50 SUPERCOINS!</h5>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Credited to your Balance</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Redeem Coupons list */}
          <div className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 text-left space-y-4">
            <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-3">
              <Ticket className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200">Redeem Coins for Shopping Coupons</h3>
            </div>

            <div className="space-y-3">
              {vouchersList.map((vou) => {
                const isUnlocked = unlockedVouchers.includes(vou.code);
                return (
                  <div 
                    key={vou.code}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono font-black text-[9px] px-2 py-0.5 rounded">
                          {vou.discount}
                        </span>
                        <span className="text-zinc-500 text-[10px] font-bold font-mono">CODE: {isUnlocked ? vou.code : "••••••"}</span>
                      </div>
                      <p className="text-xs font-extrabold text-zinc-100">{vou.desc}</p>
                    </div>

                    <div className="shrink-0">
                      {isUnlocked ? (
                        <button 
                          onClick={() => handleCopyCode(vou.code)}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase py-1.5 px-3 rounded-lg shadow-sm transition-all"
                        >
                          {copiedCode === vou.code ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRedeemVoucher(vou.code, vou.cost)}
                          className="flex items-center gap-1 bg-[#FF9900] hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase py-1.5 px-3 rounded-lg shadow-sm hover:scale-103 transition-all"
                        >
                          <Coins className="h-3 w-3 fill-white" />
                          {vou.cost} Coins
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* --- PROMO SALE ALERT SCROLLING BADGES (Matching yellow banner in screenshot) --- */}
      <div className="bg-[#FFF9C4] dark:bg-zinc-900 border border-[#FFF59D] dark:border-zinc-800 rounded-3xl p-3.5 shadow-sm flex overflow-x-auto scrollbar-none select-none justify-between items-center">
        <div className="flex items-center gap-4 w-full justify-around min-w-[500px]">
          {/* Column 1 */}
          <div className="flex flex-col items-center">
            <span className="bg-[#D4E157] text-[#004D40] font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Launch on 26th
            </span>
            <span className="text-zinc-900 dark:text-zinc-50 font-black text-xs sm:text-sm tracking-tight mt-1">
              ONMO Plus
            </span>
          </div>

          {/* Separation line */}
          <div className="h-8 w-px bg-zinc-300 dark:bg-zinc-850" />

          {/* Column 2 */}
          <div className="flex flex-col items-center">
            <span className="bg-[#D4E157] text-[#004D40] font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Sale: 26th June
            </span>
            <span className="text-zinc-900 dark:text-zinc-50 font-black text-xs sm:text-sm tracking-tight mt-1">
              Nova 2 Pro 5G
            </span>
          </div>

          {/* Separation line */}
          <div className="h-8 w-px bg-zinc-300 dark:bg-zinc-850" />

          {/* Column 3 */}
          <div className="flex flex-col items-center">
            <span className="bg-[#D4E157] text-[#004D40] font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              From ₹1,983/mo
            </span>
            <span className="text-zinc-900 dark:text-zinc-50 font-black text-xs sm:text-sm tracking-tight mt-1">
              55" 4K TVs
            </span>
          </div>
        </div>
      </div>

      {/* --- TRENDING GADGETS & APPLIANCES WITH RUNNING LIGHT GLOWING BORDER --- */}
      <div className="relative p-[3px] rounded-[32px] overflow-hidden shadow-2xl bg-zinc-950">
        {/* Animated Running Light Laser Border */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px] pointer-events-none">
          <motion.div 
            className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,#2563EB,#F59E0B,#1D4ED8,#3B82F6,#2563EB)]"
            animate={{ rotate: [360, 0] }}
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </div>

        <section className="relative z-10 bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 p-4.5 rounded-[29px] border border-blue-600 text-left overflow-hidden group">
          {/* Floating background decorative blobs to make it premium */}
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-900/30 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-3.5 px-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-white text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-2">
                Trending Gadgets & Appliances
              </h2>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full w-max">
                <Clock className="h-3 w-3 text-yellow-300 animate-pulse" />
                <span>Ends In: {formatTimer()}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                const el = document.getElementById("catalog-grid-top");
                el?.scrollIntoView({ behavior: 'smooth' });
                toast.success("Explore our full catalog!");
              }}
              className="bg-white text-blue-700 hover:bg-zinc-50 rounded-full h-8 w-12 flex items-center justify-center font-extrabold text-sm shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <ArrowRight className="h-4.5 w-4.5 font-bold" />
            </button>
          </div>

          {/* Outer body wrapper with rounded white card container inside */}
          <div className="relative z-10 bg-white dark:bg-zinc-950 rounded-[22px] p-4 shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRENDING_DEALS_PRODUCTS.slice(0, 4).map((prod, idx) => {
                const label = idx === 0 ? "True Wireless" : idx === 1 ? "Neckband" : idx === 2 ? "Smart Watches" : "Trimmers";
                const offer = idx === 0 ? "Min. 50% Off" : idx === 1 ? "Top Picks" : idx === 2 ? "Min. 40% Off" : "Min. 50% Off";
                
                return (
                  <div 
                    key={prod.id}
                    onClick={() => setActiveProductDetail(prod)}
                    className="cursor-pointer group/item flex flex-col h-full text-left"
                  >
                    {/* Light grey rounded image block matching the screenshot */}
                    <div className="bg-[#F5F5F7] dark:bg-zinc-900 rounded-2xl aspect-square flex items-center justify-center p-3 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                      {/* Small tag icon badge */}
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white font-black text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs z-10">
                        Offer
                      </div>
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="h-[80%] w-[80%] object-contain group-hover/item:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Metadata labels outside the image box */}
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium tracking-tight mt-2 truncate">
                      {label}
                    </p>
                    <p className="text-sm sm:text-base font-black text-zinc-950 dark:text-zinc-50 tracking-tight leading-none mt-1">
                      {offer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* --- MAIN SORT BAR, SIDEBAR & PRODUCT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="catalog-grid-top">
        
        {/* SIDEBAR FILTER PANEL */}
        <aside className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-6 h-max text-left">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-1.5">
              <ListFilter className="h-4.5 w-4.5 text-[#2874F0]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Filters</h3>
            </div>
            <button 
              onClick={clearAllFilters}
              className="text-[10px] font-black uppercase text-zinc-400 hover:text-rose-500 cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Categories checkboxes */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">By Categories</h4>
            <div className="space-y-2">
              {categoriesList.map(cat => (
                <label key={cat.name} className="flex items-center gap-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={selectedCats.includes(cat.name)}
                    onChange={() => handleCategoryCheckbox(cat.name)}
                    className="rounded text-[#2874F0] focus:ring-[#2874F0]"
                  />
                  <img src={cat.image} alt="" className="h-4.5 w-4.5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-400">
              <span>Max Price</span>
              <span className="text-[#2874F0] font-bold font-mono">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#2874F0] h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] font-bold text-zinc-400">
              <span>₹0</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Star Rating Selectors */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Rating</h4>
            <div className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="rating_flt" 
                  checked={minRating === 0}
                  onChange={() => setMinRating(0)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span>Any star rating</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="rating_flt" 
                  checked={minRating === 3}
                  onChange={() => setMinRating(3)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span>3.0 ★ & Above</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="rating_flt" 
                  checked={minRating === 4}
                  onChange={() => setMinRating(4)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span>4.0 ★ & Above</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="rating_flt" 
                  checked={minRating === 4.5}
                  onChange={() => setMinRating(4.5)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span>4.5 ★ & Above</span>
              </label>
            </div>
          </div>

          {/* Discount Percent Selectors */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Discount Offered</h4>
            <div className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="discount_flt" 
                  checked={discountThreshold === 0}
                  onChange={() => setDiscountThreshold(0)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span>Any discount %</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="discount_flt" 
                  checked={discountThreshold === 10}
                  onChange={() => setDiscountThreshold(10)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span className="text-[#388E3C] dark:text-[#4CAF50]">10% OFF & More</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="discount_flt" 
                  checked={discountThreshold === 25}
                  onChange={() => setDiscountThreshold(25)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span className="text-[#388E3C] dark:text-[#4CAF50]">25% OFF & More</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="discount_flt" 
                  checked={discountThreshold === 50}
                  onChange={() => setDiscountThreshold(50)}
                  className="text-[#2874F0] focus:ring-[#2874F0]" 
                />
                <span className="text-[#388E3C] dark:text-[#4CAF50]">50% OFF & More</span>
              </label>
            </div>
          </div>

        </aside>

        {/* PRODUCT GRID SECTION */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort Header */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl px-5 py-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory} Store` : "Featured Indian Bazaar"}
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{filteredProducts.length} items found</p>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#2874F0]" />
              <span className="text-xs font-extrabold text-zinc-400 uppercase">Sort:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg py-1 px-2.5 text-xs font-bold outline-none cursor-pointer focus:border-[#2874F0]"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="top-rated">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid listing */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-3">
              <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ListFilter className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 uppercase">No Match Found</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">Try clearing your selection checklist, adjusting the price slider or resetting your search input.</p>
              <button 
                onClick={clearAllFilters}
                className="bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* --- INTERACTIVE AI CHAT ASSISTANT ("Flippi") FLOATING BUTTON & BOX --- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        
        {/* Chat box window */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-80 md:w-96 h-[400px] flex flex-col overflow-hidden mb-4 mr-1 text-left"
            >
              {/* Chat Header */}
              <div className="bg-[#2874F0] text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#FF9900] flex items-center justify-center font-bold text-white shadow-md">
                    👑
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider">Flippi Helpdesk</h4>
                    <span className="text-[9px] text-blue-100 font-bold uppercase flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                      Shopping Buddy • Active
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Chat Body Scroll container */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                      {msg.sender === 'flippi' ? "Flippi Assistant" : "You"}
                    </span>
                    <div 
                      className={`p-3 rounded-2xl max-w-[85%] font-medium leading-relaxed shadow-xs whitespace-pre-wrap ${
                        msg.sender === 'user' 
                          ? 'bg-[#2874F0] text-white rounded-tr-none' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Interactive button suggestions */}
                    {msg.sender === 'flippi' && msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[95%]">
                        {msg.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handlePresetClick(opt)}
                            className="bg-blue-50 dark:bg-blue-950/40 text-[#2874F0] dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-extrabold text-[10px] uppercase py-1 px-2 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat footer text */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-850 text-center text-[9px] font-black uppercase text-zinc-400">
                SmartBuy India • Smart AI Assistance
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* The Float Trigger button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-gradient-to-r from-[#2874F0] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all ring-4 ring-white dark:ring-zinc-900"
          id="flippi-ai-chat-trigger"
          title="Chat with Flippi Assistant"
        >
          {chatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6 animate-pulse" />
          )}
        </button>

      </div>

    </div>
  );
}
