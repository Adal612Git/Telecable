import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'secondary'|'danger'|'ghost',
  size?: 'sm'|'md',
  loading?: boolean,
}

export const Button: React.FC<Props> = ({ className = '', variant='primary', size='md', loading=false, disabled, children, ...rest }) => {
  const v = variant === 'primary' ? 'btn-primary' : variant==='secondary' ? 'btn-secondary' : variant==='danger' ? 'btn-danger' : 'btn-ghost'
  const s = size==='sm' ? 'btn-sm' : ''
  const isDisabled = disabled || loading
  return (
    <button className={`btn ${v} ${s} ${loading?'btn-loading':''} ${className}`} disabled={isDisabled} {...rest}>
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      <span className={loading? 'opacity-80' : ''}>{children}</span>
    </button>
  )
}
