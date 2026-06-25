import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, Product } from '../types';
import ProductCard from '../components/ProductCard';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ShoppingBag,
  Store as StoreIcon
} from 'lucide-react';

export default function ShopDetailView() {
  const { selectedStoreUsername, navigate } = useApp();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedStoreUsername) {
      navigate('shop');
      return;
    }

    async function loadStoreDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/stores/${selectedStoreUsername}`);
        if (res.ok) {
          const data = await res.json();
          setStore(data.store);
          setProducts(data.products);
        } else {
          navigate('shop');
        }
      } catch (err) {
        console.error("Failed to load store details", err);
        navigate('shop');
      } finally {
        setLoading(false);
      }
    }

    loadStoreDetails();
  }, [selectedStoreUsername]);

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return null;
  }

  return (
    <div className="space-y-8 pb-16" id="shop-detail-container">
      {/* Back button */}
      <button 
        onClick={() => navigate('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-emerald-500 cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Stores
      </button>

      {/* Store Cover Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Cover backdrop */}
        <div className="h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/20" />

        <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row gap-5 items-start md:items-end -translate-y-6">
          {/* Logo */}
          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white shadow-md dark:bg-zinc-950 flex-shrink-0 border-2 border-white dark:border-zinc-800">
            <img 
              src={store.logo || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80'} 
              alt={store.name} 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Profile Name & Stats */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-display text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                {store.name}
              </h1>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Vendor
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">@{store.username}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl pt-2 leading-relaxed">
              {store.description}
            </p>
          </div>
        </div>

        {/* Contact info footer row */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-800/50 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            <span>{store.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-emerald-500" />
            <span>{store.contact}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-emerald-500" />
            <span>{store.email}</span>
          </div>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800 pb-3">
          <h2 className="font-display text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-emerald-500" />
            Store Catalog ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-zinc-100 rounded-2xl dark:border-zinc-800">
            <StoreIcon className="h-8 w-8 text-zinc-300" />
            <h3 className="font-display text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-2">No Products Available</h3>
            <p className="text-[11px] text-zinc-400 max-w-xs mt-1">This seller hasn't uploaded any products to their store catalog yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
