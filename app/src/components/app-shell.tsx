import React, { useEffect, useState } from 'react'
import { Roles, type Role } from '../lib/rbac'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { loadI18n, I18N } from '../lib/i18n'
import { Icon } from './ui/icon'
import { AppFooter } from './app-footer'
import { BrandDecor } from './brand-decor'

type Link = { key: string; label: string; roles: string[]; icon?: any }
const links: Link[] = [
  { key:'login', label:'Selector de rol', roles:['*'], icon:'user' },
  { key:'admin-dashboard', label:'Dashboard', roles:['admin','dueno'], icon:'chart' },
  { key:'admin-clientes', label:'Clientes', roles:['admin','cobranza','dueno'], icon:'users' },
  { key:'admin-billing', label:'Cobranza/Facturacion', roles:['admin','cobranza','dueno'], icon:'dollar' },
  { key:'admin-reports', label:'Reportes', roles:['admin','dueno'], icon:'chart' },
  { key:'jefe-tickets', label:'Bandeja/Kanban', roles:['jefe-tecnico','dueno'], icon:'tickets' },
  { key:'tech-tickets', label:'Mis tickets', roles:['tecnico','dueno'], icon:'tickets' },
  { key:'client-home', label:'Inicio', roles:['cliente'], icon:'home' },
  { key:'client-support', label:'Soporte', roles:['cliente'], icon:'wrench' },
  { key:'client-app', label:'Cliente App', roles:['*'], icon:'settings' },
]

export const AppShell: React.FC<{
  page: string,
  onNavigate: (key: string) => void,
  children: React.ReactNode,
  online?: boolean,
  pendingCount?: number,
  onSync?: () => void,
}> = ({ page, onNavigate, children, online=true, pendingCount=0, onSync }) => {
  const [lang, setLang] = useState<'es-MX'|'en-US'>('es-MX')
  const [role, setRole] = useState<Role>(Roles.current)
  const [openNav, setOpenNav] = useState(false)
  const [, setShowNotif] = useState(false)
  useEffect(()=>{ loadI18n(lang) },[lang])
  useEffect(()=>{ Roles.current = role },[role])
  useEffect(()=>{ setRole(Roles.current) },[page])

  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  const normRole = role ? (normalize(role) === 'dueno' ? 'dueno' : normalize(role)) : ''
  const canShow = (rs: string[]) => rs.includes('*') || (!!role && (rs.includes(role) || rs.map(normalize).includes(normRole) || (normRole==='dueno' && rs.includes('admin'))))

  return (
    <div className="h-full grid [grid-template-rows:auto_1fr]">
      {!online && (
        <div className="fixed top-0 inset-x-0 z-30 bg-amber-50 border-b border-amber-300 text-amber-900 text-sm px-4 py-2 flex items-center justify-between">
          <span>
            Modo sin conexion - {pendingCount} {pendingCount===1 ? 'accion' : 'acciones'} pendientes
          </span>
          {onSync && <Button variant="secondary" size="sm" onClick={onSync}>Sincronizar</Button>}
        </div>
      )}
      {!online && <div className="h-10" />}
      <header className="sticky top-0 z-10 bg-surface border-b border-border flex items-center justify-between px-4 py-2 relative">
        <div className="flex items-center gap-2">
          <button className="md:hidden btn btn-ghost btn-sm" aria-label="Abrir menu" onClick={()=> setOpenNav(true)}><Icon name="menu"/></button>
          <div className="font-extrabold tracking-tight flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-gradient text-white shadow" aria-hidden>DI</span>
            <span>DOMY ISP</span>
          </div>
          <div className="hidden md:flex items-center glass border rounded-lg px-2 ml-4">
            <Icon name="search" className="text-muted"/>
            <input placeholder="Buscar..." className="px-2 py-1 outline-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge intent="info" className="bg-[rgba(6,182,212,0.1)]">{role ?? 'Invitado'}</Badge>
          {!online && <span className="badge badge-warning">Offline</span>}
          {pendingCount>0 && <Button variant="secondary" size="sm" onClick={onSync}>Pendientes: {pendingCount}</Button>}
          <Button variant="ghost" size="sm" className="hover:bg-slate-50" aria-label="Notificaciones" onClick={()=> setShowNotif(x=>!x)}><Icon name="bell"/></Button>
          <Button variant="ghost" size="sm" className="hover:bg-slate-50" onClick={()=> setLang(I18N.lang==='es-MX'?'en-US':'es-MX')}>{I18N.lang==='es-MX'?'EN':'ES'}</Button>
          <Button variant="ghost" size="sm" className="hover:bg-slate-50" aria-label="Cambiar tema" onClick={()=> { document.documentElement.classList.toggle('dark'); const cur = document.documentElement.getAttribute('data-theme'); document.documentElement.setAttribute('data-theme', cur==='dark' ? 'light' : 'dark'); }}><Icon name="moon"/></Button>
          <Button variant="danger" size="sm" onClick={()=>{ setRole(null); onNavigate('login') }}>Salir</Button>
        </div>
        <div className="absolute left-0 right-0 bottom-0 brand-divider" aria-hidden />
      </header>
      <div className="grid md:[grid-template-columns:260px_1fr] min-h-0">
        <aside className="border-r border-border p-4 hidden md:block">
          <nav className="flex flex-col gap-1">
            {links.filter(l => canShow(l.roles)).map(l => {
              const active = page===l.key
              return (
                <a key={l.key} href="#" onClick={(e)=>{ e.preventDefault(); onNavigate(l.key) }} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
                  {l.icon && <Icon name={l.icon} className="opacity-80"/>}
                  <span>{l.label}</span>
                </a>
              )
            })}
          </nav>
        </aside>
        <main className="p-4 overflow-auto relative">
          <BrandDecor />
          <div className="relative z-[1]">
            {children}
            <AppFooter/>
          </div>
        </main>
        {openNav && (
          <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={()=> setOpenNav(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-border p-4" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2"><strong>Menu</strong><button className="btn btn-ghost btn-sm" onClick={()=> setOpenNav(false)}>x</button></div>
              <nav className="flex flex-col gap-1">
                {links.filter(l => canShow(l.roles)).map(l => {
                  const active = page===l.key
                  return (
                    <a key={l.key} href="#" onClick={(e)=>{ e.preventDefault(); onNavigate(l.key); setOpenNav(false) }} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
                      {l.icon && <Icon name={l.icon} className="opacity-80"/>}
                      <span>{l.label}</span>
                    </a>
                  )
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
      {role && ['cliente','tecnico'].includes(role) && (
        <div className="fixed bottom-0 inset-x-0 md:hidden bg-surface border-t border-border flex justify-around py-2">
          {role==='cliente' && (<>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('client-home')}} className={`flex flex-col items-center ${page==='client-home'?'text-brand-contrast':'text-muted'}`}><Icon name="home"/><span className="text-xs">Inicio</span></a>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('client-pago')}} className={`flex flex-col items-center ${page==='client-pago'?'text-brand-contrast':'text-muted'}`}><Icon name="dollar"/><span className="text-xs">Pago</span></a>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('client-support')}} className={`flex flex-col items-center ${page==='client-support'?'text-brand-contrast':'text-muted'}`}><Icon name="wrench"/><span className="text-xs">Soporte</span></a>
          </>)}
          {role==='tecnico' && (<>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('tech-tickets')}} className={`flex flex-col items-center ${page==='tech-tickets'?'text-brand-contrast':'text-muted'}`}><Icon name="tickets"/><span className="text-xs">Tickets</span></a>
          </>)}
        </div>
      )}
    </div>
  )
}
