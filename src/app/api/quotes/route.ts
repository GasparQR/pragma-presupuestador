import { NextRequest, NextResponse } from 'next/server'
import { getQuotes, saveQuote, deleteQuote, Quote } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getQuotes())
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Quote
  const saved = saveQuote(body)
  return NextResponse.json(saved)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  deleteQuote(id)
  return NextResponse.json({ ok: true })
}
