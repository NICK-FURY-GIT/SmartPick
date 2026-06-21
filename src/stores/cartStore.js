import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
    // Persist only when the guidanceStore flag is true
    partialize: (state) => state,
    skipHydration: false,
  })
)

export default useCartStore
