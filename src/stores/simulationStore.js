import { create } from 'zustand'

/**
 * Tracks the Pick-to-Light simulation workflow:
 * idle -> signaling -> blinking -> confirmed -> (back to idle or billing)
 */
const useSimulationStore = create((set, get) => ({
  // State
  step: 'idle',               // 'idle' | 'signaling' | 'blinking' | 'confirmed'
  activeProduct: null,
  activeQuantity: 1,
  activeShelf: null,          // e.g., "A-102"
  isSignaling: false,
  isBlinking: false,

  // Actions
  selectProduct: (product, quantity = 1) => {
    // Prevent selection during active workflow
    const { step } = get()
    if (step === 'signaling' || step === 'blinking') return

    set({
      step: 'signaling',
      activeProduct: product,
      activeQuantity: quantity,
      activeShelf: `${product.shelfLocation.zone}-${product.shelfLocation.rack}`,
      isSignaling: true,
    })
  },

  completeSignal: () => {
    set({ step: 'blinking', isSignaling: false, isBlinking: true })
  },

  confirmPick: () => {
    const { activeProduct, activeQuantity } = get()
    set({
      step: 'confirmed',
      isBlinking: false,
    })
    return { product: activeProduct, quantity: activeQuantity }
  },

  reset: () => {
    set({
      step: 'idle',
      activeProduct: null,
      activeQuantity: 1,
      activeShelf: null,
      isSignaling: false,
      isBlinking: false,
    })
  },
}))

export default useSimulationStore
