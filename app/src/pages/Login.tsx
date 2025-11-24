import React, { useMemo, useState } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Roles, type Role } from '../lib/rbac'
import { Badge } from '../components/ui/badge'

const accounts: Record<string, { password: string; role: Role; redirect: string }> = {
  'dueno@domy.mx': { password: 'demo123', role: 'dueno', redirect: 'admin-dashboard' },
  'facturacion@domy.mx': { password: 'demo123', role: 'facturacion', redirect: 'admin-billing' },
  'cobranza@domy.mx': { password: 'demo123', role: 'cobranza', redirect: 'admin-pos' },
  'jefetecnico@domy.mx': { password: 'demo123', role: 'jefe-tecnico', redirect: 'jefe-tickets' },
  'tecnico@domy.mx': { password: 'demo123', role: 'tecnico', redirect: 'tech-tickets' },
  'cliente@domy.mx': { password: 'demo123', role: 'cliente', redirect: 'client-home' },
  'root@domy.mx': { password: 'root123', role: 'root', redirect: 'admin-dashboard' },
}

export const Login: React.FC<{ onLogin: (r: Role, redirect?: string)=>void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('dueno@domy.mx')
  const [password, setPassword] = useState('demo123')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const accountHint = useMemo(()=> Object.keys(accounts).map(e => `${e} / ${accounts[e].password}`).join(', '), [])

  const login = () => {
    const user = accounts[email.toLowerCase()]
    if(!user || user.password!==password){ setError('Credenciales invalidas'); return }
    Roles.current = user.role
    if(remember){ localStorage.setItem('domy-user', email) }
    onLogin(user.role, user.redirect)
  }

  const launchApp = (target: 'cliente'|'tecnico') => {
    const account = target==='cliente' ? accounts['cliente@domy.mx'] : accounts['tecnico@domy.mx']
    Roles.current = account.role
    onLogin(account.role, account.redirect)
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4 items-center">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Sistema Doomy ISP</p>
        <h1 className="text-3xl font-black leading-tight">Acceso unificado<br/>roles y apps embebidas</h1>
        <p className="text-muted max-w-xl">Login sin selector de rol. Ingresas con email y contraseña, detectamos tu rol, aplicamos middleware y redireccionamos al dashboard correcto. Para la demo: {accountHint}.</p>
        <div className="flex gap-2 flex-wrap">
          <Badge intent="info">Recuperacion de contraseña lista</Badge>
          <Badge intent="success">Recuerda sesión</Badge>
        </div>
      </div>
      <Card className="space-y-3 max-w-xl">
        <div>
          <label className="text-sm font-medium">Correo</label>
          <input className="w-full mt-1 border border-border rounded-lg px-3 py-2" type="email" value={email} onChange={e=> setEmail(e.target.value)} placeholder="email@domy.mx" />
        </div>
        <div>
          <label className="text-sm font-medium">Contraseña</label>
          <input className="w-full mt-1 border border-border rounded-lg px-3 py-2" type="password" value={password} onChange={e=> setPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={e=> setRemember(e.target.checked)} /> Recordar sesión</label>
          <a className="text-brand-contrast" href="#" onClick={e=>{ e.preventDefault(); setError('Te enviamos un correo de recuperación (simulado).') }}>Olvidé contraseña</a>
        </div>
        {error && <div className="border border-red-200 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
        <Button className="w-full" onClick={login}>Entrar</Button>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <Button variant="secondary" onClick={()=> launchApp('cliente')}>Abrir APP CLIENTE</Button>
          <Button variant="secondary" onClick={()=> launchApp('tecnico')}>Abrir APP TÉCNICO</Button>
        </div>
        <div className="text-xs text-muted">Los accesos generan redirección por rol automáticamente. Root / superadmin entra con root@domy.mx / root123.</div>
      </Card>
    </div>
  )
}
