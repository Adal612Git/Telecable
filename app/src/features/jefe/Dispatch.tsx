import React, { useMemo, useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useToast } from '../../components/ui/toast'

export const Dispatch: React.FC<{ state: AppState }> = ({ state }) => {
  const { show } = useToast()
  const [clienteId, setClienteId] = useState(Object.keys(state.clientes)[0])
  const [tecnico, setTecnico] = useState(state.tecnicos[0]?.id || '')
  const [comentario, setComentario] = useState('')
  const [tickets, setTickets] = useState(Object.values(state.tickets))

  const sendToCollect = () => {
    const next = `C-${tickets.length+1}`
    const cliente = state.clientes[clienteId]
    const techName = state.tecnicos.find(t=>t.id===tecnico)?.nombre || 'Sergio'
    const nuevo = { id: next, cliente: cliente.nombre, problema:`Cobranza enviada (${cliente.plan})`, estado:'Asignado' as const, tecnico: techName, tipo:'cobranza' as const }
    setTickets([nuevo, ...tickets])
    show({ message:`Cobranza enviada a ${techName}`, type:'success' })
  }

  const assignInstall = () => {
    const next = `I-${tickets.length+1}`
    const cliente = state.clientes[clienteId]
    const techName = state.tecnicos.find(t=>t.id===tecnico)?.nombre || 'Sergio'
    const nuevo = { id: next, cliente: cliente.nombre, problema:'Instalación automática', estado:'Asignado' as const, tecnico: techName, tipo:'instalacion' as const, evidencia:'Checklist pendiente' }
    setTickets([nuevo, ...tickets])
    show({ message:`Ticket instalación auto para ${cliente.nombre}`, type:'info' })
  }

  const mapPins = useMemo(()=> state.tecnicos.map(t=> ({ label:t.nombre, lat:t.lat, lng:t.lng, status:t.status })),[state.tecnicos])

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Card>
        <h3 className="font-semibold">Dashboard técnicos</h3>
        <p className="text-sm text-muted">GPS ficticio, asignación de tickets y botón de cobranza.</p>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-sm font-medium">Cliente</label>
            <select className="w-full border border-border rounded-lg px-3 py-2" value={clienteId} onChange={e=> setClienteId(e.target.value)}>
              {Object.values(state.clientes).map(c=> <option key={c.id} value={c.id}>{c.nombre} · corte {c.fecha_corte}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Técnico</label>
            <select className="w-full border border-border rounded-lg px-3 py-2" value={tecnico} onChange={e=> setTecnico(e.target.value)}>
              {state.tecnicos.map(t=> <option key={t.id} value={t.id}>{t.nombre} ({t.zona})</option>)}
            </select>
          </div>
        </div>
        <div className="mt-2">
          <label className="text-sm font-medium">Comentario</label>
          <textarea className="w-full border border-border rounded-lg px-3 py-2" value={comentario} onChange={e=> setComentario(e.target.value)} placeholder="Ej: Llevar TPV, cobrar saldo pendiente" />
        </div>
        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          <Button onClick={sendToCollect}>Enviar técnico a cobrar</Button>
          <Button variant="secondary" onClick={assignInstall}>Ticket instalación automático</Button>
        </div>
        <div className="mt-3 text-xs text-muted">Al crear cliente se genera ticket de instalación automático. Checklist y evidencia obligatoria.</div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Mapa GPS (dummy)</h3>
            <p className="text-sm text-muted">Señal simulada con técnicos en zonas.</p>
          </div>
          <Badge intent="info">{mapPins.length} técnicos</Badge>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {mapPins.map(p => (
            <div key={p.label} className="border border-dashed border-border rounded-lg p-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{p.label}</span>
                <Badge intent={p.status==='Disponible'?'success': p.status==='En ruta'?'info':'warning'}>{p.status}</Badge>
              </div>
              <div className="text-xs text-muted">Lat {p.lat.toFixed(2)} / Lng {p.lng.toFixed(2)}</div>
              <div className="text-xs">Tiempo promedio: {Math.floor(Math.random()*50)+20} min</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Tickets operativos</h3>
            <p className="text-sm text-muted">Instalación, soporte y cobranza enviados.</p>
          </div>
          <Badge intent="info">{tickets.length} tickets</Badge>
        </div>
        <div className="mt-2 overflow-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left p-2">ID</th><th className="text-left p-2">Cliente</th><th className="text-left p-2">Tipo</th><th className="text-left p-2">Técnico</th><th className="text-left p-2">Estado</th></tr></thead>
            <tbody>
              {tickets.map(t=> (
                <tr key={t.id} className="border-t border-border">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2">{t.cliente}</td>
                  <td className="p-2">{t.tipo || 'soporte'}</td>
                  <td className="p-2">{t.tecnico}</td>
                  <td className="p-2"><Badge intent={t.estado==='Resuelto'?'success': t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
