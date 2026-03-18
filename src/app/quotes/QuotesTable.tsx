'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Quote } from '@/lib/db'

const statusLabel: Record<string, string> = { draft: 'Borrador', sent: 'Enviado', approved: 'Aprobado', rejected: 'Rechazado' }
function fmt(n: number) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

export default function QuotesTable({ initialQuotes }: { initialQuotes: Quote[] }) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter)

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este presupuesto?')) return
    await fetch('/api/quotes', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    setQuotes(q => q.filter(x => x.id !== id))
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'draft', 'sent', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            fontSize: 12, padding: '4px 12px', borderRadius: 99, cursor: 'pointer', border: '1px solid',
            borderColor: filter === s ? 'transparent' : 'var(--border-mid)',
            background: filter === s ? 'var(--accent)' : 'var(--bg)',
            color: filter === s ? 'var(--accent-fg)' : 'var(--muted)',
            fontFamily: 'inherit', fontWeight: 500,
          }}>
            {s === 'all' ? 'Todos' : statusLabel[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>No hay presupuestos en esta categoría.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Vence</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Total USD</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}>
                  <td style={{ fontWeight: 500 }}>{q.number}</td>
                  <td>{q.clientName || '—'}</td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(q.createdAt).toLocaleDateString('es-AR')}</td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(q.validUntil).toLocaleDateString('es-AR')}</td>
                  <td><span className={`badge ${q.status}`}>{statusLabel[q.status]}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(q.total)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <a href={`/api/pdf?id=${q.id}`} target="_blank">
                        <button className="btn sm">PDF</button>
                      </a>
                      <Link href={`/quotes/${q.id}`}>
                        <button className="btn sm">Editar</button>
                      </Link>
                      <button className="btn sm danger" onClick={() => handleDelete(q.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
