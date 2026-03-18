import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Quote } from '@/lib/db'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1a1917', padding: '40 48', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e5e4e0' },
  brandName: { fontSize: 18, fontFamily: 'Helvetica-Bold', letterSpacing: -0.3 },
  brandSub: { fontSize: 9, color: '#6b6a65', marginTop: 3 },
  metaRight: { alignItems: 'flex-end' },
  quoteNum: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  metaText: { fontSize: 9, color: '#6b6a65', marginTop: 2 },
  badge: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  section2: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  clientBox: { flex: 1, padding: 14, backgroundColor: '#fafaf9', borderRadius: 8, borderWidth: 1, borderColor: '#e5e4e0' },
  detailBox: { flex: 1, padding: 14, backgroundColor: '#fafaf9', borderRadius: 8, borderWidth: 1, borderColor: '#e5e4e0' },
  sectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#a09f9a', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  clientName: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  clientDetail: { fontSize: 9, color: '#6b6a65', marginBottom: 2 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailKey: { fontSize: 9, color: '#6b6a65' },
  detailVal: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  tableHeader: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#1a1917', marginBottom: 4 },
  thDesc: { flex: 3, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#6b6a65', textTransform: 'uppercase', letterSpacing: 0.6 },
  thType: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#6b6a65', textTransform: 'uppercase', letterSpacing: 0.6 },
  thNum: { width: 50, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#6b6a65', textTransform: 'uppercase', letterSpacing: 0.6 },
  itemRow: { flexDirection: 'row', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#e5e4e0', flexWrap: 'nowrap' },
  tdDesc: { flex: 3, fontSize: 10 },
  tdType: { flex: 1, fontSize: 10, color: '#6b6a65' },
  tdNum: { width: 50, textAlign: 'right', fontSize: 10 },
  totalsArea: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  totalsBox: { width: 200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalLabel: { fontSize: 10, color: '#6b6a65' },
  totalValue: { fontSize: 10 },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, marginTop: 4, borderTopWidth: 1, borderTopColor: '#1a1917' },
  grandLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  grandValue: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  notes: { marginTop: 24, padding: 14, backgroundColor: '#fafaf9', borderRadius: 8, borderWidth: 1, borderColor: '#e5e4e0' },
  notesText: { fontSize: 9, color: '#6b6a65', lineHeight: 1.6 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e5e4e0', paddingTop: 10 },
  footerText: { fontSize: 8, color: '#a09f9a' },
})

const statusColor: Record<string, string> = {
  draft: '#f1efea', sent: '#e8f1fb', approved: '#eaf3de', rejected: '#fcebeb',
}
const statusTextColor: Record<string, string> = {
  draft: '#6b6a65', sent: '#185fa5', approved: '#3b6d11', rejected: '#a32d2d',
}
const statusLabel: Record<string, string> = {
  draft: 'Borrador', sent: 'Enviado', approved: 'Aprobado', rejected: 'Rechazado',
}

function fmt(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function QuotePDF({ quote }: { quote: Quote }) {
  return (
    <Document title={`Presupuesto ${quote.number} — Pragma Studio`} author="Pragma Studio">
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Pragma Studio</Text>
            <Text style={styles.brandSub}>Web Development & SaaS Solutions</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.quoteNum}>Presupuesto #{quote.number}</Text>
            <Text style={styles.metaText}>Emisión: {new Date(quote.createdAt).toLocaleDateString('es-AR')}</Text>
            <Text style={styles.metaText}>Válido hasta: {new Date(quote.validUntil).toLocaleDateString('es-AR')}</Text>
            <View style={[styles.badge, { backgroundColor: statusColor[quote.status] }]}>
              <Text style={{ color: statusTextColor[quote.status] }}>{statusLabel[quote.status]}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section2}>
          <View style={styles.clientBox}>
            <Text style={styles.sectionLabel}>Cliente</Text>
            <Text style={styles.clientName}>{quote.clientName}</Text>
            <Text style={styles.clientDetail}>{quote.clientContact}</Text>
            <Text style={styles.clientDetail}>{quote.clientEmail}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.sectionLabel}>Detalles</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Número</Text>
              <Text style={styles.detailVal}>{quote.number}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Moneda</Text>
              <Text style={styles.detailVal}>USD</Text>
            </View>
            {quote.categories.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Categorías</Text>
                <Text style={styles.detailVal}>{quote.categories.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>

        <View wrap={false} style={styles.tableHeader}>
          <Text style={styles.thDesc}>Descripción</Text>
          <Text style={styles.thType}>Tipo</Text>
          <Text style={styles.thNum}>Cant.</Text>
          <Text style={styles.thNum}>Precio</Text>
          <Text style={styles.thNum}>Total</Text>
        </View>
        <View>
          {quote.items.map(item => (
            <View key={item.id} style={styles.itemRow} wrap={false}>
              <Text style={styles.tdDesc}>{item.description}</Text>
              <Text style={styles.tdType}>{item.type}</Text>
              <Text style={styles.tdNum}>{item.qty}</Text>
              <Text style={styles.tdNum}>{fmt(item.price)}</Text>
              <Text style={styles.tdNum}>{fmt(item.qty * item.price)}</Text>
            </View>
          ))}
        </View>

        <View wrap={false} style={styles.totalsArea}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{fmt(quote.subtotal)}</Text>
            </View>
            {quote.discountPct > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Descuento ({quote.discountPct}%)</Text>
                <Text style={styles.totalValue}>-{fmt(quote.discountAmt)}</Text>
              </View>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total USD</Text>
              <Text style={styles.grandValue}>{fmt(quote.total)}</Text>
            </View>
          </View>
        </View>

        {quote.notes && (
          <View wrap={false} style={styles.notes}>
            <Text style={styles.sectionLabel}>Notas & Condiciones</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Pragma Studio — pragma.studio</Text>
          <Text style={styles.footerText}>Este presupuesto es válido por 30 días desde su emisión.</Text>
        </View>

      </Page>
    </Document>
  )
}
