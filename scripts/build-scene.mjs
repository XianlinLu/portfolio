import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
await build({
  entryPoints: ['src/scene/entry.js'],
  outfile: 'public/scene.js',
  bundle: true,
  format: 'iife',
  minify: true,
  legalComments: 'none',
  target: ['es2022'],
  plugins: [{
    name: 'portfolio-asset-paths',
    setup(build) {
      build.onLoad({ filter: /src[\\/]scene[\\/].*\.js$/ }, async ({ path }) => ({
        contents: (await readFile(path, 'utf8')).replaceAll('/assets/', `${basePath}/assets/`).replaceAll('/images/', `${basePath}/images/`),
        loader: 'js',
      }));
    },
  }],
});
