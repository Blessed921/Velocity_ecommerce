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
    categories: ['men', 'running', 'signature'],
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
    categories: ['unisex', 'lifestyle', 'urban'],
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
  },
  {
    id: 'snk_5',
    name: 'Dunk High Retro',
    brand: 'NIKE',
    price: 135,
    description: 'Classic hardwood vibes for the streets. The Nike Dunk High Retro returns with crisp overlays and original team colors.',
    images: [
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGJhc2tldGJhbGwlMjBzaG9lc3xlbnwwfHwwfHx8MA%3D%3D'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    categories: ['men', 'basketball', 'urban'],
    stock: 30,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'snk_6',
    name: 'Forum Low Premium',
    brand: 'ADIDAS',
    price: 110,
    description: 'More than a shoe, it\'s a statement. The adidas Forum Low is a celebration of the era it was born.',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [6, 7, 8, 9, 10, 11],
    categories: ['unisex', 'lifestyle', 'signature'],
    stock: 45,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'snk_7',
    name: 'Suede Classic XXI',
    brand: 'PUMA',
    price: 75,
    description: 'The Suede has been changing the game since 1968. From Tommie Smith\'s protest to the b-boy crews in NYC, the Suede is a legend.',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [7, 8, 9, 10, 11],
    categories: ['unisex', 'urban'],
    stock: 60,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'snk_8',
    name: '574 Core',
    brand: 'NEW BALANCE',
    price: 90,
    description: 'The most "New Balance" shoe ever. The 574 was built to be a reliable shoe that could do a lot of different things well.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [8, 9, 10, 11, 12],
    categories: ['men', 'lifestyle', 'urban'],
    stock: 35,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 25
  },
  {
    id: 'snk_9',
    name: 'GEL-KAYANO 30',
    brand: 'ASICS',
    price: 160,
    description: 'Advanced stability and comfort for the miles ahead. The GEL-KAYANO 30 is the ultimate distance running companion.',
    images: [
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    categories: ['men', 'women', 'running'],
    stock: 40,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'snk_10',
    name: 'Gel-Lyte III OG',
    brand: 'ASICS',
    price: 130,
    description: 'Redefining comfort since 1990. The split-tongue design remains a staple for sneakerheads worldwide.',
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: [6, 7, 8, 9, 10, 11],
    categories: ['unisex', 'lifestyle', 'urban'],
    stock: 20,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 30
  }
];
