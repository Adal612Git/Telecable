import React, { useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

export const Reporte: React.FC<{ state: AppState, onDone: ()=>void }> = ({ state, onDone }) => {
  const { show } = useToast()
  const [tipo, setTipo] = useState('Sin servicio')
  const [desc, setDesc] = useState('')
  return (
    <Card>
      <h3 className="font-semibold">Reportar falla</h3>
      <div className="mt-2 space-y-2">
        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select className="w-full border border-border rounded-lg px-3 py-2" value={tipo} onChange={e=>setTipo(e.target.value)}>
            <option>Sin servicio</option><option>Internet lento</option><option>Intermitencias</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea className="w-full border border-border rounded-lg px-3 py-2 min-h-[120px]" value={desc} onChange={e=>setDesc(e.target.value)} />
        </div>
        <Button className="w-full" variant="danger" onClick={()=>{
          const ids = Object.keys(state.tickets).map(Number)
          const next = String(Math.max(...ids)+1)
          state.tickets[next] = { id: next, cliente:'Ana García', problema: `${tipo}${desc?` - ${desc}`:''}`, estado:'Nuevo', tecnico: null }
          show({ message:`Ticket #${next} creado`, type:'success' })
          setDesc(''); setTipo('Sin servicio')
          onDone()
        }}>Enviar Reporte</Button>
      </div>
    </Card>
  )
}

