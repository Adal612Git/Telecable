export type Lang = 'es-MX'|'en-US'

export const I18N = {
  lang: 'es-MX' as Lang,
  dict: {} as Record<string,string>,
}

export async function loadI18n(lang: Lang){
  try{
    const mod = await import(`../i18n/${lang}.json`)
    I18N.dict = mod.default as Record<string,string>
    I18N.lang = lang
  }catch{
    // noop
  }
}

export const t = (key: string, fb?: string) => I18N.dict[key] ?? fb ?? key

