import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import { SAMPLE_SNEAKERS } from '../lib/seedData';
import { motion } from 'motion/react';

const ProductCard: React.FC<{ sneaker: any }> = ({ sneaker }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ y: -5 }}
    className="group relative bg-[#111] border border-white/5 p-6 flex flex-col space-y-4 hover:border-white/20 transition-all"
  >
    <div className="aspect-[4/5] bg-stone-900 overflow-hidden relative">
      <img 
        src={sneaker.images[0]} 
        alt={sneaker.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        referrerPolicy="no-referrer"
      />
      {sneaker.isNewArrival && (
        <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter">New</span>
      )}
    </div>
    <div className="flex flex-col flex-1">
      <h3 className="font-serif text-lg tracking-tight leading-tight">{sneaker.name}</h3>
      <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest mt-1 mb-4">{sneaker.brand}</p>
      <div className="mt-auto flex justify-between items-center">
        <p className="font-bold text-lg">${sneaker.price}.00</p>
        <button className="text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
          Add To Cart
        </button>
      </div>
    </div>
    <Link 
      to={`/product/${sneaker.id}`} 
      className="absolute inset-0 z-10"
    />
  </motion.div>
);

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return SAMPLE_SNEAKERS.filter(p => {
      const matchCategory = category === 'all' || p.categories.includes(category);
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.createdAt - a.createdAt;
    });
  }, [category, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 pt-16 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 space-y-8 md:space-y-0">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter font-bold uppercase leading-none">
            {category === 'all' ? 'Signature Series' : `${category} Edition`}
          </h1>
          <p className="text-stone-500 font-medium tracking-tight">Showing {filteredProducts.length} results curated for you.</p>
        </div>
        
        <div className="flex items-center space-x-6 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
            <input 
              type="text" 
              placeholder="Search Signature Drops..."
              className="w-full bg-[#111] border border-white/5 rounded-full px-12 py-3 font-bold text-xs focus:ring-1 ring-white/20 outline-none text-white placeholder-stone-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-white text-black px-6 py-3 font-bold uppercase text-[10px] tracking-widest"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Filters Sidebar */}
        <aside className={`w-full md:w-64 flex-shrink-0 space-y-16 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-8 font-sans">Categories</h4>
            <div className="flex flex-col space-y-6 text-xs font-bold uppercase tracking-widest">
              {['all', 'men', 'women', 'kids', 'running', 'lifestyle'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left transition-all flex items-center justify-between group ${category === cat ? 'text-white' : 'text-stone-600 hover:text-stone-300'}`}
                >
                  <span>{cat === 'all' ? 'All Pieces' : cat}</span>
                  <span className="text-[9px] text-stone-800 group-hover:text-stone-600">
                    {cat === 'all' ? SAMPLE_SNEAKERS.length : SAMPLE_SNEAKERS.filter(p => p.categories.includes(cat)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-8 font-sans">Sort By</h4>
            <div className="relative">
              <select 
                title="Sort Products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 font-bold uppercase text-[10px] tracking-[0.2em] appearance-none outline-none focus:border-white transition-colors"
              >
                <option value="newest">Collection Drop</option>
                <option value="price-low">Price Ascending</option>
                <option value="price-high">Price Descending</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600" size={12} />
            </div>
          </div>

          <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-200 transition-all">
            Apply Filters
          </button>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} sneaker={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-white/10">
              <p className="text-3xl font-serif italic tracking-tighter mb-6">NO PIECES FOUND</p>
              <button 
                onClick={() => {setCategory('all'); setSearchQuery('');}}
                className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-white pb-1"
              >
                Reset Search parameters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
