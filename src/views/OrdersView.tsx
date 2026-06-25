import React, { useState } from 'react';
import { useApp, Order } from '../context/AppContext';
import { Package, Truck, CheckCircle2, Clock, Calendar, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function OrdersView() {
  const { orders, navigate } = useApp();
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
      case 'Shipped':
        return { bg: 'bg-sky-50 text-sky-700 border-sky-100', dot: 'bg-sky-500' };
      case 'Processing':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
      default:
        return { bg: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    }
  };

  const steps = [
    { label: "Ordered", desc: "Order confirmed by seller", icon: <Clock className="h-4 w-4" /> },
    { label: "Packed", desc: "Packed & ready at regional hub", icon: <Package className="h-4 w-4" /> },
    { label: "Shipped", desc: "In transit via SmartBuy Express", icon: <Truck className="h-4 w-4" /> },
    { label: "Out for Delivery", desc: "Courier partner is delivering today", icon: <Truck className="h-4 w-4" /> },
    { label: "Delivered", desc: "Handed over to resident", icon: <CheckCircle2 className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto py-6" id="orders-view-container">
      {/* Page Header */}
      <div className="flex items-center gap-2 border-b border-zinc-150 pb-4">
        <Package className="h-6 w-6 text-[#2874F0]" />
        <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
          My Past Orders
        </h1>
        <span className="text-xs bg-zinc-100 text-zinc-500 font-bold px-2 py-1 rounded-md ml-2">
          {orders.length} orders found
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-zinc-100 p-8 space-y-4">
          <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-zinc-900 uppercase">No Orders Placed Yet</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">You haven't placed any orders during this session. Check out the hot lightning deals!</p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="bg-[#2874F0] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Explore Hot Deals
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const statusConfig = getStatusStyle(order.status);
            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-zinc-150 shadow-sm p-5 hover:shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Order ID</p>
                    <p className="font-sans font-black text-xs text-zinc-800">{order.id}</p>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <span>Placed on: {order.date}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusConfig.bg}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items grid */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 object-cover rounded-lg border border-zinc-150 bg-white"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-zinc-800 truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Qty: {item.quantity} | Category: {item.product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-sans font-black text-xs text-zinc-900">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Total / Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100 pt-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Paid via {order.paymentMethod}</span>
                    <span className="text-sm font-black text-[#2874F0] font-sans">
                      Total Paid: ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => { setTrackingOrder(order); }}
                    className="bg-zinc-100 hover:bg-[#2874F0] hover:text-white text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer self-end sm:self-auto"
                  >
                    Track Order
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Tracking Timeline Modal */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-zinc-100 text-left"
            >
              <button 
                onClick={() => setTrackingOrder(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer bg-zinc-50"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight mb-1">Track Delivery Status</h3>
              <p className="text-[11px] text-zinc-400 mb-6">Real-time express logistics timeline for Order ID: <span className="font-mono font-black text-zinc-700">{trackingOrder.id}</span></p>

              {/* Vertical Timeline */}
              <div className="relative pl-8 space-y-6">
                {/* Progress bar line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-zinc-100">
                  <div 
                    className="w-full bg-blue-600 transition-all duration-500"
                    style={{ height: `${(trackingOrder.trackingStep / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isCompleted = trackingOrder.trackingStep >= idx;
                  const isActive = trackingOrder.trackingStep === idx;
                  
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className={`absolute -left-8 flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 transition-colors duration-350 ${
                        isCompleted 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-zinc-200 text-zinc-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
                      </div>

                      {/* Content */}
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-black uppercase tracking-tight ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'} ${isActive ? 'text-[#2874F0]' : ''}`}>
                          {step.label}
                          {isActive && <span className="ml-2 text-[9px] font-black uppercase text-[#FF9900] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">Active</span>}
                        </h4>
                        <p className={`text-[11px] ${isCompleted ? 'text-zinc-500 font-medium' : 'text-zinc-400'}`}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-4 flex justify-between text-xs font-semibold text-zinc-500">
                <p>Courier: <span className="font-bold text-zinc-800">SmartBuy Express Logistics</span></p>
                <p>Estimated Delivery: <span className="font-bold text-blue-600">Tomorrow EOD</span></p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
