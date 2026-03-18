import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')
const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json')
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected'

export interface QuoteItem {
  id: string
  description: string
  type: string
  qty: number
  price: number
}

export interface Quote {
  id: string
  number: string
  clientId: string
  clientName: string
  clientEmail: string
  clientContact: string
  status: QuoteStatus
  items: QuoteItem[]
  discountPct: number
  notes: string
  categories: string[]
  createdAt: string
  validUntil: string
  subtotal: number
  discountAmt: number
  total: number
}

export interface Client {
  id: string
  name: string
  contact: string
  email: string
  company: string
  createdAt: string
}

// ---- Quotes ----

export function getQuotes(): Quote[] {
  ensureDir()
  if (!fs.existsSync(QUOTES_FILE)) return []
  return JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf-8'))
}

export function getQuote(id: string): Quote | undefined {
  return getQuotes().find(q => q.id === id)
}

export function saveQuote(quote: Quote): Quote {
  ensureDir()
  const quotes = getQuotes().filter(q => q.id !== quote.id)
  quotes.unshift(quote)
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2))
  return quote
}

export function deleteQuote(id: string): void {
  const quotes = getQuotes().filter(q => q.id !== id)
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2))
}

export function nextQuoteNumber(): string {
  const quotes = getQuotes()
  if (quotes.length === 0) return 'PS-0001'
  const nums = quotes.map(q => parseInt(q.number.replace('PS-', '')) || 0)
  const max = Math.max(...nums)
  return `PS-${String(max + 1).padStart(4, '0')}`
}

// ---- Clients ----

export function getClients(): Client[] {
  ensureDir()
  if (!fs.existsSync(CLIENTS_FILE)) {
    const seed: Client[] = [
      { id: 'c1', name: 'Acme Corp', contact: 'Carlos Méndez', email: 'carlos@acme.com', company: 'Acme Corp', createdAt: new Date().toISOString() },
      { id: 'c2', name: 'Nova Digital', contact: 'Laura Gómez', email: 'lgomez@novadigital.io', company: 'Nova Digital', createdAt: new Date().toISOString() },
    ]
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(seed, null, 2))
    return seed
  }
  return JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'))
}

export function getClient(id: string): Client | undefined {
  return getClients().find(c => c.id === id)
}

export function saveClient(client: Client): Client {
  ensureDir()
  const clients = getClients().filter(c => c.id !== client.id)
  clients.push(client)
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2))
  return client
}

export function deleteClient(id: string): void {
  const clients = getClients().filter(c => c.id !== id)
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2))
}

export function calcTotals(items: QuoteItem[], discountPct: number) {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0)
  const discountAmt = subtotal * discountPct / 100
  const total = subtotal - discountAmt
  return { subtotal, discountAmt, total }
}
