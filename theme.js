/* Load synchronously in the head so a saved choice applies before the page is painted. */
(() => {
  'use strict';
  const key = 'plyrune.theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let button;
  let storage;

  function nextTheme() {
    const current = root.dataset.theme || (system.matches ? 'dark' : 'light');
    return current === 'dark' ? 'light' : 'dark';
  }

  function labelButton() {
    if (!button) return;
    const next = nextTheme();
    button.dataset.next = next;
    button.setAttribute('aria-label', `Switch to ${next} theme`);
    button.querySelector('[data-theme-label]').textContent = next === 'dark' ? 'Dark theme' : 'Light theme';
  }

  function restore() {
    try {
      storage = window.localStorage;
      const saved = storage.getItem(key);
      if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
      else delete root.dataset.theme;
    } catch { /* Storage may be disabled; keep the page-local choice. */ }
    labelButton();
  }
  restore();

  document.addEventListener('DOMContentLoaded', () => {
    button = document.querySelector('[data-theme-toggle]');
    button.addEventListener('click', () => {
      root.dataset.theme = nextTheme();
      labelButton();
      try { storage.setItem(key, root.dataset.theme); }
      catch { /* Still usable for this page when persistence is unavailable. */ }
    });
    labelButton();
    button.hidden = false;
  });

  system.addEventListener('change', labelButton);
  window.addEventListener('storage', event => {
    if (event.storageArea === storage && (event.key === key || event.key === null)) restore();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
})();
