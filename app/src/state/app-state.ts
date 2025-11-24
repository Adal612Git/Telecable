import type { Role } from '../lib/rbac'

export type Ticket = { id: string; cliente: string; problema: string; estado: 'Nuevo'|'Asignado'|'Resuelto'; tecnico: string|null; evidencia?: string }
export type Cliente = { id: string; nombre: string; plan: string; estado: 'Activo'|'Suspendido'; saldo: number; password: string; moraDays?: number; promesaPago?: string|null; telefono?: string }
export type Technician = { id: string; nombre: string; zona: string; capacidad: number; lat: number; lng: number; status: 'Disponible'|'En ruta'|'En sitio' }
export type Invoice = { id: string; clienteId: string; monto: number; fecha: string; status: 'pendiente'|'pagada'|'vencida'; descuento?: number; concepto?: string; soporte?: string }

export type Audit = { who: Role, when: string, action: string, before: any, after: any }

export type AppState = {
  loggedInUser: Role,
  tickets: Record<string, Ticket>,
  clientes: Record<string, Cliente>,
  tecnicos: Technician[],
  facturas: Record<string, Invoice>,
  audit: Audit[],
}

export const initialState: AppState = {
  loggedInUser: null,
  tickets: {
    '1054': { id:'1054', cliente:'Ana Garcia', problema:'Sin servicio', estado:'Nuevo', tecnico:null },
    '1055': { id:'1055', cliente:'Carlos Ruiz', problema:'Internet lento', estado:'Asignado', tecnico:'Sergio', evidencia:'Modem sin luz LOS' },
    '1056': { id:'1056', cliente:'Maria Lopez', problema:'Cortes intermitentes desde anoche', estado:'Asignado', tecnico:'Luisa' },
    '1057': { id:'1057', cliente:'Pedro Torres', problema:'Cable danado en poste', estado:'Resuelto', tecnico:'Miguel' },
    '1058': { id:'1058', cliente:'Luisa Gomez', problema:'La app no autentica', estado:'Nuevo', tecnico:null },
  },
  clientes: {
    '1204': { id:'1204', nombre:'Ana Garcia', plan:'50MB', estado:'Activo', saldo:350.00, moraDays: 20, telefono: '+52 55 1000 0001', promesaPago: null, password:'ana123' },
    '1205': { id:'1205', nombre:'Carlos Ruiz', plan:'50MB', estado:'Activo', saldo:0.00, moraDays: 0, telefono: '+52 55 1000 0002', promesaPago: null, password:'cruiz!' },
    '1206': { id:'1206', nombre:'Maria Lopez', plan:'100MB', estado:'Activo', saldo:120.00, moraDays: 15, telefono: '+52 55 1000 0003', promesaPago: null, password:'mlopez' },
    '1207': { id:'1207', nombre:'Pedro Torres', plan:'200MB', estado:'Activo', saldo:920.50, moraDays: 47, telefono: '+52 81 2000 0004', promesaPago: null, password:'p3dro' },
    '1208': { id:'1208', nombre:'Luisa Gomez', plan:'200MB', estado:'Activo', saldo:1820.00, moraDays: 78, telefono: '+52 33 3000 0005', promesaPago: null, password:'luisa+' },
    '1209': { id:'1209', nombre:'Jorge Mendoza', plan:'300MB', estado:'Suspendido', saldo:2100.40, moraDays: 90, telefono: '+52 55 4000 0006', promesaPago: null, password:'jorge300' },
    '1210': { id:'1210', nombre:'Sofia Rios', plan:'100MB', estado:'Activo', saldo:0, moraDays: 0, telefono: '+52 33 7000 0007', promesaPago: null, password:'sofiAR' },
    '1211': { id:'1211', nombre:'Diego Fernandez', plan:'500MB', estado:'Activo', saldo:640.25, moraDays: 5, telefono: '+52 81 7000 0008', promesaPago: null, password:'diegonet' },
  },
  tecnicos: [
    { id:'tech-sergio', nombre:'Sergio', zona:'Norte', capacidad:5, lat:19.44, lng:-99.13, status:'Disponible' },
    { id:'tech-luisa', nombre:'Luisa', zona:'Centro', capacidad:4, lat:19.43, lng:-99.16, status:'En ruta' },
    { id:'tech-miguel', nombre:'Miguel', zona:'Sur', capacidad:5, lat:19.39, lng:-99.12, status:'Disponible' },
    { id:'tech-pamela', nombre:'Pamela', zona:'Poniente', capacidad:3, lat:19.41, lng:-99.18, status:'En sitio' },
    { id:'tech-diego', nombre:'Diego', zona:'Oriente', capacidad:4, lat:19.45, lng:-99.10, status:'Disponible' },
  ],
  facturas: {
    'F-1001': { id:'F-1001', clienteId:'1204', monto:299, fecha:'2025-11-01', status:'vencida', descuento:0, concepto:'Plan 50MB Nov', soporte:'Linea demo: 800-111-2233 opcion 2' },
    'F-1002': { id:'F-1002', clienteId:'1205', monto:299, fecha:'2025-11-01', status:'pagada', descuento:0, concepto:'Plan 50MB Nov', soporte:'Linea demo: 800-111-2233 opcion 2' },
    'F-1003': { id:'F-1003', clienteId:'1206', monto:399, fecha:'2025-11-01', status:'pendiente', descuento:10, concepto:'Plan 100MB Nov', soporte:'Linea demo: 800-111-2233 opcion 2' },
    'F-1004': { id:'F-1004', clienteId:'1209', monto:499, fecha:'2025-10-01', status:'vencida', descuento:0, concepto:'Plan 300MB Oct', soporte:'Linea demo: 800-111-2233 opcion 2' },
  },
  audit: [],
}
