import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import { 
  Heart, 
  ShoppingCart, 
  ChevronLeft, 
  Check, 
  MessageSquare, 
  Star, 
  User as UserIcon, 
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Store as StoreIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function ProductDetailView() {
  const { selectedProductId, navigate, token, currencySymbol, addToCart } = useApp();

  const [product, setProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Write Review form states
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [postingReview, setPostingReview] = useState(false);

  const loadProductData = useCallback(async () => {
    if (!selectedProductId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${selectedProductId}`);
      if (res.ok) {
        const prod = await res.json();
        setProduct(prod);
        setActiveImage(prod.images[0]);

        // Fetch related products
        const catRes = await fetch(`/api/products?category=${prod.category}`);
        if (catRes.ok) {
          const list: Product[] = await catRes.json();
          setRelated(list.filter(p => p.id !== prod.id).slice(0, 4));
        }
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error("Failed to load product details", err);
    } finally {
      setLoading(false);
    }
  }, [selectedProductId]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !product) return;

    try {
      setPostingReview(true);
      if (!token) {
        toast.error("Please log in to submit a review.");
        navigate('login');
        return;
      }

      const res = await fetch(`/api/products/${product.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: ratingInput, comment: commentInput })
      });

      if (res.ok) {
        toast.success("Review posted successfully!");
        setCommentInput('');
        setRatingInput(5);
        // Refresh product details
        loadProductData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("Failed to contact the server.");
    } finally {
      setPostingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!product.inStock) {
      toast.error("Product is currently out of stock.");
      return;
    }

    addToCart(product, quantity);
    toast.success(`Added ${quantity} of ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse space-y-8" id="detail-skeleton">
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-5 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900" id="detail-notfound">
        <ShieldAlert className="h-12 w-12 text-zinc-400 mx-auto" />
        <h3 className="mt-4 text-sm font-bold text-zinc-800 dark:text-zinc-200">Product Not Found</h3>
        <p className="text-xs text-zinc-400 mt-1">This product ID does not exist or has been removed from the catalog.</p>
        <button onClick={() => navigate('home')} className="mt-4 rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold text-white cursor-pointer">
          Go back to Home
        </button>
      </div>
    );
  }

  const discount = product.mrp && product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="space-y-12 pb-16" id="product-detail-view-container">
      {/* Return button */}
      <button 
        onClick={() => {
          if (product.store?.username) {
            navigate('shop-detail', { storeUsername: product.store.username });
          } else {
            navigate('shop');
          }
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-blue-600 cursor-pointer transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Seller Store
      </button>

      {/* Main product card spec */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
      >
        
        {/* LEFT PANEL: Dynamic Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={activeImage} 
                alt={product.name} 
                referrerPolicy="no-referrer"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="max-h-full max-w-full object-contain p-4"
              />
            </AnimatePresence>
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="absolute top-4 left-4 rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wider"
              >
                {discount}% OFF
              </motion.span>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img: string, i: number) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveImage(img)}
                  className={`h-14 w-14 overflow-hidden rounded-lg border bg-white flex-shrink-0 transition-colors cursor-pointer ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800'}`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">{product.category}</span>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <RatingStars rating={product.avgRating || 5.0} count={product.numReviews} size={14} />
              
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
              
              {/* Stock status indicator */}
              {!product.inStock ? (
                <span className="text-xs font-bold text-red-500">Currently Sold Out</span>
              ) : (
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  In Stock & Verified
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-b border-zinc-100 dark:border-zinc-800/60 py-4 flex items-baseline gap-3">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{currencySymbol}{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-sm text-zinc-400 line-through dark:text-zinc-500">{currencySymbol}{product.mrp}</span>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                  Save {currencySymbol}{(product.mrp - product.price).toFixed(0)}
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">{product.description}</p>

          {/* Connected Store block */}
          {product.store && (
            <div 
              onClick={() => navigate('shop-detail', { storeUsername: product.store.username })}
              className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 cursor-pointer transition-all"
            >
              <img 
                src={product.store.logo || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80'} 
                alt={product.store.name}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Sold by</p>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 hover:text-blue-600 transition-colors">
                  {product.store.name}
                  <StoreIcon className="h-3 w-3 text-blue-600" />
                </h4>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </div>
          )}

          {/* Cart triggers */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {/* Quantity */}
            {product.inStock && (
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="h-10 w-10 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="h-10 w-10 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                >
                  +
                </button>
              </div>
            )}

            {/* Cart Button */}
            <motion.button
              id="add-to-cart-cta"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              whileHover={product.inStock ? { scale: 1.02 } : {}}
              whileTap={product.inStock ? { scale: 0.97 } : {}}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-xs font-bold transition-colors cursor-pointer ${!product.inStock ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800' : 'bg-[#2874f0] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10'}`}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Shopping Cart
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* REVIEWS & SUBMISSION SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-zinc-100 dark:border-zinc-800/80 pt-10">
        
        {/* Left: Overall Ratings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="h-4.5 w-4.5 text-blue-600" />
            Customer Ratings
          </h3>
          <div className="rounded-2xl border border-zinc-150 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 text-center space-y-2">
            <p className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{product.avgRating?.toFixed(1) || '5.0'}</p>
            <div className="flex justify-center">
              <RatingStars rating={product.avgRating || 5.0} size={15} />
            </div>
            <p className="text-[10px] text-zinc-400">Based on {product.numReviews} store reviews.</p>
          </div>
        </div>

        {/* Center: List of reviews & form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Verified Customer Comments ({product.reviews?.length || 0})</h4>
            
            {!product.reviews || product.reviews.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No reviews have been submitted for this product yet. Be the first to leave a review!</p>
            ) : (
              <div className="space-y-4 divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {product.reviews.map((rev: any, idx: number) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.3) }}
                    className="pt-4 first:pt-0 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={rev.userImage} 
                          alt={rev.username} 
                          referrerPolicy="no-referrer"
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{rev.username}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>
                    <RatingStars rating={rev.rating} size={11} />
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">{rev.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Form to submit review */}
          <div className="rounded-2xl border border-zinc-100 p-5 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/10 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Submit Your Review</h4>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Your Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRatingInput(idx)}
                      className="text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star className={`h-6 w-6 ${ratingInput >= idx ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Share your experience</label>
                <textarea
                  placeholder="What did you like or dislike about this product?"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={postingReview}
                className="rounded-xl bg-zinc-900 text-white px-5 py-2 text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer dark:bg-white dark:text-zinc-950"
              >
                {postingReview ? 'Posting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RELATED SELECTIONS */}
      {related.length > 0 && (
        <section className="space-y-6 border-t border-zinc-100 dark:border-zinc-800 pt-10">
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Related Selections
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Explore other curated pieces in the same category catalog.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
