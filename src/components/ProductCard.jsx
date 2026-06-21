import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Minus, Plus, Package } from 'lucide-react'
import useSimulationStore from '../stores/simulationStore'
import useGuidanceStore from '../stores/guidanceStore'
import useAudio from '../hooks/useAudio'
import { formatINR } from '../utils/formatters'

export default function ProductCard({ product, division }) {
  const [quantity, setQuantity] = useState(1)
  const step = useSimulationStore(s => s.step)
  const selectProduct = useSimulationStore(s => s.selectProduct)
  const updateGuidance = useGuidanceStore(s => s.updateGuidance)
  const { playBeep } = useAudio()

  const isDisabled = step === 'signaling' || step === 'blinking'
  const accentBorder = division === 'sanitary' ? 'hover:border-accent-cyan/40' : 'hover:border-accent-amber/40'
  const accentText = division === 'sanitary' ? 'text-accent-cyan' : 'text-accent-amber'
  const accentBtn = division === 'sanitary' ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30 hover:bg-accent-cyan/30' : 'bg-accent-amber/20 text-accent-amber border-accent-amber/30 hover:bg-accent-amber/30'

  const handlePick = () => {
    if (isDisabled) return
    playBeep()
    selectProduct(product, quantity)
    updateGuidance(
      `Signal sent to warehouse for ${product.name} (x${quantity})`,
      `System Status: Signaling ESP32 Node | Shelf ${product.shelfLocation.zone}-${product.shelfLocation.rack}`
    )
  }

  const categoryColor = division === 'sanitary' ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-accent-amber/10 text-accent-amber'

  return (
    <motion.div
      layout
      className={`glass rounded-xl p-3 border border-white/5 ${accentBorder} transition-colors ${
        isDisabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Category Badge */}
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColor}`}>
        {product.category}
      </span>

      {/* Product Icon */}
      <div className="flex items-center justify-center my-3">
        <div className={`w-10 h-10 rounded-lg ${division === 'sanitary' ? 'bg-accent-cyan/5' : 'bg-accent-amber/5'} flex items-center justify-center`}>
          <Package className={`w-5 h-5 ${accentText}`} />
        </div>
      </div>

      {/* Product Name */}
      <p className="text-xs font-medium text-white/80 leading-tight mb-1 line-clamp-2" title={product.name}>
        {product.name}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-sm font-semibold text-white">{formatINR(product.price)}</span>
        <span className="text-[10px] text-white/30 line-through">{formatINR(product.mrp)}</span>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50"
          disabled={isDisabled}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-xs font-medium text-white/70">{quantity}</span>
        <button
          onClick={() => setQuantity(q => Math.min(99, q + 1))}
          className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50"
          disabled={isDisabled}
        >
          <Plus className="w-3 h-3" />
        </button>
        <span className="text-[10px] text-white/30 ml-1">{product.unit}</span>
      </div>

      {/* Pick Button */}
      <button
        onClick={handlePick}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg border transition-all ${accentBtn}`}
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Pick
      </button>
    </motion.div>
  )
}
