import { writable } from 'svelte/store';
import type { CartItem } from '$lib/types';

// Initialize cart from localStorage if available
const storedCart = typeof localStorage !== 'undefined' ? localStorage.getItem('cart') : null;
const initialCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

// Create writable store
const cart = writable<CartItem[]>(initialCart);

// Subscribe to changes and update localStorage
if (typeof localStorage !== 'undefined') {
  cart.subscribe(value => {
    localStorage.setItem('cart', JSON.stringify(value));
  });
}

// Cart actions
export const cartStore = {
  subscribe: cart.subscribe,
  
  addItem: (item: CartItem) => {
    cart.update(items => {
      const existingItemIndex = items.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...items, { ...item, quantity: 1 }];
      }
    });
  },
  
  removeItem: (itemId: string) => {
    cart.update(items => {
      const existingItemIndex = items.findIndex(i => i.id === itemId);
      
      if (existingItemIndex === -1) return items;
      
      const item = items[existingItemIndex];
      
      if (item.quantity > 1) {
        // Decrease quantity
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...item,
          quantity: item.quantity - 1
        };
        return updatedItems;
      } else {
        // Remove item
        return items.filter(i => i.id !== itemId);
      }
    });
  },
  
  updateQuantity: (itemId: string, quantity: number) => {
    cart.update(items => {
      if (quantity <= 0) {
        return items.filter(i => i.id !== itemId);
      }
      
      return items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  },
  
  clearCart: () => {
    cart.set([]);
  },
  
  getTotalAmount: () => {
    let total = 0;
    cart.subscribe(items => {
      total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    })();
    return total;
  },
  
  getItemCount: () => {
    let count = 0;
    cart.subscribe(items => {
      count = items.reduce((sum, item) => sum + item.quantity, 0);
    })();
    return count;
  }
};