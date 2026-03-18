import { getQuote, getClients } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import QuoteForm from '@/components/QuoteForm'
import { notFound } from 'next/navigation'

export default function EditQuotePage({ params }: { params: { id: string } }) {
  const quote = getQuote(params.id)
  if (!quote) notFound()
  const clients = getClients()
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Editar — {quote.number}</h1>
          <a href={`/api/pdf?id=${quote.id}`} target="_blank">
            <button className="btn">Abrir PDF</button>
          </a>
        </div>
        <QuoteForm initial={quote} quoteNumber={quote.number} clients={clients} isEdit />
      </main>
    </div>
  )
}
