import React, { useMemo, useState } from 'react'
import type { AppState, Payment } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

const payChannels = ['MercadoPago','HSBC','Oxxo Pay','Transferencia','Efectivo']

export const Reports: React.FC<{ state: AppState }> = ({ state }) => {
  const [methodFilter, setMethodFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [range, setRange] = useState('2025-11')
  const payments = useMemo(()=> state.pagos.filter(p => {
    return (!methodFilter || p.metodo===methodFilter) && (!statusFilter || p.estado===statusFilter) && (!search || p.clienteId.includes(search) || (p.facturaId||'').includes(search))
  }),[methodFilter,statusFilter,search,state.pagos])

  const totalsByMethod = useMemo(()=>{
    return payChannels.map(m => ({ m, total: payments.filter(p=>p.metodo===m).reduce((a,p)=>a+p.monto,0) }))
  },[payments])

  const corte = useMemo(()=> payments.filter(p => state.clientes[p.clienteId]?.fecha_corte === p.fechaPago),[payments,state.clientes])

  const simulatedKpis = [
    { label:'Ventas por día', value:'$12,430' },
    { label:'Ventas por semana', value:'$81,230' },
    { label:'Ventas por mes', value:'$302,000' },
    { label:'Recuperación mensual', value:'88%' },
    { label:'Cartera vencida', value:'$21,400' },
    { label:'% cobrado vs esperado', value:'91%' },
  ]

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold">Reporte de corredores de pago</h3>
            <p className="text-sm text-muted">Total por método, día, conciliaciones, duplicados y pendientes.</p>
          </div>
          <div className="flex gap-2 flex-wrap text-sm">
            <select className="border border-border rounded-lg px-3 py-2" value={methodFilter} onChange={e=> setMethodFilter(e.target.value)}>
              <option value="">Metodo</option>
              {payChannels.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border border-border rounded-lg px-3 py-2" value={statusFilter} onChange={e=> setStatusFilter(e.target.value)}>
              <option value="">Estado</option>
              <option value="pendiente">pendiente</option>
              <option value="acreditado">acreditado</option>
              <option value="en proceso">en proceso</option>
            </select>
            <input className="border border-border rounded-lg px-3 py-2" placeholder="Cliente/Factura" value={search} onChange={e=> setSearch(e.target.value)} />
            <input className="border border-border rounded-lg px-3 py-2" type="month" value={range} onChange={e=> setRange(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="border border-border rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{p.id} · {p.metodo} · ${p.monto}</div>
                  <Badge intent={p.estado==='acreditado'?'success': p.estado==='en proceso'?'warning':'info'}>{p.estado}</Badge>
                </div>
                <div className="text-muted">Cliente #{p.clienteId} · Factura {p.facturaId || 'pago anticipado'} · {p.origen}</div>
                <div className="text-xs">Pago: {p.fechaPago} · Registro: {p.fechaRegistro} · Registró: {p.registradoPor}</div>
              </div>
            ))}
            {payments.length===0 && <div className="text-muted">Sin datos con esos filtros</div>}
          </div>
          <div className="space-y-2">
            {totalsByMethod.map(t => (
              <div key={t.m} className="border border-dashed border-border rounded-lg px-3 py-2 flex items-center justify-between">
                <span>{t.m}</span>
                <strong>${t.total.toFixed(2)}</strong>
              </div>
            ))}
            <div className="border border-border rounded-lg p-3 bg-amber-50 text-amber-900 text-sm">
              <strong>Retraso Oxxo 24-36h:</strong> si metodo_pago == 'OXXO' → estado = 'EN PROCESO'. Banner visible y calculando expectativa.
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Reportes globales</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {simulatedKpis.map(k=> (
            <div key={k.label} className="border border-border rounded-xl px-3 py-2">
              <div className="text-muted text-sm">{k.label}</div>
              <div className="text-xl font-semibold">{k.value}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <div className="card">
            <div className="font-semibold">Pagos por técnico</div>
            <ul className="text-sm mt-2 space-y-1">
              {state.tecnicos.map(t => <li key={t.id}>{t.nombre}: ${ (Math.random()*1200+300).toFixed(2)} · tickets resueltos {(Math.floor(Math.random()*6)+1)}</li>)}
            </ul>
          </div>
          <div className="card">
            <div className="font-semibold">Calidad del servicio</div>
            <ul className="text-sm mt-2 space-y-1">
              <li>Tiempo de respuesta promedio: 42 min</li>
              <li>SLA operativo: 96%</li>
              <li>Tickets resueltos hoy: 18</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Pagos del día de corte</h3>
            <p className="text-sm text-muted">Filtra clientes que pagaron exactamente en su fecha de corte y valida conciliación.</p>
          </div>
          <Badge intent="info">{corte.length} coincidencias</Badge>
        </div>
        <div className="overflow-auto mt-2">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left p-2">Cliente</th><th className="text-left p-2">Método</th><th className="text-left p-2">Banco</th><th className="text-left p-2">Fecha pago</th><th className="text-left p-2">Conciliación</th></tr></thead>
            <tbody>
              {corte.map(p=> (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-2">{state.clientes[p.clienteId]?.nombre}</td>
                  <td className="p-2">{p.metodo}</td>
                  <td className="p-2">{p.banco}</td>
                  <td className="p-2">{p.fechaPago}</td>
                  <td className="p-2"><Badge intent={p.estado==='acreditado'?'success':'warning'}>{p.estado==='acreditado'?'Cotejado':'Pendiente'}</Badge></td>
                </tr>
              ))}
              {corte.length===0 && <tr><td className="p-2" colSpan={5}>Sin pagos en día de corte</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Badge intent="secondary">Filtro por método</Badge>
          <Badge intent="secondary">Filtro por estado</Badge>
          <Badge intent="secondary">Buscador global</Badge>
        </div>
      </Card>
    </div>
  )
}
