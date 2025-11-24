import React, { useMemo, useState } from 'react'
import type { AppState, CashSession } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useToast } from '../../components/ui/toast'

export const Caja: React.FC<{ state: AppState }> = ({ state }) => {
  const { show } = useToast()
  const [sessions, setSessions] = useState<CashSession[]>(state.caja)
  const [montoInicial, setMontoInicial] = useState(500)
  const [evidencia, setEvidencia] = useState('foto_caja_inicial.jpg')
  const [activeUser, setActiveUser] = useState('Sergio')
  const abierta = sessions.find(s => s.estado==='abierta')

  const openCaja = () => {
    const id = `CAJA-${sessions.length+1}`
    const nueva: CashSession = { id, usuario: activeUser, fecha_apertura:new Date().toISOString(), monto_inicial:montoInicial, estado:'abierta', evidencia: evidencia? [evidencia]:[] }
    setSessions([nueva, ...sessions])
    show({ message:`Apertura ${id} creada`, type:'success' })
  }

  const closeCaja = () => {
    if(!abierta) return
    const monto_final = abierta.monto_inicial + Math.random()*800
    const diferencia = monto_final - abierta.monto_inicial - 500
    const closed: CashSession = { ...abierta, fecha_cierre:new Date().toISOString(), estado:'cerrada', monto_final: Math.round(monto_final), diferencia: Math.round(diferencia), evidencia:[...(abierta.evidencia||[]),'corte_fin_turno.pdf'], notas:'Cierre con evidencia y envío automático al dueño' }
    setSessions([closed, ...sessions.filter(s=>s.id!==abierta.id)])
    show({ message:`Caja ${abierta.id} cerrada`, type:'success' })
  }

  const expected = useMemo(()=> {
    const pagosPos = state.pagos.filter(p=> p.origen==='POS').reduce((acc,p)=> acc+p.monto, 0)
    return (abierta?.monto_inicial||0) + pagosPos
  },[abierta?.monto_inicial, state.pagos])

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Card>
        <h3 className="font-semibold">Apertura de caja</h3>
        <p className="text-sm text-muted">Técnico o cobrador inicia su turno con monto inicial y evidencia obligatoria.</p>
        <div className="mt-2 space-y-2">
          <label className="block text-sm font-medium">Usuario</label>
          <select className="border border-border rounded-lg px-3 py-2" value={activeUser} onChange={e=> setActiveUser(e.target.value)}>
            {state.tecnicos.map(t=> <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
          </select>
          <label className="block text-sm font-medium">Monto inicial</label>
          <input type="number" className="border border-border rounded-lg px-3 py-2" value={montoInicial} onChange={e=> setMontoInicial(Number(e.target.value))} />
          <label className="block text-sm font-medium">Evidencia (foto/PIN)</label>
          <input className="border border-border rounded-lg px-3 py-2" value={evidencia} onChange={e=> setEvidencia(e.target.value)} />
          <Button className="w-full" onClick={openCaja}>Aperturar</Button>
        </div>
        {abierta && (
          <div className="mt-3 border border-dashed border-border rounded-lg p-3 text-sm">
            <div className="font-semibold">Caja abierta: {abierta.id}</div>
            <div>Esperado: ${expected.toFixed(2)}</div>
            <div>Evidencias: {(abierta.evidencia||[]).join(', ')}</div>
            <Button className="w-full mt-2" variant="secondary" onClick={closeCaja}>Cerrar con corte</Button>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Historial de cierres</h3>
            <p className="text-sm text-muted">Filtra por usuario/fecha, diferencia y notas.</p>
          </div>
          <Badge intent="info">{sessions.length} registros</Badge>
        </div>
        <div className="mt-3 space-y-2 max-h-[360px] overflow-auto">
          {sessions.map(s => (
            <div key={s.id} className="border border-border rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{s.id} · {s.usuario}</div>
                <Badge intent={s.estado==='abierta'?'warning':'success'}>{s.estado}</Badge>
              </div>
              <div className="text-muted">Apertura: {new Date(s.fecha_apertura).toLocaleString()}</div>
              <div className="text-muted">Cierre: {s.fecha_cierre ? new Date(s.fecha_cierre).toLocaleString() : 'Pendiente'}</div>
              <div>Inicial ${s.monto_inicial} · Final {s.monto_final ?? '-'} · Dif {s.diferencia ?? 0}</div>
              <div className="text-xs">Notas: {s.notas || 'N/A'} · Evidencias: {(s.evidencia||[]).join(', ')}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
