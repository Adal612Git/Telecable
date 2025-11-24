import React, { useMemo, useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

export const TechDetalle: React.FC<{ state: AppState, id: string, onDone: ()=>void }> = ({ state, id, onDone }) => {
  const t = state.tickets[id]
  const { show } = useToast()
  const [onu, setOnu] = useState(false)
  const [pot, setPot] = useState(false)
  const [speed, setSpeed] = useState(false)
  const [notes, setNotes] = useState('')
  const ok = useMemo(()=> onu && pot && speed && notes.trim().length>10, [onu,pot,speed,notes])
  const steps = [
    { key: 'onu', label: 'ONU instalada', done: onu },
    { key: 'pot', label: 'Potencia OK', done: pot },
    { key: 'speed', label: 'Speedtest adjunto', done: speed },
  ]
  return (
    <Card>
      <div className={`mb-2 ${ok? 'hidden':'block'}`}>
        <div className="border border-amber-300 bg-[rgba(245,158,11,0.1)] text-amber-900 rounded-lg p-3">Checklist incompleto. <Button variant="ghost" size="sm" className="ml-2" onClick={()=> document.getElementById(!onu?'chk-onu':!pot?'chk-pot':'chk-speed')?.scrollIntoView({behavior:'smooth'})}>Ir al punto faltante</Button></div>
      </div>
      <h3 className="font-semibold">Ticket #{t.id}</h3>
      <p className="text-muted">Cliente: {t.cliente} - {t.problema}</p>
      <div className="mt-3 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.key} className="flex-1 flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.done? 'bg-brand-primary text-white':'bg-slate-200 text-slate-700'}`}>{idx+1}</div>
            <div className="ml-2 text-xs text-muted">{s.label}</div>
            {idx<steps.length-1 && <div className={`flex-1 h-[2px] mx-2 ${steps[idx+1].done? 'bg-brand-primary':'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="font-medium">Checklist</div>
        <div className="mt-2 space-y-1">
          <label className="flex items-center gap-2"><input id="chk-onu" type="checkbox" checked={onu} onChange={e=>setOnu(e.target.checked)} /> ONU instalada</label>
          <label className="flex items-center gap-2"><input id="chk-pot" type="checkbox" checked={pot} onChange={e=>setPot(e.target.checked)} /> Potencia OK</label>
          <label className="flex items-center gap-2"><input id="chk-speed" type="checkbox" checked={speed} onChange={e=>setSpeed(e.target.checked)} /> Speedtest adjunto</label>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium">Notas</label>
          <textarea className="w-full border border-border rounded-lg px-3 py-2 min-h-[120px]" value={notes} onChange={e=>setNotes(e.target.value)} />
          <div className={`text-sm text-red-800 mt-1 ${notes.trim().length>10?'hidden':'block'}`}>Minimo 10 caracteres.</div>
        </div>
      </div>
      <Button className="w-full mt-3" disabled={!ok} onClick={()=>{ state.tickets[id].estado='Resuelto'; show({ message:`Ticket #${id} resuelto`, type:'success'}); onDone() }}>Completar Ticket</Button>
    </Card>
  )
}
