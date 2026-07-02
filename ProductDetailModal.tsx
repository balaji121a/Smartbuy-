import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_PRODUCTS, Product } from '../data/products';
import { X, ShoppingCart, CreditCard, Shield, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function ProductDetailModal() {
  const { 
    activeProductDetail, 
    setActiveProductDetail, 
    addToCart, 
    navigate 
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!activeProductDetail) return null;
  const p = activeProductDetail;

  const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  // Get similar products in same category (excluding current)
  const similarProducts = INDIAN_PRODUCTS.filter(item => 
    item.category === p.category && item.id !== p.id
  ).slice(0, 3);

  // If no similar products in same category, take random ones
  const finalSimilar = similarProducts.length > 0 
    ? similarProducts 
    : INDIAN_PRODUCTS.filter(item => item.id !== p.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(p, quantity);
    toast.success(`Added ${quantity} item(s) to cart ✓`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#2874F0',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
    setActiveProductDetail(null);
  };

  const handleBuyNow = () => {
    addToCart(p, quantity);
    setActiveProductDetail(null);
    navigate('checkout');
    toast.success("Proceeding to Buy Now!");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveProductDetail(null)}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative bg-white text-zinc-800 rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col z-50 border border-zinc-150"
          id="product-detail-modal-panel"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveProductDetail(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-zinc-100 text-zinc-500 hover:text-zinc-800 rounded-full cursor-pointer hover:bg-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Scroll Container */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-grow">
            
            {/* Top Grid: Image Left, Info Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Product Gallery */}
              <div className="space-y-4">
                <div className="aspect-square relative rounded-2xl overflow-hidden border border-zinc-150 bg-zinc-50 flex items-center justify-center shadow-inner">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    {p.isAssured ? (
                      <span className="flex items-center gap-1 bg-[#2874F0] text-white text-[10px] font-black italic px-3 py-1 rounded-full shadow-md">
                        fAssured
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-zinc-950 text-[#FF9900] text-[10px] font-black px-3 py-1 rounded-full shadow-md border border-zinc-800">
                        PRIME
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Thumbnails if multiple */}
                {p.images.length > 1 && (
                  <div className="flex gap-2">
                    {p.images.map((img, index) => (
                      <div 
                        key={index} 
                        className="h-14 w-14 rounded-lg border border-zinc-200 overflow-hidden cursor-pointer hover:border-[#2874F0] transition-colors"
                      >
                        <img src={img} alt={`thumbnail-${index}`} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Specs, pricing and details */}
              <div className="text-left space-y-5">
                <div>
                  <span className="bg-orange-50 text-[#FF9900] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    {p.category}
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-zinc-900 mt-2 leading-tight">
                    {p.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-[#388E3C] text-white text-[11px] font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                      {p.avgRating} ★
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">
                      {p.numReviews.toLocaleString('en-IN')} Reviews & Ratings
                    </span>
                  </div>
                </div>

                {/* Price block */}
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-2xl font-black text-[#2874F0] font-sans">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-zinc-400 line-through font-sans">
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-bold text-[#388E3C]">
                      {discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Inclusive of all Indian taxes</p>
                </div>

                {/* Badges & Trust points */}
                <div className="grid grid-cols-2 gap-3 text-xs text-zinc-600">
                  <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <Truck className="h-4 w-4 text-[#2874F0]" />
                    <span className="font-bold">Free delivery by Tomorrow</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    <Shield className="h-4 w-4 text-[#388E3C]" />
                    <span className="font-bold">Fulfilled by Platform</span>
                  </div>
                </div>

                {/* Financial and bank offers */}
                <div className="space-y-2 text-xs">
                  <div className="bg-[#FF9900]/10 p-3 rounded-xl border border-[#FF9900]/20 flex items-start gap-2.5">
                    <CreditCard className="h-4 w-4 text-[#FF9900] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-extrabold text-[#995C00]">No Cost EMI Offer</p>
                      <p className="text-zinc-600 text-[11px] mt-0.5">Available at <span className="font-bold text-zinc-800">₹999/month</span> for up to 9 months. {p.emiOption}</p>
                    </div>
                  </div>

                  <div className="bg-[#388E3C]/10 p-3 rounded-xl border border-[#388E3C]/20 flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-[#388E3C] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-extrabold text-[#245926]">Special Bank Offers</p>
                      <p className="text-zinc-600 text-[11px] mt-0.5">Flat <span className="font-bold text-[#388E3C]">10% Instant Discount</span> on HDFC Bank Credit Cards. {p.bankOffer}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Description</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-medium">
                    {p.description}
                  </p>
                </div>

                {/* Quantity and Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-zinc-100">
                  <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden self-start sm:self-auto bg-white shadow-xs">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3.5 py-2 text-sm font-extrabold text-zinc-500 hover:bg-zinc-50 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 text-sm font-black text-zinc-800 bg-zinc-50/40">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3.5 py-2 text-sm font-extrabold text-zinc-500 hover:bg-zinc-50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-[#FF9900] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Specifications Table */}
            <div className="text-left border-t border-zinc-100 pt-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">Technical Specifications</h3>
              <div className="border border-zinc-150 rounded-2xl overflow-hidden bg-zinc-50/50">
                <table className="w-full text-xs font-semibold text-zinc-600">
                  <tbody>
                    {Object.entries(p.specs).map(([key, val], idx) => (
                      <tr 
                        key={key} 
                        className={`border-b border-zinc-150 last:border-b-0 ${idx % 2 === 0 ? 'bg-zinc-100/35' : ''}`}
                      >
                        <td className="px-4 py-2.5 font-bold text-zinc-400 w-1/3 border-r border-zinc-150">{key}</td>
                        <td className="px-4 py-2.5 text-zinc-800">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Similar Products */}
            <div className="text-left border-t border-zinc-100 pt-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">Similar Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {finalSimilar.map((item) => {
                  const simDiscount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setQuantity(1);
                        setActiveProductDetail(item);
                      }}
                      className="flex gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-100 hover:shadow-md cursor-pointer transition-all"
                    >
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 object-cover rounded-lg border border-zinc-200 bg-white"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold text-zinc-800 truncate leading-tight">{item.name}</h4>
                        <p className="text-[9px] text-[#FF9900] font-black mt-0.5">{item.category}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xs font-black text-[#2874F0] font-sans">₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] text-zinc-400 line-through font-sans">₹{item.mrp.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] font-bold text-[#388E3C] ml-1">{simDiscount}% off</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
