import { useRef, useCallback } from 'react'

/**
 * Web Audio API hook for the beep sound.
 * First call initializes AudioContext (browser autoplay policy).
 * Returns playBeep() — call on user interaction.
 */
export default function useAudio() {
  const ctxRef = useRef(null)

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const playBeep = useCallback((frequency = 440, duration = 150) => {
    try {
      const ctx = getContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

      oscillator.connect(gain)
      gain.connect(ctx.destination)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration / 1000)
    } catch {
      // Silently fail — audio is non-critical for the demo
    }
  }, [getContext])

  return { playBeep }
}
