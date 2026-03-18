'use client'
import { useState } from 'react'
import { Client } from '@/lib/db'

function initForm(): Omit<Client, 'id' | 'createdAt'> {
  return { name: '', contact: '', email: '', company: '' }
}

export default function ClientsManager({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients)
  const [form, setForm] = useState(initForm())
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function startEdit(c: Client) {
    setEditId(c.id)
    setForm({ name: c.name, contact: c.contact, email: c.email, company: c.company })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(initForm())
  }

  async function handleSave() {
    setSaving(true)
    setAlert(null)
    const client: Client = {
      id: editId || Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      ...form,
    }
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    })
    setSaving(false)
    if (res.ok) {
      const saved: Client = await res.json()
      setClients(prev =>
        editId ? prev.map(c => (c.id === editId ? saved : c)) : [...prev, saved]
      )
      setAlert({ type: 'success', msg: editId ? 'Cliente actualizado.' : 'Cliente creado.' })
      cancelEdit()
    } else {
      setAlert({ type: 'error', msg: 'Error al guardar.' })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este cliente?')) return
    await fetch('/api/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      {alert && (
        <div className={`alert ${alert.type}`}>{alert.msg}</div>
      )}

      {/* Form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          {editId ? 'Editar cliente' : 'Nuevo cliente'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="field-label">Empresa *</div>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, company: e.target.value })} placeholder="Nombre de la empresa" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="field-label">Contacto</div>
            <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Nombre del contacto" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="field-label">Email</div>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {editId && (
            <button className="btn ghost" onClick={cancelEdit}>Cancelar</button>
          )}
          <button className="btn primary" onClick={handleSave} disabled={saving || !form.name}>
            {saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Agregar cliente'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 14 }}>
          {clients.length} cliente{clients.length !== 1 ? 's' : ''}
        </div>
        {clients.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No hay clientes todavía.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Email</th>
                  <th>Creado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ color: 'var(--muted)' }}>{c.contact || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{c.email || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{new Date(c.createdAt).toLocaleDateString('es-AR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn sm" onClick={() => startEdit(c)}>Editar</button>
                        <button className="btn sm danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
