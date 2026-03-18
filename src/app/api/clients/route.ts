import { NextRequest, NextResponse } from 'next/server'
import { getClients, saveClient, deleteClient, Client } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getClients())
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Client
  const saved = saveClient(body)
  return NextResponse.json(saved)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  deleteClient(id)
  return NextResponse.json({ ok: true })
}
