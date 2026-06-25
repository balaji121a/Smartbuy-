import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, User, Order, Coupon, Category, Rating, Address, Store, OrderStatus, PaymentMethod } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to ensure data directory and file exist
function initializeDB() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultData = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Write helper
function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Read helper
export function readDB(): {
  products: Product[];
  users: (User & { passwordHash?: string })[];
  orders: Order[];
  coupons: Coupon[];
  categories: Category[];
  stores: Store[];
  ratings: Rating[];
  addresses: Address[];
} {
  initializeDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Safety fallback for migrations
    if (!parsed.stores) parsed.stores = [];
    if (!parsed.ratings) parsed.ratings = [];
    if (!parsed.addresses) parsed.addresses = [];
    
    return parsed;
  } catch (err) {
    console.error("Error reading database file, resetting to seed data", err);
    const seeds = getSeedData();
    writeDB(seeds);
    return seeds as any;
  }
}

// Seed Data definition
function getSeedData() {
  const categories: Category[] = [
    {
      id: 'cat_electronics',
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      description: 'Premium gadgetry, sound systems, and accessories.'
    },
    {
      id: 'cat_fashion',
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
      description: 'Designer apparel, shoes, and luxury wear.'
    },
    {
      id: 'cat_home',
      name: 'Home & Living',
      slug: 'home-living',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80',
      description: 'Elegant home furnishings and decor.'
    },
    {
      id: 'cat_fitness',
      name: 'Fitness & Wellness',
      slug: 'fitness',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
      description: 'Smart wearables and premium gym equipment.'
    }
  ];

  const stores: Store[] = [
    {
      id: 'store_apex',
      userId: 'usr_seller1',
      name: 'Apex Electronics',
      description: 'Your premium technology partner. Genuine components, full warranty, and expert support.',
      username: 'apex',
      address: '77 Electro Way, Tech Park, CA 94107',
      status: 'approved',
      isActive: true,
      logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80',
      email: 'apex@example.com',
      contact: '+1 (555) 765-4321',
      createdAt: '2026-06-01T00:00:00Z',
      updatedAt: '2026-06-01T00:00:00Z'
    },
    {
      id: 'store_vogue',
      userId: 'usr_user1',
      name: 'Vogue Boutique',
      description: 'Curated designer apparel, luxury wear, and premium accessories.',
      username: 'vogue',
      address: '88 Fashion Plaza, Milan, Italy 20121',
      status: 'approved',
      isActive: true,
      logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&q=80',
      email: 'vogue@example.com',
      contact: '+1 (555) 121-2121',
      createdAt: '2026-06-05T00:00:00Z',
      updatedAt: '2026-06-05T00:00:00Z'
    },
    {
      id: 'store_pending1',
      userId: 'usr_seller2',
      name: 'Green Living Co.',
      description: 'Eco-friendly, sustainable lifestyle and home products.',
      username: 'greenliving',
      address: '10 Eco Dr, Seattle, WA 98101',
      status: 'pending',
      isActive: false,
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80',
      email: 'green@example.com',
      contact: '+1 (555) 323-2323',
      createdAt: '2026-06-20T00:00:00Z',
      updatedAt: '2026-06-20T00:00:00Z'
    }
  ];

  const products: Product[] = [
    {
      id: 'prod_anc_headphones',
      name: 'AcousticMax Pro ANC Headphones',
      description: 'Experience absolute acoustic isolation with state-of-the-art hybrid Active Noise Cancellation. Powered by custom 40mm dynamic drivers, delivering punchy bass and crystalline high notes. Features up to 45 hours of playback, quick USB-C charging, luxury memory foam ear cushions, and transparency mode.',
      mrp: 349,
      price: 299,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
      ],
      category: 'Electronics',
      inStock: true,
      storeId: 'store_apex',
      createdAt: '2026-06-10T00:00:00Z',
      updatedAt: '2026-06-10T00:00:00Z'
    },
    {
      id: 'prod_smartwatch_v3',
      name: 'Chronos Wearable Smartwatch V3',
      description: 'Elevate your fitness with the Chronos Smartwatch V3. Tracks heart rate variability, SpO2 blood oxygen, deep sleep cycles, and 120+ custom sports activities. Beautiful 1.43" AMOLED screen is visible under direct sunlight, featuring an aerospace-grade titanium bezel.',
      mrp: 229,
      price: 189,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80'
      ],
      category: 'Electronics',
      inStock: true,
      storeId: 'store_apex',
      createdAt: '2026-06-12T00:00:00Z',
      updatedAt: '2026-06-12T00:00:00Z'
    },
    {
      id: 'prod_trench_coat',
      name: 'Classic Double-Breasted Trench Coat',
      description: 'A timeless silhouette meticulously tailored from water-repellent cotton gabardine. This premium trench coat features classic storm flaps, adjustable belted cuffs, and a luxury checked inner lining.',
      mrp: 199,
      price: 149,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80'
      ],
      category: 'Fashion',
      inStock: true,
      storeId: 'store_vogue',
      createdAt: '2026-06-14T00:00:00Z',
      updatedAt: '2026-06-14T00:00:00Z'
    },
    {
      id: 'prod_ergonomic_chair',
      name: 'ErgoAlign Orthopedic Desk Chair',
      description: 'Redefine your work posture. Adaptive lumbar support system, fully adjustable 3D armrests, and an ultra-breathable mesh backrest. Durable aluminum base and smooth dual-wheel casters.',
      mrp: 399,
      price: 349,
      images: [
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&q=80',
        'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&q=80'
      ],
      category: 'Home & Living',
      inStock: true,
      storeId: 'store_apex',
      createdAt: '2026-06-15T00:00:00Z',
      updatedAt: '2026-06-15T00:00:00Z'
    },
    {
      id: 'prod_yoga_mat',
      name: 'ApexGrip Eco-Friendly Yoga Mat',
      description: 'High-performance, non-slip natural rubber yoga mat. Provides 6mm of premium high-density cushioning to support joints. 100% biodegradable and free of toxic PVCs.',
      mrp: 85,
      price: 65,
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      ],
      category: 'Fitness & Wellness',
      inStock: true,
      storeId: 'store_vogue',
      createdAt: '2026-06-16T00:00:00Z',
      updatedAt: '2026-06-16T00:00:00Z'
    },
    {
      id: 'prod_minimal_wallet',
      name: 'Titan Carbon Fiber Minimalist Wallet',
      description: 'Ditch the pocket bulge. Ultra-sleek wallet crafted from aerospace-grade carbon fiber and titanium. Active RFID-blocking technology shields you against digital skimming.',
      mrp: 69,
      price: 49,
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'
      ],
      category: 'Fashion',
      inStock: true,
      storeId: 'store_vogue',
      createdAt: '2026-06-17T00:00:00Z',
      updatedAt: '2026-06-17T00:00:00Z'
    },
    {
      id: 'prod_kettlebell',
      name: 'Cast Iron Adjustable Kettlebell',
      description: 'Adjustable kettlebell ranges from 5lbs to 40lbs in seconds using dial. Cast iron weight plates with solid safety locks and comfortable wide handle.',
      mrp: 150,
      price: 120,
      images: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80'
      ],
      category: 'Fitness & Wellness',
      inStock: true,
      storeId: 'store_vogue',
      createdAt: '2026-06-18T00:00:00Z',
      updatedAt: '2026-06-18T00:00:00Z'
    }
  ];

  const coupons: Coupon[] = [
    {
      code: 'GOCART10',
      description: '10% discount for all newcomers!',
      discount: 10,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: '2028-12-31T23:59:59Z',
      createdAt: '2026-06-01T00:00:00Z'
    },
    {
      code: 'MEMBER20',
      description: 'Exclusive 20% off for GoCart members!',
      discount: 20,
      forNewUser: false,
      forMember: true,
      isPublic: true,
      expiresAt: '2028-12-31T23:59:59Z',
      createdAt: '2026-06-01T00:00:00Z'
    },
    {
      code: 'SUPER50',
      description: 'Mid-season blockbuster sale: 50% flat off!',
      discount: 50,
      forNewUser: false,
      forMember: false,
      isPublic: true,
      expiresAt: '2028-12-31T23:59:59Z',
      createdAt: '2026-06-01T00:00:00Z'
    }
  ];

  const users = [
    {
      id: 'usr_admin1',
      name: 'Platform Admin',
      email: 'admin@example.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00Z',
      phone: '+1 (555) 123-4567',
      address: '100 Silicon Blvd, Suite 400, San Francisco, CA 94107',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // admin123
    },
    {
      id: 'usr_seller1',
      name: 'Sarah Seller',
      email: 'seller@example.com',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      role: 'user',
      createdAt: '2026-06-01T00:00:00Z',
      phone: '+1 (555) 765-4321',
      address: '77 Electro Way, Tech Park, CA 94107',
      passwordHash: 'f499846b0d9da9937397b914b1c834cb29b28b76fcb8aa8cfd79f04620b7849d' // seller123
    },
    {
      id: 'usr_user1',
      name: 'Alex Johnson',
      email: 'user@example.com',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      role: 'user',
      createdAt: '2026-03-15T00:00:00Z',
      phone: '+1 (555) 987-6543',
      address: '456 Elmwood Ave, Apartment 3B, New York, NY 10011',
      passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' // password123
    }
  ];

  const addresses: Address[] = [
    {
      id: 'addr_1',
      userId: 'usr_user1',
      name: 'Alex Johnson',
      email: 'user@example.com',
      street: '456 Elmwood Ave, Apt 3B',
      city: 'New York',
      state: 'NY',
      zip: '10011',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      createdAt: '2026-06-15T00:00:00Z'
    }
  ];

  const orders: Order[] = [
    {
      id: 'ord_sample1',
      total: 299,
      status: 'DELIVERED',
      userId: 'usr_user1',
      storeId: 'store_apex',
      addressId: 'addr_1',
      isPaid: true,
      paymentMethod: 'STRIPE',
      isCouponUsed: false,
      coupon: '{}',
      createdAt: '2026-06-20T14:32:00Z',
      updatedAt: '2026-06-20T14:32:00Z',
      orderItems: [
        {
          orderId: 'ord_sample1',
          productId: 'prod_anc_headphones',
          quantity: 1,
          price: 299
        }
      ]
    },
    {
      id: 'ord_sample2',
      total: 149,
      status: 'SHIPPED',
      userId: 'usr_user1',
      storeId: 'store_vogue',
      addressId: 'addr_1',
      isPaid: false,
      paymentMethod: 'COD',
      isCouponUsed: false,
      coupon: '{}',
      createdAt: '2026-06-21T11:20:00Z',
      updatedAt: '2026-06-21T11:20:00Z',
      orderItems: [
        {
          orderId: 'ord_sample2',
          productId: 'prod_trench_coat',
          quantity: 1,
          price: 149
        }
      ]
    }
  ];

  const ratings: Rating[] = [
    {
      id: 'rat_1',
      rating: 5,
      review: 'Stellar quality, truly professional ANC headphones! Very quiet backdrop and high-fidelity transients.',
      userId: 'usr_user1',
      productId: 'prod_anc_headphones',
      orderId: 'ord_sample1',
      createdAt: '2026-06-21T10:00:00Z',
      updatedAt: '2026-06-21T10:00:00Z'
    }
  ];

  return {
    products,
    users,
    orders,
    coupons,
    categories,
    stores,
    ratings,
    addresses
  };
}

// Low-level DB Accessors
export const db = {
  getProducts: () => readDB().products,
  setProducts: (prods: Product[]) => {
    const data = readDB();
    data.products = prods;
    writeDB(data);
  },

  getUsers: () => readDB().users,
  setUsers: (usrs: any[]) => {
    const data = readDB();
    data.users = usrs;
    writeDB(data);
  },

  getOrders: () => readDB().orders,
  setOrders: (ords: Order[]) => {
    const data = readDB();
    data.orders = ords;
    writeDB(data);
  },

  getCoupons: () => readDB().coupons,
  setCoupons: (coups: Coupon[]) => {
    const data = readDB();
    data.coupons = coups;
    writeDB(data);
  },

  getCategories: () => readDB().categories,
  setCategories: (cats: Category[]) => {
    const data = readDB();
    data.categories = cats;
    writeDB(data);
  },

  getStores: () => readDB().stores,
  setStores: (strs: Store[]) => {
    const data = readDB();
    data.stores = strs;
    writeDB(data);
  },

  getRatings: () => readDB().ratings,
  setRatings: (rats: Rating[]) => {
    const data = readDB();
    data.ratings = rats;
    writeDB(data);
  },

  getAddresses: () => readDB().addresses,
  setAddresses: (addrs: Address[]) => {
    const data = readDB();
    data.addresses = addrs;
    writeDB(data);
  }
};

// models
export const ProductModel = {
  find: async (filter?: { category?: string; search?: string; storeId?: string }) => {
    let prods = db.getProducts();
    if (filter?.storeId) {
      prods = prods.filter(p => p.storeId === filter.storeId);
    }
    if (filter?.category) {
      prods = prods.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return prods;
  },

  findById: async (id: string) => {
    return db.getProducts().find(p => p.id === id) || null;
  },

  create: async (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const prods = db.getProducts();
    const newProd: Product = {
      ...prodData,
      id: 'prod_' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    prods.push(newProd);
    db.setProducts(prods);
    return newProd;
  },

  update: async (id: string, updateData: Partial<Product>) => {
    const prods = db.getProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) return null;
    prods[idx] = { ...prods[idx], ...updateData, updatedAt: new Date().toISOString() };
    db.setProducts(prods);
    return prods[idx];
  },

  delete: async (id: string) => {
    const prods = db.getProducts();
    const filtered = prods.filter(p => p.id !== id);
    if (filtered.length === prods.length) return false;
    db.setProducts(filtered);
    return true;
  }
};

export const UserModel = {
  find: async () => {
    return db.getUsers();
  },

  findByEmail: async (email: string) => {
    return db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findById: async (id: string) => {
    return db.getUsers().find(u => u.id === id) || null;
  },

  create: async (userData: Omit<User, 'id' | 'createdAt'> & { passwordHash: string }) => {
    const users = db.getUsers();
    const newId = 'usr_' + crypto.randomBytes(4).toString('hex');
    const newUser: any = {
      ...userData,
      id: newId,
      image: userData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    db.setUsers(users);
    return newUser as User;
  },

  update: async (id: string, updateData: Partial<User>) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updateData };
    db.setUsers(users);
    return users[idx];
  }
};

export const StoreModel = {
  find: async (filter?: { status?: string; isActive?: boolean }) => {
    let strs = db.getStores();
    if (filter?.status) {
      strs = strs.filter(s => s.status === filter.status);
    }
    if (filter?.isActive !== undefined) {
      strs = strs.filter(s => s.isActive === filter.isActive);
    }
    return strs;
  },

  findById: async (id: string) => {
    return db.getStores().find(s => s.id === id) || null;
  },

  findByUserId: async (userId: string) => {
    return db.getStores().find(s => s.userId === userId) || null;
  },

  findByUsername: async (username: string) => {
    return db.getStores().find(s => s.username.toLowerCase() === username.toLowerCase()) || null;
  },

  create: async (storeData: Omit<Store, 'id' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    const strs = db.getStores();
    
    // Check uniqueness of username
    const exists = strs.some(s => s.username.toLowerCase() === storeData.username.toLowerCase());
    if (exists) {
      throw new Error("Store username slug already exists.");
    }

    const newStore: Store = {
      ...storeData,
      id: 'store_' + crypto.randomBytes(4).toString('hex'),
      status: 'pending',
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    strs.push(newStore);
    db.setStores(strs);
    return newStore;
  },

  update: async (id: string, updateData: Partial<Store>) => {
    const strs = db.getStores();
    const idx = strs.findIndex(s => s.id === id);
    if (idx === -1) return null;
    strs[idx] = { ...strs[idx], ...updateData, updatedAt: new Date().toISOString() };
    db.setStores(strs);
    return strs[idx];
  },

  approve: async (id: string) => {
    const strs = db.getStores();
    const idx = strs.findIndex(s => s.id === id);
    if (idx === -1) return null;
    strs[idx].status = 'approved';
    strs[idx].isActive = true;
    strs[idx].updatedAt = new Date().toISOString();
    db.setStores(strs);
    return strs[idx];
  },

  reject: async (id: string) => {
    const strs = db.getStores();
    const idx = strs.findIndex(s => s.id === id);
    if (idx === -1) return null;
    strs[idx].status = 'rejected';
    strs[idx].isActive = false;
    strs[idx].updatedAt = new Date().toISOString();
    db.setStores(strs);
    return strs[idx];
  },

  toggleActive: async (id: string) => {
    const strs = db.getStores();
    const idx = strs.findIndex(s => s.id === id);
    if (idx === -1) return null;
    strs[idx].isActive = !strs[idx].isActive;
    strs[idx].updatedAt = new Date().toISOString();
    db.setStores(strs);
    return strs[idx];
  }
};

export const OrderModel = {
  find: async (filters?: { userId?: string; storeId?: string }) => {
    let ords = db.getOrders();
    if (filters?.userId) {
      ords = ords.filter(o => o.userId === filters.userId);
    }
    if (filters?.storeId) {
      ords = ords.filter(o => o.storeId === filters.storeId);
    }
    return ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById: async (id: string) => {
    return db.getOrders().find(o => o.id === id) || null;
  },

  create: async (orderData: Omit<Order, 'id' | 'status' | 'isPaid' | 'createdAt' | 'updatedAt'>) => {
    const ords = db.getOrders();
    const newId = 'ord_' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'ORDER_PLACED',
      isPaid: orderData.paymentMethod === 'STRIPE', // If STRIPE, paid immediately. If COD, false.
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    ords.push(newOrder);
    db.setOrders(ords);

    // Deduct stock for each item in the order
    const prods = db.getProducts();
    orderData.orderItems.forEach(item => {
      const pIdx = prods.findIndex(p => p.id === item.productId);
      if (pIdx !== -1) {
        // Stock field was stock in old DB, we can use inStock check
        // Let's update stock if needed, or simply deduct if we track stock levels.
        // GoCart products specify inStock boolean, but let's keep track of simple status
      }
    });

    return newOrder;
  },

  updateStatus: async (id: string, status: OrderStatus, isPaid?: boolean) => {
    const ords = db.getOrders();
    const idx = ords.findIndex(o => o.id === id);
    if (idx === -1) return null;
    ords[idx].status = status;
    if (isPaid !== undefined) {
      ords[idx].isPaid = isPaid;
    }
    ords[idx].updatedAt = new Date().toISOString();
    db.setOrders(ords);
    return ords[idx];
  }
};

export const RatingModel = {
  find: async (filters?: { productId?: string; userId?: string; storeId?: string }) => {
    let rats = db.getRatings();
    
    if (filters?.productId) {
      rats = rats.filter(r => r.productId === filters.productId);
    }
    if (filters?.userId) {
      rats = rats.filter(r => r.userId === filters.userId);
    }
    if (filters?.storeId) {
      const storeProds = db.getProducts().filter(p => p.storeId === filters.storeId).map(p => p.id);
      rats = rats.filter(r => storeProds.includes(r.productId));
    }
    
    return rats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: async (ratingData: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>) => {
    const rats = db.getRatings();
    
    // Check rating constraint: A user can only rate a product once per order
    const exists = rats.some(r => r.userId === ratingData.userId && r.productId === ratingData.productId && r.orderId === ratingData.orderId);
    if (exists) {
      throw new Error("You have already submitted a rating for this product on this order.");
    }

    const newRating: Rating = {
      ...ratingData,
      id: 'rat_' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    rats.push(newRating);
    db.setRatings(rats);
    return newRating;
  }
};

export const AddressModel = {
  find: async (filters?: { userId?: string }) => {
    let addrs = db.getAddresses();
    if (filters?.userId) {
      addrs = addrs.filter(a => a.userId === filters.userId);
    }
    return addrs;
  },

  findById: async (id: string) => {
    return db.getAddresses().find(a => a.id === id) || null;
  },

  create: async (addressData: Omit<Address, 'id' | 'createdAt'>) => {
    const addrs = db.getAddresses();
    const newAddr: Address = {
      ...addressData,
      id: 'addr_' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString()
    };
    addrs.push(newAddr);
    db.setAddresses(addrs);
    return newAddr;
  },

  delete: async (id: string) => {
    const addrs = db.getAddresses();
    const filtered = addrs.filter(a => a.id !== id);
    if (filtered.length === addrs.length) return false;
    db.setAddresses(filtered);
    return true;
  }
};

export const CouponModel = {
  find: async () => {
    return db.getCoupons();
  },

  findByCode: async (code: string) => {
    const coupons = db.getCoupons();
    const normalized = code.toUpperCase();
    return coupons.find(c => c.code.toUpperCase() === normalized) || null;
  },

  create: async (couponData: Coupon) => {
    const coupons = db.getCoupons();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === couponData.code.toUpperCase());
    if (idx !== -1) {
      coupons[idx] = couponData;
    } else {
      coupons.push(couponData);
    }
    db.setCoupons(coupons);
    return couponData;
  },

  delete: async (code: string) => {
    const coupons = db.getCoupons();
    const filtered = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    if (filtered.length === coupons.length) return false;
    db.setCoupons(filtered);
    return true;
  }
};

export const CategoryModel = {
  find: async () => {
    return db.getCategories();
  },

  create: async (categoryData: Omit<Category, 'id'>) => {
    const cats = db.getCategories();
    const newCat: Category = {
      ...categoryData,
      id: 'cat_' + categoryData.slug
    };
    cats.push(newCat);
    db.setCategories(cats);
    return newCat;
  },

  delete: async (id: string) => {
    const cats = db.getCategories();
    const filtered = cats.filter(c => c.id !== id);
    if (filtered.length === cats.length) return false;
    db.setCategories(filtered);
    return true;
  }
};
