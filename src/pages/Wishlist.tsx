import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { SAMPLE_SNEAKERS } from '../lib/seedData';
import { motion } from 'motion/react';
import { sneakerService } from '../services/dbService';
import { Sneaker } from '../types';

export default function Wishlist() {
  const { wishlist, profile, toggleWishlist } = useApp();
  const [dbSneakers, setDbSneakers] = React.useState<Sneaker[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const data = await sneakerService.getAll();
        setDbSneakers(data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchSneakers();
  }, []);

  const allPossibleSneakers = React.useMemo(() => {
    const combined = [...dbSneakers];
    SAMPLE_SNEAKERS.forEach(sample => {
      if (!dbSneakers.find(p => p.id === sample.id)) {
        combined.push(sample);
      }
    });
    return combined;
  }, [dbSneakers]);

  const currentWishlist = wishlist || [];
  const wishlistItems = allPossibleSneakers.filter(s => currentWishlist.includes(s.id));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-stone-500 font-bold uppercase tracking-[0.3em] animate-pulse">Syncing Wishlist Archive...</div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-8">
          <Heart size={48} className="text-stone-300" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Your wishlist is empty</h1>
        <p className="text-stone-500 mb-8 max-w-sm">Save your favorite items here. We'll let you know when they go on sale or restock.</p>
        <Link to="/products" className="bg-stone-900 text-white px-10 py-5 font-black uppercase text-sm tracking-widest hover:bg-black transition-colors">Browse Sneakers</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase">Your Wishlist</h1>
          <p className="text-stone-500 font-medium mt-2">Saved items that you have your eye on.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlistItems.map(item => (
          <motion.div 
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-stone-50 p-6 flex flex-col space-y-4"
          >
            <button 
              onClick={() => toggleWishlist(item.id)}
              className="absolute top-8 right-8 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Remove from Wishlist"
            >
              <Heart size={16} fill="currentColor" />
            </button>
            <div className="aspect-square bg-stone-100 overflow-hidden relative">
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <Link to={`/product/${item.id}`} className="absolute inset-0 z-10" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg tracking-tight uppercase">{item.name}</h3>
              <p className="text-stone-500 text-sm small-caps">{item.brand}</p>
              <p className="mt-2 font-bold text-lg">${item.price}</p>
            </div>
            <Link to={`/product/${item.id}`} className="flex items-center justify-center space-x-2 bg-stone-900 text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-colors">
              <ShoppingBag size={16} />
              <span>View Product</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
