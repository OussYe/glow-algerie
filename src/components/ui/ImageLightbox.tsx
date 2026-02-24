'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from '@heroicons/react/24/outline'

type Props = {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex = 0, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + images.length) % images.length)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [images.length])

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(1, Math.min(4, z - e.deltaY * 0.002)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseUp = () => setDragging(false)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Contrôles zoom */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setZoom(z => Math.max(1, z - 0.5))}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <MagnifyingGlassMinusIcon className="w-5 h-5" />
        </button>
        <span className="flex items-center px-2 text-white text-sm bg-white/10 rounded-full">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(4, z + 0.5))}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <MagnifyingGlassPlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Image principale */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: dragging ? 'none' : 'transform 0.2s ease',
          }}
        >
          <Image
            src={images[current]}
            alt={`Image ${current + 1}`}
            width={1200}
            height={900}
            className="max-h-[80vh] max-w-[90vw] object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setZoom(1); setPan({ x: 0, y: 0 }) }}
              className={`w-14 h-14 rounded border-2 overflow-hidden transition ${
                i === current ? 'border-white' : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt="" width={56} height={56} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Compteur */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  )
}
