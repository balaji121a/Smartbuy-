import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, MapPin, Phone, Mail, Search, Store as StoreIcon, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function ShopListView() {
  const { navigate } = useApp();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Allow live search via Navbar event too
  useEffect(() => {
    const handleSearch = (e: Event) => {
      const query = (e as CustomEvent).detail;
      setSearch(query);
    };
    window.addEventListener('gocart-search', handleSearch);
    return () => window.removeEventListener('gocart-search', handleSearch);
  }, []);

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        const url = search ? `/api/stores?search=${encodeURIComponent(search)}` : '/api/stores';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setStores(data);
        }
      } catch (err) {
        console.error("Failed to load stores", err);
      } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, [search]);

  return (
    <div className="space-y-8 pb-16" id="shop-list-container">
      {/* Search Header */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-950 px-6 py-12 text-center shadow-md">
        <div className="relative z-10 max-w-xl mx-auto space-y-3">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore SmartBuy Verified Stores
          </h1>
          <p className="text-xs text-zinc-400">
            Every store is hand-reviewed and verified by our platform administrators. Shop directly from regional vendors.
          </p>

          <div className="relative flex max-w-md mx-auto items-center mt-6">
            <input
              type="text"
              placeholder="Search stores, brands, or niches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-zinc-800 bg-zinc-900/60 py-2.5 pl-4 pr-10 text-xs text-zinc-100 outline-none focus:border-emerald-500"
            />
            <Search className="absolute right-4 h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-zinc-100 rounded-2xl dark:border-zinc-800">
          <StoreIcon className="h-10 w-10 text-zinc-300" />
          <h3 className="font-display text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-3">No Stores Found</h3>
          <p className="text-xs text-zinc-400 max-w-xs mt-1">We couldn't find any approved vendor stores matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate('shop-detail', { storeUsername: store.username })}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-zinc-100 bg-white p-4 hover:border-emerald-500/30 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer transition-all"
            >
              {/* Store Logo */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex-shrink-0 border border-zinc-50 dark:border-zinc-800">
                <img 
                  src={store.logo || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80'} 
                  alt={store.name} 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Store details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-sm font-black text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 transition-colors">
                      {store.name}
                    </h3>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium">@{store.username}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                    {store.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 border-t border-zinc-50 dark:border-zinc-800/40 mt-3 pt-2.5 text-[10px] text-zinc-400">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 text-emerald-500" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Phone className="h-3 w-3 text-emerald-500" />
                    <span>{store.contact}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
