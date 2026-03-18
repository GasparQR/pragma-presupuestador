'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Quote, QuoteItem, Client, QuoteStatus } from '@/lib/db'

const ITEM_TYPES = ['Entregable', 'Hora', 'Módulo', 'Licencia', 'Servicio']
const CATEGORIES = ['Desarrollo web', 'SaaS / Producto', 'Diseño UI/UX', 'Soporte & Mantenimiento', 'Consultoría']
const STATUS_OPTS: { value: QuoteStatus; label: string }[] = [
  { value: 'draft', label: 'Borrador' },
  { value: 'sent', label: 'Enviado' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
]

function newItem(): QuoteItem {
  return { id: Math.random().toString(36).slice(2), description: '', type: 'Entregable', qty: 1, price: 0 }
}

function fmt(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

interface Props {
  initial?: Partial<Quote>
  quoteNumber: string
  clients: Client[]
  isEdit?: boolean
}

export default function QuoteForm({ initial, quoteNumber, clients, isEdit }: Props) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const expiry = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]

  const [clientId, setClientId] = useState(initial?.clientId || '')
  const [clientName, setClientName] = useState(initial?.clientName || '')
  const [clientContact, setClientContact] = useState(initial?.clientContact || '')
  const [clientEmail, setClientEmail] = useState(initial?.clientEmail || '')
  const [status, setStatus] = useState<QuoteStatus>(initial?.status || 'draft')
  const [number, setNumber] = useState(initial?.number || quoteNumber)
  const [createdAt, setCreatedAt] = useState(initial?.createdAt?.split('T')[0] || today)
  const [validUntil, setValidUntil] = useState(initial?.validUntil?.split('T')[0] || expiry)
  const [items, setItems] = useState<QuoteItem[]>(initial?.items?.length ? initial.items : [newItem()])
  const [discountPct, setDiscountPct] = useState(initial?.discountPct ?? 0)
  const [notes, setNotes] = useState(initial?.notes || 'Pago: 50% al inicio, 50% a la entrega. Precio expresado en USD. Válido por 30 días desde la fecha de emisión.')
  const [categories, setCategories] = useState<string[]>(initial?.categories || [])
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const discountAmt = subtotal * discountPct / 100
  const total = subtotal - discountAmt

  function loadClient(id: string) {
    setClientId(id)
    const c = clients.find(c => c.id === id)
    if (c) {
      setClientName(c.name)
      setClientContact(c.contact)
      setClientEmail(c.email)
    }
  }

  function updateItem(id: string, field: keyof QuoteItem, val: string | number) {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i))
  }

  function removeItem(id: string) {
    setItems(items.filter(i => i.id !== id))
  }

  function toggleCategory(cat: string) {
    setCategories(c => c.includes(cat) ? c.filter(x => x !== cat) : [...c, cat])
  }

  async function handleSave() {
    setSaving(true)
    setAlert(null)
    const quote: Partial<Quote> = {
      id: initial?.id || Math.random().toString(36).slice(2),
      number, clientId, clientName, clientContact, clientEmail,
      status, items, discountPct, discountAmt, notes, categories,
      createdAt: createdAt + 'T00:00:00.000Z',
      validUntil: validUntil + 'T00:00:00.000Z',
      subtotal, total,
    }
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    })
    setSaving(false)
    if (res.ok) {
      setAlert({ type: 'success', msg: 'Presupuesto guardado correctamente.' })
      if (!isEdit) setTimeout(() => router.push('/quotes'), 800)
    } else {
      setAlert({ type: 'error', msg: 'Error al guardar. Intentá de nuevo.' })
    }
  }

  async function handlePDF() {
    setPdfLoading(true)
    const quoteId = initial?.id
    if (!quoteId) {
      await handleSave()
    }
    window.open(`/api/pdf?id=${initial?.id || 'latest'}`, '_blank')
    setPdfLoading(false)
  }

  return (
    <div>
      {alert && (
        <div className={`alert ${alert.type}`} style={{ marginBottom: '1rem' }}>{alert.msg}</div>
      )}

      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        {/* Client card */}
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Cliente</div>
          <div className="field">
            <div className="field-label">Empresa</div>
            <select value={clientId} onChange={e => loadClient(e.target.value)}>
              <option value="">— Seleccionar cliente —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">Empresa (manual)</div>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nombre empresa" />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">Contacto</div>
              <input type="text" value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="Nombre" />
            </div>
          </div>
          <div className="field" style={{ marginTop: 8, marginBottom: 0 }}>
            <div className="field-label">Email</div>
            <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@empresa.com" />
          </div>
        </div>

        {/* Meta card */}
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Detalles</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="field">
              <div className="field-label">Número</div>
              <input type="text" value={number} onChange={e => setNumber(e.target.value)} />
            </div>
            <div className="field">
              <div className="field-label">Estado</div>
              <select value={status} onChange={e => setStatus(e.target.value as QuoteStatus)}>
                {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">Fecha</div>
              <input type="date" value={createdAt} onChange={e => setCreatedAt(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">Válido hasta</div>
              <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Categorías de servicio</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => toggleCategory(cat)} style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 99, cursor: 'pointer', border: '1px solid',
              borderColor: categories.includes(cat) ? 'transparent' : 'var(--border-mid)',
              background: categories.includes(cat) ? 'var(--info-bg)' : 'var(--bg)',
              color: categories.includes(cat) ? 'var(--info-text)' : 'var(--muted)',
              fontFamily: 'inherit', fontWeight: 500,
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Ítems</div>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 80px 100px 90px 32px', gap: 6, paddingBottom: 6, borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
          {['Descripción', 'Tipo', 'Cant.', 'Precio USD', 'Total', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</span>
          ))}
        </div>
        {items.map(item => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 80px 100px 90px 32px', gap: 6, alignItems: 'center', marginBottom: 6 }}>
            <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Descripción..." />
            <select value={item.type} onChange={e => updateItem(item.id, 'type', e.target.value)}>
              {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="number" value={item.qty} min={1} step={1} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} style={{ textAlign: 'right' }} />
            <input type="number" value={item.price} min={0} step={0.01} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} style={{ textAlign: 'right' }} placeholder="0.00" />
            <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 500, color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 8px' }}>
              {fmt(item.qty * item.price)}
            </div>
            <button onClick={() => removeItem(item.id)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)' }}>×</button>
          </div>
        ))}
        <button className="btn ghost" style={{ width: '100%', marginTop: 6, border: '1px dashed var(--border-mid)', justifyContent: 'center' }} onClick={() => setItems([...items, newItem()])}>
          + Agregar ítem
        </button>
      </div>

      {/* Totals + Notes */}
      <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Notas &amp; Condiciones</div>
          <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 260 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: 'var(--muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: 'var(--muted)' }}>Descuento</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" value={discountPct} min={0} max={100} step={1} onChange={e => setDiscountPct(parseFloat(e.target.value) || 0)} style={{ width: 54, textAlign: 'right' }} />
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>%</span>
                <span style={{ fontWeight: 500, minWidth: 60, textAlign: 'right' }}>-{fmt(discountAmt)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 6px', fontSize: 16, fontWeight: 600, borderTop: '1px solid var(--text)', marginTop: 4 }}>
              <span>Total USD</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => router.push('/quotes')}>Cancelar</button>
        <button className="btn" onClick={handlePDF} disabled={pdfLoading}>
          {pdfLoading ? 'Generando...' : 'Exportar PDF'}
        </button>
        <button className="btn primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear presupuesto'}
        </button>
      </div>
    </div>
  )
}
