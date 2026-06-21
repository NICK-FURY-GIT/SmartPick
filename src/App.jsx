import { useState, useCallback } from 'react'
import GuidanceSystem from './components/GuidanceSystem'
import TabSelector from './components/TabSelector'
import FloorMap from './components/FloorMap'
import SmartCart from './components/SmartCart'
import PersistenceToggle from './components/PersistenceToggle'
import useSimulationStore from './stores/simulationStore'
import useCartStore from './stores/cartStore'
import useGuidanceStore from './stores/guidanceStore'

export default function App() {
  const [activeDivision, setActiveDivision] = useState('sanitary')

  // Tab switch mid-simulation: auto-complete any in-progress pick
  const handleTabSwitch = useCallback((tabId) => {
    if (tabId === activeDivision) return
    const sim = useSimulationStore.getState()
    if (sim.step === 'signaling' || sim.step === 'blinking') {
      const item = sim.confirmPick()
      if (item) {
        useCartStore.getState().addItem(item.product, item.quantity)
        useGuidanceStore.getState().updateGuidance(
          `${item.product.name} (x${item.quantity}) auto-completed. Switched to ${tabId === 'sanitary' ? 'Sanitary' : 'Hardware'} Division.`,
          'System Status: Pick Auto-Completed | Tab switched'
        )
      }
      sim.reset()
    }
    setActiveDivision(tabId)
  }, [activeDivision])

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0A0A0F]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 glass border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-amber flex items-center justify-center text-xs font-bold text-black">
            SP
          </div>
          <h1 className="text-lg font-semibold tracking-tight">SmartPick</h1>
        </div>
        <PersistenceToggle />
      </header>

      {/* Guidance Ribbon */}
      <GuidanceSystem />

      {/* Tab Selector */}
      <TabSelector activeDivision={activeDivision} onSwitch={handleTabSwitch} />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <FloorMap division={activeDivision} />
        </div>
        <SmartCart />
      </main>
    </div>
  )
}
