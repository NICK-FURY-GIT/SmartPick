import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, FileText, X } from 'lucide-react'
import useCartStore from '../stores/cartStore'
import useSimulationStore from '../stores/simulationStore'
import { formatINR, calculateLineTotal } from '../utils/formatters'
import { generateInvoiceData } from '../utils/invoiceGenerator'

export default function SmartCart() {
  const items = useCartStore(s => s.items)
  const showBill = useCartStore(s => s.showBill)
  const invoiceType = useCartStore(s => s.invoiceType)
  const removeItem = useCartStore(s => s.removeItem)
  const generateBill = useCartStore(s => s.generateBill)
  const setInvoiceType = useCartStore(s => s.setInvoiceType)
  const step = useSimulationStore(s => s.step)

  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item.product.price, item.quantity), 0)
  const totalGst = items.reduce((sum, item) => {
    const lineTotal = calculateLineTotal(item.product.price, item.quantity)
    return sum + Math.round(lineTotal * item.product.gstRate / 100)
  }, 0)
  const grandTotal = subtotal + totalGst
  const isEmpty = items.length === 0

  return (
    <>
      {/* Cart Panel */}
      <div className="w-80 shrink-0 glass border-l border-white/5 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-white/50" />
            <span className="text-sm font-semibold text-white/80">Smart Cart</span>
            {!isEmpty && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                {items.length}
              </span>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-white/20">
                <ShoppingCart className="w-8 h-8 mb-2" />
                <p className="text-xs">Cart is empty</p>
                <p className="text-[10px] mt-1">Pick products from the floor</p>
              </div>
            ) : (
              items.map(item => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass rounded-lg p-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white/80 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        x{item.quantity} @ {formatINR(item.product.price)} /{item.product.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="shrink-0 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
                    <span className="text-[10px] text-white/40">Line Total</span>
                    <span className="text-xs font-semibold text-white/80">
                      {formatINR(calculateLineTotal(item.product.price, item.quantity))}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-white/5 p-4 space-y-3 shrink-0">
            {/* Invoice Type Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInvoiceType('proforma')}
                className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                  invoiceType === 'proforma'
                    ? 'bg-white/10 text-white/70'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                Proforma
              </button>
              <button
                onClick={() => setInvoiceType('gst')}
                className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                  invoiceType === 'gst'
                    ? 'bg-white/10 text-white/70'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                GST Invoice
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Subtotal</span>
                <span className="text-white/70">{formatINR(subtotal)}</span>
              </div>
              {invoiceType === 'gst' && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">GST</span>
                  <span className="text-white/50">{formatINR(totalGst)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/10">
                <span className="text-white/60">Total</span>
                <span className="text-white">
                  {invoiceType === 'gst' ? formatINR(grandTotal) : formatINR(subtotal)}
                </span>
              </div>
            </div>

            {/* Generate Bill */}
            <button
              onClick={generateBill}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg bg-gradient-to-r from-accent-cyan/30 to-accent-amber/30 text-white border border-white/10 hover:from-accent-cyan/40 hover:to-accent-amber/40 transition-all"
            >
              <FileText className="w-4 h-4" />
              Generate Bill
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showBill && (
          <InvoiceModal
            invoice={generateInvoiceData(items, invoiceType)}
            onDismiss={useCartStore.getState().dismissBill}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Invoice Modal ──
function InvoiceModal({ invoice, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{invoice.businessName}</h2>
              <p className="text-xs text-white/40 mt-0.5">{invoice.tagline}</p>
              <div className="mt-4 space-y-1">
                <p className="text-xs text-white/60">
                  Invoice: <span className="font-mono text-white/80">{invoice.invoiceNumber}</span>
                </p>
                <p className="text-xs text-white/60">
                  Date: <span className="text-white/80">{invoice.date}</span>
                </p>
                <p className="text-xs text-white/60">
                  Type: <span className="text-white/80 capitalize">{invoice.type}</span>
                </p>
                {invoice.type === 'gst' && (
                  <p className="text-xs text-white/60">
                    GSTIN: <span className="text-white/80">{invoice.gstin}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="text-xs px-3 py-1.5 rounded-lg glass text-white/60 hover:text-white/80 transition-colors"
              >
                Print
              </button>
              <button onClick={onDismiss} className="text-white/30 hover:text-white/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left pb-2 font-medium">#</th>
                <th className="text-left pb-2 font-medium">HSN</th>
                <th className="text-left pb-2 font-medium">Product</th>
                <th className="text-right pb-2 font-medium">Qty</th>
                <th className="text-right pb-2 font-medium">Rate</th>
                {invoice.type === 'gst' && <th className="text-right pb-2 font-medium">GST</th>}
                <th className="text-right pb-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.srNo} className="border-b border-white/5 text-white/70">
                  <td className="py-2">{item.srNo}</td>
                  <td className="py-2 font-mono">{item.hsnCode}</td>
                  <td className="py-2 max-w-[200px] truncate">{item.productName}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatINR(item.rate)}</td>
                  {invoice.type === 'gst' && (
                    <td className="py-2 text-right">{item.gstRate}%</td>
                  )}
                  <td className="py-2 text-right font-medium text-white">{formatINR(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 ml-auto w-64 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Subtotal</span>
              <span className="text-white/70">{formatINR(invoice.subtotal)}</span>
            </div>
            {invoice.type === 'gst' && (
              <>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">CGST @9%</span>
                  <span className="text-white/50">{formatINR(invoice.taxSummary.cgst)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">SGST @9%</span>
                  <span className="text-white/50">{formatINR(invoice.taxSummary.sgst)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
              <span className="text-white/60">Grand Total</span>
              <span className="text-white">{formatINR(invoice.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-[10px] text-white/20 text-center">
            This is a computer-generated invoice for demonstration purposes.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
