import React, { useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'
import { Analytics } from '../../lib/analytics'

type Result = { latencyMs: number|null, dnsOk: boolean|null, ok: boolean|null }

export const SelfTest: React.FC<{ state: AppState, onDone: ()=>void }> = ({ state, onDone }) => {
  const { show } = useToast()
  const [running, setRunning] = useState(false)
  const [res, setRes] = useState<Result>({ latencyMs: null, dnsOk: null, ok: null })

  const run = async () => {
    setRunning(true); Analytics.track('selftest_run',{})
    setTimeout(()=>{
      const latency = Math.floor(50 + Math.random()*300)
      const dnsOk = Math.random() > 0.2
      const ok = latency < 180 && dnsOk
      setRes({ latencyMs: latency, dnsOk, ok })
      setRunning(false)
      if(!ok){ show({ message:'Self-test falló', type:'error' }); Analytics.track('selftest_fail',{latency, dnsOk}) }
      else { show({ message:'Self-test OK', type:'success' }) }
    }, 900)
  }

  const autoTicket = () => {
    const ids = Object.keys(state.tickets).map(Number)
    const next = String(Math.max(...ids)+1)
    state.tickets[next] = { id: next, cliente:'Ana García', problema: `Falla detectada por self-test (latency=${res.latencyMs}ms, dnsOk=${res.dnsOk})`, estado:'Nuevo', tecnico: null }
    Analytics.track('ticket_auto_created',{id: next})
    show({ message:`Ticket #${next} creado`, type:'success' })
    onDone()
  }

  return (
    <Card>
      <h3 className="font-semibold">Self-test de conexión</h3>
      <p className="text-muted">Simula latencia y resolución DNS</p>
      <div className="mt-3 flex gap-2">
        <Button onClick={run} disabled={running}>{running? 'Probando…' : 'Ejecutar test'}</Button>
        <Button variant="ghost" onClick={onDone}>Volver</Button>
      </div>
      <div className="mt-3 space-y-1">
        <div>Latencia: {res.latencyMs===null? '—' : `${res.latencyMs} ms`}</div>
        <div>DNS: {res.dnsOk===null? '—' : (res.dnsOk? 'OK' : 'FALLA')}</div>
        <div>Resultado: {res.ok===null? '—' : (res.ok? 'OK' : 'Problemas detectados')}</div>
      </div>
      {!res.ok && res.ok!==null && (
        <div className="mt-3"><Button variant="danger" onClick={autoTicket}>Crear ticket automáticamente</Button></div>
      )}
    </Card>
  )
}

