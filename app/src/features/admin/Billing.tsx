import React, { useState } from 'react'
import type { AppState, Invoice } from '../../state/app-state'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

const soporteLinea = 'Linea demo: 800-111-2233 opcion 2'

type Mode = 'new'|'edit'

export const Billing: React.FC<{ state: AppState }> = ({ state }) => {
  const { show } = useToast()
  const invoices = Object.values(state.facturas)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('new')
  const [form, setForm] = useState<Invoice>({ id:'', clienteId:'1204', monto:299, fecha:'', status:'pendiente', descuento:0, concepto:'', soporte: soporteLinea })
  const [quickClient, setQuickClient] = useState({ nombre:'', plan:'50MB', password:'demo123', saldo:0 })

  const nextId = () => {
    const nums = Object.keys(state.facturas).map(id=> Number(id.replace(/[^0-9]/g,'')))
    const next = Math.max(...nums, 1004) + 1
    return `F-${next}`
  }

  const startNew = () => {
    setMode('new')
    setForm({ id: nextId(), clienteId: form.clienteId || '1204', monto:299, fecha: new Date().toISOString().slice(0,10), status:'pendiente', descuento:0, concepto:'Servicio mensual', soporte: soporteLinea })
    setOpen(true)
  }

  const startEdit = (inv: Invoice) => {
    setMode('edit')
    setForm({ ...inv })
    setOpen(true)
  }

  const save = () => {
    if(!form.id || !form.clienteId){ show({ message:'Cliente y folio son requeridos', type:'error' }); return }
    state.facturas[form.id] = { ...form, monto: Number(form.monto), descuento: Number(form.descuento||0), soporte: form.soporte || soporteLinea }
    show({ message: mode==='new'?'Factura creada':'Factura actualizada', type:'success' })
    setOpen(false)
  }

  const remove = (id: string) => {
    const ok = window.confirm('Eliminar factura?')
    if(!ok) return
    delete state.facturas[id]
    show({ message:'Factura eliminada', type:'success' })
  }

  const applyDiscount = (inv: Invoice) => {
    const raw = window.prompt('Descuento en % (solo demo):','10')
    if(!raw) return
    const pct = Number(raw)
    if(Number.isNaN(pct)) return
    const before = inv.monto
    inv.descuento = pct
    inv.monto = Number((before * (1 - pct/100)).toFixed(2))
    show({ message:`Descuento aplicado (${pct}%)`, type:'success' })
  }

  const createClientFromBilling = () => {
    if(!quickClient.nombre.trim() || !quickClient.password.trim()){
      show({ message:'Nombre y password requeridos', type:'error' }); return
    }
    const ids = Object.keys(state.clientes).map(Number)
    const id = String(Math.max(...ids)+1)
    state.clientes[id] = { id, nombre: quickClient.nombre, plan: quickClient.plan, estado:'Activo', saldo: quickClient.saldo, moraDays: 0, promesaPago: null, telefono: undefined, password: quickClient.password }
    show({ message:`Cliente ${quickClient.nombre} creado desde cobranza`, type:'success' })
    setQuickClient({ nombre:'', plan:'50MB', password:'demo123', saldo:0 })
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-3">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-semibold">Facturacion y cobranza</h3>
            <p className="text-sm text-muted">Consulta, crea, edita, elimina y aplica descuentos. Soporte: {soporteLinea}</p>
          </div>
          <Button onClick={startNew}>Crear factura</Button>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left p-2">Folio</th><th className="text-left p-2">Cliente</th><th className="text-left p-2">Monto</th><th className="text-left p-2">Desc.</th><th className="text-left p-2">Estado</th><th className="text-left p-2">Fecha</th><th className="text-left p-2">Atencion</th><th className="text-left p-2">Acciones</th></tr></thead>
            <tbody>
              {invoices.map(inv => {
                const cliente = state.clientes[inv.clienteId]
                return (
                  <tr key={inv.id} className="border-t border-border">
                    <td className="p-2">{inv.id}</td>
                    <td className="p-2">{cliente ? `${cliente.nombre} (${cliente.id})` : inv.clienteId}</td>
                    <td className="p-2">${inv.monto.toFixed(2)}</td>
                    <td className="p-2">{inv.descuento ?? 0}%</td>
                    <td className="p-2">{inv.status}</td>
                    <td className="p-2">{inv.fecha}</td>
                    <td className="p-2 text-xs">{inv.soporte || soporteLinea}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        <Button size="sm" variant="secondary" onClick={()=> startEdit(inv)}>Editar</Button>
                        <Button size="sm" variant="ghost" onClick={()=> applyDiscount(inv)}>Descuento</Button>
                        <Button size="sm" variant="ghost" onClick={()=> remove(inv.id)}>Borrar</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-3">
        <Card>
          <h4 className="font-semibold">Alta rapida de cliente (cobranza)</h4>
          <div className="mt-2 space-y-2 text-sm">
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Nombre" value={quickClient.nombre} onChange={e=> setQuickClient(c=>({...c, nombre:e.target.value}))} />
            <select className="w-full border border-border rounded-lg px-3 py-2" value={quickClient.plan} onChange={e=> setQuickClient(c=>({...c, plan:e.target.value}))}>
              <option>50MB</option><option>100MB</option><option>200MB</option><option>300MB</option><option>500MB</option>
            </select>
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Password demo" value={quickClient.password} onChange={e=> setQuickClient(c=>({...c, password:e.target.value}))} />
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Saldo inicial" type="number" value={quickClient.saldo} onChange={e=> setQuickClient(c=>({...c, saldo:Number(e.target.value)}))} />
            <Button className="w-full" onClick={createClientFromBilling}>Crear cliente</Button>
          </div>
        </Card>
        <Card>
          <h4 className="font-semibold">Linea de atencion</h4>
          <p className="text-sm text-muted">Agrega la linea ficticia directo a la factura para que el cliente sepa donde preguntar.</p>
          <div className="mt-2 rounded-lg border border-border bg-slate-50 p-3 text-sm">{soporteLinea}</div>
        </Card>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-12 flex justify-center z-30">
          <div className="w-[520px] max-w-[calc(100%-2rem)]">
            <Card>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{mode==='new'?'Nueva factura':'Editar factura'}</h4>
                <Button variant="ghost" size="sm" onClick={()=> setOpen(false)}>Cerrar</Button>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="block text-xs uppercase text-muted">Folio</label>
                  <input className="w-full border border-border rounded-lg px-3 py-2" value={form.id} onChange={e=> setForm(f=>({...f, id:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Cliente</label>
                  <select className="w-full border border-border rounded-lg px-3 py-2" value={form.clienteId} onChange={e=> setForm(f=>({...f, clienteId:e.target.value}))}>
                    {Object.values(state.clientes).map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Concepto</label>
                  <input className="w-full border border-border rounded-lg px-3 py-2" value={form.concepto || ''} onChange={e=> setForm(f=>({...f, concepto:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Fecha</label>
                  <input type="date" className="w-full border border-border rounded-lg px-3 py-2" value={form.fecha} onChange={e=> setForm(f=>({...f, fecha:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Monto</label>
                  <input type="number" className="w-full border border-border rounded-lg px-3 py-2" value={form.monto} onChange={e=> setForm(f=>({...f, monto:Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Descuento %</label>
                  <input type="number" className="w-full border border-border rounded-lg px-3 py-2" value={form.descuento || 0} onChange={e=> setForm(f=>({...f, descuento:Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Estado</label>
                  <select className="w-full border border-border rounded-lg px-3 py-2" value={form.status} onChange={e=> setForm(f=>({...f, status:e.target.value as any}))}>
                    <option value="pendiente">pendiente</option>
                    <option value="pagada">pagada</option>
                    <option value="vencida">vencida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase text-muted">Linea de atencion</label>
                  <input className="w-full border border-border rounded-lg px-3 py-2" value={form.soporte || ''} onChange={e=> setForm(f=>({...f, soporte:e.target.value}))} />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" onClick={()=> setOpen(false)}>Cancelar</Button>
                <Button onClick={save}>Guardar</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
