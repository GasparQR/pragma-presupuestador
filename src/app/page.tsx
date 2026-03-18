import { getQuotes } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

function fmt(n: number) {
  return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function DashboardPage() {
  const quotes = getQuotes()
  const total = quotes.reduce((s, q) => s + q.total, 0)
  const approved = quotes.filter(q => q.status === 'approved')
  const approvedTotal = approved.reduce((s, q) => s + q.total, 0)
  const pending = quotes.filter(q => q.status === 'sent')

  const recent = quotes.slice(0, 5)

  const statusLabel: Record<string, string> = { draft: 'Borrador', sent: 'Enviado', approved: 'Aprobado', rejected: 'Rechazado' }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <Link href="/quotes/new">
            <button className="btn primary">+ Nuevo presupuesto</button>
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total presupuestado</div>
            <div className="stat-value">{fmt(total)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Aprobado</div>
            <div className="stat-value" style={{ color: 'var(--success-text)' }}>{fmt(approvedTotal)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Presupuestos</div>
            <div className="stat-value">{quotes.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pendientes</div>
            <div className="stat-value">{pending.length}</div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Actividad reciente</div>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>No hay presupuestos todavía. <Link href="/quotes/new" style={{ color: 'var(--info-text)' }}>Creá el primero.</Link></p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(q => (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 500 }}>{q.number}</td>
                      <td>{q.clientName}</td>
                      <td style={{ color: 'var(--muted)' }}>{new Date(q.createdAt).toLocaleDateString('es-AR')}</td>
                      <td><span className={`badge ${q.status}`}>{statusLabel[q.status]}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(q.total)}</td>
                      <td>
                        <Link href={`/quotes/${q.id}`}>
                          <button className="btn sm">Ver</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
