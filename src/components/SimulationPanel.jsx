import { motion } from 'framer-motion'
import { Radio, CheckCircle } from 'lucide-react'
import useSimulationStore from '../stores/simulationStore'
import useCartStore from '../stores/cartStore'
import useGuidanceStore from '../stores/guidanceStore'

export default function SimulationPanel({ product, division }) {
  const confirmPick = useSimulationStore(s => s.confirmPick)
  const reset = useSimulationStore(s => s.reset)
  const addItem = useCartStore(s => s.addItem)
  const updateGuidance = useGuidanceStore(s => s.updateGuidance)

  const accentColor = division === 'sanitary' ? 'accent-cyan' : 'accent-amber'
  const accentHex = division === 'sanitary' ? '#00E5FF' : '#FFD600'

  const handleConfirm = () => {
    const result = confirmPick()
    if (result) {
      addItem(result.product, result.quantity)
      updateGuidance(
        `${result.product.name} (x${result.quantity}) picked and added to cart. Ready for next selection.`,
        `System Status: Pick Confirmed | Item added to billing queue`
      )
      // Reset simulation after a brief delay
      setTimeout(() => reset(), 500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute top-4 right-4 z-30 glass-strong rounded-xl p-4 max-w-xs border border-white/10 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full animate-pulse ${division === 'sanitary' ? 'bg-accent-cyan' : 'bg-accent-amber'}`} />
        <span className="text-xs font-semibold text-white/90">ESP32 Signal Received</span>
      </div>

      <div className="h-px bg-white/5 mb-3" />

      {/* Details */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Shelf</span>
          <span className="text-xs font-mono font-medium text-white/80">{product.shelfLocation.zone}-{product.shelfLocation.rack}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Product</span>
          <span className="text-xs font-medium text-white/80 text-right max-w-[60%]">{product.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Quantity</span>
          <span className="text-xs font-bold text-white/90">x{useSimulationStore.getState().activeQuantity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Status</span>
          <span className={`text-xs font-medium ${division === 'sanitary' ? 'text-accent-cyan' : 'text-accent-amber'}`}>
            Awaiting Pick
          </span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className={`w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-lg border transition-all ${
          division === 'sanitary'
            ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30 hover:bg-accent-cyan/30'
            : 'bg-accent-amber/20 text-accent-amber border-accent-amber/30 hover:bg-accent-amber/30'
        }`}
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Simulate Staff Confirmation
      </button>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-white/20" />
          <span className="text-[10px] text-white/20 font-mono">
            Protocol: MQTT | Node: Connected
          </span>
        </div>
      </div>
    </motion.div>
  )
}
