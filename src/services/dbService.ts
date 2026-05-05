import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, orderBy, limit, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole, UserProfile, Sneaker, Review, Order, Collection } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const sneakerService = {
  async getAll() {
    const path = 'sneakers';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sneaker));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },

  async getById(id: string) {
    const path = `sneakers/${id}`;
    try {
      const docRef = doc(db, 'sneakers', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Sneaker;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
    }
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    const path = 'reviews';
    try {
      return await addDoc(collection(db, path), {
        ...review,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  getReviews(sneakerId: string, callback: (reviews: Review[]) => void) {
    const path = 'reviews';
    const q = query(collection(db, path), where('sneakerId', '==', sneakerId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, path);
    });
  },

  async add(data: Partial<Sneaker>) {
    const path = 'sneakers';
    try {
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async update(id: string, data: Partial<Sneaker>) {
    const path = `sneakers/${id}`;
    try {
      const docRef = doc(db, 'sneakers', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, path);
    }
  }
};

export const formatDate = (timestamp: any) => {
  try {
    if (!timestamp) return 'No Date';
    
    // Handle Firestore Timestamp objects (live objects from SDK)
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Handle serialized Firestore Timestamps (plain objects with seconds/nanoseconds)
    if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
      const val = Number(timestamp.seconds);
      if (!isNaN(val)) {
        return new Date(val * 1000).toLocaleDateString();
      }
    }
    
    // Handle JS Date objects
    if (timestamp instanceof Date) {
      if (!isNaN(timestamp.getTime())) {
        return timestamp.toLocaleDateString();
      }
      return 'No Date';
    }
    
    // Handle ISO strings or numbers
    // If it's a number, assume milliseconds unless it's too small (then seconds)
    let dateInput = timestamp;
    if (typeof timestamp === 'number') {
      // If timestamp is like 1625000000 (seconds), multiply by 1000
      if (timestamp < 10000000000) {
        dateInput = timestamp * 1000;
      }
    }

    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      const result = date.toLocaleDateString();
      if (result !== "Invalid Date") return result;
    }
    
    return 'No Date';
  } catch (err) {
    return 'No Date';
  }
};

export const userService = {
  async getProfile(uid: string) {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
    }
  },

  async updateWishlist(uid: string, wishlist: string[]) {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { 
        wishlist,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  async initProfile(uid: string, profileData: Partial<UserProfile>) {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      const data: any = {
        ...profileData,
        updatedAt: serverTimestamp()
      };

      if (!docSnap.exists()) {
        data.createdAt = serverTimestamp();
        data.wishlist = profileData.wishlist || [];
        data.role = profileData.role || UserRole.USER;
      }

      await setDoc(docRef, data, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    const path = `users/${uid}`;
    const docRef = doc(db, 'users', uid);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ uid: snapshot.id, ...snapshot.data() } as UserProfile);
      } else {
        callback(null);
      }
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, path);
    });
  },

  async getAllUsers() {
    const path = 'users';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  }
};

export const orderService = {
  async create(order: Omit<Order, 'id' | 'createdAt'>) {
    const path = 'orders';
    try {
      return await addDoc(collection(db, path), {
        ...order,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async getByUser(userId: string) {
    const path = 'orders';
    try {
      const q = query(collection(db, path), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },

  async getAll() {
    const path = 'orders';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  }
};

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: any;
}

export const notifyService = {
  async getByUser(uid: string) {
    const path = 'notifications';
    try {
      const q = query(collection(db, path), where('userId', '==', uid), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },

  async markAsRead(id: string) {
    const path = `notifications/${id}`;
    try {
      const docRef = doc(db, 'notifications', id);
      await updateDoc(docRef, { read: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, path);
    }
  },

  async send(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
    const path = 'notifications';
    try {
      return await addDoc(collection(db, path), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  }
};

export const collectionService = {
  async getAll() {
    const path = 'collections';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collection));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },

  async add(data: Partial<Collection>) {
    const path = 'collections';
    try {
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async delete(id: string) {
    const path = `collections/${id}`;
    try {
      await deleteDoc(doc(db, 'collections', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
};


