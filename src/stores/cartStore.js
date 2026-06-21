import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useGuidanceStore from './guidanceStore'

const cartStore = (set, get) => ({
  items: [],
  showBill: false,
  invoiceType: 'gst',     // 'proforma' | 'gst'
  invoiceNumber: null,

  addItem: (product, quantity) => {
    const { items } = get()
    // Check if same product already in cart — increment quantity
    const existing = items.find(i => i.product.id === product.id)
    if (existing) {
      set({
        items: items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      })
    } else {
      set({
        items: [...items, { product, quantity, pickedAt: Date.now() }],
      })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter(i => i.product.id !== productId) })
  },

  clearCart: () => {
    set({ items: [], invoiceNumber: null })
  },

  setInvoiceType: (type) => {
    set({ invoiceType: type })
  },

  generateBill: () => {
    set({ showBill: true, invoiceNumber: `SGA-${Date.now().toString(36).toUpperCase()}` })
  },

  dismissBill: () => {
    set({ showBill: false })
  },
})

const useCartStore = create(
  persist(cartStore, {
    name: 'smartpick-cart',
    // Persist only when guidanceStore persistenceEnabled is true
    partialize: (state) => {
      try {
        const persisted = useGuidanceStore.getState().persistenceEnabled
        return persisted ? state : {}
      } catch {
        return state // fallback: persist normally if store not ready
      }
    },
    skipHydration: false,
  })
)

export default useCartStore
