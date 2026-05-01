export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  wishlist: string[];
  createdAt: number;
}

export interface Sneaker {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: string[];
  sizes: number[];
  categories: string[];
  stock: number;
  isNewArrival: boolean;
  createdAt: number;
}

export interface Review {
  id: string;
  sneakerId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface CartItem extends Sneaker {
  selectedSize: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    sneakerId: string;
    name: string;
    price: number;
    size: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    phone: string;
  };
  paystackReference?: string;
  createdAt: number;
}
