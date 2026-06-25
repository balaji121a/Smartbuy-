import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function WishlistView() {
  const { wishlist, toggleWishlist, moveToCart, navigate } = useApp();

  const handleMoveToCart = (product: any) => {
    moveToCart(product);
    toast.success("Moved to cart ✓", {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#2874F0',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  const handleRemove = (product: any) => {
    toggleWishlist(product);
    toast.success("Removed from Wishlist");
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto py-6" id="wishlist-view-container">
      {/* Title block */}
      <div className="flex items-center gap-2 border-b border-zinc-150 pb-4">
        <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
        <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
          My Smart Wishlist
        </h1>
        <span className="text-xs bg-zinc-100 text-zinc-500 font-bold px-2 py-1 rounded-md ml-2">
          {wishlist.length} Items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-zinc-100 p-8 space-y-4">
          <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-inner">
            <Heart className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-zinc-900 uppercase">Your Wishlist is Empty</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Tap the heart icon on products to save your favorites for the Big Billion Days sale!</p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="bg-[#2874F0] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Explore Hot Deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {wishlist.map((p) => {
            const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-zinc-150 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden bg-zinc-50 border-b border-zinc-100 flex items-center justify-center">
                    <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    <button
                      onClick={() => handleRemove(p)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-zinc-400 hover:text-rose-500 hover:scale-105 active:scale-95 shadow-md cursor-pointer transition-all"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {/* Badge */}
                    <div className="absolute bottom-2 left-2">
                      {p.isAssured ? (
                        <span className="bg-[#2874F0] text-white text-[9px] font-black italic px-2 py-0.5 rounded-full select-none">
                          fAssured
                        </span>
                      ) : (
                        <span className="bg-zinc-950 text-[#FF9900] text-[9px] font-black px-2 py-0.5 rounded-full select-none border border-zinc-700">
                          PRIME
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9900]">
                      {p.category}
                    </span>
                    <h3 className="mt-1 font-sans text-xs font-bold text-zinc-800 line-clamp-2 h-8 leading-tight">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="bg-[#388E3C] text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                        {p.avgRating} ★
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">({p.numReviews.toLocaleString('en-IN')})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-4">
                      <span className="text-base font-black text-[#2874F0] font-sans">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-zinc-400 line-through font-sans">₹{p.mrp.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] font-bold text-[#388E3C]">{discountPercent}% off</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-zinc-50">
                  <button
                    onClick={() => handleMoveToCart(p)}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 bg-[#FF9900] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Move to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
