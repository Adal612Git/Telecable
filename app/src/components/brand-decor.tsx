import React from 'react'

export const BrandDecor: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none absolute inset-x-0 -top-24 h-56 overflow-hidden ${className}`} aria-hidden>
    <div className="absolute -left-20 -top-10 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-20 blur-3xl" />
    <div className="absolute -right-20 top-0 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-500 via-indigo-500 to-blue-500 opacity-20 blur-3xl" />
  </div>
)

