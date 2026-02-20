/**
 * Production build script — Bun bundler + Tailwind CSS CLI.
 *
 * 1. Bundles src/main.tsx → dist/assets/app.js  (minified, tree-shaken)
 * 2. Compiles src/index.css → dist/assets/style.css  (tailwind, minified)
 * 3. Copies public/ → dist/
 * 4. Writes dist/index.html with hashed asset references
 */
import { rm, cp, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");
const SRC = join(ROOT, "src");

/* ── Load VITE_* env vars from .env + process.env ── */
function loadViteEnvDefines(mode: string): Record<string, string> {
  // 1. Try .env file (local dev)
  let envContent = '';
  try { envContent = require('fs').readFileSync(join(ROOT, '.env'), 'utf-8'); } catch {}
  const viteVars: Record<string, string> = {};
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key.startsWith('VITE_')) viteVars[key] = val;
  }
  // 2. Override with process.env (Vercel injects env vars here)
  for (const [key, val] of Object.entries(process.env)) {
    if (key.startsWith('VITE_') && val) viteVars[key] = val;
  }
  const defines: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode),
  };
  const envObj: Record<string, unknown> = {
    MODE: mode,
    DEV: String(mode === 'development'),
    PROD: String(mode === 'production'),
    SSR: 'false',
    BASE_URL: '/',
  };
  for (const [k, v] of Object.entries(viteVars)) {
    envObj[k] = v;
    defines[`import.meta.env.${k}`] = JSON.stringify(v);
  }
  defines['import.meta.env'] = JSON.stringify(envObj);
  return defines;
}

/* ── Clean ── */
await rm(DIST, { recursive: true, force: true });

/* ── 1. Bundle JS/TSX ── */
console.log("⚡ Bundling JS…");
const jsBuild = await Bun.build({
  entrypoints: [join(SRC, "main.tsx")],
  outdir: join(DIST, "assets"),
  target: "browser",
  format: "esm",
  minify: true,
  splitting: true,
  sourcemap: "linked",
  define: loadViteEnvDefines('production'),
  // Bun resolves JSX automatically for .tsx
});

if (!jsBuild.success) {
  console.error("❌ JS bundle failed:");
  for (const log of jsBuild.logs) console.error(log);
  process.exit(1);
}

// Find the main entry chunk name
const mainChunk = jsBuild.outputs.find(
  (o) => o.kind === "entry-point"
);
const jsFileName = mainChunk
  ? mainChunk.path.split("/").pop()!
  : "main.js";

console.log(`  → ${jsFileName}`);

/* ── 2. Tailwind CSS ── */
console.log("🎨 Compiling CSS…");
const cssIn = join(SRC, "index.css");
const cssOut = join(DIST, "assets", "style.css");

const twProc = Bun.spawn(
  [
    "bunx",
    "@tailwindcss/cli",
    "-i", cssIn,
    "-o", cssOut,
    "--minify",
  ],
  { cwd: ROOT, stdout: "inherit", stderr: "inherit" }
);
const twExit = await twProc.exited;
if (twExit !== 0) {
  console.error("❌ Tailwind CSS build failed");
  process.exit(1);
}
console.log("  → style.css");

/* ── 3. Copy public/ → dist/ ── */
async function copyDir(src: string, dest: string) {
  try {
    const entries = await readdir(src);
    for (const entry of entries) {
      const s = join(src, entry);
      const d = join(dest, entry);
      const info = await stat(s);
      if (info.isDirectory()) {
        await cp(s, d, { recursive: true });
      } else {
        // ensure parent exists
        await Bun.write(d, Bun.file(s));
      }
    }
  } catch {
    // public/ may not exist
  }
}
await copyDir(PUBLIC, DIST);
console.log("📁 Copied public/");

/* ── 4. Write index.html ── */
const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="7-дневный марафон «Бизнес с ИИ» — автоматизируй бизнес, получи первые лиды и экономь до 10 часов в неделю. Всего 1 490 ₽" />
    <meta property="og:title" content="ИИ-перезагрузка: Автоматизируй бизнес за 7 дней!" />
    <meta property="og:description" content="Игровой челлендж для предпринимателей, блогеров и SMM-специалистов. 50+ промптов, шаблоны, живые трансляции." />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/style.css" />
    <title>AI Landing</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFileName}"></script>
  </body>
</html>`;

await Bun.write(join(DIST, "index.html"), html);
console.log("✅ Build complete → dist/");
