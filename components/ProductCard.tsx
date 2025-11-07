'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Plus } from 'lucide-react';
import type { DemoProduct } from '@/lib/types';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';

interface ProductCardProps {
  product: DemoProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isDemo, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    setIsAdding(true);
    
    try {
      // Get user's cart
      const cartKey = isDemo ? 'dc:cart' : `dc:cart:${user.id}`;
      const existingCart = localStorage.getItem(cartKey);
      const cart = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if product already in cart
      const existingItem = cart.find((item: any) => item.productId === product.id);
      
      if (existingItem) {
        // Increase quantity
        existingItem.qty += 1;
      } else {
        // Add new item
        const newItem = {
          id: `cart_${Date.now()}_${product.id}`,
          productId: product.id,
          qty: 1,
          projectId: undefined,
          area: undefined,
        };
        cart.push(newItem);
      }
      
      // Save updated cart
      localStorage.setItem(cartKey, JSON.stringify(cart));
      
      // Show feedback (you could use a toast notification here)
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white border border-[#2e2e2e]/10 hover:border-[#d96857]/30 rounded-2xl overflow-hidden
        shadow-sm hover:shadow-md transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f9f8f7] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#d96857] to-[#c45745] text-white rounded-full shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 transition-all duration-200 transform flex flex-col gap-2
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
          <button
            className="w-9 h-9 rounded-full bg-white/95 shadow-lg flex items-center justify-center
              hover:bg-[#d96857] hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Handle wishlist action
            }}
          >
            <Heart className="w-5 h-5" />
          </button>
          
          <button
            className={`w-9 h-9 rounded-full bg-white/95 shadow-lg flex items-center justify-center
              hover:bg-[#d96857] hover:text-white transition-colors ${
                isAdding ? 'bg-green-500 text-white' : ''
              }`}
            onClick={addToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-medium text-[#2e2e2e] leading-snug">
            {product.title}
          </h3>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <span className="text-xs px-3 py-1 bg-[#f9f8f7] rounded-full text-[#2e2e2e]/70 border border-[#2e2e2e]/10">
                {product.category}
              </span>
            )}
            {product.roomType && (
              <span className="text-xs px-3 py-1 bg-[#f9f8f7] rounded-full text-[#2e2e2e]/70 border border-[#2e2e2e]/10">
                {product.roomType}
              </span>
            )}
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between pt-1">
            <div className="font-semibold text-[#2e2e2e]">
              ₹{typeof product.price === "number"
                ? product.price.toLocaleString("en-IN")
                : product.price}
            </div>
            {product.rating && (
              <div className="flex items-center gap-1.5 bg-[#f9f8f7] px-2 py-1 rounded-full">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-[#2e2e2e]/70">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`w-full mt-3 py-2 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
              isAdding 
                ? 'bg-green-500 text-white' 
                : 'bg-[#d96857] hover:bg-[#c85745] text-white'
            }`}
            onClick={addToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add to Cart
              </div>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}