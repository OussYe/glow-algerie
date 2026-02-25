import { NextResponse } from 'next/server'

const API_KEY  = 'Vio3QKV5fuFDizFmiivXQlBhvgKkB4NATms6qa1IudVegWlMtZQ5G9WhwMq3'
const BASE_URL = 'https://golivri.ecotrack.dz/api/v1'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const res = await fetch(`${BASE_URL}/get/communes/${id}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[Ecotrack] communes error:', res.status, await res.text())
      return NextResponse.json({ error: `Ecotrack ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    console.log(`[Ecotrack] communes(${id}) OK — items:`, Array.isArray(data?.data) ? data.data.length : 'format inconnu')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[Ecotrack] communes exception:', err)
    return NextResponse.json({ error: 'Erreur réseau Ecotrack' }, { status: 500 })
  }
}
