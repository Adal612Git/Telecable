import type { Role } from '../lib/rbac'

export type Ticket = { id: string; cliente: string; problema: string; estado: 'Nuevo'|'Asignado'|'Resuelto'; tecnico: string|null }
export type Cliente = { id: string; nombre: string; plan: string; estado: 'Activo'|'Suspendido'; saldo: number; moraDays?: number; promesaPago?: string|null; telefono?: string }

export type Audit = { who: Role, when: string, action: string, before: any, after: any }

export type AppState = {
  loggedInUser: Role,
  tickets: Record<string, Ticket>,
  clientes: Record<string, Cliente>,
  audit: Audit[],
}

export const initialState: AppState = {
  loggedInUser: null,
  tickets: {
    '1054': { id:'1054', cliente:'Ana García', problema:'Sin servicio', estado:'Nuevo', tecnico:null },
    '1055': { id:'1055', cliente:'Carlos Ruiz', problema:'Internet lento', estado:'Asignado', tecnico:'Sergio' }
  },
  clientes: {
    '1204': { id:'1204', nombre:'Ana García', plan:'50MB', estado:'Activo', saldo:350.00, moraDays: 20, telefono: '+52 55 1000 0001', promesaPago: null },
    '1205': { id:'1205', nombre:'Carlos Ruiz', plan:'50MB', estado:'Activo', saldo:0.00, moraDays: 0, telefono: '+52 55 1000 0002', promesaPago: null },
    '1206': { id:'1206', nombre:'María López', plan:'100MB', estado:'Activo', saldo:120.00, moraDays: 15, telefono: '+52 55 1000 0003', promesaPago: null },
    '1207': { id:'1207', nombre:'Pedro Torres', plan:'200MB', estado:'Activo', saldo:920.50, moraDays: 47, telefono: '+52 81 2000 0004', promesaPago: null },
    '1208': { id:'1208', nombre:'Luisa Gómez', plan:'200MB', estado:'Activo', saldo:1820.00, moraDays: 78, telefono: '+52 33 3000 0005', promesaPago: null },
  },
  audit: [],
}
