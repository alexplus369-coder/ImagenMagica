/* coi-serviceworker.js
 * Inyecta los headers COOP/COEP necesarios para SharedArrayBuffer (WebAssembly SAM).
 * Colócalo en la raíz del repo, junto al HTML.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", function (e) {
  if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;

  e.respondWith(
    fetch(e.request).then(function (r) {
      if (r.status === 0) return r;

      const h = new Headers(r.headers);
      h.set("Cross-Origin-Opener-Policy",   "same-origin");
      h.set("Cross-Origin-Embedder-Policy", "require-corp");
      h.set("Cross-Origin-Resource-Policy", "cross-origin");

      return new Response(r.body, {
        status:     r.status,
        statusText: r.statusText,
        headers:    h
      });
    })
  );
});
