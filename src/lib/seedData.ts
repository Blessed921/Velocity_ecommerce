import { Sneaker } from '../types';

export const SAMPLE_SNEAKERS: Sneaker[] = [
  {
    id: 'snk_1',
    name: 'Velocity Prime X',
    brand: 'VELOX',
    price: 180,
    description: 'Designed for ultimate speed and comfort. Featuring our proprietary Aerostride foam technology and a breathable mesh upper that moves with you.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    categories: ['men', 'running', 'new'],
    stock: 50,
    isNewArrival: true,
    createdAt: Date.now()
  },
  {
    id: 'snk_2',
    name: 'Metrostreet Classic',
    brand: 'VELOX',
    price: 120,
    description: 'The definitive sneaker for the urban explorer. Premium leather accents meet a minimalist silhouette for timeless style.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [6, 7, 8, 9, 10],
    categories: ['unisex', 'lifestyle'],
    stock: 25,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'snk_3',
    name: 'Thunderbolt High-Top',
    brand: 'ADIDAS',
    price: 210,
    description: 'Electrify your game with our most responsive basketball shoe yet. Maximum ankle support and high-impact cushioning.',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1512374382149-4332c6c02153?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [8, 9, 10, 11, 12, 13],
    categories: ['men', 'basketball'],
    stock: 15,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'snk_4',
    name: 'Cloudwalk Airy',
    brand: 'NIKE',
    price: 95,
    description: 'So light, you\'ll forget you\'re wearing them. Perfect for daily commutes or light workouts.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [5, 6, 7, 8, 9],
    categories: ['women', 'lifestyle', 'training'],
    stock: 100,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 10
  }
];
