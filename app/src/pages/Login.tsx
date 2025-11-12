import React from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Roles, type Role } from '../lib/rbac'

export const Login: React.FC<{ onLogin: (r: Role)=>void }> = ({ onLogin }) => {
  const login = (r: Role) => { Roles.current = r; onLogin(r) }
  return (
    <Card>
      <h2 className="text-xl font-semibold">¿Quién eres hoy?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mt-3">
        <Button variant="secondary" onClick={()=>login('dueño')}>Dueño/Admin</Button>
        <Button variant="secondary" onClick={()=>login('cobranza')}>Cobranza</Button>
        <Button variant="secondary" onClick={()=>login('jefe-tecnico')}>Jefe de Técnicos</Button>
        <Button variant="secondary" onClick={()=>login('tecnico')}>Técnico (Sergio)</Button>
        <Button variant="secondary" onClick={()=>login('cliente')}>Cliente (Ana)</Button>
      </div>
    </Card>
  )
}

