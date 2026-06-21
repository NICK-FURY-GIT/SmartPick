# SmartPick — Interactive Warehouse Picking Simulation

**Date:** 2026-06-21
**Project:** SmartPick & Bill Ecosystem
**Business:** Shree Ganpati Agency (Official Jaquar Distributor)

---

## 1. Overview

An immersive, animation-driven single-page application built in React.js that simulates a **Smart Pick-to-Light** warehouse automation system integrated with a retail billing counter. The application acts as a digital twin of the physical store layout — a presentation demo for management, investors, and clients showing how ESP32-driven wireless shelf identification reduces order-fulfillment time and eliminates manual picking errors in a multi-floor retail environment.

**Target Audience:** Store management, investors, clients (presentation context)
**Primary Value:** Visual proof-of-concept *before* physical microcontroller deployment

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | React 18 (Vite SPA) | Fastest bundler for React SPA, zero-config Tailwind integration |
| **Styling** | Tailwind CSS 3 | Dark UI, glassmorphism utilities, rapid layout iteration |
| **Animation** | Framer Motion 11 | Declarative animations, shared layout transitions, scroll control |
| **State** | Zustand 5 | ~1KB gzipped, built-in persist middleware, clean store boundaries |
| **Icons** | Lucide React | Line-based iconography, no emoji used anywhere in the UI |
| **Audio** | Web Audio API | Programmatic beep generation — no audio file to ship or manage |

### Theme Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--accent-cyan` | `#00E5FF` | Sanitary division borders, signals, glow effects |
| `--accent-amber` | `#FFD600` | Hardware division borders, signals, glow effects |
| `--bg-base` | `#0A0A0F` | Main background (near-black) |
| `--bg-card` | `rgba(255,255,255,0.03)` | Glassmorphism card surface |
| `--bg-glass` | `rgba(255,255,255,0.08)` | Modal/sheet surfaces |
| `--border-glass` | `rgba(255,255,255,0.10)` | Subtle borders on glass surfaces |

No standard emoji anywhere in the UI. All icons via Lucide React.

---

## 3. Project Structure

```
smartpick/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                    (Tailwind directives + glassmorphism utilities)
│   ├── data/
│   │   └── products.js             (Full product catalog, ~10-15 items per division)
│   ├── stores/
│   │   ├── simulationStore.js      (Workflow: idle → signaling → blinking → confirmed)
│   │   ├── cartStore.js            (Cart items + billing, optional persist middleware)
│   │   └── guidanceStore.js        (Instruction text + persistence toggle flag)
│   ├── hooks/
│   │   └── useAudio.js             (Web Audio API beep generator)
│   ├── components/
│   │   ├── GuidanceSystem.jsx      (Persistent instruction ribbon)
│   │   ├── TabSelector.jsx         (Floor toggle tabs)
│   │   ├── FloorMap.jsx            (Main layout container)
│   │   ├── FloorSection.jsx        (One floor: showcase + godown)
│   │   ├── ShowcaseShelf.jsx       (Display area grid)
│   │   ├── ProductCard.jsx         (Clickable product item)
│   │   ├── GodownShelf.jsx         (Warehouse rack with blink glow)
│   │   ├── SignalBeam.jsx          (Animated neon signal arc)
│   │   ├── SimulationPanel.jsx     (ESP32 status popup)
│   │   ├── StaffAvatar.jsx         (Staff presence indicator)
│   │   ├── SmartCart.jsx           (Floating side panel cart)
│   │   ├── InvoiceModal.jsx        (GST invoice overlay)
│   │   └── PersistenceToggle.jsx   (Save/load state switch)
│   └── utils/
│       ├── formatters.js           (INR price, GST formatting)
│       └── invoiceGenerator.js     (Builds invoice data from cart)
```

---

## 4. Data Layer — Product Catalog

A single `src/data/products.js` module exports an array. Each product object:

```js
{
  id: 'san-shower-001',
  name: 'Jaquar Essenza Hand Shower Chrome',
  category: 'Showers',
  division: 'sanitary',              // 'sanitary' | 'hardware'
  price: 2499,                       // selling price
  mrp: 2999,
  unit: 'piece',
  hsnCode: '8481',
  gstRate: 18,                       // percentage
  shelfLocation: { zone: 'A', rack: 102 },
  godownSection: 'top-godown',       // 'top-godown' | 'ground-godown'
  stock: 50,
}
```

**Catalog scale:** ~10-15 representative products per division, drawn from standard Jaquar product lines plus common hardware categories (locks, tools, fasteners). The data file is a plain JS module — easy to swap for a JSON endpoint or spreadsheet import later.

**Future extension path:** Replace the static module with an async data fetcher. The component layer reads from the same products array shape, so components don't change.

---

## 5. State Management — Zustand Stores

### simulationStore

```js
{
  step: 'idle',                      // 'idle' | 'signaling' | 'blinking' | 'confirmed'
  activeProduct: null | Product,
  activeQuantity: 1,
  activeShelf: null | string,
  isSignaling: false,
  isBlinking: false,
}

// Actions:
  selectProduct(product, qty)         // Sets active product, step → 'signaling'
  completeSignal()                    // Signal animation ends, step → 'blinking'
  confirmPick()                       // Staff confirms, step → 'confirmed', clears after push
  reset()                             // Back to idle
```

### cartStore

```js
{
  items: [{ product, quantity, pickedAt }],
  showBill: false,
  invoiceNumber: null,
}

// Actions:
  addItem(product, quantity)          // Pushed when confirmPick completes
  removeItem(id)
  clearCart()
  generateBill()                      // Sets showBill: true, generates invoice number
  dismissBill()

// Middleware: Zustand 'persist' — enabled/disabled by guidanceStore flag
```

### guidanceStore

```js
{
  instructionText: 'Select a product to begin...',
  technicalSubtext: 'System Status: Ready | ESP32 Nodes: Online',
  persistenceEnabled: true,
}

// Actions:
  updateGuidance(text, subtext)
  togglePersistence()
```

---

## 6. Component Architecture & Responsibilities

### Root: App.jsx
Arranges the primary layout: left content area (GuidanceSystem + TabSelector + FloorMap) with right-panel SmartCart overlay. Full viewport, no scrolling body — internal scroll zones per floor section.

### GuidanceSystem.jsx
Fixed strip at top. Two-line display: bold instruction text + smaller technical subtext. Animates text changes with Framer Motion `AnimatePresence` (fade up). Always visible regardless of simulation state.

### TabSelector.jsx
Glowing pill-style toggle: **Sanitary Division** (cyan accent) | **Hardware Division** (amber accent). Active tab gets a neon underline + glow. Swapping tabs mid-simulation auto-completes any in-progress pick first (guidanceStore update, item pushed to cart).

### FloorMap.jsx
Renders the active `FloorSection` based on current tab. Handles viewport scroll/pan via Framer Motion `useScroll` when a blink auto-focuses a godown shelf.

### FloorSection.jsx
Divided into two connected areas:
- **Showcase area** (top 60%): Product cards in a responsive grid
- **Godown area** (bottom 40%): Warehouse rack visualization with shelf slots

A subtle dashed connector line with an arrow runs between the showcase and the godown, suggesting the "signal path."

### ProductCard.jsx
Tailwind glassmorphism card with product name, category badge, price, an inline quantity stepper (+/- buttons with number display, range 1-99), and a "Pick" button. Disabled during `step === 'signaling'` or `step === 'blinking'`. Clicking "Pick" triggers `selectProduct(product, quantity)`.

### SignalBeam.jsx
Conditional animated element. Uses Framer Motion `motion.path` or `motion.div` with `layoutId` to trace a neon beam from the clicked ProductCard position to the target GodownShelf. Two color variants: cyan for sanitary, amber for hardware. Duration: ~0.8s. On animation complete, calls `simulationStore.completeSignal()`.

### GodownShelf.jsx
Warehouse rack representation with shelf labels (A-101, A-102, etc.). When `isBlinking === true`, applies a pulsing neon border glow animation (Framer Motion keyframes, box-shadow oscillation). Displays quantity overlay. Color-matched to division accent.

### SimulationPanel.jsx
Premium glassmorphism popup positioned above the blinking shelf:
```
┌──────────────────────────────┐
│  ● ESP32 Signal Received     │
│  ─────────────────────────    │
│  Shelf: A-102                │
│  Quantity: 2                 │
│  Status: ⏳ Awaiting Pick... │
│                              │
│  [Simulate Confirmation]     │
│                              │
│  System: MQTT Connected      │
└──────────────────────────────┘
```
The confirmation button calls `simulationStore.confirmPick()`, which ends the blink, removes the panel, and pushes the item to cartStore.

### StaffAvatar.jsx
A stylized minimal icon (Lucide `User` icon) that fades in next to the blinking shelf to represent staff presence. Pulses slowly while active. Removes on confirmation.

### SmartCart.jsx
Floating panel anchored to the right edge. Expandable/collapsible. Shows:
- Item count badge
- Scrollable item list (product name, qty, line total)
- Grand total (formatted INR)
- "Generate Bill" button (disabled when empty)
- Proforma/GST toggle

Items animate in using Framer Motion layout animations (slide in from left).

### InvoiceModal.jsx
Full-screen glassmorphism overlay. The printable invoice:
- Letterhead: **Shree Ganpati Agency** (with tagline: "Official Jaquar Distributor")
- Invoice number (auto-generated: `SGA-2026-XXXX`)
- Date
- Tabular item listing with Sr.No, HSN Code, Product, Quantity, Rate, Taxable Value, GST, Total
- Subtotal
- Tax breakdown (CGST 9% + SGST 9%)
- Grand Total
- Footer notes

Two modes controlled by the Proforma/GST toggle:
- **Proforma:** No tax breakdown, simpler table
- **GST Invoice:** Full tax breakdown with CGST/SGST/TOTAL lines

A "Print" button triggers `window.print()` with print-specific CSS.

### PersistenceToggle.jsx
Small toggle switch in the app header. Label: "Persist Session". On = cart + picked items save to localStorage via Zustand persist middleware. Off = ephemeral session, clears saved data.

---

## 7. Simulation Workflow — Complete Cycle

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  IDLE    │ ──> │SIGNALING │ ──> │ BLINKING │ ──> │CONFIRMED │ ──> │  BILLING │
│          │     │          │     │          │     │          │     │          │
│ Select   │     │ Beam     │     │ Shelf    │     │ Item →   │     │ Generate │
│ product  │     │ animates │     │ pulsing  │     │ Cart     │     │ Invoice  │
│          │     │ beep     │     │ panel    │     │          │     │          │
│          │     │          │     │ avatar   │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
```

**Step-by-step:**

1. **Idle → Signaling:** User clicks a ProductCard. `simulationStore.selectProduct()` fires. Guidance updates to "Signal sent to warehouse..."

2. **Signaling:** SignalBeam animates across the UI (~0.8s). Web Audio beep plays (440Hz sine, 150ms). All other ProductCards become disabled.

3. **Signaling → Blinking:** `SignalBeam.onAnimationComplete` fires `completeSignal()`. GodownShelf starts pulsing glow. SimulationPanel opens with ESP32 details. StaffAvatar fades in. Framer Motion `scrollTo()` brings the shelf into focus. Guidance: "ESP32 node triggered — awaiting staff confirmation."

4. **Blinking → Confirmed:** User clicks "Simulate Staff Confirmation" in the panel. `confirmPick()` fires. Glow stops. Panel closes. Avatar fades out. Product pushed to cartStore with quantity and timestamp. Guidance: "Item picked and added to cart."

5. **Confirmed:** User can select another product (back to step 1) or click "Generate Bill" in SmartCart.

6. **Billing:** InvoiceModal opens with full GST breakdown. User can print or dismiss and continue picking.

### Edge Cases Handled:
- **Double-click prevention:** All ProductCards disabled during `signaling` and `blinking` states
- **Tab switch mid-pick:** Auto-completes the current pick (push to cart) before switching floors
- **Empty cart:** "Generate Bill" button visually disabled with tooltip
- **Browser audio block:** First user interaction initializes AudioContext; subsequent beeps use the existing context silently on failure
- **Rapid consecutive picks:** Each pick goes through full cycle independently
- **Shelf already blinking:** Cannot signal a shelf that is currently blinking

---

## 8. Billing & Invoice Format

### SmartCart Features
- **Running total:** INR-formatted subtotal + GST computed in real-time
- **Proforma/GST toggle:** Switches between simplified and tax-inclusive views
- **Remove items:** Each cart item has a remove action — only available when not in bill generation

### GST Invoice Breakdown
For 18% GST items: CGST = 9% of taxable value, SGST = 9% of taxable value.

### Invoice Data Generation
`invoiceGenerator.js` takes the cart items array and produces:
```js
{
  invoiceNumber: 'SGA-2026-0001',
  date: '2026-06-21',
  items: [/* enriched with line totals */],
  subtotal: 5897,
  taxSummary: { CGST: 531, SGST: 531 },
  grandTotal: 6959,
  gstin: '07XXXXXXXXXXXXX',    // placeholder
}
```

---

## 9. Persistence

When `persistenceEnabled === true`:
- `cartStore` wraps with Zustand `persist` middleware (key: `smartpick-cart`)
- On reload, cart restores automatically
- Workflow state does NOT persist mid-cycle (guidance resets to starting state)
- Toggling **off** clears localStorage for the store key

---

## 10. Animations Reference

| Animation | Element | Technique | Duration |
|-----------|---------|-----------|----------|
| Neon signal beam | SignalBeam | Framer Motion `motion.path` stroke-dashoffset | 0.8s |
| Shelf blink glow | GodownShelf | keyframes `boxShadow` transparent → accent → transparent | 1.2s loop |
| Panel entrance | SimulationPanel | spring `scale: [0.9, 1]` + `opacity: [0, 1]` | 0.3s |
| Avatar fade | StaffAvatar | `opacity: [0, 1]` + y-bounce | 0.4s |
| Cart entry | SmartCart items | `layoutId` shared with ProductCard | 0.5s |
| Modal overlay | InvoiceModal | backdrop blur ramp + scale spring | 0.4s |
| Tab switch | TabSelector | `layoutId` on active indicator pill | 0.2s |
| Guidance text swap | GuidanceSystem | `AnimatePresence` mode "wait" | 0.2s |

---

## 11. Performance Considerations

- **Granular Zustand selectors:** Components subscribe only to the slices they need
- **GPU animations:** Framer Motion defaults to `transform`/`opacity` — no layout thrash
- **Beep cleanup:** `OscillatorNode` disconnects after 150ms — zero memory leak
- **No router overhead:** Single-page, no React Router

---

## 12. Non-Goals (Out of Scope for v1)

- Actual ESP32/WebSocket/MQTT communication (simulated visually)
- Authentication or user roles
- Database backend (ephemeral + optional localStorage only)
- Multi-language support
- Mobile optimization (degrades gracefully, targets 1440px+)
- CI/CD, Docker, deployment config

---

## 13. Implementation Order

1. Scaffold: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/index.css`, `src/main.jsx`
2. Data layer: `src/data/products.js`
3. Utilities: `src/utils/formatters.js`, `src/utils/invoiceGenerator.js`
4. Store layer: 3 Zustand stores
5. Hook: `src/hooks/useAudio.js`
6. Root + shell: `App.jsx`, `GuidanceSystem.jsx`, `TabSelector.jsx`
7. Core display: `FloorMap.jsx`, `FloorSection.jsx`, `ShowcaseShelf.jsx`, `ProductCard.jsx`
8. Simulation: `SignalBeam.jsx`, `GodownShelf.jsx`, `SimulationPanel.jsx`, `StaffAvatar.jsx`
9. Billing: `SmartCart.jsx`, `InvoiceModal.jsx`
10. Persistence: `PersistenceToggle.jsx`
11. Polish pass

---

## 14. Verification

After implementation:
1. `npm run dev` starts without errors
2. Tab switch between Sanitary and Hardware works
3. Click ProductCard → signal beam animates → shelf blinks → panel appears → beep plays
4. Click "Simulate Confirmation" → blink stops → item appears in SmartCart
5. Multiple picks → cart total updates correctly
6. Toggle Proforma/GST → invoice view switches
7. Enable persistence → refresh → cart restores
8. Disable persistence → refresh → cart is empty
9. Rapid clicks during signaling are blocked
10. Tab switch mid-blink auto-completes the pick
