import { NextResponse } from 'next/server'

const API_KEY  = 'Vio3QKV5fuFDizFmiivXQlBhvgKkB4NATms6qa1IudVegWlMtZQ5G9WhwMq3'
const BASE_URL = 'https://golivri.ecotrack.dz/api/v1'

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/get/fees`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[Ecotrack] fees error:', res.status, await res.text())
      return NextResponse.json({ error: `Ecotrack ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    console.log('[Ecotrack] fees OK — clés:', Object.keys(data))
    return NextResponse.json(data)
  } catch (err) {
    console.error('[Ecotrack] fees exception:', err)
    return NextResponse.json({ error: 'Erreur réseau Ecotrack' }, { status: 500 })
  }
}
