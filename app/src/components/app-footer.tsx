import React from 'react'

export const AppFooter: React.FC = () => (
  <footer className="mt-6 text-xs text-muted flex items-center justify-between border-t border-border pt-3">
    <div>© {new Date().getFullYear()} DOMY ISP · v0.1.0</div>
    <div className="flex items-center gap-3">
      <a href="#" onClick={e=>e.preventDefault()}>Términos</a>
      <a href="#" onClick={e=>e.preventDefault()}>Privacidad</a>
      <a href="#" onClick={e=>e.preventDefault()}>Ayuda</a>
    </div>
  </footer>
)

