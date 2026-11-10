import type { Locale } from '@/content/profile';
import en from '@/content/sections-en.json';
import zh from '@/content/sections-zh.json';
export function PortfolioSection({name,locale}:{name:keyof typeof en;locale:Locale}){
  const markup = (locale === 'zh' ? zh : en)[name].replaceAll('/assets/', `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/assets/`).replaceAll('/images/', `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/`);
  return <div className={`section-mount section-${name}`} dangerouslySetInnerHTML={{__html:markup}} />;
}
