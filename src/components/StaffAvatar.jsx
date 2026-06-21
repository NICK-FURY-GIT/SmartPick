import { motion } from 'framer-motion'
import { User } from 'lucide-react'

export default function StaffAvatar({ division }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="absolute bottom-4 left-4 z-20 flex items-center gap-2 glass rounded-lg px-3 py-2"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-6 h-6 rounded-full ${
          division === 'sanitary' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-accent-amber/20 text-accent-amber'
        } flex items-center justify-center`}
      >
        <User className="w-3.5 h-3.5" />
      </motion.div>
      <div>
        <p className="text-[10px] font-medium text-white/70">Staff Assigned</p>
        <p className="text-[9px] text-white/30">Approaching shelf...</p>
      </div>
    </motion.div>
  )
}
