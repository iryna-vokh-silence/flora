import { resolve } from 'path';
import { readFileSync } from 'fs';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

function staticJsonEmitter({ source = 'db.json', outDir = 'api' } = {}) {
  return {
    name: 'static-json-emitter',
    apply: 'build',
    generateBundle() {
      const data = JSON.parse(readFileSync(resolve(process.cwd(), source), 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        if (!Array.isArray(value)) continue;
        this.emitFile({
          type: 'asset',
          fileName: `${outDir}/${key}.json`,
          source: JSON.stringify(value),
        });
      }
    },
  };
}

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default {
  base: repo ? `/${repo}/` : '/',
  plugins: [
    tailwindcss(),
    staticJsonEmitter(),
    viteStaticCopy({
      targets: [
        { src: 'images', dest: '.' },
        { src: 'assets', dest: '.' },
      ],
    }),
  ],
};
