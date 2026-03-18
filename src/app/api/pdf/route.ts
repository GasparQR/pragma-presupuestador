import { NextRequest, NextResponse } from 'next/server'
import { getQuote, getQuotes } from '@/lib/db'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import QuotePDF from '@/components/QuotePDF'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  let quote
  if (id === 'latest') {
    quote = getQuotes()[0]
  } else {
    quote = id ? getQuote(id) : undefined
  }

  if (!quote) {
    return new NextResponse('Presupuesto no encontrado', { status: 404 })
  }

  const buffer = await renderToBuffer(createElement(QuotePDF, { quote }))

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Presupuesto-${quote.number}.pdf"`,
    },
  })
}
