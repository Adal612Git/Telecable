import React, { createContext, useContext, useState } from 'react'

type Toast = { id: number; message: string; type?: 'success'|'error'; action?: { label: string; onClick: () => void } }
const ToastCtx = createContext<{ show: (t: Omit<Toast,'id'>) => void } | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastCtx)
  if(!ctx) throw new Error('useToast outside provider')
  return ctx
}

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<Toast[]>([])
  const show = (t: Omit<Toast,'id'>) => {
    const id = Date.now() + Math.random()
    setItems((xs)=>[...xs, { id, ...t }])
    setTimeout(()=> setItems(xs => xs.filter(i=>i.id!==id)), 2200)
  }
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] space-y-2" aria-live="polite" aria-atomic="true">
        {items.map(t=> (
          <div key={t.id} role="status" className={`toast ${t.type==='error'?'error':'success'} flex items-center gap-3`}> 
            <span>{t.message}</span>
            {t.action && <button className="btn btn-ghost btn-sm" onClick={t.action.onClick}>{t.action.label}</button>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

