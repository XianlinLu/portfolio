import {build} from 'esbuild';
await build({entryPoints:['src/scene/entry.js'],outfile:'public/scene.js',bundle:true,format:'iife',minify:true,legalComments:'none',target:['es2022']});
