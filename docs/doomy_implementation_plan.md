# Doomy System Implementation Plan

This document consolidates the requested Doomy system requirements into an implementation-ready backlog structured for incremental delivery. It is organized by platform surface, backend modules, and cross-cutting services to help map tasks directly into tickets.

## 1) Platform Surfaces

### 1.1 Web Admin Panel
- Unified login (email/password, remember session, reset) without manual role selection; post-auth redirect to role dashboard.
- Dashboards per role: Owner, Billing Lead, Collections, Tech Lead, Technician (embedded), Client (embedded).
- POS workflows (register payment, method selection, discounts with permission checks, notes, evidence, assign to invoice, partial/prepaid payments, printable receipt, history).
- Reports: payment corridors, Oxxo delay banner, sales/collections KPIs, day-of-cut payments, technician collections, ticket SLAs.
- Cash box: open/close, expected vs actual, required evidence, automatic email report, history.
- Tickets: creation, assignment, lifecycle, evidence, checklists; auto-installation ticket on client creation.
- Technician management: simulated GPS map, send to collect, ticket assignment, operational metrics.

### 1.2 Embedded Technician App
- List of assigned tickets (installation/support/collections).
- Upload mandatory evidence (photos, comments), checklist completion before close, accept/reject, suggested payment method, collection info, history.

### 1.3 Embedded Client App
- View invoices, payments, tickets, contract PDF, service status, last payment date.

### 1.4 POS Module
- Payment intake with supported methods: MercadoPago, HSBC, Oxxo Pay, Cash, Manual Transfer.
- Discounts restricted to Owner/Billing Lead; internal notes and optional evidence.
- Assign payment to specific invoice, support partial/advance payments; printable HTML/PDF ticket.

## 2) Data Model (initial schema)

Tables and key fields:
- **usuarios**: id, nombre, email, password_hash, rol, permisos_extra (json).
- **clientes**: id, nombre, direccion, telefono, plan, fecha_corte, estado_servicio, ultima_fecha_pago, saldo_pendiente.
- **facturas**: id, cliente_id, fecha_emision, fecha_vencimiento, monto, estado, metodo_pago, fecha_pago, quien_registro, evidencia.
- **pagos**: id, factura_id, cliente_id, fecha_pago, fecha_registro, metodo, origen, banco, estado_acreditacion, monto, registrado_por.
- **tickets**: id, tipo (instalacion, soporte, cobranza), cliente_id, tecnico_id, descripcion, fecha_creacion, fecha_cierre, estado, evidencia.
- **caja**: id, usuario_id, fecha_apertura, fecha_cierre, monto_inicial, monto_final, diferencia, notas, evidencia.

## 3) Roles & Permissions

| Rol | Acceso principal | Notas |
| --- | --- | --- |
| Dueño | Todo | Puede aplicar descuentos. |
| Jefa de Facturación | Facturas, pagos, POS, reportes financieros | Puede aplicar descuentos. |
| Cobranza | Pagos, POS | No puede aplicar descuentos. |
| Jefe de Técnicos | Dashboard técnicos, GPS, asignar tickets | Puede enviar técnico a cobrar. |
| Técnico | App técnico | Tickets asignados y evidencias. |
| Cliente | App cliente | Estado, facturas, tickets. |
| Root/Superadmin (opcional) | Todo, gestión de roles | |

Permission middleware logic (conceptual):
```
if user.rol == "dueño":
    access = all
elif user.rol == "facturacion":
    access = ["facturas", "pagos", "POS", "reportes_financieros"]
elif user.rol == "cobranza":
    access = ["pagos", "POS"]  # descuentos prohibidos
elif user.rol == "jefe_tecnicos":
    access = ["dashboard_tecnicos", "gps", "asignar_tickets"]
elif user.rol == "tecnico":
    access = ["app_tecnico"]
elif user.rol == "cliente":
    access = ["app_cliente"]
```

## 4) API Endpoints (backlog)

- **Auth**: POST /auth/login, POST /auth/logout, POST /auth/reset
- **Clientes**: POST /clientes (auto-creates installation ticket), GET /clientes, GET /clientes/{id}, PUT /clientes/{id}
- **Facturas**: POST /facturas, GET /facturas, PUT /facturas/{id}, POST /facturas/{id}/pago
- **POS**: POST /pos/registrar-pago, GET /pos/historial
- **Tickets**: POST /tickets, PUT /tickets/{id}, POST /tickets/{id}/cerrar
- **Técnicos**: GET /tecnicos, POST /tecnicos/enviar-a-cobrar
- **Caja**: POST /caja/apertura, POST /caja/cierre, GET /caja/historial
- **Reportes**: GET /reportes/cobros, GET /reportes/corte, GET /reportes/recuperacion, GET /reportes/bancos, GET /reportes/tecnicos

## 5) Reporting Requirements

- Payment corridor report: method totals (MercadoPago, HSBC, Oxxo Pay, manual), daily totals, pending vs accredited vs duplicates, metadata (payment date, credit date, client, amount, bank/method, status, origin, registrar).
- Oxxo delay banner: if metodo_pago == "OXXO" then estado = "EN PROCESO" and expected 24–36 hours.
- Global KPIs: daily/weekly/monthly sales, monthly recovery, overdue portfolio, collected vs expected %, payments per technician, tickets resolved, response times, day-of-cut payments.
- Day-of-cut report filters: client, method, bank, exact date, reconciliation status, last payment date, search by name/ID.

## 6) Cash Box Lifecycle

- Opening: user, initial amount, digital signature/PIN.
- Closing: final count, system-expected = initial + registered payments, difference, mandatory evidence, auto email to Owner, history filters by user/date.

## 7) Ticketing Workflow

- Auto-create installation ticket on new client with address, activation date, assigned technician, notes, status.
- Ticket closure requires evidence (photos), checklist (installation done, speed measured, router ok, cable test, optional client signature).
- Technician assignment and collection tickets from Tech Lead dashboard; includes comments and simulated GPS map for technician positions.

## 8) UX/Dashboard Notes

- Owner dashboard: KPIs, today payments list, charts (monthly line, method pie, bar by technician).
- Billing dashboard: pending/paid invoices, bank reconciliation.
- Collections dashboard: client search, register payment, history; discounts hidden.
- Tech dashboard: map, pending tickets, send technician to collect.
- Technician app: tickets list, upload evidence, GPS placeholder, accept/reject, assigned collections.
- Client app: invoices, payments, tickets, contract.

## 9) Delivery Roadmap (suggested slices)

1. **Auth & Roles**: centralized login, session management, permission middleware, role-based redirects, embedded app launchers.
2. **Core Models & Migrations**: usuarios, clientes, facturas, pagos, tickets, caja with seed roles.
3. **POS**: payment registration flows, discounts with role guard, receipts, history, evidence upload.
4. **Tickets & Technician App**: assignment, evidence, checklist, collection tickets, fake GPS map, technician dashboard tools.
5. **Client App**: invoices/tickets/status, receipts download.
6. **Reports**: corridor/cut-day/technician/bank reconciliation dashboards with filters; Oxxo delay handling.
7. **Cash Box**: open/close, expected/difference, evidence, auto email, history.

This plan is ready to translate into routes, controllers, services, and UI components across the admin panel, technician app, and client app.
