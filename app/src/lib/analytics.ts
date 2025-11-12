export type EventPayload = Record<string, unknown>

export const Analytics = {
  events: [] as { ev: string; ts: string; props: EventPayload }[],
  track(ev: string, props: EventPayload = {}){
    const e = { ev, ts: new Date().toISOString(), props }
    this.events.push(e)
    console.log('[track]', e)
  }
}

