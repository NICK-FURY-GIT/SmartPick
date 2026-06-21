import { create } from 'zustand'

const useGuidanceStore = create((set) => ({
  instructionText: 'Select a product tab to begin exploring the store',
  technicalSubtext: 'System Status: Ready | ESP32 Nodes: 20 Online',
  persistenceEnabled: true,

  updateGuidance: (instruction, subtext) => {
    set({
      instructionText: instruction,
      technicalSubtext: subtext || getDefaultSubtext(),
    })
  },

  togglePersistence: () => {
    set(state => {
      const newVal = !state.persistenceEnabled
      if (!newVal) {
        // Clear persisted cart data when disabling
        try { localStorage.removeItem('smartpick-cart') } catch {}
      }
      return { persistenceEnabled: newVal }
    })
  },
}))

function getDefaultSubtext() {
  return 'System Status: Ready | ESP32 Nodes: 20 Online'
}

export default useGuidanceStore
