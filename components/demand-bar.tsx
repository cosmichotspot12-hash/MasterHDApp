'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  totalActive: number
  rentTotal: number
  saleTotal: number
  leaseTotal: number
}

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0)
  const triggered = useRef(false)
  const elRef = useRef<HTMLDivElement>(null)

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
            const eased = 1 - Math.pow(1 - t, 3)
            setCount(Math.round(eased * target))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, elRef }
}

export default function DemandBar({ totalActive, rentTotal, saleTotal, leaseTotal }: Props) {
  const { count, elRef } = useCountUp(totalActive)

  const extras: { value: number; label: string }[] = []
  if (rentTotal > 0) extras.push({ value: rentTotal, label: 'Renting' })
  if (saleTotal > 0) extras.push({ value: saleTotal, label: 'Buying' })
  if (leaseTotal > 0) extras.push({ value: leaseTotal, label: 'Leasing' })

  return (
    <div className="hd-demand-bar" ref={elRef}>
      <div className="hd-demand-stat">
        <span className="hd-demand-count" aria-live="polite">
          {count}<span className="hd-demand-plus">+</span>
        </span>
        <span className="hd-demand-label">Active now</span>
      </div>

      {extras.map(({ value, label }) => (
        <span key={label}>
          <span className="hd-demand-div" aria-hidden />
          <div className="hd-demand-stat">
            <span className="hd-demand-count">{value}</span>
            <span className="hd-demand-label">{label}</span>
          </div>
        </span>
      ))}
    </div>
  )
}
