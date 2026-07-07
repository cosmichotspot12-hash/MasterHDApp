'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function PropertyGallery({
  photos,
  title,
}: {
  photos: string[]
  title: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePhoto = photos[activeIndex] ?? photos[0]

  return (
    <section className="overflow-hidden rounded-lg border border-[#dedbd2] bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#fbf1e4]">
        <Image
          src={activePhoto}
          alt={title}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto border-t border-[#dedbd2] bg-white p-2 sm:p-3">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={'View photo ' + (i + 1)}
              aria-current={i === activeIndex}
              className={
                'flex-shrink-0 overflow-hidden rounded-md border-2 transition ' +
                (i === activeIndex
                  ? 'border-[#9f4a22]'
                  : 'border-[#dedbd2] opacity-70 hover:opacity-100')
              }
            >
              <Image
                src={photo}
                alt={'Property photo ' + (i + 1)}
                width={224}
                height={160}
                className="h-16 w-24 object-cover sm:h-20 sm:w-28"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
