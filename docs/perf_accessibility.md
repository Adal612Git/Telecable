# Performance & Accesibilidad

Budgets: LCP < 2.5s, INP < 200ms, TBT < 200ms.
- Carga diferida de vistas, CSS variables, sin imágenes pesadas
- SW para caché de vistas críticas (home cliente, mis tickets)

Accesibilidad (WCAG 2.2 AA):
- Foco visible (box-shadow var(--focus))
- aria-live en toasts, role=alert/status en banners
- Navegación teclado (Tab/Shift+Tab); Esc cierra sheets
- Contraste suficiente (tema alto contraste)
