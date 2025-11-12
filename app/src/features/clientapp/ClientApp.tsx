import React, { useMemo, useState } from 'react'
import type { AppState } from '../../state/app-state'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/toast'

type Tab = 'home'|'bills'|'support'|'profile'

export const ClientApp: React.FC<{ state: AppState }> = ({ state }) => {
  const [tab, setTab] = useState<Tab>('home')
  const { show } = useToast()
  const ana = state.clientes['1204']
  const dueDate = useMemo(()=> {
    const d = new Date(); d.setDate(d.getDate()+7); return d.toLocaleDateString()
  },[])
  const invoices = useMemo(()=> ([
    { id:'F-1001', date:'2025-10-01', amount:299.00, status:'paid'},
    { id:'F-1002', date:'2025-11-01', amount:299.00, status:'paid'},
    { id:'F-1003', date:'2025-12-01', amount:299.00, status: ana.saldo>0?'failed':'paid'},
  ]),[ana.saldo]) as {id:string,date:string,amount:number,status:'paid'|'failed'}[]

  return (
    <div className="mx-auto max-w-[420px] h-[720px] border border-border rounded-3xl overflow-hidden shadow-soft bg-white flex flex-col">
      <header className="bg-[#0B1220] text-white px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">DOMY Cliente</div>
        <div className="text-xs opacity-80">v0.1</div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        {tab==='home' && (
          <div className="space-y-3">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted">Saldo</div>
                  <div className="text-2xl font-bold">${ana.saldo.toFixed(2)}</div>
                </div>
                <div className="text-right text-sm">Próxima fecha: <strong>{dueDate}</strong></div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button onClick={()=> show({ message:'Flujo de pago en “Bills”', type:'success' })} className={ana.saldo>0?'':'hidden'}>Pagar</Button>
                <Button variant="ghost" onClick={()=> setTab('support')}>Soporte</Button>
              </div>
            </div>
            <div className="card">
              <div className="font-semibold mb-2">Últimos tickets</div>
              <div className="space-y-1 text-sm">
                {Object.values(state.tickets).filter(t=>t.cliente==='Ana García').slice(-3).map(t => (
                  <div key={t.id}><strong>#{t.id}</strong> · {t.problema} · <Badge intent={t.estado==='Resuelto'?'success':t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==='bills' && (
          <div className="space-y-3">
            <div className="card">
              <div className="font-semibold">Facturas</div>
              <table className="w-full mt-2">
                <thead><tr><th className="text-left p-2">Folio</th><th className="text-left p-2">Fecha</th><th className="text-left p-2">Monto</th><th className="text-left p-2">Estado</th><th className="text-left p-2">Acciones</th></tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-t border-border text-sm">
                      <td className="p-2">{inv.id}</td>
                      <td className="p-2">{inv.date}</td>
                      <td className="p-2">${inv.amount.toFixed(2)}</td>
                      <td className="p-2">{inv.status==='paid'?<Badge intent="success">Pagada</Badge>:<Badge intent="danger">Fallida</Badge>}</td>
                      <td className="p-2 flex gap-1">
                        <Button size="sm" variant="secondary" onClick={()=>{
                          const blob=new Blob([`CFDI ${inv.id}`],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${inv.id}.txt`; a.click(); URL.revokeObjectURL(url);
                        }}>Descargar</Button>
                        {inv.status==='failed' && <Button size="sm" onClick={()=> show({ message:'Reintento de pago simulado', type:'success' })}>Reintentar</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab==='support' && (
          <div className="space-y-3">
            <div className="card">
              <div className="font-semibold">Soporte rápido</div>
              <div className="text-sm text-muted">Ejecuta un self‑test y, si falla, podrás crear un ticket automáticamente.</div>
              <div className="mt-2 flex gap-2">
                <Button onClick={()=> show({ message:'Self‑test lanzado (ver sección Soporte de web)', type:'success' })}>Self‑test</Button>
                <Button variant="danger" onClick={()=> show({ message:'Ticket creado (dummy)', type:'success' })}>Reportar falla</Button>
              </div>
            </div>
          </div>
        )}
        {tab==='profile' && (
          <div className="space-y-3">
            <div className="card">
              <div className="font-semibold">Mi cuenta</div>
              <div className="text-sm mt-2">Plan: <strong>{ana.plan}</strong></div>
              <div className="text-sm">Dirección: Calle Falsa 123</div>
              <div className="text-sm">Tarjeta: **** **** **** 4242</div>
              <div className="mt-2 flex gap-2">
                <Button onClick={()=> show({ message:'Cambio de plan solicitado', type:'success' })}>Cambiar plan</Button>
                <Button variant="ghost" onClick={()=> show({ message:'Preferencias guardadas', type:'success' })}>Notificaciones</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <nav className="border-t border-border bg-white grid grid-cols-4 text-sm">
        <button className={`py-3 ${tab==='home'?'text-brand-contrast':'text-muted'}`} onClick={()=> setTab('home')}>Inicio</button>
        <button className={`py-3 ${tab==='bills'?'text-brand-contrast':'text-muted'}`} onClick={()=> setTab('bills')}>Facturas</button>
        <button className={`py-3 ${tab==='support'?'text-brand-contrast':'text-muted'}`} onClick={()=> setTab('support')}>Soporte</button>
        <button className={`py-3 ${tab==='profile'?'text-brand-contrast':'text-muted'}`} onClick={()=> setTab('profile')}>Perfil</button>
      </nav>
    </div>
  )
}

