import React from 'react'

export const Chip: React.FC<{ label: string, onRemove?: ()=>void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border rounded-full">
    {label}
    {onRemove && <button className="text-muted hover:text-text" aria-label="remove" onClick={onRemove}>✕</button>}
  </span>
)

