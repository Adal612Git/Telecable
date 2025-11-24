import React from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export const ClientHome: React.FC<{
  state: AppState,
  clientId: string,
  onSwitchClient: (id: string)=>void,
  onPay: ()=>void,
  onSupport: ()=>void,
}> = ({ state, clientId, onSwitchClient, onPay, onSupport }) => {
  const cliente = state.clientes[clientId] ?? Object.values(state.clientes)[0]
  const clientName = cliente?.nombre ?? 'Cliente'
  const saldo = cliente?.saldo ?? 0
  return (
    <div className="space-y-3">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-semibold">Hola, {clientName}</h3>
            <div className="text-sm text-muted">Elige otro cliente para probar el flujo</div>
          </div>
          <select className="border border-border rounded-lg px-3 py-2" value={clientId} onChange={e=> onSwitchClient(e.target.value)}>
            {Object.values(state.clientes).map(c => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.plan})</option>
            ))}
          </select>
        </div>
        <div className="mt-2">Saldo: <strong>${saldo.toFixed(2)}</strong> <Badge className={saldo>0? 'hidden':''} intent="success">Pagado</Badge></div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <Button className={saldo>0? '':'hidden'} onClick={onPay}>Pagar</Button>
          <Button variant="danger" onClick={onSupport}>Problemas tecnicos</Button>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Mis tickets</h3>
        <div className="mt-2 space-y-1">
          {Object.values(state.tickets).filter(t=>t.cliente===clientName).map(t=> (
            <div key={t.id}><strong>#{t.id}</strong> - {t.problema} - <Badge intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
          ))}
          {Object.values(state.tickets).filter(t=>t.cliente===clientName).length===0 && (
            <div className="text-muted text-sm">Aun no hay tickets para este cliente.</div>
          )}
        </div>
      </Card>
    </div>
  )
}
