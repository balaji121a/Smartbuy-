import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDIAN_PRODUCTS, Product } from '../data/products';

export type ActiveView = 
  | 'home' 
  | 'cart' 
  | 'orders' 
  | 'wishlist' 
  | 'profile' 
  | 'checkout' 
  | 'login' 
  | 'register'
  | 'products'
  | 'product-detail'
  | 'play';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  mrpTotal: number;
  discount: number;
  deliveryCharge: number;
  date: string;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Ordered';
  address: {
    name: string;
    phone: string;
    pincode: string;
    address: string;
    city: string;
    state: string;
  };
  paymentMethod: string;
  trackingStep: number; // 0: Ordered, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
}

export interface AppUser {
  name: string;
  email: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  superCoins: number;
  isMember: 'none' | 'plus' | 'prime';
  role?: 'user' | 'admin';
  profileCompleted?: boolean;
}

interface AppContextType {
  user: AppUser | null;
  activeView: ActiveView;
  selectedProductId: string | null;
  theme: 'light' | 'dark';
  pincode: string;
  token: string | null;
  currencySymbol: string;
  
  // Search state
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearch: (query: string) => void;
  searchHistory: string[];
  addSearchQuery: (query: string) => void;
  removeSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;

  // Comparison state
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  
  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Wishlist state
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  moveToCart: (product: Product) => void;

  // Orders state
  orders: Order[];
  createNewOrder: (address: any, paymentMethod: string) => Order;
  
  // Modal selection
  activeProductDetail: Product | null;
  setActiveProductDetail: (product: Product | null) => void;
  
  login: (email: string, name: string) => void;
  logout: () => void;
  navigate: (view: ActiveView, extraData?: { productId?: string }) => void;
  toggleTheme: () => void;
  setPincode: (pin: string) => void;
  updateUserMembership: (membership: 'none' | 'plus' | 'prime') => void;
  deductSuperCoins: (amount: number) => void;
  addSuperCoins: (amount: number) => void;
  updateUser: (fields: Partial<AppUser>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ind_ecom_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // User state
  const [user, setUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('ind_ecom_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.email.toLowerCase().includes('admin')) {
          parsed.role = 'admin';
        }
        return parsed;
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  // Token state
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('amplify_token');
  });

  // Active view routing
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pincode, setPincodeState] = useState<string>("Chennai 600001");
  
  // Product Detail Modal State
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);

  // Search, categories
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const setSelectedCategory = (cat: string | null) => {
    setSelectedCategoryState(cat);
  };

  const setSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addSearchQuery(query.trim());
    }
  };

  // Search history state
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('ind_ecom_search_history');
    return saved ? JSON.parse(saved) : ["iPhone", "MacBook", "Puma", "Football", "Levi's"];
  });

  const addSearchQuery = (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 10);
      localStorage.setItem('ind_ecom_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearchQuery = (query: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(q => q !== query);
      localStorage.setItem('ind_ecom_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('ind_ecom_search_history');
  };

  // Product Compare State
  const [compareList, setCompareList] = useState<Product[]>([]);

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product]; // oldest out, new in
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  // Cart State (Persists in session/local storage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ind_ecom_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ind_ecom_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ind_ecom_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ind_ecom_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const moveToCart = (product: Product) => {
    addToCart(product);
    setWishlist(prev => prev.filter(p => p.id !== product.id));
  };

  // Fake Past Orders + user new orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ind_ecom_orders');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ind_ecom_orders', JSON.stringify(orders));
  }, [orders]);

  const createNewOrder = (address: any, paymentMethod: string) => {
    const mrpTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = mrpTotal - totalAmount;
    const deliveryCharge = totalAmount >= 499 ? 0 : 40;
    
    const newOrder: Order = {
      id: "OD" + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: totalAmount + deliveryCharge,
      mrpTotal,
      discount,
      deliveryCharge,
      date: new Date().toISOString().split('T')[0],
      status: "Ordered",
      address,
      paymentMethod,
      trackingStep: 0 // Ordered
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Auth Operations
  const login = (first: string, second: any) => {
    if (second && typeof second === 'object') {
      // Full-stack Real Login: login(token, userData)
      const tokenVal = first;
      const userData = second;
      
      const isDemoUser = userData.email && (
        userData.email.toLowerCase().includes('customer') || 
        userData.email.toLowerCase().includes('amit@example.com') || 
        userData.email.toLowerCase().includes('admin')
      );

      const isPhone = userData.email && /^\d{10}$/.test(userData.email.trim());

      const newUser: AppUser = {
        name: isDemoUser ? (userData.name || "Amit Kumar") : (userData.name || ""),
        email: isPhone ? "" : (userData.email || ""),
        phone: isPhone ? userData.email.trim() : (userData.phone || (isDemoUser ? "9876543210" : "")),
        pincode: userData.pincode || (isDemoUser ? "600001" : ""),
        address: userData.address || (isDemoUser ? "12, Anna Salai, Mount Road" : ""),
        city: userData.city || (isDemoUser ? "Chennai" : ""),
        state: userData.state || (isDemoUser ? "Tamil Nadu" : ""),
        superCoins: userData.superCoins !== undefined ? userData.superCoins : (isDemoUser ? 240 : 0),
        isMember: userData.isMember || 'none',
        role: userData.role || (userData.email && userData.email.toLowerCase().includes('admin') ? 'admin' : 'user'),
        profileCompleted: isDemoUser ? true : !!(userData.phone && userData.address && userData.pincode)
      };
      
      setUser(newUser);
      setToken(tokenVal);
      localStorage.setItem('amplify_token', tokenVal);
      localStorage.setItem('ind_ecom_user', JSON.stringify(newUser));
    } else {
      // Quick/Fake Login: login(email, name)
      const email = first;
      const name = second || "";
      const isAdminEmail = email && email.toLowerCase().includes('admin');
      const isDemoUser = email && (
        email.toLowerCase().includes('customer') || 
        email.toLowerCase().includes('amit@example.com') || 
        email.toLowerCase().includes('admin')
      );
      const isPhone = email && /^\d{10}$/.test(email.trim());
      
      const newUser: AppUser = {
        name: isDemoUser ? (name || "Amit Kumar") : name,
        email: isPhone ? "" : (email || ""),
        phone: isPhone ? email.trim() : (isDemoUser ? "9876543210" : ""),
        pincode: isDemoUser ? "600001" : "",
        address: isDemoUser ? "12, Anna Salai, Mount Road" : "",
        city: isDemoUser ? "Chennai" : "",
        state: isDemoUser ? "Tamil Nadu" : "",
        superCoins: isDemoUser ? 240 : 0,
        isMember: 'none',
        role: isAdminEmail ? 'admin' : 'user',
        profileCompleted: isDemoUser ? true : false
      };
      
      const mockToken = "mock_token_" + Math.random().toString(36).substring(2);
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('amplify_token', mockToken);
      localStorage.setItem('ind_ecom_user', JSON.stringify(newUser));
    }
  };

  const updateUser = (fields: Partial<AppUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...fields };
      // profile is completed if they have real name, phone, address, pincode, city, and state
      const hasRequired = !!(
        updated.name?.trim() &&
        updated.phone?.trim() &&
        updated.pincode?.trim() &&
        updated.address?.trim() &&
        updated.city?.trim() &&
        updated.state?.trim()
      );
      updated.profileCompleted = hasRequired;
      localStorage.setItem('ind_ecom_user', JSON.stringify(updated));
      return updated;
    });

    if (fields.pincode) {
      setPincodeState(`${fields.city || "Chennai"} ${fields.pincode}`);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ind_ecom_user');
    localStorage.removeItem('amplify_token');
    setActiveView('home');
  };

  const setPincode = (pin: string) => {
    setPincodeState(pin);
    if (user) {
      const updated = { ...user, pincode: pin.replace("Deliver to: ", "").trim() };
      setUser(updated);
      localStorage.setItem('ind_ecom_user', JSON.stringify(updated));
    }
  };

  const updateUserMembership = (membership: 'none' | 'plus' | 'prime') => {
    if (user) {
      const updated = { ...user, isMember: membership };
      setUser(updated);
      localStorage.setItem('ind_ecom_user', JSON.stringify(updated));
    }
  };

  const deductSuperCoins = (amount: number) => {
    if (user) {
      const updated = { ...user, superCoins: Math.max(0, user.superCoins - amount) };
      setUser(updated);
      localStorage.setItem('ind_ecom_user', JSON.stringify(updated));
    }
  };

  const addSuperCoins = (amount: number) => {
    if (user) {
      const updated = { ...user, superCoins: user.superCoins + amount };
      setUser(updated);
      localStorage.setItem('ind_ecom_user', JSON.stringify(updated));
    }
  };

  // Theme support
  useEffect(() => {
    localStorage.setItem('ind_ecom_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigate = (view: ActiveView, extraData?: { productId?: string }) => {
    setActiveView(view);
    if (extraData?.productId) {
      setSelectedProductId(extraData.productId);
      const found = INDIAN_PRODUCTS.find(p => p.id === extraData.productId);
      if (found) {
        setActiveProductDetail(found);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{
      user,
      activeView,
      selectedProductId,
      theme,
      pincode,
      token,
      currencySymbol: "₹",
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearch,
      searchHistory,
      addSearchQuery,
      removeSearchQuery,
      clearSearchHistory,
      compareList,
      toggleCompare,
      clearCompare,
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      moveToCart,
      orders,
      createNewOrder,
      activeProductDetail,
      setActiveProductDetail,
      login,
      logout,
      navigate,
      toggleTheme,
      setPincode,
      updateUserMembership,
      deductSuperCoins,
      addSuperCoins,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
