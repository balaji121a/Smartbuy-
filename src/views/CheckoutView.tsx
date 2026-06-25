import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function CheckoutView() {
  const { cart, user, createNewOrder, navigate, deductSuperCoins, updateUser } = useApp();

  const [step, setStep] = useState(1); // Step 1: Address, Step 2: Payment, Step 3: Order Summary, Step 4: Success Screen
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Address State (prefilled with default user details if available)
  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: user?.pincode || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || ''
  });

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, upi, card, netbanking, paylater
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  
  // Redeem SuperCoins flag
  const [redeemSuperCoins, setRedeemSuperCoins] = useState(false);

  // Cart pricing values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const mrpTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const sellingTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const productDiscount = mrpTotal - sellingTotal;
  const isDeliveryFree = sellingTotal >= 499;
  const deliveryCharge = cartCount > 0 ? (isDeliveryFree ? 0 : 40) : 0;
  
  // SuperCoins redemption (up to 100 or total coins)
  const coinsToRedeem = user ? Math.min(user.superCoins, 100) : 0;
  const coinsDiscount = redeemSuperCoins ? coinsToRedeem : 0;

  const finalTotal = sellingTotal + deliveryCharge - coinsDiscount;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.state) {
      toast.error("Please fill in all address details.");
      return;
    }
    if (addressForm.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return;
    }
    setStep(2);
    toast.success("Delivery address saved! Proceeding to Payment.");
  };

  const handleSavePayment = () => {
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      toast.error("Please enter a valid UPI ID (e.g. name@okhdfc)");
      return;
    }
    if (paymentMethod === 'card' && cardDetails.number.length < 16) {
      toast.error("Please enter a valid 16-digit Card Number");
      return;
    }
    setStep(3);
  };

  const handleConfirmOrder = () => {
    // Call Context action to persist order in local state & clear cart
    const paymentLabel = getPaymentMethodLabel();
    const newOrder = createNewOrder(addressForm, paymentLabel);
    
    // Deduct coins if redeemed
    if (redeemSuperCoins && coinsToRedeem > 0) {
      deductSuperCoins(coinsToRedeem);
    }

    // Sync address back to user profile so that profile is automatically updated and completed!
    if (updateUser) {
      updateUser({
        name: addressForm.name,
        phone: addressForm.phone,
        address: addressForm.address,
        pincode: addressForm.pincode,
        city: addressForm.city,
        state: addressForm.state,
        profileCompleted: true
      });
    }

    setPlacedOrderId(newOrder.id);
    setStep(4);
    toast.success("🎉 Order placed successfully!", {
      duration: 5000,
      icon: '✨'
    });
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'upi': return `UPI (${upiId})`;
      case 'card': return 'Credit/Debit Card';
      case 'netbanking': return 'Net Banking';
      case 'paylater': return 'Pay Later (No Cost EMI)';
      default: return 'Cash on Delivery';
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4" id="checkout-empty">
        <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-black text-zinc-900 uppercase">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Please add items to your cart before proceeding to the checkout view.</p>
        <button
          onClick={() => navigate('home')}
          className="bg-[#2874F0] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-sm cursor-pointer"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 text-left" id="checkout-view-container">
      {step !== 4 && (
        <div className="flex items-center gap-2 border-b border-zinc-150 pb-4 mb-6">
          <ShoppingBag className="h-6 w-6 text-[#2874F0]" />
          <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Checkout Securely</h1>
        </div>
      )}

      {/* 3 Step progress header */}
      {step !== 4 && (
        <div className="grid grid-cols-3 gap-2 mb-8 text-center text-xs font-bold">
          <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            step === 1 ? 'bg-blue-50 border-blue-200 text-[#2874F0] shadow-sm' : 'bg-white border-zinc-150 text-zinc-400'
          }`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#2874F0] text-white' : 'bg-zinc-100 text-zinc-400'}`}>1</span>
            <span className="uppercase tracking-wide text-[10px]">Shipping Address</span>
          </div>
          
          <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            step === 2 ? 'bg-blue-50 border-blue-200 text-[#2874F0] shadow-sm' : 'bg-white border-zinc-150 text-zinc-400'
          }`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#2874F0] text-white' : 'bg-zinc-100 text-zinc-400'}`}>2</span>
            <span className="uppercase tracking-wide text-[10px]">Payment Method</span>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            step === 3 ? 'bg-blue-50 border-blue-200 text-[#2874F0] shadow-sm' : 'bg-white border-zinc-150 text-zinc-400'
          }`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#2874F0] text-white' : 'bg-zinc-100 text-zinc-400'}`}>3</span>
            <span className="uppercase tracking-wide text-[10px]">Order Summary</span>
          </div>
        </div>
      )}

      {/* Main Form/Success content based on step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* STEP 1: Delivery Address Form */}
          {step === 1 && (
            <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-[#2874F0]" />
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Delivery Address</h3>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Your Name"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Mobile Phone</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 9876543210"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Street Address</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="e.g. 12, Anna Salai, Opposite LIC Building"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">City</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Chennai"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">State</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Tamil Nadu"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">PIN Code</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      placeholder="600001"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "") })}
                      className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-xs font-bold tracking-widest text-[#2874F0] focus:border-[#2874F0] outline-none text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Save & Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Payment options */}
          {step === 2 && (
            <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm max-w-xl mx-auto space-y-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#2874F0]" />
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Select Payment Option</h3>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <label className={`border rounded-2xl p-4 flex flex-col cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'bg-blue-50/50 border-[#2874F0] ring-1 ring-[#2874F0]/20' : 'border-zinc-200 hover:bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment_opt" 
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-[#2874F0] focus:ring-[#2874F0]" 
                      />
                      <span className="text-xs font-black uppercase text-zinc-800">BHIM UPI (GPay / PhonePe / Paytm)</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Fastest</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pl-6">
                      <input 
                        type="text" 
                        placeholder="Enter Virtual Payment Address (e.g. name@okhdfc)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#2874F0] outline-none"
                      />
                    </div>
                  )}
                </label>

                {/* Credit / Debit Card Option */}
                <label className={`border rounded-2xl p-4 flex flex-col cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'bg-blue-50/50 border-[#2874F0] ring-1 ring-[#2874F0]/20' : 'border-zinc-200 hover:bg-zinc-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#2874F0] focus:ring-[#2874F0]" 
                    />
                    <span className="text-xs font-black uppercase text-zinc-800">Credit / Debit Card</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-3 pl-6 space-y-3">
                      <input 
                        type="text" 
                        maxLength={16}
                        placeholder="Card Number (16 Digits)"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "") })}
                        className="w-full border border-zinc-200 rounded-lg p-2 text-xs font-semibold focus:border-[#2874F0] outline-none"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          placeholder="Expiry (MM/YY)"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="col-span-2 border border-zinc-200 rounded-lg p-2 text-xs font-semibold focus:border-[#2874F0] outline-none"
                        />
                        <input 
                          type="password" 
                          maxLength={3}
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                          className="col-span-1 border border-zinc-200 rounded-lg p-2 text-xs font-semibold focus:border-[#2874F0] outline-none text-center"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* Net Banking Option */}
                <label className={`border rounded-2xl p-4 flex cursor-pointer transition-all ${
                  paymentMethod === 'netbanking' ? 'bg-blue-50/50 border-[#2874F0] ring-1 ring-[#2874F0]/20' : 'border-zinc-200 hover:bg-zinc-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-[#2874F0] focus:ring-[#2874F0]" 
                    />
                    <span className="text-xs font-black uppercase text-zinc-800">Net Banking (SBI, HDFC, ICICI, Axis)</span>
                  </div>
                </label>

                {/* Pay Later / EMI Option */}
                <label className={`border rounded-2xl p-4 flex cursor-pointer transition-all ${
                  paymentMethod === 'paylater' ? 'bg-blue-50/50 border-[#2874F0] ring-1 ring-[#2874F0]/20' : 'border-zinc-200 hover:bg-zinc-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentMethod === 'paylater'}
                      onChange={() => setPaymentMethod('paylater')}
                      className="text-[#2874F0] focus:ring-[#2874F0]" 
                    />
                    <span className="text-xs font-black uppercase text-zinc-800">Pay Later (No Cost EMI up to 12 months)</span>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label className={`border rounded-2xl p-4 flex cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'bg-blue-50/50 border-[#2874F0] ring-1 ring-[#2874F0]/20' : 'border-zinc-200 hover:bg-zinc-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#2874F0] focus:ring-[#2874F0]" 
                    />
                    <span className="text-xs font-black uppercase text-zinc-800">Cash on Delivery (COD)</span>
                  </div>
                </label>
              </div>

              {/* Navigation Back & Forth */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-extrabold text-xs uppercase py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Address Form
                </button>
                <button
                  onClick={handleSavePayment}
                  className="flex-1 bg-[#FF9900] hover:bg-orange-600 text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Proceed to Summary
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Summary before confirming */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product items review */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <FileText className="h-5 w-5 text-[#2874F0]" />
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Review Order Items</h3>
                  </div>

                  <div className="space-y-4">
                    {cart.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-4 items-center">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 object-cover rounded-lg border border-zinc-150 bg-white"
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <h4 className="text-xs font-black text-zinc-800 truncate leading-tight">{product.name}</h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5 font-semibold">Qty: {quantity} | Category: {product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans font-black text-xs text-zinc-900">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery details summary */}
                <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-1">Ship to</h4>
                    <p className="text-xs font-bold text-zinc-800 mt-2">{addressForm.name}</p>
                    <p className="text-xs text-zinc-500 font-semibold mt-1">{addressForm.address}, {addressForm.city}, {addressForm.state} - {addressForm.pincode}</p>
                    <p className="text-xs text-zinc-500 font-semibold mt-1">Phone: {addressForm.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-1">Payment Method</h4>
                    <p className="text-xs font-bold text-zinc-800 mt-2">{getPaymentMethodLabel()}</p>
                    <p className="text-[10px] text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-2">Verified Secure</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown sidebar */}
              <div className="space-y-4">
                <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm text-left space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-2">Billing Details</h3>
                  
                  {/* SuperCoins rewards banner */}
                  {user && user.superCoins > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-bold">
                        <Coins className="h-4 w-4 text-[#FF9900]" />
                        <span>Redeem {coinsToRedeem} SuperCoins? (Save ₹{coinsToRedeem})</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={redeemSuperCoins}
                        onChange={() => setRedeemSuperCoins(!redeemSuperCoins)}
                        className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-xs font-semibold text-zinc-600">
                    <div className="flex justify-between">
                      <span>MRP Total ({cartCount} items)</span>
                      <span className="font-sans">₹{mrpTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#388E3C]">
                      <span>Product Discount</span>
                      <span className="font-sans">- ₹{productDiscount.toLocaleString('en-IN')}</span>
                    </div>
                    {redeemSuperCoins && (
                      <div className="flex justify-between text-yellow-600 font-bold">
                        <span>SuperCoins Discount</span>
                        <span className="font-sans">- ₹{coinsToRedeem}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-dashed border-zinc-200 pb-3">
                      <span>Delivery Charges</span>
                      <span>
                        {deliveryCharge === 0 ? (
                          <span className="text-[#388E3C] font-black uppercase">Free</span>
                        ) : (
                          `₹${deliveryCharge}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-zinc-900 pt-1">
                      <span>Total Amount</span>
                      <span className="text-[#2874F0] font-sans">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleConfirmOrder}
                      className="w-full bg-[#FF9900] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-md cursor-pointer transition-all text-center flex items-center justify-center gap-2"
                    >
                      Confirm Order
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 font-bold text-[10px] uppercase py-2 rounded-lg mt-3 text-center transition-colors cursor-pointer"
                    >
                      Back to Payments
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-xs font-semibold text-zinc-500 flex items-center gap-2 leading-relaxed">
                  <ShieldCheck className="h-5 w-5 text-[#388E3C] shrink-0" />
                  <span>SmartBuy India Buyer Protection ensures security from checkout dispatch through live delivery.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Animated order placed success screen */}
          {step === 4 && (
            <div className="bg-white border border-zinc-150 rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-blue-100"
              >
                <CheckCircle className="h-10 w-10 fill-blue-500 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-black text-blue-600 uppercase tracking-tight">🎉 Order Placed Successfully!</h2>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">Your order is confirmed and is already being packed. Thank you for shopping with SmartBuy India!</p>
              </div>

              {/* Order ID display panel */}
              <div className="bg-zinc-50 rounded-2xl p-4 max-w-sm mx-auto border border-zinc-100 space-y-1">
                <p className="text-[9px] text-zinc-400 font-black uppercase">Order ID Reference</p>
                <p className="font-mono font-black text-[#2874F0] text-sm tracking-wider">{placedOrderId || 'OD9283749817'}</p>
              </div>

              <div className="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('orders')}
                  className="bg-[#2874F0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Track in My Orders
                </button>
                <button
                  onClick={() => navigate('home')}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
