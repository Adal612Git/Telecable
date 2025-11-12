import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Skeleton } from '../../components/ui/skeleton'
import type { AppState } from '../../state/app-state'
import { Badge } from '../../components/ui/badge'
import { Tabs } from '../../components/ui/tabs'

export const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'kpi'|'trends'|'ops'>('kpi')
  useEffect(()=>{ const t = setTimeout(()=> setLoading(false), 800); return ()=> clearTimeout(t) },[])
  const tickets = Object.values(state.tickets)
  const kpis = useMemo(()=>{
    const numClientes = Object.keys(state.clientes).length
    const open = tickets.filter(t=>t.estado!=='Resuelto').length
    const arpu = 299.00
    const sla = 0.98
    const churn = 0.012
    return { numClientes, open, arpu, sla, churn }
  },[state])

  const revenue = useMemo(()=>{
    // genera 12 meses de ingresos simulados
    const base = Object.keys(state.clientes).length * 299
    return Array.from({length:12}, (_,i)=> Math.round(base*(0.9 + Math.sin(i/2)*0.05 + Math.random()*0.04)))
  },[state])

  const ticketsBy = useMemo(()=>{
    return ['Nuevo','Asignado','Resuelto'].map(s => ({ s, n: tickets.filter(t=>t.estado===s as any).length }))
  },[state])
  return (
    <div className="space-y-3">
      <Tabs tabs={[{key:'kpi',label:'KPIs'},{key:'trends',label:'Tendencias'},{key:'ops',label:'Operación'}]} active={tab} onChange={(k)=> setTab(k as any)} />
      {loading ? <Skeleton className="h-28"/> : tab==='kpi' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-2">
          <Card><div className="text-muted">Clientes</div><h2 className="text-2xl">{kpis.numClientes}</h2></Card>
          <Card><div className="text-muted">Tickets abiertos</div><h2 className="text-2xl">{kpis.open}</h2></Card>
          <Card><div className="text-muted">ARPU</div><h2 className="text-2xl">${kpis.arpu.toFixed(2)}</h2></Card>
          <Card><div className="text-muted">SLA</div><h2 className="text-2xl">{(kpis.sla*100).toFixed(0)}%</h2></Card>
          <Card><div className="text-muted">Churn</div><h2 className="text-2xl">{(kpis.churn*100).toFixed(1)}%</h2></Card>
        </div>
      ) : tab==='trends' ? (
        <div className="grid md:grid-cols-2 gap-3 mt-2">
          <Card>
            <div className="font-semibold">Ingreso mensual</div>
            <svg viewBox="0 0 300 100" className="w-full h-24 mt-2">
              <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points={revenue.map((v,i)=> `${i*(300/11)},${100 - (v/Math.max(...revenue))*90 - 5}`).join(' ')} />
            </svg>
          </Card>
          <Card>
            <div className="font-semibold">Tickets por estado</div>
            <div className="flex items-end gap-3 h-28 mt-3">
              {ticketsBy.map((x,i)=> (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-8 bg-[#e5ecff]" style={{ height: `${10 + x.n*15}px`}} />
                  <div className="text-xs mt-1">{x.s}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3 mt-2">
          <Card>
            <div className="font-semibold">Capacidad por técnico (Hoy)</div>
            <div className="mt-2 space-y-2 text-sm">
              {['Sergio','Luisa','Miguel'].map((t,i)=>{
                const used = [3,1,2][i]
                const cap = 5
                return (
                  <div key={t}>
                    <div className="flex justify-between"><span>{t}</span><span>{used}/{cap}</span></div>
                    <div className="h-2 bg-slate-200 rounded">
                      <div className="h-2 bg-[#3B82F6] rounded" style={{ width: `${(used/cap)*100}%`}}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
          <Card>
            <div className="font-semibold">Acciones recientes</div>
            <ul className="mt-2 text-sm list-disc pl-4">
              {state.audit.slice(-5).reverse().map((a,i)=> (
                <li key={i}>{a.action} · {new Date(a.when).toLocaleString()}</li>
              ))}
              {state.audit.length===0 && <li className="text-muted">Sin actividades recientes</li>}
            </ul>
          </Card>
        </div>
      )}
      <Card>
        <h3 className="font-semibold">Tickets recientes</h3>
        <div className="overflow-auto mt-2">
          <table className="w-full">
            <thead><tr><th className="text-left p-2">ID</th><th className="text-left p-2">Cliente</th><th className="text-left p-2">Problema</th><th className="text-left p-2">Estado</th><th className="text-left p-2">Técnico</th></tr></thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-t border-border">
                  <td className="p-2">#{t.id}</td>
                  <td className="p-2">{t.cliente}</td>
                  <td className="p-2">{t.problema}</td>
                  <td className="p-2"><Badge intent={t.estado==='Resuelto'?'success': t.estado==='Asignado'?'info':'warning'}>{t.estado}</Badge></td>
                  <td className="p-2">{t.tecnico ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
