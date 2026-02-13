import { build } from 'tsup';
import fs from 'fs';
import path from 'path';

async function buildBeacon() {
  const outDir = path.join(process.cwd(), '.beacon-tmp');
  const cssPath = path.join(process.cwd(), 'src/beacon/beacon.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Clean tmp dir
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }

  await build({
    entry: ['src/beacon/index.tsx'],
    outDir,
    format: ['iife'],
    globalName: 'MarkdeskBeacon',
    minify: true,
    treeshake: true,
    sourcemap: false,
    splitting: false,
    clean: true,
    dts: false,
    jsx: 'automatic',
    jsxImportSource: 'preact',
    esbuildOptions(options) {
      options.alias = {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
      };
      // Define CSS as a compile-time constant
      options.define = {
        ...options.define,
        '__BEACON_CSS__': JSON.stringify(cssContent),
      };
    },
    noExternal: [/.*/],
    platform: 'browser',
  });

  // Find and copy the output file to public/beacon.js
  const targetFile = path.join(process.cwd(), 'public/beacon.js');
  const outputFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.js'));

  if (outputFiles.length > 0) {
    fs.copyFileSync(path.join(outDir, outputFiles[0]), targetFile);
    const stats = fs.statSync(targetFile);
    console.log(`\nBeacon built: public/beacon.js (${(stats.size / 1024).toFixed(1)}KB)`);
  } else {
    console.error('No JS output found from tsup build');
    process.exit(1);
  }

  // Cleanup
  fs.rmSync(outDir, { recursive: true });
}

buildBeacon().catch(console.error);
