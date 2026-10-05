/**
 * Injected into every webview before the app bundle runs (see `HARDEN` in main.rs).
 * Removes the browser affordances that make a Tauri shell feel like a web page:
 * the native context menu (reload / inspect / view-source), reload and devtools
 * accelerators, and drag-out of images and links.
 *
 * Only *host* behaviours are suppressed. The app's own shortcuts (/, ?, Ctrl+K,
 * Esc), clipboard keys (Ctrl+C/X/V/A) and programmatic `location.reload()` are
 * deliberately left alone.
 */
(function harden() {
  "use strict";

  document.documentElement.dataset.shell = "tauri";

  /** The webview's own context menu, everywhere. */
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  /** No dragging logos or thumbnails out of the window. File drops come from the OS, not the DOM. */
  document.addEventListener("dragstart", (e) => {
    const el = e.target;
    if (el && el.nodeType === 1 && (el.tagName === "IMG" || el.tagName === "A")) e.preventDefault();
  }, true);

  /** F5 reload, F11 web-fullscreen, F12 devtools. */
  var KEYS = new Set(["F5", "F11", "F12"]);
  /** Ctrl+<key> the host acts on: reload, print, save-as, view-source, open-file, bookmark. */
  var HOST = new Set(["r", "p", "s", "u", "o", "d"]);
  /** Ctrl+Shift+<key> opens a devtools panel. */
  var DEVTOOLS = new Set(["i", "j", "c"]);

  addEventListener("keydown", (e) => {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    var mod = e.ctrlKey || e.metaKey;
    if (KEYS.has(k) || (mod && !e.shiftKey && HOST.has(k)) || (mod && e.shiftKey && DEVTOOLS.has(k))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  /** Ctrl+wheel zoom. Registered non-passive so preventDefault is honoured. */
  addEventListener("wheel", (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false, capture: true });
})();