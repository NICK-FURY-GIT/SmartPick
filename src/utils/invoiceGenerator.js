import { calculateLineTotal, calculateTaxBreakdown, formatDate } from './formatters'

let invoiceCounter = 1

/**
 * Generate full invoice data from cart items
 *
 * @param {Array} items - Cart items with { product, quantity }
 * @param {'proforma'|'gst'} type - Invoice type
 * @returns {Object} Invoice data
 */
export function generateInvoiceData(items, type = 'gst') {
  const enrichedItems = items.map((item, index) => {
    const lineTotal = calculateLineTotal(item.product.price, item.quantity)
    const gstAmount = Math.round(lineTotal * item.product.gstRate / 100)
    return {
      srNo: index + 1,
      hsnCode: item.product.hsnCode,
      productName: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      rate: item.product.price,
      taxableValue: lineTotal,
      gstRate: item.product.gstRate,
      gstAmount,
      total: type === 'gst' ? lineTotal + gstAmount : lineTotal,
    }
  })

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.taxableValue, 0)
  const grandTotal = enrichedItems.reduce((sum, item) => sum + item.total, 0)
  // Map cart items ({ product, quantity }) to the flat shape calculateTaxBreakdown expects
  const taxItems = items.map(item => ({
    price: item.product.price,
    quantity: item.quantity,
    gstRate: item.product.gstRate,
  }))
  const taxSummary = calculateTaxBreakdown(subtotal, taxItems)

  const invoiceNumber = `SGA-2026-${String(invoiceCounter++).padStart(4, '0')}`

  return {
    invoiceNumber,
    date: formatDate(new Date()),
    items: enrichedItems,
    subtotal,
    taxSummary,
    grandTotal,
    type,
    gstin: '07XXXXXXXXXXXXX', // Placeholder — update with real GSTIN
    businessName: 'Shree Ganpati Agency',
    tagline: 'Official Jaquar Distributor',
  }
}
