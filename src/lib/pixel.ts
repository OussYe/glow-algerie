declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: ((...args: unknown[]) => void) | null
      queue: unknown[][]
      loaded?: boolean
      version?: string
      push?: (...args: unknown[]) => void
    }
    _fbq?: unknown
  }
}

/**
 * Injecte le SDK fbevents.js et crée le stub officiel Facebook.
 * Identique au snippet officiel Meta Pixel — le stub queue les appels
 * jusqu'à ce que le SDK soit chargé, puis les flush automatiquement.
 */
export function loadPixelScript(): void {
  if (typeof window === 'undefined') return
  if (window.fbq) return

  // Créer le stub AVANT d'ajouter le script (même ordre que le snippet officiel)
  const n = function (...args: unknown[]) {
    if (n.callMethod) {
      // SDK chargé → traitement direct
      n.callMethod.apply(n, args)
    } else {
      // SDK pas encore chargé → mise en file d'attente
      n.queue.push(args)
    }
  } as typeof window.fbq

  n.push = n
  n.queue = []
  n.loaded = true
  n.version = '2.0'
  // NE PAS définir callMethod ici — c'est le SDK qui le définit au chargement

  window.fbq = n
  window._fbq = n

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
}

export function initPixel(pixelId: string): void {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('init', pixelId)
}

export function trackSingle(pixelId: string, event: string, data?: object): void {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('trackSingle', pixelId, event, data)
}
