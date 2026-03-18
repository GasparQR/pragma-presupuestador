import { getClients, nextQuoteNumber } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import QuoteForm from '@/components/QuoteForm'

export default function NewQuotePage() {
  const clients = getClients()
  const quoteNumber = nextQuoteNumber()
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Nuevo presupuesto</h1>
        </div>
        <QuoteForm quoteNumber={quoteNumber} clients={clients} />
      </main>
    </div>
  )
}
