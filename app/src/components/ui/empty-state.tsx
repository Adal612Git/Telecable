import React from 'react'
import { Button } from './button'

export const EmptyState: React.FC<{ title: string; actionLabel?: string; onAction?: ()=>void }> = ({ title, actionLabel, onAction }) => (
  <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted">
    <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center">🙂</div>
    <p className="text-sm">{title}</p>
    {actionLabel && <Button className="mt-3" onClick={onAction}>{actionLabel}</Button>}
  </div>
)
