/**
 * Type Definitions for SmartBuy - Multi-Vendor E-Commerce Platform
 */

export interface User {
  id: string;
  name: string;
  email: string;
  image: string; // Avatar URL
  cart?: string; // Json representation of cart, defaulted to "{}"
  role: 'user' | 'admin';
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  description: string;
  username: string; // unique URL slug
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  logo: string;
  email: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number; // original price
  price: number; // selling price
  images: string[];
  category: string;
  inStock: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  
  // Optional client-side fields for easier UI parsing
  avgRating?: number;
  numReviews?: number;
}

export type OrderStatus = 'ORDER_PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'STRIPE';

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  userId: string;
  storeId: string;
  addressId: string;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  isCouponUsed: boolean;
  coupon: string; // JSON string representing Coupon info
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  
  // Client enrichment fields
  storeName?: string;
  customerName?: string;
  addressDetails?: Address;
}

export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  
  // Client enrichment fields
  productName?: string;
  productImage?: string;
  productCategory?: string;
}

export interface Rating {
  id: string;
  rating: number;
  review: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  
  // Client enrichment fields
  userName?: string;
  userImage?: string;
  productName?: string;
  productCategory?: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discount: number; // percentage, e.g., 10 = 10%
  forNewUser: boolean;
  forMember: boolean;
  isPublic: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalEarnings: number; // for store, totalSales/totalRevenue for admin
  totalOrders: number;
  totalRatings?: number; // for store
  totalStores?: number; // for admin
  orderTrends?: { date: string; orders: number; revenue: number }[];
}
