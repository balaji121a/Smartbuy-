import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Trash2, ArrowRight, ShoppingCart, Percent, Check, Store as StoreIcon, ShieldCheck, ShoppingBag, MapPin, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function CartView() {
  const { cart, updateCartQty, removeFromCart, navigate, currencySymbol, user } = useApp();

  // Segment Selector ("Flipkart" vs "Minutes")
  const [activeSegment, setActiveSegment] = useState<'flipkart' | 'minutes'>('flipkart');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    discountAmount: number;
    description: string;
  } | null>(null);

  // Map product entries directly from context cart
  const cartItemsList = cart.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    product: item.product
  }));

  // Math calculations
  const totalMRP = cartItemsList.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);
  const subtotal = cartItemsList.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const discountAmount = totalMRP - subtotal;
  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount = parseFloat(((subtotal * appliedCoupon.discount) / 100).toFixed(2));
  }
  
  const packagingFee = subtotal > 0 ? 29 : 0;
  const deliveryCharge = subtotal >= 499 ? 0 : 40;
  const finalTotal = Math.max(0, subtotal - couponDiscount + packagingFee + deliveryCharge);
  const totalSavings = discountAmount + couponDiscount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      setValidatingCoupon(true);
      const isNewUser = !user;
      const isMember = user?.isMember !== 'none';

      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponInput.trim().toUpperCase(), 
          subtotal,
          isNewUser,
          isMember
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          discountAmount: data.discountAmount,
          description: data.description
        });
        toast.success(`Coupon ${data.code} applied successfully!`);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Invalid coupon code.');
      }
    } catch (err) {
      toast.error('Failed to validate coupon.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveItem = (productId: string, name: string) => {
    removeFromCart(productId);
    toast.success(`${name} removed from cart.`);
  };

  const handleIncrement = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      updateCartQty(productId, item.quantity + 1);
    }
  };

  const handleDecrement = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      updateCartQty(productId, item.quantity - 1);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout.");
      navigate('login');
      return;
    }

    // Save applied coupon to SessionStorage
    if (appliedCoupon) {
      sessionStorage.setItem('gocart_active_coupon', JSON.stringify(appliedCoupon));
    } else {
      sessionStorage.removeItem('gocart_active_coupon');
    }

    navigate('checkout');
  };

  // Determine if cart is completely empty
  const isCartEmpty = cartItemsList.length === 0;

  return (
    <div className="max-w-5xl mx-auto pb-24 text-left font-sans px-2" id="cart-root">
      
      {/* HEADER SECTION: "My Cart" & Segments */}
      <div className="bg-white rounded-2xl border border-zinc-150 p-3.5 shadow-sm space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-[#2874F0]" />
            My Cart ({cartItemsList.length} Items)
          </h1>
          {user && (
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3 text-red-500" />
              Deliver to: {user.pincode || "600001"}
            </p>
          )}
        </div>

        {/* Segmented controls matching Screenshot 2 exactly */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-150 max-w-md">
          <button
            onClick={() => setActiveSegment('flipkart')}
            className={`flex-1 py-2 text-center text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeSegment === 'flipkart'
                ? 'bg-[#2874F0] text-white shadow-md scale-102'
                : 'text-zinc-600 hover:bg-zinc-200/50'
            }`}
          >
            Flipkart
          </button>
          <button
            onClick={() => {
              setActiveSegment('minutes');
              toast.success("Flipkart Minutes hyper-local delivery catalog is ready!");
            }}
            className={`flex-1 py-2 text-center text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeSegment === 'minutes'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'text-zinc-600 hover:bg-zinc-200/50'
            }`}
          >
            Minutes
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isCartEmpty || activeSegment === 'minutes' ? (
          /* ====================================================================
             1. EMPTY STATE (Screenshot 2 Replica)
             ==================================================================== */
          <div className="max-w-xl mx-auto">
            <motion.div
              key="empty-cart-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-zinc-150 py-16 px-6 text-center shadow-sm space-y-6 flex flex-col items-center"
              id="empty-cart-container"
            >
              {/* Cute empty cart graphic with floating yellow bottle */}
              <div className="relative h-28 w-28 flex items-center justify-center">
                {/* Floating Yellow Bottle (from screenshot) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute top-1 z-10 bg-yellow-400 text-yellow-950 font-black px-1.5 py-0.5 rounded shadow text-[9px] uppercase tracking-wider border border-yellow-300"
                >
                  MILK
                </motion.div>
                {/* Grey Shopping Cart with eyes */}
                <div className="h-20 w-20 border-4 border-zinc-300 rounded-2xl relative flex flex-col items-center justify-center shrink-0">
                  <div className="flex gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                  </div>
                  <div className="h-2.5 w-5 border-t-2 border-zinc-400 rounded-b-full bg-transparent" />
                  {/* Wheels */}
                  <div className="absolute -bottom-2 flex justify-around w-full px-2">
                    <span className="h-4.5 w-4.5 rounded-full bg-zinc-300 border-2 border-zinc-400" />
                    <span className="h-4.5 w-4.5 rounded-full bg-zinc-300 border-2 border-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Empty text and CTA button */}
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-zinc-800">Your cart is empty!</h3>
                <p className="text-[11px] text-zinc-400 font-semibold max-w-xs leading-normal">
                  {activeSegment === 'minutes' 
                    ? "There are no hyper-local Minutes items in your pocket. Switch back to Flipkart or explore fresh grocery lists!"
                    : "Add items to your cart from our verified sellers and they will appear here."}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveSegment('flipkart');
                  navigate('products');
                }}
                className="bg-[#2874F0] hover:bg-blue-600 text-white font-black text-xs uppercase px-8 py-2.5 rounded-xl shadow-md tracking-wider transition-all cursor-pointer"
              >
                Shop now
              </button>
            </motion.div>
          </div>
        ) : (
          /* ====================================================================
             2. ACTIVE CART PRODUCTS LIST & INVOICE DETAILS
             ==================================================================== */
          <motion.div
            key="active-cart-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {/* LEFT COLUMN: Items and coupon codes */}
            <div className="md:col-span-2 space-y-4">
              {/* ITEMS LIST */}
              <div className="bg-white rounded-2xl border border-zinc-150 divide-y divide-zinc-100 overflow-hidden shadow-sm">
                {cartItemsList.map((item, idx) => (
                  <div 
                    key={item.productId}
                    className="p-3.5 flex gap-4 hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* Thumbnail Image */}
                    <div 
                      onClick={() => navigate('product-detail', { productId: item.product.id })}
                      className="h-20 w-20 bg-zinc-50 border border-zinc-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center cursor-pointer relative"
                    >
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="h-16 w-auto object-contain" 
                      />
                    </div>

                    {/* Information Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-0.5 text-left">
                        <h3 
                          onClick={() => navigate('product-detail', { productId: item.product.id })}
                          className="text-xs font-black text-zinc-850 truncate hover:text-[#2874F0] transition-colors cursor-pointer"
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1 leading-none">
                          <StoreIcon className="h-3 w-3 text-zinc-400" />
                          Seller: {item.product.storeId || "SmartBuy Vendor"}
                        </p>
                        {item.product.isAssured && (
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-1 py-0.5 rounded text-[8px] font-black tracking-wider uppercase inline-block mt-1">
                            Assured
                          </span>
                        )}
                      </div>

                      {/* Price and quantity modifiers row */}
                      <div className="flex items-center justify-between gap-3 mt-2">
                        <div className="flex items-baseline gap-1">
                          <p className="text-xs font-black text-zinc-900">₹{item.product.price.toLocaleString('en-IN')}</p>
                          {item.product.mrp > item.product.price && (
                            <p className="text-[10px] text-zinc-400 line-through font-semibold">₹{item.product.mrp.toLocaleString('en-IN')}</p>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                          <button 
                            onClick={() => handleDecrement(item.productId)}
                            className="px-2 py-0.5 text-xs font-black hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-center text-xs font-black text-zinc-800 font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => handleIncrement(item.productId)}
                            className="px-2 py-0.5 text-xs font-black hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Trash bin action */}
                        <button 
                          onClick={() => handleRemoveItem(item.productId, item.product.name)}
                          className="text-zinc-300 hover:text-rose-600 cursor-pointer transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* COUPON INPUT CARD */}
              <div className="bg-white rounded-2xl border border-zinc-150 p-4 shadow-sm">
                <form onSubmit={handleApplyCoupon} className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block pl-0.5">Apply Coupon Code</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="e.g. GOCART10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-3 pr-8 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500 transition-colors"
                      />
                      <Percent className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    </div>
                    <button
                      type="submit"
                      disabled={validatingCoupon}
                      className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                    >
                      {validatingCoupon ? 'Apply...' : 'Apply'}
                    </button>
                  </div>

                  {appliedCoupon && (
                    <p className="text-[10px] font-black text-emerald-600 flex items-center gap-1 pl-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                      {appliedCoupon.description}
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: PRICE DETAILS INVOICE & PROCEED */}
            <div className="md:col-span-1 space-y-4 md:sticky md:top-[195px]">
              <div className="bg-white rounded-2xl border border-zinc-150 p-4 shadow-sm space-y-3.5">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 pl-0.5">Price Details</h3>
                
                <div className="divide-y divide-zinc-100 text-xs font-semibold space-y-2 text-zinc-600">
                  <div className="flex justify-between py-1 bg-white">
                    <span>Price ({cartItemsList.length} items)</span>
                    <span className="text-zinc-800">₹{totalMRP.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-2 text-emerald-600 bg-white">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between py-2 text-emerald-600 bg-white">
                      <span>Coupon Discount ({appliedCoupon.discount}%)</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 bg-white">
                    <span>Secured Packaging Fee</span>
                    <span className="text-zinc-800">₹{packagingFee.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-2 bg-white">
                    <span>Delivery Charges</span>
                    <span className={deliveryCharge === 0 ? 'text-emerald-600 font-black' : 'text-zinc-800'}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 text-sm font-black text-zinc-900 border-t border-zinc-100 bg-white pt-2">
                    <span>Total Amount</span>
                    <span className="text-zinc-950">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Total Savings tag at bottom */}
                {totalSavings > 0 && (
                  <div className="bg-emerald-50 text-emerald-700 rounded-xl p-2.5 text-[11px] font-black text-center border border-emerald-100">
                    🎉 You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
                  </div>
                )}
              </div>

              {/* SIGNATURE FLIPKART CHECKOUT FOOTER STRIP */}
              <div className="bg-white rounded-2xl border border-zinc-150 p-3.5 flex items-center justify-between shadow-sm">
                <div className="text-left leading-none">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Total Amount</p>
                  <p className="text-sm font-black text-zinc-900 mt-1">₹{finalTotal.toLocaleString('en-IN')}</p>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="bg-[#2874F0] hover:bg-blue-600 text-white font-black text-xs uppercase px-6 py-3 rounded-xl shadow-md tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  Place Order
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
