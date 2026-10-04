import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const appVersion = (JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string }).version;

function vendorChunk(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined;
  const pkg = id.split('node_modules/').pop()!.split('/')[0];
  if (['react', 'react-dom', 'scheduler'].includes(pkg)) return 'react';
  if (pkg === 'three') return 'three';
  if (pkg === 'lucide-react') return 'icons';
  return undefined;
}

/**
 * The config that ships with the repo — `npm run build` and CI/hosted builds use it.
 * `npm run dev` still points at ~/vite-configs/solutions-build.config.mjs, because macOS TCC
 * stalls esbuild on configs read from ~/Documents during a long-running dev session.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rollupOptions: { output: { manualChunks: vendorChunk } },
  },
});
