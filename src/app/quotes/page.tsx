import { getQuotes } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import QuotesTable from './QuotesTable'

export default function QuotesPage() {
  const quotes = getQuotes()
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Presupuestos</h1>
          <Link href="/quotes/new">
            <button className="btn primary">+ Nuevo presupuesto</button>
          </Link>
        </div>
        <QuotesTable initialQuotes={quotes} />
      </main>
    </div>
  )
}
