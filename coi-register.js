/* coi-register.js
 * Registra el Service Worker que activa COOP/COEP.
 * Este script va como el PRIMER <script> dentro del <head> del HTML:
 *   <script src="coi-register.js"></script>
 */
(() => {
  // Si SharedArrayBuffer ya está disponible, no hace falta el SW
  if (typeof SharedArrayBuffer !== "undefined") return;

  // Solo funciona en HTTPS (o localhost)
  if (location.protocol !== "https:" && location.hostname !== "localhost") return;

  if (!navigator.serviceWorker) return;

  // Registrar el SW
  navigator.serviceWorker.register("/coi-serviceworker.js").then(registration => {
    // Si el SW se acaba de instalar, recargar una vez para activarlo
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // Evitar bucle de recargas: marcar la URL
        const url = new URL(location.href);
        if (!url.searchParams.has("coi-sw")) {
          url.searchParams.set("coi-sw", "1");
          location.replace(url.href);
        }
      });
    }
  }).catch(err => {
    console.warn("[COI-SW] No se pudo registrar el Service Worker:", err);
  });
})();
