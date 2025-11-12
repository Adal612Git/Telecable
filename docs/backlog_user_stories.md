# Backlog: Historias de Usuario (GWT + tracking)

1) Como Admin quiero guardar filtros de clientes para reusarlos para agilizar búsquedas.
- Given filtros definidos, When guardo con nombre único, Then quedan disponibles y persistentes.
- Error: nombre duplicado → mensaje y sugerir sufijo.
- Track: filter_saved{name}

2) Como Cobranza quiero enviar recordatorio de pago con plantilla editable para mejorar recuperación.
- Given cliente en mora, When disparo recordatorio, Then se agenda y registra el contacto.
- Error: "SMS provider down" → reintentar o fallback email.
- Track: reminder_sent{channel}

3) Como Cobranza quiero conciliar pagos SPEI duplicados sin duplicar saldos para evitar errores.
- Given dos referencias idénticas, When concilio, Then ignoro duplicado con nota.
- Track: reconciliation_match | dup_ignored

4) Como Cliente quiero pagar con tarjeta inválida y recibir indicación exacta para corregir.
- Given PAN inválido, When confirmo, Then ver validación inline.
- Track: payment_failed{code}

5) Como Cliente quiero deshacer SPEI adjuntando folio dentro de 10 min.
- Given pago SPEI, When pulso deshacer, Then reversa saldo y registra auditoría.
- Track: undo_window_opened | undo_done

6) Como Jefe técnico quiero ver capacidad y sugerencia de asignación para balancear carga.
- Given tickets nuevos, When abro bandeja, Then veo disponibilidad y sugerencias.
- Track: assignment_recommendation_viewed/accepted

7) Como Jefe técnico quiero reabrir ticket mal cerrado cumpliendo reglas.
- Given ticket resuelto, When reabro, Then pasa a Asignado con motivo.
- Track: ticket_reopened{reason}

8) Como Técnico quiero subir fotos offline para sincronizar después.
- Given offline, When adjunto, Then quedan en cola y sincronizan.
- Track: attachments_queued | synced

9) Como Técnico quiero ver historial del cliente (incidencias/potencias) para contexto.
- Given ticket, When abro historial, Then carga últimos eventos.
- Track: topology_viewed

10) Como Técnico quiero marcar en ruta sin GPS (modo manual) para continuar flujo.
- Given GPS negado, When activo manual, Then estado En ruta.
- Track: gps_denied | manual_route_set

11) Como Cliente quiero self-test (latencia/DNS) para diagnosticar.
- Given inicio soporte, When corro test, Then recibo pasos o se crea ticket.
- Track: selftest_run | selftest_fail | ticket_auto_created

12) Como Admin quiero cancelar factura y generar nota de crédito si procede.
- Given timbrada, When cancelo, Then crea nota y auditoría.
- Track: invoice_canceled | credit_note_created

13) Como Admin quiero exportar reportes con filtros incrustados.
- Given filtros, When exporto, Then CSV/PDF con metadata.
- Track: report_exported{filters_hash}

14) Como Soporte quiero aplicar macros de respuesta.
- Given ticket, When inserto macro, Then se aplica con placeholders.
- Track: macro_applied{name}

15) Como Soporte quiero ver PII ofuscada y revelar con permiso.
- Given dato sensible, When solicito, Then registro razón y ventana temporal.
- Track: pii_revealed{reason}

16) Como Cliente quiero cambiar plan con prorrateo.
- Given plan actual, When solicito cambio, Then cálculo y confirmación.
- Track: plan_change_requested | confirmed

17) Como Admin quiero ver churn y cohortes.
- Given data, When abro cohorte, Then métricas por periodo.
- Track: cohort_viewed

18) Como Cobranza quiero planes de pago (parcialidades).
- Given deuda, When creo plan, Then calendario y recordatorios.
- Track: installment_created | paid

19) Como Jefe técnico quiero rutas optimizadas por cluster de tickets.
- Given cluster, When optimizo, Then orden sugerido.
- Track: route_optimized

20) Como Sistema quiero idempotencia en activación/facturación/pagos.
- Given idempotency_key, When repito, Then no duplica efectos.
- Track: idempotency_key_used

