'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/', label: 'Dashboard', icon: '▪' },
  { href: '/quotes', label: 'Presupuestos', icon: '▪' },
  { href: '/quotes/new', label: 'Nuevo presupuesto', icon: '+' },
  { href: '/clients', label: 'Clientes', icon: '▪' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-name">Pragma Studio</div>
        <div className="brand-sub">Presupuestos</div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(n => (
          <Link key={n.href} href={n.href}>
            <span className={`nav-item ${path === n.href ? 'active' : ''}`}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
