import React, { useMemo, useState } from 'react'
import type { AppState, Payment } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Roles } from '../../lib/rbac'
import { useToast } from '../../components/ui/toast'

const methods: Payment['metodo'][] = ['MercadoPago','HSBC','Oxxo Pay','Efectivo','Transferencia']

export const POS: React.FC<{ state: AppState }> = ({ state }) => {
  const { show } = useToast()
  const [metodo, setMetodo] = useState<Payment['metodo']>('MercadoPago')
  const [cliente, setCliente] = useState(Object.keys(state.clientes)[0])
  const [factura, setFactura] = useState('')
  const [monto, setMonto] = useState(299)
  const [descuento, setDescuento] = useState(0)
  const [notas, setNotas] = useState('')
  const [origen, setOrigen] = useState<Payment['origen']>('POS')
  const [banco, setBanco] = useState('BBVA')
  const [evidencia, setEvidencia] = useState<string>('ticket_demo.pdf')
  const [registros, setRegistros] = useState<Payment[]>(state.pagos)

  const canDiscount = Roles.current==='dueno' || Roles.current==='facturacion' || Roles.current==='root'

  const facturasCliente = useMemo(()=> Object.values(state.facturas).filter(f=> f.clienteId===cliente), [cliente, state.facturas])
  const metodoEstado = metodo==='Oxxo Pay' ? 'en proceso' : 'acreditado'

  const addPayment = () => {
    const id = `P-${Math.floor(Math.random()*9000+1000)}`
    const pago: Payment = {
      id,
      facturaId: factura || undefined,
      clienteId: cliente,
      fechaPago: new Date().toISOString().slice(0,10),
      fechaRegistro: new Date().toISOString(),
      metodo,
      origen,
      banco,
      estado: metodo==='Oxxo Pay' ? 'en proceso' : 'pendiente',
      monto,
      descuento: canDiscount ? descuento : 0,
      notas,
      registradoPor: Roles.current ?? 'cobranza',
      evidencia: evidencia? [evidencia] : [],
    }
    setRegistros([pago, ...registros])
    show({ message:`Pago ${id} registrado`, type:'success' })
  }

  const totalMetodo = useMemo(()=>{
    return registros.reduce((acc, p)=>{ acc[p.metodo]=(acc[p.metodo]||0)+p.monto; return acc },{} as Record<string,number>)
  },[registros])

  return (
    <div className="space-y-3">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">POS - Registrar pago</h3>
              <p className="text-sm text-muted">Permite anticipados, parciales, notas internas y evidencias.</p>
            </div>
            {metodo==='Oxxo Pay' && <Badge intent="warning">Demora 24-36h</Badge>}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm font-medium">Cliente</label>
              <select className="w-full border border-border rounded-lg px-3 py-2" value={cliente} onChange={e=> setCliente(e.target.value)}>
                {Object.values(state.clientes).map(c=> <option key={c.id} value={c.id}>{c.nombre} ({c.plan})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Factura</label>
              <select className="w-full border border-border rounded-lg px-3 py-2" value={factura} onChange={e=> setFactura(e.target.value)}>
                <option value="">Pago anticipado / parcial</option>
                {facturasCliente.map(f=> <option key={f.id} value={f.id}>{f.id} - ${f.monto} ({f.status})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Método de pago</label>
              <select className="w-full border border-border rounded-lg px-3 py-2" value={metodo} onChange={e=> setMetodo(e.target.value as Payment['metodo'])}>
                {methods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Banco</label>
              <input className="w-full border border-border rounded-lg px-3 py-2" value={banco} onChange={e=> setBanco(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Monto</label>
              <input type="number" className="w-full border border-border rounded-lg px-3 py-2" value={monto} onChange={e=> setMonto(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center justify-between">Descuento <span className="text-xs text-muted">solo dueño / facturación</span></label>
              <input type="number" className="w-full border border-border rounded-lg px-3 py-2" value={descuento} onChange={e=> setDescuento(Number(e.target.value))} disabled={!canDiscount} />
            </div>
            <div>
              <label className="text-sm font-medium">Origen</label>
              <select className="w-full border border-border rounded-lg px-3 py-2" value={origen} onChange={e=> setOrigen(e.target.value as Payment['origen'])}>
                <option value="POS">POS</option>
                <option value="app cliente">app cliente</option>
                <option value="manual">manual</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Evidencia (opcional)</label>
              <input className="w-full border border-border rounded-lg px-3 py-2" value={evidencia} onChange={e=> setEvidencia(e.target.value)} />
            </div>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium">Notas internas</label>
            <textarea className="w-full border border-border rounded-lg px-3 py-2 min-h-[80px]" value={notas} onChange={e=> setNotas(e.target.value)} placeholder="Ej: cobro en sitio, evidencia en drive" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Badge intent={metodoEstado==='en proceso'?'warning':'info'}>Estado: {metodoEstado}</Badge>
            <Badge intent="secondary">Asignar a factura específica</Badge>
            <Badge intent="secondary">Imprimir ticket HTML/PDF</Badge>
          </div>
          <Button className="w-full mt-3" onClick={addPayment}>Registrar pago</Button>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Historial rápido de caja</h3>
              <p className="text-sm text-muted">Incluye cobros por método y pendientes por conciliar.</p>
            </div>
            <Badge intent="info">{registros.length} movimientos</Badge>
          </div>
          <div className="mt-3 space-y-2 max-h-[320px] overflow-auto">
            {registros.map(p => (
              <div key={p.id} className="border border-border rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{p.id} · {p.metodo}</div>
                  <Badge intent={p.estado==='acreditado'?'success': p.estado==='en proceso'?'warning':'info'}>{p.estado}</Badge>
                </div>
                <div className="text-muted">Cliente #{p.clienteId} · {p.origen} · {p.banco}</div>
                <div className="flex items-center justify-between mt-1">
                  <span>${p.monto.toFixed(2)} {p.descuento? `(desc ${p.descuento})`: ''}</span>
                  <span className="text-xs text-muted">{new Date(p.fechaRegistro).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {registros.length===0 && <div className="text-muted">Sin movimientos</div>}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {methods.map(m=>(
              <div key={m} className="border border-dashed border-border rounded-lg px-2 py-2 flex items-center justify-between">
                <span>{m}</span>
                <strong>${(totalMetodo[m]||0).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
