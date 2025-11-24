import React, { useMemo, useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

export const SelfTest: React.FC<{ state: AppState, clientId: string, onDone: ()=>void }> = ({ state, clientId, onDone }) => {
  const { show } = useToast()
  const [type, setType] = useState('Sin servicio')
  const [desc, setDesc] = useState('')
  const [checks, setChecks] = useState({ power:false, cables:false, reboot:false, device:false })
  const [photoName, setPhotoName] = useState<string>('')
  const [tried, setTried] = useState(false)
  const cliente = state.clientes[clientId] ?? Object.values(state.clientes)[0]
  const clientName = cliente?.nombre ?? 'Cliente'

  const ready = useMemo(()=> Object.values(checks).every(Boolean) && photoName.trim().length>0, [checks, photoName])
  const submit = () => {
    const ids = Object.keys(state.tickets).map(Number)
    const next = String(Math.max(...ids)+1)
    state.tickets[next] = {
      id: next,
      cliente: clientName,
      problema: `${type}${desc?` - ${desc}`:''}`,
      estado:'Nuevo',
      tecnico: null,
      evidencia: photoName,
    }
    show({ message:`Ticket #${next} creado con evidencia`, type:'success' })
    setDesc(''); setChecks({ power:false, cables:false, reboot:false, device:false }); setPhotoName(''); setTried(false)
    onDone()
  }

  return (
    <Card>
      <h3 className="font-semibold">Problemas tecnicos</h3>
      <p className="text-muted text-sm">Responde el checklist rapido. Si sigues con fallas, generaremos el ticket y adjuntaremos la foto obligatoria.</p>
      <div className="mt-3 space-y-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Paso 1: checklist basico</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={checks.power} onChange={e=> setChecks(c=>({...c, power:e.target.checked}))}/> Luces del modem encendidas</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={checks.cables} onChange={e=> setChecks(c=>({...c, cables:e.target.checked}))}/> Cable/coax sin cortes visibles</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={checks.reboot} onChange={e=> setChecks(c=>({...c, reboot:e.target.checked}))}/> Reinicie el equipo hace menos de 5 minutos</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={checks.device} onChange={e=> setChecks(c=>({...c, device:e.target.checked}))}/> Probe con otro dispositivo</label>
        </div>
        <div>
          <label className="block text-sm font-medium">Paso 2: tipo de falla</label>
          <select className="w-full border border-border rounded-lg px-3 py-2" value={type} onChange={e=> setType(e.target.value)}>
            <option>Sin servicio</option>
            <option>Internet lento</option>
            <option>Intermitencias</option>
            <option>Problemas de wifi</option>
            <option>Danio fisico/ruido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Paso 3: detalle</label>
          <textarea className="w-full border border-border rounded-lg px-3 py-2 min-h-[110px]" value={desc} onChange={e=> setDesc(e.target.value)} placeholder="Ej: luces rojas, pierde internet al jugar, empezo hoy en la manana" />
        </div>
        <div>
          <label className="block text-sm font-medium">Paso 4: foto obligatoria</label>
          <input type="file" accept="image/*" className="w-full" onChange={e=>{ const f = e.target.files?.[0]; setPhotoName(f? f.name:'') }} />
          <div className={`text-sm ${photoName? 'text-green-700':'text-red-700'}`}>{photoName? `Foto lista: ${photoName}` : 'Sin foto no se puede avanzar'}</div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="border border-amber-200 bg-amber-50 text-amber-900 rounded-lg px-3 py-2 text-sm">Si aun con todo lo anterior sigues con fallas, presiona el boton para generar el ticket. Se adjuntara la foto.</div>
        <Button className="w-full" variant="danger" disabled={!ready} onClick={()=>{ setTried(true); submit() }}>No se resolvio, crear ticket</Button>
        <Button className="w-full" variant="ghost" onClick={onDone}>Todo ok, volver</Button>
        {tried && !ready && <div className="text-sm text-red-700 text-center">Completa checklist y sube foto para avanzar.</div>}
      </div>
    </Card>
  )
}
