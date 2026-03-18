import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pragma Studio — Presupuestos',
  description: 'Sistema de presupuestos Pragma Studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
