import React from 'react'

type Props = React.SVGProps<SVGSVGElement> & { name: 'menu'|'bell'|'search'|'sun'|'moon'|'logout'|'user'|'settings'|'chart'|'tickets'|'users'|'dollar'|'home'|'wrench'|'user-plus'|'ticket'|'zap'|'zap-off'|'dollar-sign'|'tool'|'log-out' }

const paths: Record<Props['name'], string> = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  search: 'M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z',
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12H4m13.657 6.343l1.414 1.414M4.929 4.929L6.343 6.343m9.9-1.414l1.414-1.414M4.929 19.071l1.414-1.414M12 6a6 6 0 100 12 6 6 0 000-12z',
  moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-10V5a2 2 0 114 0v1',
  user: 'M16 14a4 4 0 10-8 0m8 0a4 4 0 10-8 0m12 6v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2',
  settings: 'M12 8a4 4 0 100 8 4 4 0 000-8z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 016.04 3.3l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  chart: 'M4 19h16M6 17V9m5 8V5m5 12v-6',
  tickets: 'M4 7h16v4h-3a2 2 0 100 4h3v4H4v-4h3a2 2 0 100-4H4V7z',
  users: 'M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m14-10a4 4 0 10-8 0 4 4 0 008 0zm6 12v-2a4 4 0 00-3-3.87',
  dollar: 'M12 8c-3.333 0-3.333-4 0-4 3.333 0 3.333 4 0 4zm0 8c3.333 0 3.333 4 0 4-3.333 0-3.333-4 0-4zm0-12v16m-4-8h8',
  home: 'M3 12l9-9 9 9v9a3 3 0 01-3 3h-12a3 3 0 01-3-3z',
  wrench: 'M14.7 6.3a4 4 0 11-5.657 5.657l-6.364 6.364 1.414 1.414 6.364-6.364A4 4 0 1114.7 6.3z'
}

export const Icon: React.FC<Props> = ({ name, className='', ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${className}`} {...rest}>
    <path d={paths[(name as keyof typeof paths) in paths ? name as keyof typeof paths : (name==='user-plus'?'user': name==='ticket'?'tickets': name==='zap'?'wrench': name==='zap-off'?'wrench': name==='dollar-sign'?'dollar': name==='tool'?'wrench': name==='log-out'?'logout':'menu')]} />
  </svg>
)
