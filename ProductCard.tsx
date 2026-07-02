import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../data/products';
import { ShoppingCart, Heart, Sparkles, Scale } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  key?: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setActiveProductDetail, 
    compareList, 
    toggleCompare,
    navigate
  } = useApp();

  const isWishlisted = wishlist.some(p => p.id === product.id);
  const isCompared = compareList.some(p => p.id === product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [shineX, setShineX] = React.useState(50);
  const [shineY, setShineY] = React.useState(50);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Maximum tilt of 10 degrees for elegant look
    const rX = -(y / (box.height / 2)) * 10;
    const rY = (x / (box.width / 2)) * 10;
    setRotateX(rX);
    setRotateY(rY);

    const pctX = ((e.clientX - box.left) / box.width) * 100;
    const pctY = ((e.clientY - box.top) / box.height) * 100;
    setShineX(pctX);
    setShineY(pctY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    setActiveProductDetail(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart ✓", {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#2874F0',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (isWishlisted) {
      toast.success("Removed from wishlist", {
        icon: '💔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
    } else {
      toast.success("Wishlisted ❤", {
        icon: '❤️',
        style: {
          borderRadius: '10px',
          background: '#FF9900',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product);
    if (isCompared) {
      toast.success(`Removed ${product.name} from comparison`);
    } else {
      toast.success(`Comparing ${product.name} (Max 3)`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      className="group relative bg-white rounded-2xl border border-zinc-150 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all cursor-pointer overflow-hidden flex flex-col h-full text-left"
    >
      {/* Dynamic 3D Shine reflection overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-25 transition-opacity duration-300 mix-blend-overlay opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`
        }}
      />

      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-zinc-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title="Add to Wishlist"
      >
        <Heart className={`h-4.5 w-4.5 transition-all ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
      </button>

      {/* Compare Button Overlay */}
      <button
        onClick={handleCompareToggle}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer ${isCompared ? 'bg-[#2874F0] text-white' : 'bg-white/90 hover:bg-white text-zinc-400 hover:text-blue-500'}`}
        title="Compare side-by-side"
      >
        <Scale className="h-4 w-4" />
      </button>

      {/* Image container */}
      <div className="aspect-square relative overflow-hidden bg-zinc-100 border-b border-zinc-100 flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Badge (Assured vs Prime) */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {product.isAssured ? (
            <span className="flex items-center gap-0.5 bg-[#2874F0] text-white text-[9px] font-black italic px-2 py-0.5 rounded-full shadow-sm select-none">
              <span className="text-[#FF9900] font-black">f</span>Assured
            </span>
          ) : (
            <span className="flex items-center gap-0.5 bg-gradient-to-r from-zinc-900 to-zinc-750 text-[#FF9900] text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-sm select-none border border-zinc-700">
              PRIME
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9900]">
            {product.category}
          </span>
          <h3 className="mt-1 font-sans text-xs font-bold leading-snug text-zinc-800 group-hover:text-[#2874F0] transition-colors line-clamp-2 h-8">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="bg-[#388E3C] text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
              {product.avgRating} <span className="text-[8px]">★</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold">({product.numReviews.toLocaleString('en-IN')})</span>
          </div>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-black text-[#2874F0] font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-zinc-400 line-through font-sans font-medium">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-[#388E3C]">
              {discountPercent}% off
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 bg-[#FF9900] hover:bg-orange-600 active:scale-95 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <ShoppingCart className="h-3 w-3" />
              Add
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                navigate('cart');
                toast.success("Proceeding to secure checkout! 🔒", { icon: '✈️' });
              }}
              className="flex items-center justify-center gap-1 bg-[#2874F0] hover:bg-blue-600 active:scale-95 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
