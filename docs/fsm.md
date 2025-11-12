# FSM (Estados)

## Tickets
Estados: Nuevo -> Asignado -> En ruta -> En sitio -> Resuelto
- Reabrir: Resuelto -> Asignado (con regla y auditoría)
- Cancelado: Nuevo/Asignado -> Cancelado (sólo admin, confirmación destructiva + 2FA)

Eventos:
- assign(tecnico)
- start_route(gps|manual)
- arrive_site
- resolve(checklist_ok)
- reopen(reason)
- cancel(reason)

## Facturas
Estados: borrador -> timbrada -> pagada | fallida -> cancelada
- Nota de crédito: timbrada/pagada -> crédito emitido

Eventos:
- stamp(batch)
- pay(method, idempotency_key)
- fail(code)
- cancel(reason)
- credit_note(links)
