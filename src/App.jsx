import { useState } from 'react'
import GuidanceSystem from './components/GuidanceSystem'
import TabSelector from './components/TabSelector'
import FloorMap from './components/FloorMap'
import SmartCart from './components/SmartCart'
import PersistenceToggle from './components/PersistenceToggle'

export default function App() {
  const [activeDivision, setActiveDivision] = useState('sanitary')

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
      <TabSelector activeDivision={activeDivision} onSwitch={setActiveDivision} />

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
