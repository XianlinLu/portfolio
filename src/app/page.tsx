import Script from 'next/script';
import { ReferenceSection } from '@/components/ReferenceSection';
import { Experience } from '@/components/Experience';
export default async function Home({searchParams}:{searchParams:Promise<{lang?:string}>}){
 const locale=(await searchParams).lang==='zh'?'zh':'en';
 return <><ReferenceSection name="story" locale={locale}/><div className="content" id="content"><ReferenceSection name="about" locale={locale}/><Experience locale={locale}/><ReferenceSection name="numbers" locale={locale}/><ReferenceSection name="work" locale={locale}/><ReferenceSection name="contact" locale={locale}/></div><Script src="/scene.js" strategy="afterInteractive"/><noscript><p>Enable JavaScript for the interactive story. 启用 JavaScript 以体验互动故事。</p></noscript></>;
}
