import ProductCard from './ProductCard'
import GodownShelf from './GodownShelf'
import SignalBeam from './SignalBeam'
import SimulationPanel from './SimulationPanel'
import StaffAvatar from './StaffAvatar'
import useSimulationStore from '../stores/simulationStore'
import { ArrowDown } from 'lucide-react'

export default function FloorSection({ division, products }) {
  const activeShelf = useSimulationStore(s => s.activeShelf)
  const isBlinking = useSimulationStore(s => s.isBlinking)
  const isSignaling = useSimulationStore(s => s.isSignaling)
  const activeProduct = useSimulationStore(s => s.activeProduct)

  const accentColor = division === 'sanitary' ? 'accent-cyan' : 'accent-amber'
  const accentHex = division === 'sanitary' ? '#00E5FF' : '#FFD600'

  // Build shelves for the godown area
  const shelfIds = [...new Set(products.map(p => `${p.shelfLocation.zone}-${p.shelfLocation.rack}`))]

  return (
    <div className="flex flex-col h-full gap-6 relative">
      {/* Showcase Area */}
      <div className="flex-1 glass rounded-xl p-4 lg:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
          Showroom Display — {division === 'sanitary' ? 'Jaquar Luxury Sanitary' : 'Industrial Hardware'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} division={division} />
          ))}
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center justify-center gap-2 text-white/20">
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <ArrowDown className="w-4 h-4" />
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Godown Area */}
      <div className={`flex-1 glass rounded-xl p-4 lg:p-6 relative ${isBlinking || isSignaling ? 'ring-1 ring-' + accentColor + '/30' : ''}`}>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
          Warehouse — Godown ({division === 'sanitary' ? 'Top Floor' : 'Ground Floor'})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {shelfIds.map(shelfId => (
            <GodownShelf
              key={shelfId}
              shelfId={shelfId}
              products={products.filter(p => `${p.shelfLocation.zone}-${p.shelfLocation.rack}` === shelfId)}
              isBlinking={isBlinking && activeShelf === shelfId}
              division={division}
            />
          ))}
        </div>

        {/* Overlays */}
        <SignalBeam division={division} />
        {isBlinking && activeProduct && (
          <>
            <SimulationPanel product={activeProduct} division={division} />
            <StaffAvatar division={division} />
          </>
        )}
      </div>
    </div>
  )
}
