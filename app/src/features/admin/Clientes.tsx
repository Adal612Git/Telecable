import React, { useEffect, useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'
import { Analytics } from '../../lib/analytics'
import { Offline } from '../../lib/offline'
import { Chip } from '../../components/ui/chip'
import { Pagination } from '../../components/ui/pagination'

type Segment = 'all'|'0-30'|'31-60'|'60+'
export const Clientes: React.FC<{ state: AppState }> = ({ state }) => {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [plan, setPlan] = useState('50MB')
  const [segment, setSegment] = useState<Segment>('all')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const perPage = 8
  const { show } = useToast()
  useEffect(()=>{ const t = setTimeout(()=> setLoading(false), 400); return ()=> clearTimeout(t) },[])

  const all = Object.values(state.clientes)
    .filter(c => {
      if(segment==='all') return true
      const d = c.moraDays ?? 0
      if(segment==='0-30') return d>0 && d<=30
      if(segment==='31-60') return d>=31 && d<=60
      if(segment==='60+') return d>60
      return true
    })
    .filter(c => search ? c.nombre.toLowerCase().includes(search.toLowerCase()) : true)
    .filter(c => planFilter.length? planFilter.includes(c.plan) : true)
    .filter(c => statusFilter.length? statusFilter.includes(c.estado) : true)

  const total = all.length
  const clientes = all.slice((page-1)*perPage, page*perPage)

  const create = () => {
    const nextId = String(Math.max(...Object.keys(state.clientes).map(Number))+1)
    state.clientes[nextId] = { id: nextId, nombre, plan, estado:'Activo', saldo:0, moraDays: 0, promesaPago: null }
    setOpen(false); setNombre(''); setPlan('50MB')
    show({ message:'Cliente creado', type:'success'})
  }

  const sendReminder = (id: string) => {
    const c = state.clientes[id]
    const action = () => {
      // 25% chance of provider down
      const fail = Math.random() < 0.25
      if(fail){ show({ message: (window as any).__I18N?.dict?.['error.generic'] || 'No pudimos procesar tu solicitud. Intenta nuevamente o contacta soporte.', type:'error' }); Analytics.track('reminder_failed',{channel:'sms', id}); return }
      show({ message:'Recordatorio enviado', type:'success' }); Analytics.track('reminder_sent',{channel:'sms', id})
    }
    if(!Offline.online){ Offline.add(action); show({ message:'Accion encolada (offline)', type:'success' }); return }
    action()
  }

  const setPromise = (id: string) => {
    const c = state.clientes[id]
    const date = window.prompt('Fecha promesa de pago (YYYY-MM-DD):','')
    if(!date) return
    c.promesaPago = date
    show({ message:'Promesa registrada', type:'success' }); Analytics.track('installment_created',{id, promise_date:date})
  }

  const conciliate = (id: string) => {
    const ref = window.prompt('Referencia SPEI:','')
    if(!ref) return
    if(ref.trim().toUpperCase()==='DUP'){
      show({ message:'Pago duplicado ignorado', type:'success' }); Analytics.track('dup_ignored',{id, ref})
    } else {
      show({ message:'Conciliado', type:'success' }); Analytics.track('reconciliation_match',{id, ref})
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Clientes</h3>
        <Button onClick={()=> setOpen(true)}>Crear cliente</Button>
      </div>
      {/* Segments toolbar */}
      <div className="mt-3 flex items-center gap-2">
        <Button variant={segment==='all'?'primary':'ghost'} onClick={()=> setSegment('all')}>Todos</Button>
        <Button variant={segment==="0-30"?"primary":"ghost"} onClick={()=> setSegment("0-30")}>0-30</Button>
        <Button variant={segment==="31-60"?"primary":"ghost"} onClick={()=> setSegment("31-60")}>31-60</Button>
        <Button variant={segment==='60+'?'primary':'ghost'} onClick={()=> setSegment('60+')}>60+</Button>
        <div className="ml-auto flex items-center gap-2">
          <input className="border border-border rounded-lg px-3 py-2" placeholder="Buscar nombre..." value={search} onChange={e=>{ setSearch(e.target.value); setPage(1) }} />
          <select className="border border-border rounded-lg px-2 py-2" onChange={e=>{ const v=e.target.value; setPlanFilter(v? [v]:[]); setPage(1) }}>
            <option value="">Plan</option>
            <option>50MB</option><option>100MB</option><option>200MB</option>
          </select>
          <select className="border border-border rounded-lg px-2 py-2" onChange={e=>{ const v=e.target.value; setStatusFilter(v? [v]:[]); setPage(1) }}>
            <option value="">Estado</option>
            <option>Activo</option><option>Suspendido</option>
          </select>
        </div>
      </div>

      {(planFilter.length>0 || statusFilter.length>0 || search) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {search && <Chip label={`Nombre: ${search}`} onRemove={()=> setSearch('')} />}
          {planFilter.map(p => <Chip key={p} label={`Plan: ${p}`} onRemove={()=> setPlanFilter([])} />)}
          {statusFilter.map(s => <Chip key={s} label={`Estado: ${s}`} onRemove={()=> setStatusFilter([])} />)}
          <button className="btn btn-ghost btn-sm" onClick={()=>{ setSearch(''); setPlanFilter([]); setStatusFilter([]) }}>Limpiar</button>
        </div>
      )}

      {(() => {
        if (loading) return <div className="skeleton h-14 mt-3"/>
        if (clientes.length === 0) return (
          <div className="mt-3"><EmptyState title="Aun no hay clientes - Crear cliente" actionLabel="Crear cliente" onAction={()=> setOpen(true)} /></div>
        )
        return (
          <div>
            <div className="mt-3 overflow-auto">
              <table className="w-full">
                <thead><tr><th className="text-left p-2">ID</th><th className="text-left p-2">Nombre</th><th className="text-left p-2">Plan</th><th className="text-left p-2">Estado</th><th className="text-left p-2">Saldo</th><th className="text-left p-2">Mora</th><th className="text-left p-2">Promesa</th><th className="text-left p-2">Acciones</th></tr></thead>
                <tbody>
                  {clientes.map(c => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="p-2">{c.id}</td>
                      <td className="p-2">{c.nombre}</td>
                      <td className="p-2">{c.plan}</td>
                      <td className="p-2">{c.estado}</td>
                      <td className="p-2">${c.saldo.toFixed(2)}</td>
                      <td className="p-2">{(c.moraDays??0)}d</td>
                      <td className="p-2">{c.promesaPago ?? '-'}</td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="secondary" onClick={()=> sendReminder(c.id)} disabled={(c.saldo||0)<=0}>Recordatorio</Button>
                          <Button size="sm" variant="ghost" onClick={()=> setPromise(c.id)} disabled={(c.saldo||0)<=0}>Promesa</Button>
                          <Button size="sm" variant="ghost" onClick={()=> conciliate(c.id)} disabled={(c.saldo||0)<=0}>Conciliar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} total={total} perPage={perPage} onPage={setPage} />
          </div>
        )
      })()}

      {open && (
        <div className="fixed right-4 top-16 w-[420px] max-w-[calc(100%-2rem)]">
          <Card>
            <h3 className="font-semibold">Nuevo cliente</h3>
            <div className="mt-2 space-y-3">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input className="form-input w-full border border-border rounded-lg px-3 py-2" value={nombre} onChange={e=>setNombre(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Plan</label>
                <select className="form-select w-full border border-border rounded-lg px-3 py-2" value={plan} onChange={e=>setPlan(e.target.value)}>
                  <option>50MB</option><option>100MB</option><option>200MB</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={()=> setOpen(false)}>Cerrar</Button>
                <Button onClick={create}>Guardar</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}




