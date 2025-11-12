import React from 'react'

export const Tabs: React.FC<{ tabs: { key: string, label: string }[], active: string, onChange: (k:string)=>void }> = ({ tabs, active, onChange }) => (
  <div className="flex gap-2 border-b border-border">
    {tabs.map(t => (
      <button key={t.key} onClick={()=> onChange(t.key)} className={`px-3 py-2 -mb-px border-b-2 ${active===t.key?'border-brand-primary text-brand-contrast':'border-transparent text-muted hover:text-text'}`}>{t.label}</button>
    ))}
  </div>
)

