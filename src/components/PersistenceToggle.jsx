import { Save } from 'lucide-react'
import useGuidanceStore from '../stores/guidanceStore'

export default function PersistenceToggle() {
  const persistenceEnabled = useGuidanceStore(s => s.persistenceEnabled)
  const togglePersistence = useGuidanceStore(s => s.togglePersistence)

  return (
    <button
      onClick={togglePersistence}
      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all ${
        persistenceEnabled
          ? 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan'
          : 'glass border-white/5 text-white/30 hover:text-white/50'
      }`}
    >
      <Save className="w-3 h-3" />
      <span>{persistenceEnabled ? 'Persist ON' : 'Persist OFF'}</span>
    </button>
  )
}
