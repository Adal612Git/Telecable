import React from 'react'

export const Pagination: React.FC<{ page: number, total: number, perPage: number, onPage: (p:number)=>void }> = ({ page, total, perPage, onPage }) => {
  const pages = Math.max(1, Math.ceil(total / perPage))
  const go = (p:number) => onPage(Math.min(Math.max(1,p), pages))
  return (
    <div className="flex items-center justify-between mt-3 text-sm">
      <div>Página {page} de {pages}</div>
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost btn-sm" onClick={()=>go(1)} disabled={page===1}>«</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>go(page-1)} disabled={page===1}>‹</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>go(page+1)} disabled={page===pages}>›</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>go(pages)} disabled={page===pages}>»</button>
      </div>
    </div>
  )
}

