import React from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export const ClientHome: React.FC<{ state: AppState, onPay: ()=>void, onReport: ()=>void, onSelfTest?: ()=>void }> = ({ state, onPay, onReport, onSelfTest }) => {
  const ana = state.clientes['1204']
  return (
    <div className="space-y-3">
      <Card>
        <h3 className="font-semibold">Hola, Ana</h3>
        <div className="mt-2">Saldo: <strong>${ana.saldo.toFixed(2)}</strong> <Badge className={ana.saldo>0? 'hidden':''} intent="success">Pagado</Badge></div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <Button className={ana.saldo>0? '':'hidden'} onClick={onPay}>Pagar</Button>
          <Button variant="danger" onClick={onReport}>Reportar falla</Button>
          <Button variant="ghost" onClick={onSelfTest}>Self-test</Button>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Mis tickets</h3>
        <div className="mt-2 space-y-1">
          {Object.values(state.tickets).filter(t=>t.cliente==='Ana García').map(t=> (
            <div key={t.id}><strong>#{t.id}</strong> · {t.problema} · <Badge intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
          ))}
        </div>
      </Card>
    </div>
  )
}
