import React, { useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export const TechTickets: React.FC<{ state: AppState, onOpen: (id:string)=>void }> = ({ state, onOpen }) => {
  const [techName, setTechName] = useState(state.tecnicos[0]?.nombre || 'Sergio')
  const assigned = Object.values(state.tickets).filter(t=> t.tecnico===techName)
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold">Mis Tickets ({techName})</h3>
          <div className="text-sm text-muted">Selecciona otro tecnico para ver su cola (demo)</div>
        </div>
        <select className="border border-border rounded-lg px-3 py-2" value={techName} onChange={e=> setTechName(e.target.value)}>
          {state.tecnicos.map(t => <option key={t.id} value={t.nombre}>{t.nombre} - {t.zona}</option>)}
        </select>
      </div>
      <div className="mt-2 space-y-2">
        {assigned.length===0 && <div className="border border-dashed border-border rounded-xl p-4 text-center text-muted">Sin tickets asignados.</div>}
        {assigned.map(t => (
          <div key={t.id} className="card cursor-pointer" onClick={()=> onOpen(t.id)}>
            <div className="flex items-center justify-between">
              <div>
                <div><strong>Ticket #{t.id}</strong> <Badge className="ml-2" intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
                <div className="text-muted">{t.cliente} - {t.problema}</div>
              </div>
              <Button size="sm" variant="ghost">Ver</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
