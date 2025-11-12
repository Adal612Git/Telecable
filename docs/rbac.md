# RBAC - DOMY ISP

Roles:
- Dueño/Admin: Acceso total; acciones destructivas requieren 2FA y confirmación.
- Cobranza: Ver cuentas, crear recordatorios, conciliar; sin PII completa de tarjeta (sin PAN/exp/CSC).
- Jefe técnico: Asignar/reasignar, ver capacidad y KPIs operativos.
- Técnico: Actualizar estados, subir evidencia; sólo tickets propios.
- Cliente: Pagar, descargar CFDI, abrir tickets, ver historial propio.

Auditoría: registrar quién, cuándo, desde dónde, antes→después en `AppState.audit` y exportable.

Superficies y restricciones:
- Admin Dashboard, Billing, Reports: dueño/admin
- Clientes: dueño/admin/cobranza (acciones de conciliación sólo cobranza/admin)
- Kanban y asignación: jefe técnico
- Mis tickets / Detalle / Checklist: técnico
- Cliente Home / Pago / Reporte: cliente
