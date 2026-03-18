import { getClients } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import ClientsManager from './ClientsManager'

export default function ClientsPage() {
  const clients = getClients()
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Clientes</h1>
        </div>
        <ClientsManager initialClients={clients} />
      </main>
    </div>
  )
}
