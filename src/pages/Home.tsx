import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAMPLE_SNEAKERS } from '../lib/seedData';
import { Sneaker } from '../types';

const ProductCard: React.FC<{ sneaker: Sneaker }> = ({ sneaker }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative bg-[#111] border border-white/5 p-6 flex flex-col space-y-5 transition-colors hover:border-white/20"
  >
    <div className="aspect-[4/5] bg-stone-900 overflow-hidden relative">
      <img 
        src={sneaker.images[0]} 
        alt={sneaker.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        referrerPolicy="no-referrer"
      />
      {sneaker.isNewArrival && (
        <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter shadow-xl">New Arrival</span>
      )}
    </div>
    <div className="flex flex-col flex-1">
      <h3 className="font-serif text-xl tracking-tight leading-tight">{sneaker.name}</h3>
      <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest mt-1 mb-4">{sneaker.brand}</p>
      <div className="mt-auto flex justify-between items-center">
        <p className="font-bold text-lg tracking-tighter">${sneaker.price}.00</p>
        <button className="text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all">
          View Detail
        </button>
      </div>
    </div>
    <Link 
      to={`/product/${sneaker.id}`} 
      className="absolute inset-0 z-10"
    />
  </motion.div>
);

export default function Home() {
  const newArrivals = SAMPLE_SNEAKERS.filter(s => s.isNewArrival);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Sneaker" 
            className="w-full h-full object-cover opacity-40 brightness-75 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center text-center w-full">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-8xl md:text-[12rem] font-serif italic font-bold tracking-tighter leading-none mb-4 select-none"
          >
            Velocity<span className="text-white/20">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-stone-400 text-lg md:text-xl max-w-2xl mb-12 font-medium tracking-tight"
          >
            Engineering the intersection of high-performance athletics and avant-garde streetwear. A new legacy in motion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex space-x-6"
          >
            <Link to="/products" className="bg-white text-black px-12 py-5 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-stone-200 transition-all shadow-2xl">
              Shop Signature Series
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        <div className="flex justify-between items-end">
          <h2 className="text-5xl font-serif italic tracking-tighter">Signature Series</h2>
          <p className="text-sm text-stone-500 max-w-xs text-right">Curated drops from our most innovative engineering lab.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map(sneaker => (
            <ProductCard key={sneaker.id} sneaker={sneaker} />
          ))}
        </div>
      </section>

      {/* Campaign Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden">
          <div className="relative aspect-square md:aspect-auto h-full group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-5xl font-serif italic mb-4">Urban Expedition</h3>
              <p className="text-stone-400 mb-8 max-w-sm">Built for the concrete jungle. High traction, maximum comfort.</p>
              <Link to="/products?category=urban" className="text-[10px] font-black uppercase tracking-[0.3em] text-white border-b border-white pb-1 w-fit hover:tracking-[0.4em] transition-all">Explore Category</Link>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto h-full group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-5xl font-serif italic mb-4">Performance Pro</h3>
              <p className="text-stone-400 mb-8 max-w-sm">For those who demand excellence on every track and court.</p>
              <Link to="/products?category=running" className="text-[10px] font-black uppercase tracking-[0.3em] text-white border-b border-white pb-1 w-fit hover:tracking-[0.4em] transition-all">Shop Performance</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="bg-dark-surface py-40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-24">
          {[
            { icon: Zap, title: "Nitro-Response", desc: "Energy return engineering that propels elite movement." },
            { icon: TrendingUp, title: "Aero-Shift", desc: "Minimalist drag profiles for maximum explosive speed." },
            { icon: Shield, title: "Dura-Core", desc: "Sustainable composite engineering for timeless endurance." }
          ].map((item, i) => (
            <div key={i} className="space-y-6">
              <item.icon className="text-white/10" size={64} strokeWidth={1} />
              <h4 className="text-2xl font-serif italic tracking-tight">{item.title}</h4>
              <p className="text-stone-500 text-sm leading-relaxed tracking-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
