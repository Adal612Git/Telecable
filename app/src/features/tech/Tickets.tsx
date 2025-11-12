import React from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export const TechTickets: React.FC<{ state: AppState, onOpen: (id:string)=>void }> = ({ state, onOpen }) => {
  const assigned = Object.values(state.tickets).filter(t=> t.tecnico==='Sergio')
  return (
    <Card>
      <h3 className="font-semibold">Mis Tickets (Sergio)</h3>
      <div className="mt-2 space-y-2">
        {assigned.length===0 && <div className="border border-dashed border-border rounded-xl p-4 text-center text-muted">Sin tickets asignados.</div>}
        {assigned.map(t => (
          <div key={t.id} className="card cursor-pointer" onClick={()=> onOpen(t.id)}>
            <div className="flex items-center justify-between">
              <div>
                <div><strong>Ticket #{t.id}</strong> <Badge className="ml-2" intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
                <div className="text-muted">{t.cliente} — {t.problema}</div>
              </div>
              <div>›</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

