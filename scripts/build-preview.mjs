// Makes preview.html for the claude.ai preview link (which adds its own <html>/<head>/<body>).
// GitHub Pages uses index.html directly; you don't need this file there.
import { readFile, writeFile } from 'node:fs/promises';
const src = await readFile('index.html', 'utf8');
const head = src.match(/<head>([\s\S]*?)<\/head>/i)[1]
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '');
const body = src.match(/<body>([\s\S]*?)<\/body>/i)[1];
await writeFile('preview.html', head.trim() + '\n' + body.trim() + '\n');
console.log('Wrote preview.html');
