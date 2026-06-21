import { AnimatePresence, motion } from 'framer-motion'
import { PRODUCTS_BY_DIVISION } from '../data/products'
import FloorSection from './FloorSection'

export default function FloorMap({ division }) {
  const products = PRODUCTS_BY_DIVISION[division] || []

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={division}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <FloorSection
          division={division}
          products={products}
        />
      </motion.div>
    </AnimatePresence>
  )
}
