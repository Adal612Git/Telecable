import React, { useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

export const Pago: React.FC<{ state: AppState, clientId: string, onDone: ()=>void }> = ({ state, clientId, onDone }) => {
  const { show } = useToast()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState<'card'|'spei'|'oxxo'>('card')
  const [pan, setPan] = useState('')
  const cliente = state.clientes[clientId] ?? Object.values(state.clientes)[0]
  const saldo = cliente?.saldo ?? 0
  const clientName = cliente?.nombre ?? ''
  return (
    <Card>
      <h3 className="font-semibold">Pago (3 pasos)</h3>
      <div className="mt-2">Paso <strong>{step}</strong> de 3</div>
      <div className="mt-2 h-2 bg-slate-200 rounded">
        <div className="h-2 bg-brand-primary rounded transition-all duration-200 ease-out" style={{ width: `${(step/3)*100}%` }} />
      </div>
      {step===1 && (
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2"><input type="radio" checked={method==='card'} onChange={()=> setMethod('card')} /> Tarjeta</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='spei'} onChange={()=> setMethod('spei')} /> SPEI</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='oxxo'} onChange={()=> setMethod('oxxo')} /> OXXO</label>
          <Button className="mt-2" onClick={()=> setStep(2)}>Continuar</Button>
        </div>
      )}
      {step===2 && (
        <div className="mt-3">
          {method==='card' && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Tarjeta</label>
                <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="4111 1111 1111 1111" value={pan} onChange={e=>setPan(e.target.value)} />
              </div>
            </div>
          )}
          {method==='spei' && <p className="text-muted">Se generara CLABE y podras deshacer por 10 min.</p>}
          <Button className="mt-2" onClick={()=> {
            if(method==='card' && !/^\d{16}$/.test(pan.replace(/\s/g,''))){ show({ message: 'Tarjeta invalida', type:'error' }); return }
            setStep(3)
          }}>Revisar</Button>
        </div>
      )}
      {step===3 && (
        <div className="mt-3">
          <p>Saldo a pagar para {clientName || 'cliente'}: <strong>${saldo.toFixed(2)}</strong></p>
          <div className="mt-2 flex gap-2">
            <Button onClick={()=>{
              if(!cliente){ onDone(); return }
              if(method==='card'){
                cliente.saldo = 0
                show({ message:'Pago recibido', type:'success' })
                onDone()
              } else if(method==='spei'){
                const undo = () => { cliente.saldo = saldo; show({ message:'Pago SPEI deshecho', type:'success' }) }
                cliente.saldo = 0
                show({ message:'Pago SPEI recibido', type:'success', action:{ label:'Deshacer', onClick: undo } })
                onDone()
              } else {
                show({ message:'Referencia OXXO generada', type:'success' })
                onDone()
              }
            }}>Confirmar</Button>
            <Button variant="ghost" onClick={onDone}>Cancelar</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
