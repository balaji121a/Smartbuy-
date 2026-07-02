import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartQty, removeFromCart, navigate } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate pricing
  const mrpTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const sellingTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountTotal = mrpTotal - sellingTotal;
  const isDeliveryFree = sellingTotal >= 499;
  const deliveryCharge = cartCount > 0 ? (isDeliveryFree ? 0 : 40) : 0;
  const finalTotal = sellingTotal + deliveryCharge;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    onClose();
    navigate('checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white text-zinc-800 shadow-2xl z-50 flex flex-col h-full border-l border-zinc-100"
            id="cart-drawer-panel"
          >
            {/* Header */}
            <div className="p-4 bg-[#2874F0] text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#FF9900]" />
                <span className="font-extrabold text-sm uppercase tracking-wider">My Shopping Cart ({cartCount})</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of Cart Items */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900 uppercase">Your Cart is Empty</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-[200px] mx-auto">Add some products from the Indian bazaar to start shopping!</p>
                  </div>
                  <button
                    onClick={() => { onClose(); navigate('home'); }}
                    className="bg-[#2874F0] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors"
                  >
                    Browse Catalogue
                  </button>
                </div>
              ) : (
                cart.map(({ product, quantity }) => {
                  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                  return (
                    <div 
                      key={product.id} 
                      className="flex gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-100 items-start hover:shadow-xs transition-shadow"
                    >
                      {/* Image */}
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 object-cover rounded-lg border border-zinc-200 bg-white"
                      />

                      {/* Product Details & Actions */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-zinc-800 truncate leading-tight">{product.name}</h5>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{product.category}</p>
                        
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-sans font-black text-[#2874F0] text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="font-sans text-[10px] line-through text-zinc-400">₹{product.mrp.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] font-bold text-[#388E3C]">{discountPercent}% OFF</span>
                        </div>

                        {/* Qty Stepper & Remove */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateCartQty(product.id, quantity - 1)}
                              className="px-2 py-1 text-xs font-extrabold text-zinc-500 hover:bg-zinc-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-zinc-800 bg-zinc-50/50">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(product.id, quantity + 1)}
                              className="px-2 py-1 text-xs font-extrabold text-zinc-500 hover:bg-zinc-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => { removeFromCart(product.id); toast.success("Removed from cart"); }}
                            className="text-zinc-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Price Breakdown Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-1.5">Price Details</h4>
                
                <div className="space-y-1.5 text-xs font-medium text-zinc-600">
                  <div className="flex justify-between">
                    <span>MRP Total ({cartCount} items)</span>
                    <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#388E3C]">
                    <span>Product Discount</span>
                    <span>- ₹{discountTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-zinc-200 pb-2">
                    <span>Delivery Charges</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-[#388E3C] font-extrabold uppercase">Free</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  
                  {/* Free shipping banner */}
                  {!isDeliveryFree && (
                    <p className="text-[10px] text-zinc-400 text-center py-1">
                      Add <span className="font-bold text-[#FF9900]">₹{(499 - sellingTotal).toLocaleString('en-IN')}</span> more for <span className="font-bold uppercase text-[#388E3C]">Free Delivery</span>
                    </p>
                  )}
                  
                  <div className="flex justify-between text-sm font-black text-zinc-900 pt-1.5">
                    <span>Total Amount</span>
                    <span className="text-[#2874F0]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#FF9900] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                >
                  Place Order
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
