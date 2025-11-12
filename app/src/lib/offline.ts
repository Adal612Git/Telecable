type Listener = (len: number) => void
const listeners: Listener[] = []
export const Offline = {
  online: true,
  queue: [] as (()=>void)[],
  add(fn: ()=>void){ this.queue.push(fn); listeners.forEach(l=>l(this.queue.length)) },
  flush(){ const q = [...this.queue]; this.queue.length = 0; listeners.forEach(l=>l(this.queue.length)); q.forEach(f=>f()) },
  subscribe(fn: Listener){ listeners.push(fn); return () => { const i = listeners.indexOf(fn); if(i>=0) listeners.splice(i,1) } }
}
