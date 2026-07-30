import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string; // Size + Color
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, variant: string) => void;
  updateQuantity: (id: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.variant === item.variant
          );
          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity || 1;
            return { items: newItems, isOpen: true }; // Auto-open on add
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
            isOpen: true, // Auto-open on add
          };
        }),
      removeItem: (id, variant) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.variant === variant)),
        })),
      updateQuantity: (id, variant, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.variant === variant ? { ...i, quantity: Math.max(0, quantity) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'luxe-cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);
