import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category } from '../types';
import { 
  Grid, 
  Search, 
  ShoppingBag, 
  Camera, 
  Sparkles, 
  Smartphone, 
  Shirt, 
  Tv, 
  BookOpen, 
  Laptop, 
  ChevronRight, 
  Star, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RefreshCcw, 
  X, 
  Percent, 
  Eye, 
  ShoppingCart, 
  ShieldCheck, 
  ArrowLeft,
  Flame,
  Zap,
  Tag,
  Compass,
  Gift,
  HelpCircle,
  Coins,
  Cpu,
  Tv2,
  Watch,
  Heart,
  Store as StoreIcon,
  ShoppingBag as BagIcon,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function ProductListingView() {
  const { 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearch, 
    navigate,
    addToCart,
    searchHistory,
    removeSearchQuery,
    clearSearchHistory
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<string>('default');
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  // Sync external filters if changed from navbar
  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory) params.append('category', activeCategory);
      if (localSearch) params.append('search', localSearch);
      if (sortBy !== 'default') params.append('sortBy', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        
        // Filter by price client side to support large INR catalog values
        const filtered = data.filter((p: Product) => p.price >= minPrice && p.price <= maxPrice);
        setProducts(filtered);
      }
    } catch (err) {
      console.error("Error fetching filtered products", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, localSearch, minPrice, maxPrice, sortBy]);

  // Load Categories on Mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters or search terms change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleResetFilters = () => {
    setActiveCategory(null);
    setSelectedCategory(null);
    setMinPrice(0);
    setMaxPrice(200000);
    setSortBy('default');
    setLocalSearch('');
    setSearch('');
  };

  const handleSelectCategoryFromSidebar = (categoryName: string) => {
    setActiveCategory(categoryName);
    setSelectedCategory(categoryName);
    toast.success(`Showing products for "${categoryName}"`);
  };

  // Categories metadata matching Screenshot 1 exactly
  const sidebarCategories = [
    { name: 'For You', icon: Sparkles, color: 'bg-purple-100 text-purple-600', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=80' },
    { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&q=80' },
    { name: 'Mobiles', icon: Smartphone, color: 'bg-cyan-100 text-cyan-600', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=80' },
    { name: 'Appliances', icon: Tv2, color: 'bg-orange-100 text-orange-600', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=120&q=80' },
    { name: 'Electronics', icon: Laptop, color: 'bg-emerald-100 text-emerald-600', img: 'https://images.unsplash.com/photo-1496181130204-755241544e35?w=120&q=80' },
    { name: 'Smart Gadgets', icon: Watch, color: 'bg-indigo-100 text-indigo-600', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=120&q=80' },
    { name: 'Home', icon: Sparkles, color: 'bg-teal-100 text-teal-600', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=120&q=80' },
    { name: 'Beauty & Personal Care', icon: Sparkles, color: 'bg-rose-100 text-rose-600', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&q=80' },
    { name: 'Toys & Baby Care', icon: Gift, color: 'bg-amber-100 text-amber-600', img: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=120&q=80' },
    { name: 'Food & Healthcare', icon: Heart, color: 'bg-red-100 text-red-600', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&q=80' }
  ];

  // Upcoming bento launcher cards
  const upcomingLaunches = [
    { title: 'Nova 2 Pro 5G', badge: 'NOTIFY ME', color: 'text-emerald-600 bg-emerald-50', bg: 'bg-gradient-to-tr from-pink-400 to-indigo-400', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80' },
    { title: 'Nova 2 Neo 5G', badge: 'NOTIFY ME', color: 'text-emerald-600 bg-emerald-50', bg: 'bg-gradient-to-tr from-cyan-400 to-teal-400', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
    { title: 'Xiaomi FX Screen', badge: 'BUY NOW', color: 'text-blue-600 bg-blue-50', bg: 'bg-gradient-to-tr from-zinc-800 to-zinc-950', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80' },
    { title: 'VZY Smart TVs', badge: 'NOTIFY ME', color: 'text-emerald-600 bg-emerald-50', bg: 'bg-gradient-to-tr from-purple-400 to-pink-400', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&q=80' },
    { title: 'HP Curved Monitors', badge: 'SHOP NOW', color: 'text-indigo-600 bg-indigo-50', bg: 'bg-gradient-to-tr from-sky-400 to-blue-600', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80' },
    { title: 'OnePlus Nord Buds 4', badge: 'NOTIFY ME', color: 'text-emerald-600 bg-emerald-50', bg: 'bg-gradient-to-tr from-emerald-400 to-cyan-500', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80' },
    { title: 'realme P4R 5G', badge: 'SALE IS ON', color: 'text-rose-600 bg-rose-50', bg: 'bg-gradient-to-tr from-yellow-400 to-red-500', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&q=80' },
    { title: 'ONMO+ Console', badge: 'NOTIFY ME', color: 'text-emerald-600 bg-emerald-50', bg: 'bg-gradient-to-tr from-rose-400 to-orange-400', img: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=300&q=80' },
  ];

  // Circle icons sections
  const haveYouTried = [
    { name: "Student's Club", badge: 'Claim Now', color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Flipkart UPI', badge: 'Flipkart UPI', color: 'bg-blue-100 text-blue-700' },
    { name: 'SuperCoin', badge: 'SuperCoin', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Join BLACK', badge: 'Join BLACK', color: 'bg-zinc-900 text-yellow-400 font-bold' },
    { name: 'Bills & Recharges', badge: 'Bills & Recharges', color: 'bg-green-100 text-green-700' },
    { name: 'Flipkart Pay', badge: 'Flipkart Pay', color: 'bg-purple-100 text-purple-700' },
    { name: 'LiveShop+', badge: 'LiveShop+', color: 'bg-rose-100 text-rose-700' },
    { name: 'SLAP Game', badge: 'SLAP', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Personal Loan', badge: 'Personal Loan', color: 'bg-amber-100 text-amber-700' },
    { name: 'GenZ trends', badge: 'GenZ trends', color: 'bg-sky-100 text-sky-700' },
  ];

  const moreOnFlipkart = [
    { name: 'Uber Rides', badge: 'Uber', color: 'bg-zinc-100 text-zinc-900' },
    { name: 'Pet Supplies', badge: 'Pet Supplies', color: 'bg-amber-50 text-amber-900' },
    { name: 'Flipkart Green', badge: 'Flipkart Green', color: 'bg-emerald-50 text-emerald-800' },
    { name: 'Samarth Crafts', badge: 'Flipkart Samarth', color: 'bg-orange-50 text-orange-800' },
    { name: 'FK Originals', badge: 'Flipkart Originals', color: 'bg-blue-50 text-blue-800' },
    { name: 'Coin Rewards', badge: 'SuperCoin Rewards', color: 'bg-yellow-50 text-yellow-800' },
    { name: 'Next Gen Brands', badge: 'Next Gen Brands', color: 'bg-pink-50 text-pink-800' },
  ];

  // Helper to determine if we show search/filtered products mode
  const isSearchMode = !!activeCategory || !!localSearch || !!searchQuery;

  return (
    <div className="pb-24 text-left font-sans" id="product-listing-root">
      
      <AnimatePresence mode="wait">
        {!isSearchMode ? (
          /* ====================================================================
             1. ALL CATEGORIES MODE (Screenshot 1 replica)
             ==================================================================== */
          <motion.div
            key="categories-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-150 shadow-inner"
            id="all-categories-layout"
          >
            {/* LEFT COLUMN: Scrollable Vertical Category Sidebar */}
            <div className="col-span-1 bg-white border-r border-zinc-150 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto max-h-[120px] md:max-h-[750px] scrollbar-none divide-y divide-zinc-100 shrink-0">
              {sidebarCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectCategoryFromSidebar(cat.name)}
                    className="flex flex-row md:flex-col items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 w-full text-left transition-colors cursor-pointer shrink-0 border-r md:border-r-0 md:border-b last:border-0"
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-100 shadow-sm flex-shrink-0 bg-zinc-100">
                      <img src={cat.img} alt={cat.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs font-black text-zinc-800 tracking-tight leading-snug text-center md:text-left">{cat.name}</p>
                      <p className="hidden md:block text-[8px] text-zinc-400 font-bold uppercase tracking-wider">Browse store</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Gorgeous Scrollable Categories Bento Grids */}
            <div className="col-span-1 md:col-span-3 p-4 space-y-6 overflow-y-auto max-h-[600px] md:max-h-[750px] scrollbar-none">
              
              {/* TOP HEADER: Title & Quick Icons */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                  <h1 className="text-base font-black text-zinc-900 tracking-tight flex items-center gap-2">
                    <Grid className="h-4.5 w-4.5 text-[#2874F0]" />
                    All Categories
                  </h1>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Flipkart SmartBuy Hub</p>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <button onClick={() => toast("Click search bar at the top to search catalog!")} className="p-1.5 hover:bg-zinc-200/50 rounded-full cursor-pointer"><Search className="h-4 w-4" /></button>
                  <button onClick={() => toast("Camera search initiated!")} className="p-1.5 hover:bg-zinc-200/50 rounded-full cursor-pointer"><Camera className="h-4 w-4" /></button>
                  <button onClick={() => navigate('cart')} className="p-1.5 hover:bg-zinc-200/50 rounded-full cursor-pointer"><ShoppingBag className="h-4 w-4" /></button>
                </div>
              </div>

              {/* SECTION 1: Popular Store (Screenshot 1 item) */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Popular Store</h3>
                <div className="grid grid-cols-3 gap-3">
                  {/* GOAT SALE */}
                  <div className="rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-3 flex flex-col justify-between text-white h-24 shadow-sm border border-rose-400/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <Flame className="absolute right-1 bottom-1 text-white/10 h-16 w-16 -rotate-12" />
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase w-max">GOAT</span>
                    <div className="z-10 leading-none">
                      <p className="font-sans text-xs font-black uppercase tracking-tight italic">GOAT SALE</p>
                      <p className="text-[9px] text-rose-100 font-bold mt-1">Coming soon</p>
                    </div>
                  </div>
                  {/* BACK TO CAMPUS */}
                  <div className="rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-3 flex flex-col justify-between text-white h-24 shadow-sm border border-emerald-400/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <Zap className="absolute right-1 bottom-1 text-white/10 h-16 w-16" />
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase w-max">CAMPUS</span>
                    <div className="z-10 leading-none">
                      <p className="font-sans text-xs font-black uppercase tracking-tight italic">BACK TO CAMPUS</p>
                      <p className="text-[9px] text-emerald-100 font-bold mt-1">Sale is live</p>
                    </div>
                  </div>
                  {/* Glam Up SALE */}
                  <div className="rounded-xl bg-gradient-to-tr from-fuchsia-500 to-pink-600 p-3 flex flex-col justify-between text-white h-24 shadow-sm border border-fuchsia-400/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <Tag className="absolute right-1 bottom-1 text-white/10 h-16 w-16 rotate-45" />
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase w-max">GLAM</span>
                    <div className="z-10 leading-none">
                      <p className="font-sans text-xs font-black uppercase tracking-tight italic">Glam Up SALE</p>
                      <p className="text-[9px] text-pink-100 font-bold mt-1">Sale live!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: New & Upcoming Launches Bento (9 cards) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">New & Upcoming Launches</h3>
                  <button onClick={() => toast("Showing all launches!")} className="text-[10px] font-black text-blue-600 uppercase tracking-wider">See all</button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {upcomingLaunches.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-150 bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectCategoryFromSidebar('Mobiles')}
                    >
                      {/* Product Thumbnail inside gradient wrapper */}
                      <div className={`h-28 ${item.bg} p-2 relative flex items-center justify-center`}>
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="h-24 w-auto object-contain rounded-lg drop-shadow-xl hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className={`absolute top-2 left-2 text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${item.color}`}>
                          {item.badge}
                        </span>
                      </div>
                      {/* Title block */}
                      <div className="p-2.5 flex-1 flex flex-col justify-between bg-white leading-none">
                        <p className="text-[11px] font-black text-zinc-800 truncate tracking-tight">{item.title}</p>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Pre-book Now</p>
                      </div>
                    </div>
                  ))}

                  {/* View All Launches */}
                  <div
                    onClick={() => handleSelectCategoryFromSidebar('Mobiles')}
                    className="rounded-2xl border-2 border-dashed border-zinc-200 hover:border-blue-500 bg-zinc-50 flex flex-col items-center justify-center p-4 text-center group transition-colors cursor-pointer h-full min-h-[140px]"
                  >
                    <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-wider">View All</span>
                    <span className="text-[8px] text-zinc-400 font-semibold uppercase mt-0.5">99+ Releases</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Have You Tried? (Horizontal Circle grid) */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Have you tried?</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3.5">
                  {haveYouTried.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toast(`Feature "${item.name}" loading...`)}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className={`h-11 w-11 rounded-full ${item.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-zinc-150`}>
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-[9px] font-bold text-zinc-700 leading-tight mt-1.5 max-w-[70px] truncate">{item.name}</p>
                      <span className="text-[7px] text-blue-600 font-black uppercase tracking-tight mt-0.5 leading-none">{item.badge}</span>
                    </div>
                  ))}
                  {/* View All */}
                  <div
                    onClick={() => toast("All features listed!")}
                    className="flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div className="h-11 w-11 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center shadow-sm border-2 border-dashed border-zinc-200 group-hover:scale-105 transition-transform">
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </div>
                    <p className="text-[9px] font-black text-zinc-700 mt-1.5">View All</p>
                    <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">Explore</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: More on Flipkart */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">More on Flipkart</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3.5">
                  {moreOnFlipkart.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toast(`Navigating to ${item.badge}...`)}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className={`h-11 w-11 rounded-full ${item.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-zinc-150`}>
                        <Compass className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-[9px] font-semibold text-zinc-700 leading-tight mt-1.5 max-w-[70px] truncate">{item.name}</p>
                      <span className="text-[7px] text-emerald-600 font-bold uppercase tracking-tight mt-0.5">{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* ====================================================================
             2. SEARCH RESULTS MODE / PRODUCT LISTING VIEW
             ==================================================================== */
          <motion.div
            key="products-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
            id="products-results-layout"
          >
            {/* BACK TO DIRECTORY HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 bg-white p-3 rounded-2xl shadow-sm border border-zinc-150">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleResetFilters}
                  className="p-2 hover:bg-zinc-100 rounded-full text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer flex items-center justify-center border border-zinc-200 bg-zinc-50"
                  id="search-back-btn"
                >
                  <ArrowLeft className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
                <div>
                  <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Results Directory</h2>
                  <h1 className="text-sm font-black text-zinc-900 leading-none mt-0.5">
                    Search: "{localSearch || activeCategory}"
                  </h1>
                </div>
              </div>

              {/* Reset filter pill */}
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-800 cursor-pointer bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100"
              >
                <RefreshCcw className="h-3 w-3 animate-spin [animation-duration:8s]" />
                Reset Directory
              </button>
            </div>

            {/* DUAL COLUMN: Sorter Sidebar and Products Column */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* SIDEBAR: Advanced Filters */}
              <aside className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-150 pb-2.5">
                  <h3 className="text-xs font-black uppercase text-zinc-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4 w-4 text-[#2874F0]" />
                    Filter Catalog
                  </h3>
                </div>

                {/* Search query manual filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Refine Text</label>
                  <form onSubmit={(e) => { e.preventDefault(); setSearch(localSearch); }} className="relative">
                    <input 
                      type="text"
                      placeholder="Type query..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 pr-8 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500 transition-colors"
                    />
                    <button type="submit" className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-blue-600 cursor-pointer">
                      <Search className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>

                {/* Categories Pill Grid */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Category</label>
                  <div className="flex flex-wrap gap-1">
                    <button 
                      onClick={() => { setActiveCategory(null); setSelectedCategory(null); }}
                      className={`text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${activeCategory === null ? 'bg-[#2874F0] border-[#2874F0] text-white shadow-sm' : 'bg-white border-zinc-150 text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.name); setSelectedCategory(cat.name); }}
                        className={`text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${activeCategory === cat.name ? 'bg-[#2874F0] border-[#2874F0] text-white shadow-sm' : 'bg-white border-zinc-150 text-zinc-600 hover:bg-zinc-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">INR Price Presets</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'Budget (< ₹5k)', min: 0, max: 5000 },
                      { label: 'Mid (₹5k-₹20k)', min: 5000, max: 20000 },
                      { label: 'Premium (₹20k-₹80k)', min: 20000, max: 80000 },
                      { label: 'Luxury (₹80k+)', min: 80000, max: 200000 },
                    ].map((preset) => {
                      const isActive = minPrice === preset.min && maxPrice === preset.max;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setMinPrice(preset.min);
                            setMaxPrice(preset.max);
                          }}
                          className={`px-2 py-1.5 rounded-lg text-[9px] font-black border transition-all cursor-pointer text-center leading-none ${isActive ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' : 'bg-white border-zinc-150 text-zinc-600 hover:bg-zinc-50'}`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400">
                    <span>Range Slider</span>
                    <span className="text-blue-600 font-mono">₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="200000" 
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </aside>

              {/* PRODUCTS COLUMN: Mobile-optimized listing (Vertical stacks) */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* SORT BAR CARD */}
                <div className="bg-white rounded-2xl border border-zinc-200 p-3 flex items-center justify-between text-xs font-semibold shadow-sm">
                  <p className="text-zinc-500 font-medium">
                    Found <span className="font-black text-zinc-800">{products.length}</span> matching premium items
                  </p>
                  
                  <div className="flex items-center gap-1 bg-zinc-50 px-2.5 py-1.5 rounded-xl border border-zinc-150">
                    <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent border-none outline-none font-bold text-zinc-700 text-xs"
                    >
                      <option value="default">Default Match</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated (★)</option>
                    </select>
                  </div>
                </div>

                {/* PRODUCTS LIST */}
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="animate-pulse flex gap-4 rounded-2xl border border-zinc-150 p-4 bg-white">
                        <div className="h-28 w-28 rounded-xl bg-zinc-100 shrink-0" />
                        <div className="flex-1 space-y-2 mt-2">
                          <div className="h-4 w-3/4 rounded bg-zinc-100" />
                          <div className="h-4 w-1/4 rounded bg-zinc-100" />
                          <div className="h-4 w-1/3 rounded bg-zinc-100 mt-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-zinc-150 bg-white p-6 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 border border-zinc-150 mx-auto">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-black text-zinc-800 uppercase">No Matches Catalogued</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto font-medium">We couldn't locate items fitting those exact pricing boundaries or terms.</p>
                    <button 
                      onClick={handleResetFilters}
                      className="mt-4 rounded-full bg-[#2874F0] px-5 py-2 text-xs font-black text-white cursor-pointer hover:bg-blue-600 transition-colors shadow"
                    >
                      Browse Directory
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((p) => {
                      const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                      return (
                        <div
                          key={p.id}
                          className="bg-white rounded-2xl border border-zinc-200 p-3.5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow relative overflow-hidden text-left"
                        >
                          {/* Left Thumbnail with discount overlay */}
                          <div 
                            onClick={() => navigate('product-detail', { productId: p.id })}
                            className="h-28 w-28 bg-zinc-50 border border-zinc-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center cursor-pointer relative group self-center sm:self-start"
                          >
                            <img 
                              src={p.images[0]} 
                              alt={p.name} 
                              className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-300" 
                              referrerPolicy="no-referrer"
                            />
                            {discountPercent > 0 && (
                              <span className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-black px-1 rounded shadow">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Right Information Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="space-y-1">
                              {/* Title */}
                              <h3 
                                onClick={() => navigate('product-detail', { productId: p.id })}
                                className="text-xs md:text-sm font-black text-zinc-900 leading-snug hover:text-[#2874F0] transition-colors cursor-pointer truncate"
                              >
                                {p.name}
                              </h3>

                              {/* Rating and Badges Row */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                                <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 text-[10px] font-black shadow-sm">
                                  {p.avgRating || 4.5}
                                  <Star className="h-2.5 w-2.5 fill-white" />
                                </span>
                                <span className="text-zinc-400">({(p.numReviews || 45).toLocaleString()} reviews)</span>
                                {p.isAssured && (
                                  <span className="bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase flex items-center gap-0.5">
                                    <ShieldCheck className="h-3 w-3 text-blue-600 fill-blue-50" />
                                    Assured
                                  </span>
                                )}
                              </div>

                              {/* Spec Bullets (Dynamic Spec extract) */}
                              {p.specs && (
                                <div className="text-[10px] text-zinc-500 font-semibold space-y-0.5 pt-1">
                                  {Object.entries(p.specs).slice(0, 3).map(([key, value]) => (
                                    <p key={key} className="truncate">
                                      • <span className="text-zinc-400 uppercase text-[9px] font-black">{key}:</span> {value}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Price and CTA Actions */}
                            <div className="flex items-center justify-between gap-4 mt-3 pt-2.5 border-t border-zinc-100">
                              <div className="flex items-baseline gap-1.5 leading-none">
                                <p className="text-sm font-black text-zinc-900">₹{p.price.toLocaleString('en-IN')}</p>
                                <p className="text-[10px] text-zinc-400 line-through font-semibold">₹{p.mrp.toLocaleString('en-IN')}</p>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => { navigate('product-detail', { productId: p.id }); }}
                                  className="text-[10px] font-black uppercase text-zinc-500 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1.5 rounded-xl border border-zinc-150 transition-colors cursor-pointer"
                                >
                                  Specs
                                </button>
                                <button
                                  onClick={() => {
                                    addToCart(p);
                                    toast.success(`${p.name.split(" - ")[0]} added to Cart!`);
                                  }}
                                  className="text-[10px] font-black uppercase bg-[#2874F0] hover:bg-blue-600 text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                  <ShoppingCart className="h-3 w-3" />
                                  Add
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
