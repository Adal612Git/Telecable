import React from 'react'

export const AppFooter: React.FC = () => (
  <footer className="mt-10 text-sm text-muted border-t border-border pt-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-brand-gradient text-white text-[10px] font-bold">DI</span>
        <span>© {new Date().getFullYear()} DOMY ISP · v0.1.0</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="#" onClick={e=>e.preventDefault()} className="hover:underline">Términos</a>
        <a href="#" onClick={e=>e.preventDefault()} className="hover:underline">Privacidad</a>
        <a href="#" onClick={e=>e.preventDefault()} className="hover:underline">Ayuda</a>
      </div>
    </div>
  </footer>
)

