import React from 'react'
export const Skeleton: React.FC<{ className?: string }> = ({ className='' }) => (
  <div className={`skeleton ${className}`} />
)

