import { motion } from 'framer-motion'
import { Package, PackageCheck } from 'lucide-react'
import { formatINR } from '../utils/formatters'

export default function GodownShelf({ shelfId, products, isBlinking, division }) {
  const accentColor = division === 'sanitary' ? '#00E5FF' : '#FFD600'
  const accentVar = division === 'sanitary'
    ? { boxShadow: ['0 0 5px #00E5FF40', '0 0 25px #00E5FF', '0 0 5px #00E5FF40'] }
    : { boxShadow: ['0 0 5px #FFD60040', '0 0 25px #FFD600', '0 0 5px #FFD60040'] }

  const totalItems = products.reduce((sum, p) => sum + p.stock, 0)
  const topProducts = products.slice(0, 3)

  return (
    <motion.div
      layout
      animate={isBlinking ? accentVar : { boxShadow: '0 0 0px transparent' }}
      transition={isBlinking ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      className={`glass rounded-xl p-3 border transition-colors ${
        isBlinking
          ? `border-${division === 'sanitary' ? 'accent-cyan/50' : 'accent-amber/50'}`
          : 'border-white/5 hover:border-white/10'
      }`}
    >
      {/* Shelf Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono font-bold ${
          isBlinking
            ? division === 'sanitary' ? 'text-accent-cyan' : 'text-accent-amber'
            : 'text-white/40'
        }`}>
          RACK {shelfId}
        </span>
        <span className="text-[10px] text-white/20">{totalItems} units</span>
      </div>

      {/* Shelf visual */}
      <div className={`h-1 rounded-full mb-2 ${
        isBlinking
          ? division === 'sanitary' ? 'bg-accent-cyan/30' : 'bg-accent-amber/30'
          : 'bg-white/5'
      }`} />

      {/* Products on this shelf */}
      <div className="space-y-1">
        {topProducts.map(p => (
          <div key={p.id} className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 truncate max-w-[70%]">
              <Package className="w-2.5 h-2.5 text-white/20 shrink-0" />
              <span className="text-white/50 truncate">{p.name}</span>
            </div>
            <span className="text-white/30 shrink-0 ml-1">{formatINR(p.price)}</span>
          </div>
        ))}
        {products.length > 3 && (
          <p className="text-[9px] text-white/20 text-center">+{products.length - 3} more items</p>
        )}
      </div>

      {/* Blink indicator */}
      {isBlinking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 flex items-center gap-1.5 justify-center"
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${division === 'sanitary' ? 'bg-accent-cyan' : 'bg-accent-amber'}`}
          />
          <span className={`text-[10px] font-medium ${division === 'sanitary' ? 'text-accent-cyan' : 'text-accent-amber'}`}>
            PICKING IN PROGRESS
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
