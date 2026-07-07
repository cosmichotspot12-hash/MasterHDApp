'use client'

import { useEffect } from 'react'

// Prevents mouse-wheel scrolling from changing the value of a focused
// number input — the browser default that surprises users mid-scroll.
export default function NumberInputGuard() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const target = e.target as HTMLElement | null
      if (
        target instanceof HTMLInputElement &&
        target.type === 'number' &&
        document.activeElement === target
      ) {
        e.preventDefault()
      }
    }

    // Must be non-passive so preventDefault takes effect.
    document.addEventListener('wheel', onWheel, { passive: false })
    return () => document.removeEventListener('wheel', onWheel)
  }, [])

  return null
}
