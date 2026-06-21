import { motion } from 'framer-motion'

const TABS = [
  { id: 'sanitary', label: 'Sanitary Division', color: 'accent-cyan' },
  { id: 'hardware', label: 'Hardware Division', color: 'accent-amber' },
]

export default function TabSelector({ activeDivision, onSwitch }) {
  return (
    <div className="flex gap-1 px-6 py-3 shrink-0">
      {TABS.map(tab => {
        const isActive = activeDivision === tab.id
        const accentClass = tab.color === 'accent-cyan' ? 'text-accent-cyan border-accent-cyan' : 'text-accent-amber border-accent-amber'
        return (
          <button
            key={tab.id}
            onClick={() => onSwitch(tab.id)}
            className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? `text-white ${accentClass}`
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className={`absolute inset-0 rounded-lg border ${accentClass} opacity-40`}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
