import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SAMPLE_SNEAKERS } from '../lib/seedData';
import { Heart, ShoppingBag, Truck, RotateCcw, Share2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { sneakerService } from '../services/dbService';
import { Sneaker } from '../types';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useApp();
  
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchSneaker = async () => {
      // First check sample data
      const sample = SAMPLE_SNEAKERS.find(s => s.id === id);
      if (sample) {
        setSneaker(sample);
        setLoading(false);
        return;
      }

      // If not in sample, check DB
      try {
        const dbItems = await sneakerService.getAll();
        const item = dbItems?.find(s => s.id === id);
        if (item) setSneaker(item);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchSneaker();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-stone-600 font-bold uppercase tracking-[0.4em] animate-pulse">Decrypting Product Archives...</div>
      </div>
    );
  }

  if (!sneaker) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-serif italic text-4xl">
      <h1 className="tracking-tighter mb-8 opacity-40 uppercase">Sneaker Not Found</h1>
      <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-white pb-1">Back to Origin</Link>
    </div>
  );

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setIsAdding(true);
    addToCart(sneaker, selectedSize);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const isWishlisted = (wishlist || []).includes(sneaker.id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-20 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-stone-900 overflow-hidden relative border border-white/5 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImg}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={sneaker.images[activeImg] || sneaker.images[0]} 
                alt={sneaker.name} 
                className="w-full h-full object-cover grayscale brightness-90"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {sneaker.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImg(idx)}
                className={`aspect-square bg-[#111] border transition-all duration-500 overflow-hidden ${activeImg === idx ? 'border-white' : 'border-white/5 opacity-40 hover:opacity-100'}`}
              >
                <img src={img} alt={`${sneaker.name} ${idx}`} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-16">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-600 block mb-4">{sneaker.brand} • Limited Lab Drop</span>
                <h1 className="text-6xl md:text-7xl font-serif italic italic font-bold tracking-tighter leading-none">{sneaker.name}</h1>
              </div>
              <button 
                onClick={() => toggleWishlist(sneaker.id)}
                className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${isWishlisted ? 'bg-white text-black border-white' : 'text-stone-600 hover:border-white hover:text-white'}`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-4xl font-bold tracking-tighter italic text-white/90">${sneaker.price}.00</p>
          </div>

          <div className="space-y-16">
            <div>
              <div className="flex justify-between mb-8 font-black uppercase text-[10px] tracking-[0.3em] text-stone-500">
                <span>Select Dimensions</span>
                <button className="text-stone-700 hover:text-white border-b border-stone-800 hover:border-white transition-all">Sizing Matrix</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {sneaker.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-14 border text-[10px] font-bold transition-all flex items-center justify-center ${selectedSize === size ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent border-white/10 text-stone-500 hover:border-white/30'}`}
                  >
                    US {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full h-16 font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 transition-all shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed ${isAdding ? 'bg-stone-800 text-white' : 'bg-white text-black hover:bg-stone-200'}`}
              >
                {isAdding ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Added to Manifest</motion.span>
                ) : (
                  <>
                    <ShoppingBag size={14} className="opacity-40" /> 
                    <span>Add to Inventory</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center space-x-8 text-[8px] font-black uppercase tracking-[0.3em] text-stone-700">
                <span className="flex items-center"><Truck size={10} className="mr-2" /> Global Expedited</span>
                <span className="flex items-center"><RotateCcw size={10} className="mr-2" /> 30-Day Protocol</span>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 space-y-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline decoration-white/10 underline-offset-8 mb-8">Engineering Narrative</h4>
                <p className="text-stone-500 text-sm leading-relaxed tracking-tight max-w-xl">{sneaker.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-700">Weight Profile</span>
                  <p className="text-xs font-bold uppercase italic tracking-widest">320g • AERO-LIGHT</p>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-700">Production Lab</span>
                  <p className="text-xs font-bold uppercase italic tracking-widest">Velocity Lab 04</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-48 pt-32 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-5xl font-serif italic italic font-bold tracking-tighter uppercase mb-4">Transmission Reports</h2>
            <div className="flex items-center space-x-4">
              <div className="flex text-white space-x-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="white" className="opacity-20" />)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">4.9 Coefficient based on 24 reports</span>
            </div>
          </div>
          <button className="bg-white/5 border border-white/10 text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">Submit Entry</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#111] p-12 border border-white/5 relative group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{i === 1 ? 'Alexander W.' : 'Sarah M.'}</span>
                  <p className="text-[8px] font-bold text-stone-700 uppercase tracking-widest italic">Verified Explorer</p>
                </div>
                <span className="text-[9px] font-bold text-stone-800 uppercase tracking-widest">0{i}d ago</span>
              </div>
              <p className="text-stone-400 font-serif italic text-lg leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                "{i === 1 ? "The precision engineering here is unmatched. Light enough for the track, detailed enough for the gallery." : "Velocity Prime redefined my morning routine. The Aero-Light profile is no joke."}"
              </p>
              <div className="flex text-white/10 space-x-1">
                {[1, 2, 3, 4, 5].map(j => <Star key={j} size={10} fill="currentColor" />)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
