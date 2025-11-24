import React, { useMemo, useState } from 'react'
import type { AppState, Ticket, Technician } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

export const Kanban: React.FC<{ state: AppState }> = ({ state }) => {
  const { show } = useToast()
  const [selected, setSelected] = useState<Record<string,string>>({})
  const tickets = Object.values(state.tickets)
  const cols: Record<string, Ticket[]> = { Nuevo:[], Asignado:[], Resuelto:[] }
  tickets.forEach(t=> cols[t.estado].push(t))

  const loadPerTech = useMemo(()=> {
    const base: Record<string, number> = {}
    state.tecnicos.forEach(t=> base[t.nombre] = 0)
    tickets.filter(t=> t.estado==='Asignado' && t.tecnico).forEach(t=> { base[t.tecnico as string] = (base[t.tecnico as string]||0)+1 })
    return base
  },[tickets, state.tecnicos])

  const assign = (t: Ticket) => {
    const techName = selected[t.id] || state.tecnicos[0]?.nombre || 'Tecnico'
    const before = JSON.parse(JSON.stringify(t))
    t.estado = 'Asignado'; t.tecnico = techName
    show({ message:`Ticket asignado a ${techName} - Ver GPS`, type:'success', action:{ label:'Ver GPS', onClick:()=> alert('Ruta simulada y ETA 25 min') } })
    state.audit.push({ who: state.loggedInUser, when: new Date().toISOString(), action:'ticket_assigned', before, after: { ...t } })
    setSelected(s=> ({ ...s }))
  }

  const lngMin = Math.min(...state.tecnicos.map(t=>t.lng))
  const lngMax = Math.max(...state.tecnicos.map(t=>t.lng))
  const latMin = Math.min(...state.tecnicos.map(t=>t.lat))
  const latMax = Math.max(...state.tecnicos.map(t=>t.lat))
  const toPos = (tech: Technician) => {
    const x = ((tech.lng - lngMin) / (lngMax - lngMin + 0.0001)) * 100
    const y = ((tech.lat - latMin) / (latMax - latMin + 0.0001)) * 100
    return { x, y }
  }

  return (
    <div className="space-y-3">
      <Card>
        <h3 className="font-semibold">Monitoreo operativo</h3>
        <div className="mt-2 grid md:grid-cols-3 gap-2 text-sm">
          <div className="card">
            <div className="font-semibold">Capacidad hoy</div>
            <div className="mt-1 space-y-1 text-xs">
              {state.tecnicos.map(t => (
                <div key={t.id} className="flex justify-between"><span>{t.nombre} ({t.zona})</span><span>{loadPerTech[t.nombre] ?? 0}/{t.capacidad}</span></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="font-semibold">Sugerencia</div>
            <div className="mt-1">Asigna tickets de "Internet lento" a quien tenga menor carga y zona mas cercana.</div>
          </div>
          <div className="card">
            <div className="font-semibold">GPS (ficticio)</div>
            <div className="mt-2 relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50 border border-border">
              {state.tecnicos.map(t => {
                const pos = toPos(t)
                return (
                  <div key={t.id} className="absolute" style={{ left:`${pos.x}%`, top:`${100-pos.y}%`, transform:'translate(-50%, -50%)' }}>
                    <div className="w-3 h-3 rounded-full bg-brand-primary shadow" title={`${t.nombre} - ${t.status}`} />
                    <div className="text-[10px] bg-white border border-border rounded px-1 mt-1">{t.nombre}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          {(['Nuevo','Asignado','Resuelto'] as const).map(col => (
            <div key={col}>
              <h4 className="font-semibold mb-1">{col}</h4>
              <div className="space-y-2">
                {cols[col].map(t => (
                  <div key={t.id} className="card">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div><strong>#{t.id}</strong> - {t.cliente} <Badge className="ml-2" intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
                        <div className="text-muted text-sm">{t.problema}</div>
                        {t.evidencia && <div className="text-xs mt-1 text-slate-600">Evidencia: {t.evidencia}</div>}
                      </div>
                      <div className="text-xs text-muted">{t.tecnico || 'Sin tecnico'}</div>
                    </div>
                    {t.estado!=='Resuelto' && (
                      <div className="mt-2 flex flex-col sm:flex-row gap-2">
                        <select className="border border-border rounded-lg px-2 py-1 text-sm" value={selected[t.id] || ''} onChange={e=> setSelected(s=>({ ...s, [t.id]: e.target.value }))}>
                          <option value="">Elegir tecnico</option>
                          {state.tecnicos.map(tech => (
                            <option key={tech.id} value={tech.nombre}>{tech.nombre} ({loadPerTech[tech.nombre] ?? 0}/{tech.capacidad})</option>
                          ))}
                        </select>
                        <Button size="sm" variant="secondary" onClick={()=> assign(t)}>Asignar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
