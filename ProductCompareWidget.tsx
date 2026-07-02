import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, X, ShoppingCart, Star, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import toast from 'react-hot-toast';

export default function ProductCompareWidget() {
  const { compareList, toggleCompare, clearCompare, addToCart, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (compareList.length === 0) return null;

  // Find the cheapest product in comparison
  const prices = compareList.map(p => p.price);
  const minPrice = Math.min(...prices);

  // Find the highest rated product
  const ratings = compareList.map(p => p.avgRating || 0);
  const maxRating = Math.max(...ratings);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart ✓`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#2874F0',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  return (
    <>
      {/* Floating Pill - Bottom Right */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-40"
        id="product-compare-floating-pill"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-[#2874F0] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-400/20"
        >
          <Scale className="h-4 w-4 animate-pulse" />
          <span>Compare Products ({compareList.length})</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="product-compare-modal-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="relative w-full max-w-5xl rounded-3xl border border-zinc-150 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-blue-50 p-2 text-[#2874F0]">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-zinc-900 uppercase tracking-tight">Side-by-Side Product Comparison</h3>
                      <p className="text-[11px] text-zinc-400">Analyze prices, categories, ratings, and specifications to select the perfect match.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearCompare}
                      className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-full border border-zinc-150 p-1.5 text-zinc-400 hover:text-zinc-900 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Comparison Grid */}
                <div className="mt-6 overflow-x-auto">
                  <div className="grid grid-cols-4 gap-4 min-w-[700px] divide-x divide-zinc-100 text-left">
                    
                    {/* Specifications Labels Column */}
                    <div className="col-span-1 space-y-12 pr-4 self-center pt-24 text-right">
                      <div className="h-44 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Product Details
                      </div>
                      <div className="h-14 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Price
                      </div>
                      <div className="h-12 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Discount / Value
                      </div>
                      <div className="h-12 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Review Rating
                      </div>
                      <div className="h-12 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Category
                      </div>
                      <div className="h-12 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Availability
                      </div>
                      <div className="h-20 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Description
                      </div>
                    </div>

                    {/* Products Columns */}
                    {compareList.map((product) => {
                      const isCheapest = product.price === minPrice;
                      const isBestRated = (product.avgRating || 0) === maxRating && maxRating > 0;
                      const hasDiscount = product.mrp && product.mrp > product.price;
                      const discountAmount = hasDiscount ? product.mrp - product.price : 0;
                      const discountPercent = hasDiscount ? Math.round((discountAmount / product.mrp) * 100) : 0;

                      return (
                        <div key={product.id} className="col-span-1 pl-4 flex flex-col space-y-12 pb-4 text-center">
                          {/* Image & Title Header block */}
                          <div className="h-44 flex flex-col items-center text-center justify-between group">
                            <div className="aspect-square w-24 relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-150">
                              <img
                                src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                              <button
                                onClick={() => toggleCompare(product)}
                                className="absolute top-1 right-1 rounded-full bg-zinc-950/80 p-1 text-white hover:bg-red-600 transition-colors cursor-pointer"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </div>
                            <div className="mt-2.5">
                              <h4 
                                onClick={() => { setIsOpen(false); }}
                                className="text-xs font-bold text-zinc-800 line-clamp-1 hover:text-[#2874F0] cursor-pointer transition-colors"
                              >
                                {product.name}
                              </h4>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#FF9900] hover:bg-orange-600 px-3 py-1 text-[10px] font-bold text-white shadow transition-all cursor-pointer border-0"
                              >
                                <ShoppingCart className="h-3 w-3" />
                                Add to Cart
                              </button>
                            </div>
                          </div>

                          {/* Price Row */}
                          <div className="h-14 flex flex-col justify-center items-center">
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-black text-zinc-900">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {hasDiscount && (
                                <span className="text-[10px] text-zinc-400 line-through">
                                  ₹{product.mrp.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            {isCheapest && (
                              <span className="mt-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                                Best Value Choice
                              </span>
                            )}
                          </div>

                          {/* Savings Row */}
                          <div className="h-12 flex items-center justify-center">
                            {hasDiscount ? (
                              <div className="text-center">
                                <span className="text-xs font-black text-emerald-600">
                                  Save {discountPercent}%
                                </span>
                                <p className="text-[9px] text-zinc-400">(₹{discountAmount.toLocaleString('en-IN')} off)</p>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-400 font-medium">Standard Price</span>
                            )}
                          </div>

                          {/* Rating Row */}
                          <div className="h-12 flex flex-col justify-center items-center">
                            {product.avgRating ? (
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-black text-zinc-800">{product.avgRating}</span>
                                  <div className="flex text-amber-400">
                                    <Star className="h-3 w-3 fill-current" />
                                  </div>
                                </div>
                                {isBestRated && (
                                  <span className="mt-0.5 text-[8px] font-bold text-amber-600 uppercase">Top Rated</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-400 font-medium">No reviews</span>
                            )}
                          </div>

                          {/* Category Row */}
                          <div className="h-12 flex items-center justify-center">
                            <span className="rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-bold text-zinc-600 border border-zinc-150">
                              {product.category}
                            </span>
                          </div>

                          {/* Availability Row */}
                          <div className="h-12 flex items-center justify-center">
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                              <CheckCircle className="h-4 w-4" />
                              In Stock
                            </span>
                          </div>

                          {/* Description Row */}
                          <div className="h-20 flex items-start justify-center text-center overflow-y-auto pr-1">
                            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium line-clamp-3">
                              {product.description}
                            </p>
                          </div>

                        </div>
                      );
                    })}

                    {/* Placeholder Columns if less than 3 compared */}
                    {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, idx) => (
                      <div key={idx} className="col-span-1 pl-4 flex flex-col justify-center items-center border-dashed border border-zinc-200 rounded-2xl p-6 h-full text-center">
                        <div className="rounded-full bg-zinc-50 p-3 text-zinc-300">
                          <Scale className="h-5 w-5" />
                        </div>
                        <h4 className="mt-2 text-[10px] font-bold text-zinc-400 uppercase">Add Product</h4>
                        <p className="text-[9px] text-zinc-400 max-w-[120px] mt-0.5">Select another item from the catalog to compare side-by-side.</p>
                      </div>
                    ))}

                  </div>
                </div>

                {/* Footer instructions */}
                <div className="mt-8 border-t border-zinc-150 pt-4 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>* Values compared are pulled directly from authorized vendor catalogs.</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-zinc-100 px-3.5 py-1.5 font-bold text-zinc-600 hover:bg-zinc-200 transition-all cursor-pointer border-0"
                  >
                    Close Comparison
                  </button>
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
