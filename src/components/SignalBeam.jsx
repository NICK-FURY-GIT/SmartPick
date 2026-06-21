import { motion, AnimatePresence } from 'framer-motion'
import useSimulationStore from '../stores/simulationStore'

export default function SignalBeam({ division }) {
  const isSignaling = useSimulationStore(s => s.isSignaling)
  const completeSignal = useSimulationStore(s => s.completeSignal)
  const accentColor = division === 'sanitary' ? '#00E5FF' : '#FFD600'

  return (
    <AnimatePresence>
      {isSignaling && (
        <motion.div
          className="absolute inset-x-0 top-0 flex flex-col items-center pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Signal node */}
          <motion.div
            className="relative"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: [0, 120], opacity: [1, 0.6, 1] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onAnimationComplete={completeSignal}
          >
            {/* Glow dot */}
            <motion.div
              className="w-3 h-3 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.4, repeat: 2 }}
            />
            {/* Signal line */}
            <div
              className="w-0.5 h-24 bg-gradient-to-b"
              style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }}
            />
          </motion.div>

          {/* Label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-mono font-medium mt-1"
            style={{ color: accentColor }}
          >
            SIGNAL TRANSMITTING...
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
