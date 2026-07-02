import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNavigationBar from './components/BottomNavigationBar';
import Footer from './components/Footer';
import ProductCompareWidget from './components/ProductCompareWidget';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

// Views
import HomeView from './views/HomeView';
import ProductListingView from './views/ProductListingView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import ProfileView from './views/ProfileView';
import WishlistView from './views/WishlistView';
import OrdersView from './views/OrdersView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import AdminDashboardView from './views/AdminDashboardView';
import ShopListView from './views/ShopListView';
import ShopDetailView from './views/ShopDetailView';
import PlayView from './views/PlayView';
import ProductDetailModal from './components/ProductDetailModal';

import { ShieldQuestion } from 'lucide-react';

function AppContent() {
  const { activeView, theme, navigate } = useApp();

  // Route Dispatcher
  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'play':
        return <PlayView />;
      case 'shop':
        return <ShopListView />;
      case 'shop-detail':
        return <ShopDetailView />;
      case 'products':
        return <ProductListingView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
      case 'pricing':
        return <CheckoutView />;
      case 'wishlist':
        return <WishlistView />;
      case 'orders':
        return <OrdersView />;
      case 'profile':
        return <ProfileView />;
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;
      case 'admin':
      case 'admin-dashboard':
      case 'admin-approve':
      case 'admin-stores':
      case 'admin-coupons':
        return <AdminDashboardView />;
      default:
        // Elegant 404 Fallback page
        return (
          <div className="text-center py-24 rounded-2xl border border-white/20 bg-white/40 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 animate-fade" id="fallback-404">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400 mx-auto">
              <ShieldQuestion className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-black text-zinc-900 dark:text-zinc-50">Requested Niche Not Found</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">The requested catalogue, resource, or checkout view has expired or moved to a different sector.</p>
            <button 
              onClick={() => navigate('home')} 
              className="mt-6 rounded-full bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white cursor-pointer hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"
            >
              Return to Catalog Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50/50 text-zinc-850'}`}>
      {/* Visual background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-900/30" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-300/20 blur-[120px] dark:bg-purple-950/20" />
      </div>

      {/* Main navigation */}
      <Navbar />

      {/* Main dynamic container with Page Transitions */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[180px] pb-24 md:pb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Product Comparison Floating Widget */}
      <ProductCompareWidget />

      {/* Global Product Detail Modal Popup */}
      <ProductDetailModal />

      {/* Floating Bottom Navigation Bar for Mobile & Desktop */}
      <BottomNavigationBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
