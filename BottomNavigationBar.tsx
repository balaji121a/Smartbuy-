import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Grid, 
  Gamepad2, 
  User, 
  ShoppingBag 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomNavigationBar() {
  const { activeView, navigate, cart } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Categories', icon: Grid },
    { id: 'play', label: 'Play', icon: Gamepad2, badge: true, badgeText: 'New' },
    { id: 'profile', label: 'Account', icon: User },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount > 0, badgeText: cartCount.toString() },
  ];

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-all duration-300"
      id="bottom-navigation-bar"
    >
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id as any);
                // Scroll to top of window smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center cursor-pointer group focus:outline-none select-none"
              id={`nav-item-${item.id}`}
            >
              {/* Highlight Circle for Active Item */}
              {isActive && (
                <motion.span
                  layoutId="activeTabGlow"
                  className="absolute inset-0 mx-auto w-12 h-12 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with scaling animation */}
              <div className={`relative transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400 scale-110 -translate-y-0.5' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'}`}>
                <IconComponent className="h-5 w-5 stroke-[2.25]" />
                
                {/* Badge Indicator */}
                {item.badge && item.badgeText && (
                  <span className={`absolute -top-1.5 -right-2 text-[8px] font-black h-4 px-1 min-w-4 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-zinc-900 text-white shadow-sm ${
                    item.id === 'play' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                  }`}>
                    {item.badgeText}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span className={`text-[10px] font-black tracking-tight mt-1 transition-colors duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-zinc-500 dark:text-zinc-400 font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
