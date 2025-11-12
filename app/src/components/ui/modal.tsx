import React from 'react'

type ModalProps = {
  open: boolean
  title?: string
  children?: React.ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
  confirmVariant?: 'primary'|'danger'|'secondary'
}

export const Modal: React.FC<ModalProps> = ({ open, title, children, onClose, onConfirm, confirmLabel='Confirmar', confirmVariant='primary' }) => {
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[90%] max-w-md card animate-[fadeIn_.2s_ease-out]">
        {title && <h3 className="font-semibold mb-2">{title}</h3>}
        <div className="text-sm text-muted mb-3">{children}</div>
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className={`btn ${confirmVariant==='primary'?'btn-primary':confirmVariant==='danger'?'btn-danger':'btn-secondary'}`} onClick={onConfirm}> {confirmLabel} </button>
        </div>
      </div>
    </div>
  )
}

