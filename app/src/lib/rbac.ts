export type Role = 'dueño'|'admin'|'cobranza'|'jefe-tecnico'|'tecnico'|'cliente'|null

export const Roles = {
  current: null as Role,
}

export function canSee(roles: string[]){
  const r = Roles.current
  return roles.includes('*') || (!!r && roles.includes(r))
}

