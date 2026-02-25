'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from '@heroicons/react/24/outline'

export type LightboxItem = { type: 'image' | 'video'; url: string }

type Props = {
  media: LightboxItem[]
  initialIndex?: number
  onClose: () => void
}

export default function ImageLightbox({ media, initialIndex = 0, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const [zoom, setZoom]       = useState(1)
  const [pan, setPan]         = useState({ x: 0, y: 0 })
  const [dragging, setDragging]   = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const item    = media[current]
  const isVideo = item?.type === 'video'

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + media.length) % media.length)
    resetView()
  }, [media.length])

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % media.length)
    resetView()
  }, [media.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  // Reset zoom quand on passe sur une vidéo
  useEffect(() => { if (isVideo) resetView() }, [isVideo])

  const handleWheel = (e: React.WheelEvent) => {
    if (isVideo) return
    e.preventDefault()
    setZoom(z => Math.max(1, Math.min(4, z - e.deltaY * 0.002)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVideo || zoom <= 1) return
    setDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setDragging(false)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Contrôles zoom (images seulement) */}
      {!isVideo && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button onClick={() => setZoom(z => Math.max(1, z - 0.5))}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
            <MagnifyingGlassMinusIcon className="w-5 h-5" />
          </button>
          <span className="flex items-center px-2 text-white text-sm bg-white/10 rounded-full">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(z => Math.min(4, z + 0.5))}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Zone principale */}
      <div
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden px-16"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: !isVideo && zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {item?.type === 'image' && (
          <div style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: dragging ? 'none' : 'transform 0.2s ease',
          }}>
            <Image
              src={item.url}
              alt={`Média ${current + 1}`}
              width={1200}
              height={900}
              className="max-h-[80vh] max-w-[90vw] object-contain select-none"
              draggable={false}
            />
          </div>
        )}

        {item?.type === 'video' && (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            className="max-h-[80vh] max-w-[90vw] rounded-xl bg-black"
          />
        )}
      </div>

      {/* Navigation gauche / droite */}
      {media.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Miniatures en bas */}
      {media.length > 1 && (
        <div className="absolute bottom-4 flex gap-2 flex-wrap justify-center px-16">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetView() }}
              className={`w-14 h-14 rounded border-2 overflow-hidden transition flex-shrink-0 ${
                i === current ? 'border-white' : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              {m.type === 'image' ? (
                <Image src={m.url} alt="" width={56} height={56} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <PlayIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Compteur */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm">
        {current + 1} / {media.length}
      </div>
    </div>
  )
}
