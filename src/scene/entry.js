import translations from '../content/scene-translations.json';
const locale=new URLSearchParams(location.search).get('lang')==='zh'?'zh':'en';
window.PORTFOLIO_LANG=locale;document.documentElement.lang=locale==='zh'?'zh-CN':'en';
window.L=(unused,en)=>typeof en==='string'&&locale==='zh'?(translations[en]||en):en;
const button=document.getElementById('lng');button.setAttribute('aria-label',locale==='zh'?'Switch to English':'切换为中文');
button.addEventListener('click',()=>{const url=new URL(location.href);url.searchParams.set('lang',locale==='en'?'zh':'en');location.assign(url);});
Promise.all([import('./main.js'),import('./cursor.js'),import('./works.js'),import('./mesh.js'),import('./content.js'),import('./ig-phone.js'),import('./music.js')]).catch(error=>{console.error(error);document.body.classList.add('ready','entered');for(const id of ['scene','track','loader']){const el=document.getElementById(id);if(el)el.style.display='none';}document.getElementById('about')?.scrollIntoView();});
