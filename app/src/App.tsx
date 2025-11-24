import React, { useEffect, useState } from 'react'
import { AppShell } from './components/app-shell'
import { ToastProvider } from './components/ui/toast'
import { initialState, type AppState } from './state/app-state'
import { Roles, type Role } from './lib/rbac'
import { Login } from './pages/Login'
import { Dashboard } from './features/admin/Dashboard'
import { Clientes } from './features/admin/Clientes'
import { Kanban } from './features/jefe/Kanban'
import { TechTickets } from './features/tech/Tickets'
import { TechDetalle } from './features/tech/Detalle'
import { ClientHome } from './features/client/Home'
import { Pago } from './features/client/Pago'
import { SelfTest } from './features/client/SelfTest'
import { Offline } from './lib/offline'
import { ClientApp } from './features/clientapp/ClientApp'
import { Billing } from './features/admin/Billing'
import { POS } from './features/admin/POS'
import { Reports } from './features/admin/Reports'
import { Caja } from './features/admin/Caja'
import { Dispatch } from './features/jefe/Dispatch'

export const App: React.FC = () => {
  const [state] = useState<AppState>({ ...initialState })
  const [page, setPage] = useState<string>('login')
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [pending, setPending] = useState<number>(0)
  const [techDetailId, setTechDetailId] = useState<string|null>(null)
  const [activeClientId, setActiveClientId] = useState<string>('1204')

  useEffect(()=>{
    const r = Roles.current
    if(!r){ setPage('login') }
    const unsub = Offline.subscribe((len)=> setPending(len))
    const onOn = () => setOnline(true)
    const onOff = () => setOnline(false)
    window.addEventListener('online', onOn); window.addEventListener('offline', onOff)
    return ()=>{ unsub(); window.removeEventListener('online', onOn); window.removeEventListener('offline', onOff) }
  },[])

  const login = (r: Role, redirect?: string) => {
    state.loggedInUser = r
    if(redirect){ setPage(redirect); return }
    if(r==='dueno' || r==='root') setPage('admin-dashboard')
    if(r==='facturacion') setPage('admin-billing')
    if(r==='cobranza') setPage('admin-pos')
    if(r==='jefe-tecnico') setPage('jefe-dashboard')
    if(r==='tecnico') setPage('tech-tickets')
    if(r==='cliente'){ setActiveClientId('1204'); setPage('client-home') }
  }

  return (
    <ToastProvider>
      <AppShell page={page} onNavigate={setPage} online={online} pendingCount={pending} onSync={()=> Offline.flush()}>
        {page==='login' && <Login onLogin={login} />}

        {page==='admin-dashboard' && <Dashboard state={state} />}
        {page==='admin-clientes' && <Clientes state={state} />}
        {page==='admin-billing' && <Billing state={state} />}
        {page==='admin-pos' && <POS state={state} />}
        {page==='admin-reports' && <Reports state={state} />}
        {page==='admin-caja' && <Caja state={state} />}

        {page==='jefe-tickets' && <Kanban state={state} />}
        {page==='jefe-dashboard' && <Dispatch state={state} />}

        {page==='tech-tickets' && <TechTickets state={state} onOpen={(id)=>{ setTechDetailId(id); setPage('tech-detalle') }} />}
        {page==='tech-detalle' && techDetailId && <TechDetalle state={state} id={techDetailId} onDone={()=> setPage('tech-tickets')} />}

        {page==='client-home' && <ClientHome state={state} clientId={activeClientId} onSwitchClient={setActiveClientId} onPay={()=> setPage('client-pago')} onSupport={()=> setPage('client-support')} />}
        {page==='client-pago' && <Pago state={state} clientId={activeClientId} onDone={()=> setPage('client-home')} />}
        {page==='client-support' && <SelfTest state={state} clientId={activeClientId} onDone={()=> setPage('client-home')} />}
        {page==='client-app' && <ClientApp state={state} />}
      </AppShell>
    </ToastProvider>
  )
}
