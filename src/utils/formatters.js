/**
 * Format number as Indian Rupees
 * e.g., formatINR(2499) → "₹2,499"
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format GST rate for display
 * e.g., formatGST(18) → "18%"
 */
export function formatGST(rate) {
  return `${rate}%`
}

/**
 * Calculate line total before tax
 */
export function calculateLineTotal(price, quantity) {
  return price * quantity
}

/**
 * Calculate tax breakdown for an invoice
 * Returns CGST and SGST amounts (each = half of total GST)
 */
export function calculateTaxBreakdown(subtotal, items) {
  // Calculate total GST amount
  let totalGst = 0
  for (const item of items) {
    const lineTotal = calculateLineTotal(item.price, item.quantity)
    const gstAmount = Math.round(lineTotal * item.gstRate / 100)
    totalGst += gstAmount
  }
  const cgst = Math.round(totalGst / 2)
  return {
    cgst,
    sgst: totalGst - cgst, // ensures cgst + sgst === totalGst even when odd
    totalGst,
  }
}

/**
 * Format date as DD Mmm YYYY
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
