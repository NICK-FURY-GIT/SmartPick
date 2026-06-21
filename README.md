# 🏭 SmartPick — Interactive Warehouse Picking Simulation

<div align="center">

**A React.js digital twin simulating an ESP32-driven Pick-to-Light warehouse automation system with integrated GST billing**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://github.com/pmndrs/zustand)

**Business:** Shree Ganpati Agency — Official Jaquar Distributor

</div>

---

## 📋 Overview

SmartPick is an immersive, animation-driven **single-page application** that simulates how ESP32-powered wireless shelf identification can transform warehouse order fulfillment. Built as a presentation demo for management, investors, and clients, it acts as a **digital twin** of a multi-floor retail store layout — demonstrating how technology reduces picking errors and cuts fulfillment time *before* deploying physical hardware.

### The Problem

In a multi-floor retail store (Sanitary on top floor, Hardware on ground floor), when a customer selects a product, the manager must either verbally call warehouse staff or physically walk to verify and fetch stock — slow, error-prone, and inefficient.

### The Solution

Wi-Fi enabled ESP32 microcontrollers attached to each godown shelf create a **Pick-to-Light** system. The central dashboard sends a wireless signal → the target shelf blinks with a neon glow → staff instantly identifies the location → confirms the pick → the item flows to billing.

---

## ✨ Features

### 🎮 Interactive Simulation Workflow

```
IDLE → SIGNALING → BLINKING → CONFIRMED → BILLING
```

| Step | What Happens |
|------|-------------|
| **1. Select** | Click a product card, set quantity |
| **2. Signal** | Neon beam animates to the godown shelf + audio beep |
| **3. Blink** | Target shelf pulses with glow, ESP32 panel appears |
| **4. Confirm** | "Simulate Staff Confirmation" → item added to cart |
| **5. Bill** | Generate GST/Proforma invoice |

### 🖥️ Smart Cart & Billing
- Floating side panel with live totals
- GST invoice with CGST (9%) + SGST (9%) breakdown
- Proforma mode for simplified view
- Printable invoice with Shree Ganpati Agency branding
- Auto-generated invoice numbers (`SGA-2026-XXXX`)

### 💾 Session Persistence
- Optional localStorage persistence via Zustand `persist` middleware
- Toggle ON/OFF — clears saved data when disabled

### ⚡ Edge Cases Handled
- Double-click prevention during active picks
- Tab switch mid-pick auto-completes the workflow
- Browser audio block handled gracefully
- Consecutive picks cycle independently

---

## 🏗️ Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | React 18 (Vite SPA) |
| **Styling** | Tailwind CSS 3 — Dark glassmorphism theme |
| **Animations** | Framer Motion 11 — Signal beam, shelf glow, modals |
| **State** | Zustand 5 — Simulation workflow, cart, guidance |
| **Icons** | Lucide React — No emoji anywhere |
| **Audio** | Web Audio API — Programmatic beep (no audio files) |

### Theme

```
🎨 Sanitary Division — Cyan (#00E5FF)
🎨 Hardware Division — Amber (#FFD600)
🌑 Background — Near-black (#0A0A0F)
🪟 Surfaces — Glassmorphism (rgba white overlays)
```

---

## 📁 Project Structure

```
smartpick/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx                  # React 18 entry point
│   ├── App.jsx                   # Root layout
│   ├── index.css                 # Tailwind + glassmorphism utilities
│   ├── data/
│   │   └── products.js           # 20 products (10 sanitary + 10 hardware)
│   ├── stores/
│   │   ├── simulationStore.js    # Workflow state machine
│   │   ├── cartStore.js          # Cart + billing state
│   │   └── guidanceStore.js      # Instruction text + persistence
│   ├── hooks/
│   │   └── useAudio.js           # Web Audio API beep generator
│   ├── components/
│   │   ├── GuidanceSystem.jsx    # Persistent instruction ribbon
│   │   ├── TabSelector.jsx       # Floor toggle tabs
│   │   ├── FloorMap.jsx          # Main layout container
│   │   ├── FloorSection.jsx      # Showcase + godown area
│   │   ├── ProductCard.jsx       # Clickable product with quantity stepper
│   │   ├── GodownShelf.jsx       # Warehouse rack with blink animation
│   │   ├── SignalBeam.jsx        # Animated neon signal beam
│   │   ├── SimulationPanel.jsx   # ESP32 status popup
│   │   ├── StaffAvatar.jsx       # Staff presence indicator
│   │   ├── SmartCart.jsx         # Floating cart panel
│   │   ├── InvoiceModal.jsx      # GST invoice overlay
│   │   └── PersistenceToggle.jsx # Save/load state switch
│   └── utils/
│       ├── formatters.js         # INR, GST formatting
│       └── invoiceGenerator.js   # Invoice data builder
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/NICK-FURY-GIT/SmartPick.git
cd SmartPick

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
# Output in dist/
```

---

## 🎯 How to Use

1. **Select a Division** — Click **Sanitary** or **Hardware** tab
2. **Pick a Product** — Browse products, set quantity (1–99), click **Pick**
3. **Watch the Simulation** — Signal beam animates → shelf blinks → ESP32 panel appears
4. **Confirm the Pick** — Click **Simulate Staff Confirmation**
5. **Review Cart** — Items appear in the right-side SmartCart
6. **Generate Invoice** — Click **Generate Bill** → choose Proforma or GST → Print

### Persistence Toggle

Click **Persist ON/OFF** in the header:
- **ON** → Cart saves to localStorage, survives page reload
- **OFF** → Ephemeral session, clears saved data

---

## 📄 Invoice Format

### GST Invoice
| Field | Details |
|-------|---------|
| Letterhead | Shree Ganpati Agency (Official Jaquar Distributor) |
| Invoice No | `SGA-2026-XXXX` |
| Tax Breakdown | CGST 9% + SGST 9% |
| Items | Sr.No, HSN Code, Product, Qty, Rate, Taxable Value, GST, Total |

### Proforma
Simplified view without tax breakdown lines.

---

## 🔮 Future Roadmap

- [ ] Real ESP32/WebSocket/MQTT communication
- [ ] Multi-language support (Hindi/English)
- [ ] Mobile-responsive layout
- [ ] Database backend (beyond localStorage)
- [ ] Authentication & user roles

---

## 🧪 Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] Tab switch between Sanitary and Hardware works
- [ ] ProductCard → signal beam → shelf blink → panel → beep
- [ ] Confirm pick → blink stops → item in SmartCart
- [ ] Multiple picks → cart total updates correctly
- [ ] Proforma/GST toggle → invoice view switches
- [ ] Enable persistence → refresh → cart restores
- [ ] Disable persistence → refresh → cart is empty
- [ ] Rapid clicks during signaling are blocked
- [ ] Tab switch mid-blink auto-completes the pick

---

## 📝 License

Proprietary — **Shree Ganpati Agency**

---

<div align="center">
Built with ❤️ for Shree Ganpati Agency — Official Jaquar Distributor
</div>
