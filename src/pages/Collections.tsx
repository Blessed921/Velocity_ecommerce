import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Globe, LayoutGrid } from 'lucide-react';
import { collectionService } from '../services/dbService';
import { Collection as ProductCollection } from '../types';

const CollectionCard = ({ title, description, image, link, icon: Icon }: any) => (
  <Link to={link} className="group relative overflow-hidden bg-white/5 border border-white/10 aspect-[4/5] flex flex-col justify-end p-8">
    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
      <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
    </div>
    <div className="relative z-10 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform">
      <Icon className="text-white mb-4" size={32} />
      <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{title}</h3>
      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{description}</p>
      <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
        Explore Vault <ArrowRight size={14} />
      </div>
    </div>
  </Link>
);

export default function Collections() {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionService.getAll();
        setCollections(data || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
      setLoading(false);
    };
    fetchCollections();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'basketball': return Target;
      case 'urban': return Globe;
      case 'signature': return Zap;
      default: return LayoutGrid;
    }
  };

  const STATIC_COLLECTIONS = [
    {
      id: 'col_1',
      title: 'Signature Series',
      description: 'The pinnacle of Velocity engineering. Direct from our research labs.',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000',
      category: 'signature'
    },
    {
      id: 'col_2',
      title: 'Heritage Basketball',
      description: 'Classic silhouettes re-imagined with modern high-impact technology.',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000',
      category: 'basketball'
    },
    {
      id: 'col_3',
      title: 'Urban Expedition',
      description: 'Performance gear optimized for the variable conditions of city life.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000',
      category: 'urban'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-500 font-bold uppercase tracking-[0.3em] animate-pulse">Synchronizing Collections...</div>
      </div>
    );
  }

  const allCollections = [...STATIC_COLLECTIONS];
  collections.forEach(c => {
    if (!STATIC_COLLECTIONS.find(sc => sc.category === c.category)) {
      allCollections.push(c);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 font-sans">
      <div className="mb-20 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">Curated Archives</p>
        <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8">The Collection Vault</h1>
        <p className="max-w-2xl text-stone-400 font-medium leading-relaxed">
          Explore our seasonal rotations and limited-run collaborations. Each collection represents a specific breakthrough in footwear architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {allCollections.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CollectionCard 
              title={c.title} 
              description={c.description} 
              image={c.image} 
              link={`/products?category=${c.category}`} 
              icon={getIcon(c.category)} 
            />
          </motion.div>
        ))}
      </div>

      <div id="brands" className="mt-40 space-y-12">
        <div className="flex items-end justify-between border-b border-white/10 pb-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">Corporate Partners</p>
            <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">The Brand Edition</h2>
          </div>
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest max-w-[200px] text-right">
            Explore original engineering from the world's most elite manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {[
            { name: 'Velox', origin: 'Germany', link: '/products?search=velox' },
            { name: 'Nike', origin: 'USA', link: '/products?search=nike' },
            { name: 'Adidas', origin: 'Germany', link: '/products?search=adidas' },
            { name: 'Puma', origin: 'Germany', link: '/products?search=puma' },
            { name: 'Jordan', origin: 'USA', link: '/products?search=jordan' },
            { name: 'Asics', origin: 'Japan', link: '/products?search=asics' },
            { name: 'New Balance', origin: 'USA', link: '/products?search=balance' },
            { name: 'Reebok', origin: 'USA', link: '/products?search=reebok' },
          ].map((brand, i) => (
            <Link 
              key={i} 
              to={brand.link}
              className="bg-black p-10 hover:bg-white hover:text-black transition-all group flex flex-col justify-between aspect-square"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 group-hover:text-stone-400">{brand.origin}</span>
              <div className="space-y-2">
                <span className="block text-3xl font-black italic uppercase tracking-tighter">{brand.name}</span>
                <span className="block text-[8px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Archive Access</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-32 p-16 bg-white text-black flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase">Limited Drops Only</h2>
          <p className="text-stone-600 font-bold uppercase tracking-widest text-xs">Join our priority access list for upcoming releases.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input 
            type="email" 
            placeholder="Identity@Nexus.com" 
            className="p-5 bg-stone-100 border-none font-bold placeholder-stone-400 focus:ring-1 focus:ring-black outline-none min-w-[300px]"
          />
          <button className="bg-black text-white px-10 py-5 font-black uppercase italic tracking-widest text-sm hover:bg-stone-800 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
