import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Category, User, DashboardStats } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw, 
  Layers, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Truck,
  XCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRODUCT_PRESETS: Record<string, { label: string; url: string }[]> = {
  'Electronics': [
    { label: '📱 iPhone 15 Pro', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' },
    { label: '💻 MacBook Air', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
    { label: '🎧 Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
    { label: '⌚ Smart Watch', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80' },
    { label: '📷 DSLR Camera', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
    { label: '🔊 Speaker', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' }
  ],
  'Fashion': [
    { label: '👟 Red Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
    { label: '🧥 Hoodie', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80' },
    { label: '👜 Handbag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
    { label: '🕶️ Sunglasses', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80' },
    { label: '🧴 Perfume', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80' },
    { label: '👕 T-Shirt', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80' }
  ],
  'Home & Living': [
    { label: '🪑 Nordic Chair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80' },
    { label: '🛋️ Cozy Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
    { label: '💡 Modern Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80' },
    { label: '🪴 House Plant', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80' },
    { label: '☕ Mug Set', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80' }
  ],
  'Fitness & Wellness': [
    { label: '🏋️ Dumbbells', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
    { label: '🧘 Yoga Mat', url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80' },
    { label: '🥛 Shaker Bottle', url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80' },
    { label: '🧴 Skincare', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80' },
    { label: '⌚ Tracker', url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80' }
  ],
};

const CATEGORY_PRESETS = [
  { label: '💻 Electronics', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80' },
  { label: '👗 Fashion', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
  { label: '🏠 Home Decor', url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80' },
  { label: '🚴 Fitness Cover', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
  { label: '📚 Books Cover', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80' },
  { label: '🧸 Toys & Games', url: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&q=80' }
];

export default function AdminDashboardView() {
  const { user, navigate } = useApp();

  // Route protection
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('home');
    }
  }, [user, navigate]);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'users'>('overview');
  const [loading, setLoading] = useState(true);

  // Form Management states
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodStock, setProdStock] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');

  // Sub-list States (fetched separately for detailed tabs)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('amplify_token');
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error loading dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubData = useCallback(async () => {
    try {
      const token = localStorage.getItem('amplify_token');
      const [prodsRes, catsRes, ordsRes, usrsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (prodsRes.ok) setAllProducts(await prodsRes.json());
      if (catsRes.ok) setAllCategories(await catsRes.json());
      if (ordsRes.ok) setAllOrders(await ordsRes.json());
      if (usrsRes.ok) setAllUsers(await usrsRes.json());
    } catch (err) {
      console.error("Error loading administration rosters", err);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadSubData();
  }, [loadStats, loadSubData]);

  // Handle open editor for create or edit product
  const handleOpenProductForm = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setProdName(p.name);
      setProdDesc(p.description);
      setProdPrice(p.price.toString());
      setProdOrigPrice(p.mrp.toString());
      setProdCategory(p.category);
      setProdStock(p.inStock ? '10' : '0');
      setProdDiscount('0');
      setProdImage(p.images[0] || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdOrigPrice('');
      setProdCategory('Electronics');
      setProdStock('');
      setProdDiscount('0');
      setProdImage('');
    }
    setProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('amplify_token');
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        name: prodName,
        description: prodDesc,
        price: parseFloat(prodPrice),
        mrp: prodOrigPrice ? parseFloat(prodOrigPrice) : parseFloat(prodPrice),
        category: prodCategory,
        inStock: parseInt(prodStock) > 0,
        images: prodImage ? [prodImage] : undefined
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setProductFormOpen(false);
        loadStats();
        loadSubData();
        alert(editingProduct ? "Product updated successfully!" : "Product added successfully!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save product.");
      }
    } catch (err) {
      alert("Error contact the backend server.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('amplify_token');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadStats();
        loadSubData();
        alert("Product deleted.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const token = localStorage.getItem('amplify_token');
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCatName,
          description: newCatDesc,
          image: newCatImg
        })
      });

      if (res.ok) {
        setNewCatName('');
        setNewCatDesc('');
        setNewCatImg('');
        loadStats();
        loadSubData();
        alert("New niche category added!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem('amplify_token');
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadStats();
        loadSubData();
        alert("Category deleted.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const token = localStorage.getItem('amplify_token');
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          orderStatus: status,
          // Auto pay if delivered
          paymentStatus: status === 'DELIVERED' ? 'Paid' : undefined
        })
      });

      if (res.ok) {
        loadStats();
        loadSubData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('amplify_token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadStats();
        loadSubData();
        alert("User record deleted.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6 pb-16" id="admin-dashboard-container">
      {/* Dashboard Title Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border border-white/20 bg-zinc-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black">Control Station Center</h1>
            <p className="text-xs text-zinc-400">Enterprise inventory management, live orders, and transactional analytics.</p>
          </div>
        </div>

        <button 
          onClick={() => { loadStats(); loadSubData(); }}
          className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-zinc-200 cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Synchronize Data
        </button>
      </div>

      {/* Tabs Menu bar */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-xs font-bold border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeTab === 'overview' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}
        >
          General Overview
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-xs font-bold border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeTab === 'products' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}
        >
          Products CRUD ({allProducts.length})
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 text-xs font-bold border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeTab === 'categories' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}
        >
          Category Niches ({allCategories.length})
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-xs font-bold border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeTab === 'orders' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}
        >
          Incoming Orders ({allOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-xs font-bold border-b-2 cursor-pointer whitespace-nowrap transition-all ${activeTab === 'users' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}
        >
          Customer Roster ({allUsers.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && stats && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 animate-fade"
          >
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Sales Vol</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">${stats.totalSales.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"><DollarSign className="h-5 w-5" /></div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Orders</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{stats.totalOrders}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><ShoppingBag className="h-5 w-5" /></div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Items Catalog</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{stats.totalProducts}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"><Layers className="h-5 w-5" /></div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Customers</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{stats.totalUsers}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"><Users className="h-5 w-5" /></div>
              </div>
            </div>

            {/* Graphic Charts bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: SVG Revenue Line-Bar Trend */}
              <div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Monthly Gross Revenue Trend
                </h3>
                
                {/* Visual Chart - Hand-crafted responsive SVG */}
                <div className="h-56 w-full pt-4">
                  <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                    {/* Background grid lines */}
                    <line x1="50" y1="20" x2="550" y2="20" stroke="rgba(128,128,128,0.15)" strokeDasharray="4" />
                    <line x1="50" y1="80" x2="550" y2="80" stroke="rgba(128,128,128,0.15)" strokeDasharray="4" />
                    <line x1="50" y1="140" x2="550" y2="140" stroke="rgba(128,128,128,0.15)" strokeDasharray="4" />
                    <line x1="50" y1="180" x2="550" y2="180" stroke="rgba(128,128,128,0.3)" />

                    {/* Chart Bars with gradients */}
                    {stats.salesByMonth.map((sm, i) => {
                      // Normalize heights: max 140px height
                      const barHeight = Math.max(10, Math.min(150, (sm.sales / 12000) * 140));
                      const x = 70 + (i * 42);
                      const y = 180 - barHeight;

                      return (
                        <g key={i} className="group">
                          <rect
                            x={x}
                            y={y}
                            width="24"
                            height={barHeight}
                            rx="4"
                            className="fill-indigo-500 dark:fill-indigo-600 hover:fill-indigo-400 transition-colors cursor-pointer"
                          />
                          {/* Value overlay label on hover */}
                          <text 
                            x={x + 12} 
                            y={y - 6} 
                            textAnchor="middle" 
                            className="text-[10px] font-bold fill-zinc-700 dark:fill-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ${Math.round(sm.sales)}
                          </text>
                          {/* Label Month */}
                          <text 
                            x={x + 12} 
                            y="195" 
                            textAnchor="middle" 
                            className="text-[9px] font-bold fill-zinc-400 dark:fill-zinc-600 uppercase"
                          >
                            {sm.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Chart 2: SVG Category Distribution */}
              <div className="rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Layers className="h-4 w-4 text-purple-500" />
                  Category Niche Ratios
                </h3>

                <div className="space-y-4 pt-2">
                  {stats.salesByCategory.map((sc, i) => {
                    const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'];
                    const sum = stats.salesByCategory.reduce((acc, c) => acc + c.value, 0);
                    const percentage = sum > 0 ? (sc.value / sum) * 100 : 0;

                    return (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between font-medium">
                          <span className="text-zinc-600 dark:text-zinc-300">{sc.category}</span>
                          <span className="font-bold text-zinc-850 dark:text-zinc-100">{percentage.toFixed(0)}% (${sc.value.toLocaleString()})</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-150 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[i % colors.length]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Inventory Warnings Block */}
            {stats.lowStockProducts.length > 0 && (
              <section className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 dark:border-amber-950/20 dark:bg-amber-950/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Critical Stock Depletion Alerts</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {stats.lowStockProducts.map((p) => (
                    <div 
                      key={p.id}
                      className="p-3 bg-white dark:bg-zinc-950 border border-amber-100 dark:border-amber-900 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-zinc-850 dark:text-zinc-200 truncate max-w-[150px]">{p.name}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Category: {p.category}</p>
                      </div>
                      <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 font-bold">
                        {p.inStock ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </motion.div>
        )}

        {/* TAB CONTENT: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <motion.div 
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Products Catalog ({allProducts.length})</h3>
              <button 
                onClick={() => handleOpenProductForm()}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 text-zinc-950 px-4 py-2 text-xs font-bold shadow-lg shadow-amber-500/10 hover:bg-amber-400 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </button>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/40 overflow-hidden backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 font-bold">Product</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Inventory</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {allProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 font-sans">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-lg object-cover bg-zinc-100" />
                          <div>
                            <p className="font-bold text-zinc-850 dark:text-zinc-100">{p.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{p.id}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-zinc-650 dark:text-zinc-350">{p.category}</td>
                        <td className="p-4 font-bold text-zinc-850 dark:text-zinc-100">
                          ${p.price}{' '}
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-zinc-400 line-through font-normal">${p.mrp}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${p.inStock ? 'text-emerald-500' : 'text-red-500'}`}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2 h-16">
                          <button 
                            onClick={() => handleOpenProductForm(p)}
                            className="rounded p-1.5 text-zinc-400 hover:text-amber-500 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="rounded p-1.5 text-zinc-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Create Category form */}
            <div className="md:col-span-1 rounded-2xl border border-white/20 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Add Category Niche</h3>
              
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Designer Jewelry"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Niche Description</label>
                  <textarea
                    placeholder="Brief scope of the category catalogs..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Cover Image URL</label>
                    {newCatImg && (
                      <button 
                        type="button" 
                        onClick={() => setNewCatImg('')} 
                        className="text-[10px] text-red-500 hover:underline font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newCatImg}
                        onChange={(e) => setNewCatImg(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                      />
                    </div>
                    
                    {/* Live Preview */}
                    {newCatImg ? (
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                        <img 
                          src={newCatImg} 
                          alt="category preview" 
                          referrerPolicy="no-referrer" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=100&q=80';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 shrink-0 flex items-center justify-center text-[9px] text-zinc-400 font-bold uppercase">
                        No Pic
                      </div>
                    )}
                  </div>

                  {/* Category presets */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Quick Cover Presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORY_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setNewCatImg(p.url)}
                          className={`px-2 py-0.5 text-[10px] rounded-lg border transition-all font-semibold ${newCatImg === p.url ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer hover:bg-indigo-500"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* List and deletes */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Active Niches ({allCategories.length})</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allCategories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="p-4 rounded-xl border border-zinc-150 bg-white dark:border-zinc-850 dark:bg-zinc-950/40 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt="" referrerPolicy="no-referrer" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-zinc-850 dark:text-zinc-150">{cat.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]">{cat.slug}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="rounded p-1.5 text-zinc-300 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: INCOMING ORDERS */}
        {activeTab === 'orders' && (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Incoming Orders ({allOrders.length})</h3>

            <div className="rounded-2xl border border-white/20 bg-white/40 overflow-hidden backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Recipient</th>
                      <th className="p-4 font-bold">Grand Total</th>
                      <th className="p-4 font-bold">Payment Status</th>
                      <th className="p-4 font-bold">Package Status</th>
                      <th className="p-4 font-bold text-right">Alter Shipments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {allOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 font-sans">
                        <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{o.id}</td>
                        <td className="p-4 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <p className="font-bold text-zinc-850 dark:text-zinc-100">{o.shippingAddress.fullName}</p>
                          <p className="text-[10px] text-zinc-400">{o.shippingAddress.phone}</p>
                        </td>
                        <td className="p-4 font-bold text-zinc-850 dark:text-zinc-100">${o.totalAmount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : (o.status === 'CANCELLED' ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40')}`}>
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => handleUpdateOrderStatus(o.id, 'SHIPPED')}
                                className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/25 dark:text-blue-400 text-[10px] font-black uppercase rounded hover:bg-blue-100 cursor-pointer"
                              >
                                Ship package
                              </button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')}
                                className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-400 text-[10px] font-black uppercase rounded hover:bg-emerald-100 cursor-pointer"
                              >
                                Deliver package
                              </button>
                            </div>
                          )}
                          {o.status === 'DELIVERED' && <span className="text-emerald-500 font-bold text-xs">Delivered & Closed</span>}
                          {o.status === 'CANCELLED' && <span className="text-red-500 font-bold text-xs">Cancelled</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: CUSTOMER ROSTER */}
        {activeTab === 'users' && (
          <motion.div 
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Customer Accounts Roster ({allUsers.length})</h3>

            <div className="rounded-2xl border border-white/20 bg-white/40 overflow-hidden backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-900/40 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Email Folder</th>
                      <th className="p-4 font-bold">Account Access</th>
                      <th className="p-4 font-bold">Phone</th>
                      <th className="p-4 font-bold">Joined On</th>
                      <th className="p-4 font-bold text-right">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {allUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 font-sans">
                        <td className="p-4 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-zinc-150 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 font-bold flex items-center justify-center uppercase">
                            {usr.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-850 dark:text-zinc-150">{usr.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{usr.id}</p>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-700 dark:text-zinc-300">{usr.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${usr.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-400">{usr.phone || 'None provided'}</td>
                        <td className="p-4 text-zinc-400">{new Date(usr.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          {usr.id !== 'usr_admin1' && (
                            <button
                              onClick={() => handleDeleteUser(usr.id)}
                              className="rounded p-1.5 text-zinc-300 hover:text-red-500 cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {usr.id === 'usr_admin1' && <span className="text-[10px] text-zinc-400 font-medium">Locked Admin</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* POPUP MODAL: CREATE / EDIT PRODUCT */}
      <AnimatePresence>
        {productFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop closer */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProductFormOpen(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                {editingProduct ? 'Modify Catalog Specifications' : 'Introduce New Catalog Item'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Carbon Fiber Wireless Audio"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Detailed Description</label>
                    <textarea
                      placeholder="Technical specs, craftsmanship details, dimensions..."
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sale Price ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 199"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Original retail Price ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 249"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Stock Inventory</label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Discount Percent (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={prodDiscount}
                      onChange={(e) => setProdDiscount(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Fitness & Wellness">Fitness & Wellness</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Photo URL</label>
                      {prodImage && (
                        <button 
                          type="button" 
                          onClick={() => setProdImage('')} 
                          className="text-[10px] text-red-500 hover:underline font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      
                      {/* Image Live Preview */}
                      {prodImage ? (
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                          <img 
                            src={prodImage} 
                            alt="preview" 
                            referrerPolicy="no-referrer" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=100&q=80';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 shrink-0 flex items-center justify-center text-[9px] text-zinc-400 font-bold uppercase">
                          No Pic
                        </div>
                      )}
                    </div>

                    {/* Quick presets for this category */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Quick Photo Presets for {prodCategory}:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(PRODUCT_PRESETS[prodCategory] || PRODUCT_PRESETS['Electronics']).map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setProdImage(p.url)}
                            className={`px-2 py-1 text-[10px] rounded-lg border transition-all font-semibold ${prodImage === p.url ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setProductFormOpen(false)}
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                  >
                    Save Specifications
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
