import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { 
  ProductModel, 
  UserModel, 
  StoreModel,
  OrderModel, 
  RatingModel,
  AddressModel,
  CouponModel, 
  CategoryModel, 
  db,
  readDB
} from "./server/db";
import { 
  hashPassword, 
  comparePassword, 
  signToken, 
  authMiddleware, 
  adminMiddleware, 
  AuthenticatedRequest 
} from "./server/auth";

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Ensure default demo users have passwords properly hashed.
  // SECURITY: these well-known demo passwords are only ever seeded outside production,
  // so a real deployment never ships with guessable admin/seller/user credentials.
  if (process.env.NODE_ENV !== "production") {
    try {
      const users = db.getUsers();
      let updated = false;
      users.forEach((u: any) => {
        if (u.id === 'usr_admin1' && !u.passwordHash) {
          u.passwordHash = hashPassword('admin123');
          updated = true;
        }
        if (u.id === 'usr_user1' && !u.passwordHash) {
          u.passwordHash = hashPassword('user123');
          updated = true;
        }
        if (u.id === 'usr_seller1' && !u.passwordHash) {
          u.passwordHash = hashPassword('seller123');
          updated = true;
        }
      });
      if (updated) {
        db.setUsers(users);
      }
    } catch (err) {
      console.error("Failed to setup initial hashed passwords:", err);
    }
  }

  // ==========================================
  // AUTHENTICATION APIs
  // ==========================================

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
      }

      const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }

      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists." });
      }

      const passwordHash = hashPassword(password);
      const user = await UserModel.create({
        name,
        email,
        role: 'user', // Default registered users are regular customers
        phone: '',
        address: '',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        passwordHash
      });

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      res.status(201).json({
        message: "Registration successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Registration failed" });
    }
  });

  // Simple in-memory rate limiter for login attempts (prevents brute-force password guessing).
  // Keyed by IP + email; resets after the window expires.
  const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const LOGIN_ATTEMPT_MAX = 8;
  const loginAttempts = new Map<string, { count: number; windowStart: number }>();

  function isLoginRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = loginAttempts.get(key);
    if (!entry || now - entry.windowStart > LOGIN_ATTEMPT_WINDOW_MS) {
      loginAttempts.set(key, { count: 1, windowStart: now });
      return false;
    }
    entry.count += 1;
    return entry.count > LOGIN_ATTEMPT_MAX;
  }

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const rateLimitKey = `${req.ip}:${String(email).toLowerCase()}`;
      if (isLoginRateLimited(rateLimitKey)) {
        return res.status(429).json({ message: "Too many login attempts. Please try again in a few minutes." });
      }

      const user: any = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const isMatch = comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      
      // Look up store if any
      const store = await StoreModel.findByUserId(user.id);

      res.json({
        message: "Login successful",
        token,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          phone: user.phone, 
          address: user.address,
          image: user.image,
          storeId: store ? store.id : null,
          storeStatus: store ? store.status : null,
          storeUsername: store ? store.username : null
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Login failed" });
    }
  });

  // Get current user profile
  app.get("/api/auth/profile", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User profile not found." });
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch profile." });
    }
  });

  // Update profile
  app.put("/api/auth/profile", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, phone, address } = req.body;
      const updated = await UserModel.update(req.user!.id, { name, phone, address });
      if (!updated) {
        return res.status(404).json({ message: "User profile not found." });
      }
      res.json({ message: "Profile updated successfully", user: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to update profile." });
    }
  });

  // ==========================================
  // PRODUCTS APIs
  // ==========================================

  // Get products
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;
      const storeId = req.query.storeId as string;
      const sortBy = req.query.sortBy as string || 'default';

      let products = await ProductModel.find({ category, search, storeId });

      // Enrich products with avg rating and num reviews
      const ratings = db.getRatings();
      products = products.map(p => {
        const prodRatings = ratings.filter(r => r.productId === p.id);
        const avg = prodRatings.length ? parseFloat((prodRatings.reduce((sum, r) => sum + r.rating, 0) / prodRatings.length).toFixed(1)) : 5.0;
        return {
          ...p,
          avgRating: avg,
          numReviews: prodRatings.length
        };
      });

      // Apply sorting
      if (sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        products.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
      }

      res.json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch products." });
    }
  });

  // Get product by id (includes full store details and reviews)
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      // Fetch rating reviews
      const ratings = await RatingModel.find({ productId: product.id });
      const users = db.getUsers();
      
      const enrichedReviews = ratings.map(r => {
        const u = users.find(usr => usr.id === r.userId);
        return {
          id: r.id,
          username: u ? u.name : "Verified Customer",
          userImage: u ? u.image : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
          rating: r.rating,
          comment: r.review,
          date: r.createdAt.split('T')[0]
        };
      });

      const avgRating = ratings.length ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)) : 5.0;
      
      // Fetch store details
      const store = await StoreModel.findById(product.storeId);

      res.json({
        ...product,
        avgRating,
        numReviews: ratings.length,
        reviews: enrichedReviews,
        store: store ? { id: store.id, name: store.name, username: store.username, logo: store.logo, description: store.description } : null
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch product." });
    }
  });

  // Post public product review
  app.post("/api/products/:id/review", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { rating, comment } = req.body;
      if (!rating || !comment) {
        return res.status(400).json({ message: "Rating and comment are required." });
      }

      const ratingRecord = await RatingModel.create({
        userId: req.user!.id,
        productId: req.params.id,
        orderId: 'public_review_' + crypto.randomBytes(4).toString('hex'),
        rating: parseInt(rating),
        review: comment
      });

      res.status(201).json({
        message: "Review submitted successfully!",
        rating: ratingRecord
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to submit review." });
    }
  });

  // ==========================================
  // STORES APIs
  // ==========================================

  // List all approved & active stores
  app.get("/api/stores", async (req, res) => {
    try {
      const search = req.query.search as string;
      let stores = await StoreModel.find({ status: 'approved', isActive: true });
      
      if (search) {
        const q = search.toLowerCase();
        stores = stores.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }

      res.json(stores);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch stores." });
    }
  });

  // Get individual store details + its products
  app.get("/api/stores/:username", async (req, res) => {
    try {
      const store = await StoreModel.findByUsername(req.params.username);
      if (!store) {
        return res.status(404).json({ message: "Store not found." });
      }

      // Products belonging to this store
      let products = await ProductModel.find({ storeId: store.id });
      
      // Enrich products with average ratings
      const ratings = db.getRatings();
      products = products.map(p => {
        const prodRatings = ratings.filter(r => r.productId === p.id);
        const avg = prodRatings.length ? parseFloat((prodRatings.reduce((sum, r) => sum + r.rating, 0) / prodRatings.length).toFixed(1)) : 5.0;
        return {
          ...p,
          avgRating: avg,
          numReviews: prodRatings.length
        };
      });

      res.json({
        store,
        products
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch store detail." });
    }
  });

  // Register store (pending status)
  app.post("/api/store/register", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, username, email, contact, logo, description, address } = req.body;
      if (!name || !username || !email || !contact || !description || !address) {
        return res.status(400).json({ message: "All store fields are required." });
      }

      // Check if user already owns a store
      const existingStore = await StoreModel.findByUserId(req.user!.id);
      if (existingStore) {
        return res.status(400).json({ message: "You have already registered a store for this account." });
      }

      const store = await StoreModel.create({
        userId: req.user!.id,
        name,
        username: username.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        email,
        contact,
        logo: logo || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80',
        description,
        address
      });

      res.status(201).json({
        message: "Store registration pending approval.",
        store
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to register store." });
    }
  });

  // Get currently logged in user's store
  app.get("/api/store/my-store", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(404).json({ message: "No store found for this user." });
      }
      res.json(store);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch seller store." });
    }
  });

  // ==========================================
  // CATEGORIES APIs
  // ==========================================

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await CategoryModel.find();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch categories." });
    }
  });

  // ==========================================
  // COUPONS APIs
  // ==========================================

  // Validate Coupon
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, subtotal, isNewUser, isMember } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Coupon code is required." });
      }

      const coupon = await CouponModel.findByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon code does not exist." });
      }

      // Check Expiration
      if (new Date(coupon.expiresAt).getTime() < Date.now()) {
        return res.status(400).json({ message: "This coupon code has expired." });
      }

      // New User Constraint
      if (coupon.forNewUser && !isNewUser) {
        return res.status(400).json({ message: "This coupon is only available for new users." });
      }

      // Member Constraint
      if (coupon.forMember && !isMember) {
        return res.status(400).json({ message: "This coupon is reserved for platform members." });
      }

      const discountAmount = parseFloat(((subtotal * coupon.discount) / 100).toFixed(2));
      res.json({
        message: "Coupon validated and applied successfully!",
        code: coupon.code,
        discount: coupon.discount,
        discountAmount,
        description: coupon.description
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to validate coupon." });
    }
  });

  // ==========================================
  // ADDRESSES APIs
  // ==========================================

  // Fetch addresses for logged in user
  app.get("/api/addresses", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const list = await AddressModel.find({ userId: req.user!.id });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load addresses." });
    }
  });

  // Create delivery address
  app.post("/api/addresses", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, email, street, city, state, zip, country, phone } = req.body;
      if (!name || !email || !street || !city || !state || !zip || !country || !phone) {
        return res.status(400).json({ message: "All address specifications are required." });
      }

      const addr = await AddressModel.create({
        userId: req.user!.id,
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone
      });

      res.status(201).json({ message: "Address added successfully", address: addr });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to add address." });
    }
  });

  // Delete address
  app.delete("/api/addresses/:id", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await AddressModel.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Address not found." });
      }
      res.json({ message: "Address deleted successfully." });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to delete address." });
    }
  });

  // ==========================================
  // ORDER PLACEMENT & MY ORDERS
  // ==========================================

  // Create order(s) - partitions cart items by vendor store!
  app.post("/api/orders", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { cartItems, addressId, paymentMethod, couponCode, couponDiscountPercent } = req.body;
      // cartItems is an array: { productId: string, quantity: number, price: number }
      
      if (!cartItems || !cartItems.length || !addressId || !paymentMethod) {
        return res.status(400).json({ message: "Missing order components." });
      }

      const address = await AddressModel.findById(addressId);
      if (!address) {
        return res.status(400).json({ message: "Delivery address selection invalid." });
      }

      // Group cart items by their associated products' storeId
      const productsInDB = db.getProducts();
      const itemsByStore: Record<string, typeof cartItems> = {};

      for (const item of cartItems) {
        const prod = productsInDB.find(p => p.id === item.productId);
        if (!prod) {
          return res.status(400).json({ message: `Product ${item.name || item.productId} no longer exists.` });
        }
        const storeId = prod.storeId;
        if (!itemsByStore[storeId]) {
          itemsByStore[storeId] = [];
        }
        itemsByStore[storeId].push({
          ...item,
          price: prod.price, // ensure price integrity from database
          name: prod.name,
          image: prod.images[0],
          category: prod.category
        });
      }

      const placedOrders: any[] = [];

      // Create a separate order record for each store (Multi-vendor design!)
      for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
        const subtotal = storeItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        let discount = 0;
        if (couponDiscountPercent) {
          discount = parseFloat(((subtotal * couponDiscountPercent) / 100).toFixed(2));
        }
        const total = subtotal - discount;

        const orderItems = storeItems.map((item: any) => ({
          orderId: '', // populated below
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }));

        const order = await OrderModel.create({
          userId: req.user!.id,
          storeId,
          addressId,
          total,
          paymentMethod,
          isCouponUsed: !!couponCode,
          coupon: couponCode ? JSON.stringify({ code: couponCode, discount: couponDiscountPercent }) : '{}',
          orderItems
        });

        // Map orderId back into items in our local db structure
        const ords = db.getOrders();
        const oIdx = ords.findIndex(o => o.id === order.id);
        if (oIdx !== -1) {
          ords[oIdx].orderItems = ords[oIdx].orderItems.map(item => ({ ...item, orderId: order.id }));
          db.setOrders(ords);
          order.orderItems = ords[oIdx].orderItems;
        }

        placedOrders.push(order);
      }

      res.status(201).json({
        message: "Checkout successful. Order placed!",
        orders: placedOrders
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to checkout order." });
    }
  });

  // Fetch my orders with nested data
  app.get("/api/orders/my-orders", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const orders = await OrderModel.find({ userId: req.user!.id });
      const stores = db.getStores();
      const products = db.getProducts();
      const addresses = db.getAddresses();

      const enriched = orders.map(o => {
        const store = stores.find(s => s.id === o.storeId);
        const address = addresses.find(a => a.id === o.addressId);
        
        const enrichedItems = o.orderItems.map(item => {
          const prod = products.find(p => p.id === item.productId);
          return {
            ...item,
            productName: prod ? prod.name : "Deleted Product",
            productImage: prod ? prod.images[0] : "",
            productCategory: prod ? prod.category : ""
          };
        });

        return {
          ...o,
          storeName: store ? store.name : "SmartBuy Vendor",
          addressDetails: address,
          orderItems: enrichedItems
        };
      });

      res.json(enriched);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load orders." });
    }
  });

  // Submit product review & rating
  app.post("/api/orders/rate", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { orderId, productId, rating, review } = req.body;
      if (!orderId || !productId || !rating || !review) {
        return res.status(400).json({ message: "All rating metrics are required." });
      }

      // Check if order exists and is delivered
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
      if (order.status !== 'DELIVERED') {
        return res.status(400).json({ message: "Ratings can only be submitted for delivered orders." });
      }

      // Create rating
      const ratingRecord = await RatingModel.create({
        userId: req.user!.id,
        productId,
        orderId,
        rating: parseInt(rating),
        review
      });

      res.status(201).json({
        message: "Thank you for your rating!",
        rating: ratingRecord
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to submit rating." });
    }
  });

  // ==========================================
  // SELLER/VENDOR DASHBOARD & MANAGEMENT APIs
  // ==========================================

  // Seller stats + reviews
  app.get("/api/seller/stats", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Store not found. Please register a store." });
      }

      const products = db.getProducts().filter(p => p.storeId === store.id);
      const orders = db.getOrders().filter(o => o.storeId === store.id);
      const ratings = await RatingModel.find({ storeId: store.id });
      const users = db.getUsers();

      // Total earnings from delivered and paid orders
      const earnings = orders
        .filter(o => o.isPaid)
        .reduce((sum, o) => sum + o.total, 0);

      const reviewsList = ratings.map(r => {
        const u = users.find(usr => usr.id === r.userId);
        const p = products.find(prod => prod.id === r.productId);
        return {
          id: r.id,
          rating: r.rating,
          review: r.review,
          createdAt: r.createdAt,
          userName: u ? u.name : "Anonymous Buyer",
          userImage: u ? u.image : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
          productName: p ? p.name : "Product",
          productCategory: p ? p.category : "Electronics",
          productId: r.productId
        };
      });

      res.json({
        totalProducts: products.length,
        totalEarnings: parseFloat(earnings.toFixed(2)),
        totalOrders: orders.length,
        totalRatings: ratings.length,
        reviews: reviewsList
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load seller stats." });
    }
  });

  // Seller products listing
  app.get("/api/seller/products", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Store required." });
      }
      const products = await ProductModel.find({ storeId: store.id });
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch seller products." });
    }
  });

  // Seller add product
  app.post("/api/seller/products", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Approved store required." });
      }

      const { name, description, mrp, price, category, images, inStock } = req.body;
      if (!name || !description || !mrp || !price || !category) {
        return res.status(400).json({ message: "All product parameters are required." });
      }

      const product = await ProductModel.create({
        name,
        description,
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        category,
        images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
        inStock: inStock !== undefined ? inStock : true,
        storeId: store.id
      });

      res.status(201).json({ message: "Product created successfully", product });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to add product." });
    }
  });

  // Seller update product
  app.put("/api/seller/products/:id", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Store required." });
      }

      const product = await ProductModel.findById(req.params.id);
      if (!product || product.storeId !== store.id) {
        return res.status(403).json({ message: "Unauthorized. You do not own this product." });
      }

      const updated = await ProductModel.update(req.params.id, req.body);
      res.json({ message: "Product updated successfully", product: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to update product." });
    }
  });

  // Seller delete product
  app.delete("/api/seller/products/:id", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Store required." });
      }

      const product = await ProductModel.findById(req.params.id);
      if (!product || product.storeId !== store.id) {
        return res.status(403).json({ message: "Unauthorized. You do not own this product." });
      }

      await ProductModel.delete(req.params.id);
      res.json({ message: "Product deleted successfully." });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to delete product." });
    }
  });

  // Seller orders listing
  app.get("/api/seller/orders", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Store required." });
      }

      const orders = await OrderModel.find({ storeId: store.id });
      const users = db.getUsers();
      const products = db.getProducts();
      const addresses = db.getAddresses();

      const enriched = orders.map(o => {
        const customer = users.find(u => u.id === o.userId);
        const address = addresses.find(a => a.id === o.addressId);
        
        const enrichedItems = o.orderItems.map(item => {
          const prod = products.find(p => p.id === item.productId);
          return {
            ...item,
            productName: prod ? prod.name : "Deleted Product",
            productImage: prod ? prod.images[0] : "",
            productCategory: prod ? prod.category : ""
          };
        });

        return {
          ...o,
          customerName: customer ? customer.name : "SmartBuy Customer",
          addressDetails: address,
          orderItems: enrichedItems
        };
      });

      res.json(enriched);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch seller orders." });
    }
  });

  // Seller update order status
  app.put("/api/seller/orders/:id/status", authMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.findByUserId(req.user!.id);
      if (!store) {
        return res.status(403).json({ message: "Store required." });
      }

      const order = await OrderModel.findById(req.params.id);
      if (!order || order.storeId !== store.id) {
        return res.status(403).json({ message: "Unauthorized. You do not own this order." });
      }

      const { status } = req.body; // ORDER_PLACED, PROCESSING, SHIPPED, DELIVERED
      if (!status) {
        return res.status(400).json({ message: "Order status is required." });
      }

      const isPaid = status === 'DELIVERED' ? true : order.isPaid;
      const updatedOrder = await OrderModel.updateStatus(order.id, status, isPaid);

      res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to update order status." });
    }
  });

  // ==========================================
  // ADMIN DASHBOARD & MANAGEMENT APIs
  // ==========================================

  // Admin stats (Total Products, Total Revenue, Total Orders, Total Stores, trends)
  app.get("/api/admin/stats", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const products = db.getProducts();
      const orders = db.getOrders();
      const stores = db.getStores();

      const totalRevenue = orders
        .filter(o => o.isPaid)
        .reduce((sum, o) => sum + o.total, 0);

      // Recharts AreaChart trends
      const orderTrends = [
        { date: 'Jun 18', orders: 4, revenue: 450 },
        { date: 'Jun 19', orders: 6, revenue: 890 },
        { date: 'Jun 20', orders: 8, revenue: 1200 },
        { date: 'Jun 21', orders: 12, revenue: 1650 },
        { date: 'Jun 22', orders: 15, revenue: 2100 },
        { date: 'Jun 23', orders: orders.length, revenue: totalRevenue }
      ];

      res.json({
        totalProducts: products.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        totalStores: stores.length,
        orderTrends
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load admin stats." });
    }
  });

  // List pending stores
  app.get("/api/admin/stores/pending", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const pending = await StoreModel.find({ status: 'pending' });
      res.json(pending);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load pending stores." });
    }
  });

  // List all stores
  app.get("/api/admin/stores", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const stores = await StoreModel.find();
      res.json(stores);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load stores list." });
    }
  });

  // Approve store
  app.put("/api/admin/stores/:id/approve", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.approve(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found." });
      }
      res.json({ message: "Store approved successfully", store });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to approve store." });
    }
  });

  // Reject store
  app.put("/api/admin/stores/:id/reject", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.reject(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found." });
      }
      res.json({ message: "Store rejected successfully", store });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to reject store." });
    }
  });

  // Toggle store active switch
  app.put("/api/admin/stores/:id/toggle", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const store = await StoreModel.toggleActive(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found." });
      }
      res.json({ message: "Store active status toggled successfully", store });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to toggle store status." });
    }
  });

  // Admin coupon list
  app.get("/api/admin/coupons", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const list = await CouponModel.find();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to load coupons." });
    }
  });

  // Admin add coupon
  app.post("/api/admin/coupons", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const { code, description, discount, forNewUser, forMember, isPublic, expiresAt } = req.body;
      if (!code || !description || !discount || !expiresAt) {
        return res.status(400).json({ message: "All coupon metrics are required." });
      }

      const coupon = await CouponModel.create({
        code: code.toUpperCase(),
        description,
        discount: parseFloat(discount),
        forNewUser: !!forNewUser,
        forMember: !!forMember,
        isPublic: isPublic !== undefined ? !!isPublic : true,
        expiresAt,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ message: "Coupon created successfully", coupon });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to create coupon." });
    }
  });

  // Admin delete coupon
  app.delete("/api/admin/coupons/:code", adminMiddleware as any, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await CouponModel.delete(req.params.code);
      if (!success) {
        return res.status(404).json({ message: "Coupon not found." });
      }
      res.json({ message: "Coupon deleted successfully." });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to delete coupon." });
    }
  });

  // ==========================================
  // VITE & STATIC FILES SERVING MIDDLEWARE
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SmartBuy Server] running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Express server:", err);
});
