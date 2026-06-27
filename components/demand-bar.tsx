'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface Props {
  totalActive: number
  rentTotal: number
  saleTotal: number
  leaseTotal: number
}

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const triggered = useRef(false)
  const elRef = useRef<HTMLAnchorElement>(null)

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

  const pills = [
    rentTotal > 0 ? `${rentTotal} rent seekers` : '',
    saleTotal > 0 ? `${saleTotal} buyers` : '',
    leaseTotal > 0 ? `${leaseTotal} lease seekers` : '',
  ].filter(Boolean)

  return (
    <Link
      href="/list"
      className="hd-demand-bar"
      ref={elRef}
      aria-label={`Live local demand — ${totalActive} active requirements. List your property.`}
    >
      <span className="hd-demand-live">
        <span className="hd-demand-dot" aria-hidden />
        Live local demand
      </span>

      <span className="hd-demand-count" aria-live="polite">
        {count}<span className="hd-demand-plus">+</span>
      </span>
      <span className="hd-demand-label">active property requirements</span>

      {pills.length > 0 && (
        <div className="hd-demand-pills">
          {pills.map((p) => (
            <span key={p} className="hd-demand-pill">{p}</span>
          ))}
        </div>
      )}

      <span className="hd-demand-action">List property →</span>
    </Link>
  )
}
