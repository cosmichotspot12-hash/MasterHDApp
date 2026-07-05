'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  totalActive: number
  rentTotal: number
  saleTotal: number
  leaseTotal: number
}

/** Animate all provided numbers together once the bar scrolls into view. */
function useCountUp(targets: number[], duration = 1600) {
  const [progress, setProgress] = useState(0)
  const elRef = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const node = elRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            setProgress(1 - Math.pow(1 - t, 3))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [duration])

  const values = targets.map((target) => Math.round(progress * target))
  return { values, elRef }
}

export default function DemandBar({ totalActive, rentTotal, saleTotal, leaseTotal }: Props) {
  const stats = [
    { value: totalActive, label: 'Active requirements', plus: true, highlight: true },
    rentTotal > 0 ? { value: rentTotal, label: 'Rent seekers' } : null,
    saleTotal > 0 ? { value: saleTotal, label: 'Buyers' } : null,
    leaseTotal > 0 ? { value: leaseTotal, label: 'Lease seekers' } : null,
  ].filter(Boolean) as { value: number; label: string; plus?: boolean; highlight?: boolean }[]

  const { values, elRef } = useCountUp(stats.map((s) => s.value))

  return (
    <div className="hd-demand-bar" ref={elRef}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={'hd-stat' + (stat.highlight ? ' hd-stat-primary' : '')}
        >
          <span className="hd-stat-value" aria-live={i === 0 ? 'polite' : undefined}>
            {values[i]}
            {stat.plus && <span className="hd-stat-plus">+</span>}
          </span>
          <span className="hd-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
