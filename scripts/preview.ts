/**
 * Preview server — serves the production build from dist/.
 * SPA fallback: all non-file paths → index.html
 */
import { join, resolve, extname } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const DIST = join(ROOT, "dist");
const PORT = 4173;

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
  ".map": "application/json",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = join(DIST, url.pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      const ext = extname(url.pathname);
      return new Response(file, {
        headers: {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
        },
      });
    }

    // SPA fallback
    const indexFile = Bun.file(join(DIST, "index.html"));
    return new Response(indexFile, {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.log(`\n  📦 Preview server at http://localhost:${PORT}\n`);
