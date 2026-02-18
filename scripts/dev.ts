/**
 * Dev server — Bun.serve() + live-reload + Tailwind CSS watch.
 *
 * - Bundles src/main.tsx on-the-fly via Bun.build()
 * - Compiles Tailwind CSS via @tailwindcss/cli --watch
 * - Serves public/ as static
 * - Injects live-reload snippet (WebSocket-based)
 * - Spawns Bun API server on port 3000
 * - Proxies /api/* to localhost:3000
 * - SPA fallback: any non-file GET → index.html
 */
import { watch } from "node:fs";
import { join, resolve, extname } from "node:path";

/* ── Spawn API server (Bun-native, port 3000) ── */
const apiProc = Bun.spawn(["bun", "run", join(import.meta.dir, "api-server.ts")], {
  cwd: resolve(import.meta.dir, ".."),
  stdout: "inherit",
  stderr: "inherit",
});
process.on("exit", () => apiProc.kill());
process.on("SIGINT", () => { apiProc.kill(); process.exit(0); });
process.on("SIGTERM", () => { apiProc.kill(); process.exit(0); });

const ROOT = resolve(import.meta.dir, "..");
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");
const PORT = 5173;
const API_TARGET = "http://localhost:3000";

/* ── Load VITE_* env vars from .env ── */
function loadViteEnvDefines(mode: string): Record<string, string> {
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

/* ── Mime types ── */
const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".map": "application/json",
};

/* ── In-memory cache for built bundles ── */
let jsBundle: string = "";
let cssBundle: string = "";
let buildError: string | null = null;

/* ── Build JS ── */
async function buildJS() {
  const t0 = performance.now();
  const result = await Bun.build({
    entrypoints: [join(SRC, "main.tsx")],
    outdir: join(ROOT, ".dev-cache"),
    target: "browser",
    format: "esm",
    minify: false,
    splitting: false,
    sourcemap: "inline",
    define: loadViteEnvDefines('development'),
  });

  if (!result.success) {
    buildError = result.logs.map((l) => String(l)).join("\n");
    console.error("❌ Build error:\n", buildError);
    return;
  }

  buildError = null;
  const entry = result.outputs.find((o) => o.kind === "entry-point");
  if (entry) {
    jsBundle = await entry.text();
  }
  console.log(`⚡ JS rebuilt in ${(performance.now() - t0).toFixed(0)}ms`);
}

/* ── Build CSS (called once, then tailwind --watch handles it) ── */
const CSS_OUT = join(ROOT, ".dev-cache", "style.css");

async function buildCSS() {
  const proc = Bun.spawn(
    ["bunx", "@tailwindcss/cli", "-i", join(SRC, "index.css"), "-o", CSS_OUT],
    { cwd: ROOT, stdout: "inherit", stderr: "inherit" }
  );
  await proc.exited;
  try {
    cssBundle = await Bun.file(CSS_OUT).text();
  } catch { /* will retry */ }
}

// Start tailwind in watch mode
Bun.spawn(
  ["bunx", "@tailwindcss/cli", "-i", join(SRC, "index.css"), "-o", CSS_OUT, "--watch"],
  { cwd: ROOT, stdout: "inherit", stderr: "inherit" }
);

// Initial builds
await buildCSS();
await buildJS();

/* ── Live reload via WebSocket ── */
const wsClients = new Set<import("bun").ServerWebSocket<unknown>>();

function notifyReload() {
  for (const ws of wsClients) {
    try {
      ws.send("reload");
    } catch {
      wsClients.delete(ws);
    }
  }
}

const LIVE_RELOAD_SCRIPT = `
<script>
(function(){
  let ws;
  function connect(){
    ws=new WebSocket("ws://localhost:${PORT}/__lr");
    ws.onmessage=function(){location.reload()};
    ws.onclose=function(){setTimeout(connect,1000)};
    ws.onerror=function(){ws.close()};
  }
  connect();
})();
</script>`;

/* ── Watch src/ for changes ── */
let debounce: ReturnType<typeof setTimeout> | null = null;
watch(SRC, { recursive: true }, (_event, filename) => {
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(async () => {
    const ext = filename ? extname(filename) : "";
    if (ext === ".css") {
      // Tailwind --watch handles CSS, just re-read
      try {
        cssBundle = await Bun.file(CSS_OUT).text();
      } catch { /* ok */ }
    } else {
      await buildJS();
    }
    notifyReload();
  }, 100);
});

/* ── Generate dev HTML ── */
function devHTML(): string {
  if (buildError) {
    return `<!DOCTYPE html><html><body style="font-family:monospace;padding:2rem;background:#1a1a1a;color:#ff6b6b"><h1>Build Error</h1><pre>${buildError}</pre>${LIVE_RELOAD_SCRIPT}</body></html>`;
  }
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/__dev/style.css" />
    <title>AI Landing (dev)</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/__dev/app.js"></script>
    ${LIVE_RELOAD_SCRIPT}
  </body>
</html>`;
}

/* ── Serve file from public/ ── */
async function servePublic(pathname: string): Promise<Response | null> {
  const filePath = join(PUBLIC, pathname);
  const file = Bun.file(filePath);
  if (await file.exists()) {
    const ext = extname(pathname);
    return new Response(file, {
      headers: { "Content-Type": MIME[ext] || "application/octet-stream" },
    });
  }
  return null;
}

/* ── Server ── */
Bun.serve({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket upgrade for live reload
    if (url.pathname === "/__lr") {
      if (server.upgrade(req)) return;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    // Dev bundles
    if (url.pathname === "/__dev/app.js") {
      return new Response(jsBundle, {
        headers: { "Content-Type": "application/javascript" },
      });
    }
    if (url.pathname === "/__dev/style.css") {
      return new Response(cssBundle, {
        headers: { "Content-Type": "text/css" },
      });
    }

    // API proxy → localhost:3000
    if (url.pathname.startsWith("/api/") || url.pathname === "/api") {
      try {
        const target = new URL(url.pathname + url.search, API_TARGET);
        const proxyRes = await fetch(target.toString(), {
          method: req.method,
          headers: req.headers,
          body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
        });
        return new Response(proxyRes.body, {
          status: proxyRes.status,
          headers: proxyRes.headers,
        });
      } catch {
        return new Response("API proxy error", { status: 502 });
      }
    }

    // Static files from public/
    const publicRes = await servePublic(url.pathname);
    if (publicRes) return publicRes;

    // SPA fallback
    return new Response(devHTML(), {
      headers: { "Content-Type": "text/html" },
    });
  },
  websocket: {
    open(ws) {
      wsClients.add(ws);
    },
    close(ws) {
      wsClients.delete(ws);
    },
    message() {},
  },
});

console.log(`\n  🚀 Dev server running at http://localhost:${PORT}\n`);
