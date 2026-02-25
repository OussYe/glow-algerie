import { NextResponse } from 'next/server'

const API_KEY  = 'Vio3QKV5fuFDizFmiivXQlBhvgKkB4NATms6qa1IudVegWlMtZQ5G9WhwMq3'
const BASE_URL = 'https://golivri.ecotrack.dz/api/v1'

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/get/wilayas`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      // pas de cache Next.js pour forcer le fetch frais en dev
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[Ecotrack] wilayas error:', res.status, await res.text())
      return NextResponse.json({ error: `Ecotrack ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    console.log('[Ecotrack] wilayas OK — items:', Array.isArray(data?.data) ? data.data.length : 'format inconnu')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[Ecotrack] wilayas exception:', err)
    return NextResponse.json({ error: 'Erreur réseau Ecotrack' }, { status: 500 })
  }
}
