import React from 'react'

type Props = React.HTMLAttributes<HTMLSpanElement> & { intent?: 'success'|'warning'|'info'|'danger' }
export const Badge: React.FC<Props> = ({ className='', intent='info', ...rest }) => {
  const i = intent==='success'?'badge-success':intent==='warning'?'badge-warning':intent==='danger'?'badge-danger':'badge-info'
  return <span className={`badge ${i} ${className}`} {...rest} />
}

