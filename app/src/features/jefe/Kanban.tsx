import React from 'react'
import type { AppState, Ticket } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

export const Kanban: React.FC<{ state: AppState }> = ({ state }) => {
  const { show } = useToast()
  const assign = (t: Ticket) => {
    const before = JSON.parse(JSON.stringify(t))
    t.estado = 'Asignado'; t.tecnico = 'Sergio'
    show({ message:`Ticket asignado a  — Ver ruta`, type:'success', action:{ label:'Ver ruta', onClick:()=> alert('Ruta simulada') } })
    state.audit.push({ who: state.loggedInUser, when: new Date().toISOString(), action:'ticket_assigned', before, after: t })
  }
  const tickets = Object.values(state.tickets)
  const cols: Record<string, Ticket[]> = { Nuevo:[], Asignado:[], Resuelto:[] }
  tickets.forEach(t=> cols[t.estado].push(t))
  return (
    <Card>
      <h3 className="font-semibold">Bandeja de tickets</h3>
      <div className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
        <div className="card">
          <div className="font-semibold">Capacidad hoy</div>
          <div className="mt-1">Sergio: 3/5 · Luisa: 1/5 · Miguel: 2/5</div>
        </div>
        <div className="card sm:col-span-2">
          <div className="font-semibold">Sugerencia</div>
          <div className="mt-1">Asignar tickets de â€œInternet lentoâ€ a Sergio (skill + proximidad)</div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-2">
        {(['Nuevo','Asignado','Resuelto'] as const).map(col => (
          <div key={col}>
            <h4 className="font-semibold mb-1">{col}</h4>
            <div className="space-y-2">
              {cols[col].map(t => (
                <div key={t.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div><strong>#{t.id}</strong> · {t.cliente} <Badge className="ml-2" intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
                      <div className="text-muted">{t.problema}</div>
                    </div>
                  </div>
                  {t.estado==='Nuevo' && <Button className="mt-2" variant="secondary" size="sm" onClick={()=> assign(t)}>Asignar</Button>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}



