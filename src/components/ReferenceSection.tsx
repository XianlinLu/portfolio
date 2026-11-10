import type { Locale } from '@/content/profile';
import en from '@/content/sections-en.json';
import zh from '@/content/sections-zh.json';
export function ReferenceSection({name,locale}:{name:keyof typeof en;locale:Locale}){
  return <div className={`section-mount section-${name}`} dangerouslySetInnerHTML={{__html:(locale==='zh'?zh:en)[name]}} />;
}
