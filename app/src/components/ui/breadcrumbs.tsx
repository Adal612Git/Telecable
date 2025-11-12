import React from 'react'

export const Breadcrumbs: React.FC<{ items: { label: string, onClick?: ()=>void }[] }> = ({ items }) => (
  <nav className="text-sm text-muted" aria-label="breadcrumbs">
    {items.map((it, i) => (
      <span key={i}>
        {i>0 && <span className="mx-1">/</span>}
        {it.onClick ? <a href="#" onClick={(e)=>{e.preventDefault(); it.onClick?.()}} className="hover:underline">{it.label}</a> : <span>{it.label}</span>}
      </span>
    ))}
  </nav>
)

