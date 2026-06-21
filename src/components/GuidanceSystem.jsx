import { AnimatePresence, motion } from 'framer-motion'
import useGuidanceStore from '../stores/guidanceStore'
import { Info } from 'lucide-react'

export default function GuidanceSystem() {
  const instructionText = useGuidanceStore(s => s.instructionText)
  const technicalSubtext = useGuidanceStore(s => s.technicalSubtext)

  return (
    <div className="px-6 py-3 glass border-b border-white/5 shrink-0">
      <div className="flex items-start gap-3">
        <Info className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
        <div className="min-h-[2.5rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={instructionText}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-white/90"
            >
              {instructionText}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-white/30 mt-0.5 font-mono">{technicalSubtext}</p>
        </div>
      </div>
    </div>
  )
}
