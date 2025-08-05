import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "@/hooks/use-toast"

export interface CartItem {
  id: string
  name: string
  price: number
  comparePrice?: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
  getShippingCost: () => number
  getTaxAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (cartItem) => cartItem.id === item.id
        )
        
        if (existingItemIndex > -1) {
          // Update quantity if item already exists
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += 1
          set({ items: updatedItems })
          
          // Show toast notification
          toast({
            title: "Item updated in cart",
            description: `${item.name} quantity updated to ${updatedItems[existingItemIndex].quantity}`,
          })
        } else {
          // Add new item
          set({ items: [...items, { ...item, quantity: 1 }] })
          
          // Show toast notification
          toast({
            title: "Added to cart",
            description: `${item.name} has been added to your cart`,
          })
        }
      },
      
      removeItem: (id) => {
        const { items } = get()
        const filteredItems = items.filter((item) => item.id !== id)
        set({ items: filteredItems })
      },
      
      updateQuantity: (id, quantity) => {
        const { items } = get()
        const updatedItems = items.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(1, quantity) }
          }
          return item
        })
        set({ items: updatedItems })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        const { items } = get()
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shipping = get().getShippingCost()
        const tax = get().getTaxAmount()
        return subtotal + shipping + tax
      },
      
      getSubtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      
      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      getShippingCost: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 50 ? 0 : 5.99 // Free shipping over $50
      },
      
      getTaxAmount: () => {
        const subtotal = get().getSubtotal()
        return subtotal * 0.08 // 8% tax rate
      },
    }),
    {
      name: 'cart-storage',
      // Only persist the items array, not the functions
      partialize: (state) => ({ items: state.items }),
      // Handle version migrations if needed in the future
      version: 1,
      // Merge function to handle updates gracefully
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          items: persistedState.items || [],
        }
      },
    }
  )
) 