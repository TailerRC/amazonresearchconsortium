/**
 * i18n.js — Motor de traducción para sitio HTML multipágina
 * Amazon Research Consortium
 * 
 * Idiomas: EN (default) | ES | PT
 * 
 * Incluir en CADA página HTML antes de </body>:
 *   <script src="/js/i18n.js"></script>
 * 
 * Botones de idioma (en navbar.html):
 *   <button data-lang="en">EN</button>
 *   <button data-lang="es">ES</button>
 *   <button data-lang="pt">PT</button>
 */

(function () {
  console.log('[i18n] Script cargado correctamente');
  const SUPPORTED_LANGS = ['en', 'es', 'pt'];
  const DEFAULT_LANG    = 'en';
  const LOCALES_BASE    = 'locales';
  console.log('[i18n] LOCALES_BASE:', LOCALES_BASE);

  let currentLang  = DEFAULT_LANG;
  let translations = {};

  // ── Detectar idioma inicial ──────────────────────────────────────────────
  function detectLang() {
    // 1. ¿El usuario ya eligió antes?
    const saved = localStorage.getItem('i18n_lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    // 2. ¿El navegador habla uno de nuestros idiomas?
    const browserLangs = navigator.languages || [navigator.language || ''];
    for (const bl of browserLangs) {
      const code = bl.slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.includes(code)) return code;
    }

    // 3. Siempre inglés por defecto
    return DEFAULT_LANG;
  }

  // ── Cargar JSON de traducciones ──────────────────────────────────────────
  async function loadTranslations(lang) {
    const url = `${LOCALES_BASE}/${lang}.json`;
    console.log('[i18n] Intentando cargar:', url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('[i18n] Traducciones cargadas correctamente:', lang);
      return data;
    } catch (e) {
      console.warn(`[i18n] No se pudo cargar ${lang}.json, usando inglés.`, e);
      if (lang !== DEFAULT_LANG) {
        const fallback = await fetch(`${LOCALES_BASE}/${DEFAULT_LANG}.json`);
        return fallback.json();
      }
      return {};
    }
  }

  // ── Resolver clave (ej: "pages_ourwork_malaria.h11") ────────────────────
  function resolve(key, depth = 0) {
    // Prevenir loops infinitos en referencias circulares
    if (depth > 10) {
      console.warn(`[i18n] Referencia circular detectada para: ${key}`);
      return key;
    }

    // Buscar la clave directamente
    if (translations[key] !== undefined) {
      const val = translations[key];
      // Si el valor es una string que parece ser una referencia a otra clave,
      // intentar resolver recursivamente
      if (typeof val === 'string' && val.includes('.') && !val.includes('&') && !val.includes(' ')) {
        const resolved = resolve(val, depth + 1);
        // Si se resuelve a algo diferente que el mismo valor, usar lo resuelto
        if (resolved !== val) return resolved;
      }
      return val;
    }

    // Navegar la estructura de objetos (para claves con puntos)
    const nested = key.split('.').reduce((obj, k) => obj?.[k], translations);
    if (nested !== undefined && nested !== null) {
      // Aplicar la misma lógica de referencias recursivas
      if (typeof nested === 'string' && nested.includes('.') && !nested.includes('&') && !nested.includes(' ')) {
        const resolved = resolve(nested, depth + 1);
        if (resolved !== nested) return resolved;
      }
      return nested;
    }

    return null;
  }

  // ── Aplicar traducciones al DOM ──────────────────────────────────────────
  function applyTranslations() {
    console.log('[i18n] Aplicando traducciones para idioma:', currentLang);
    // Texto de elementos
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = resolve(key);
      if (val !== null) {
        if (el.children.length === 0) {
          el.textContent = val;
        } else {
          // Preservar hijos (iconos, <strong>, etc.), solo reemplaza texto
          const textNode = [...el.childNodes].find(
            n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
          );
          if (textNode) textNode.textContent = val;
        }
      }
    });

    // Atributos: placeholder, alt, title, aria-label
    ['placeholder', 'alt', 'title', 'aria-label'].forEach(attr => {
      document.querySelectorAll(`[data-i18n-${attr}]`).forEach(el => {
        const key = el.getAttribute(`data-i18n-${attr}`);
        const val = resolve(key);
        if (val !== null) el.setAttribute(attr, val);
      });
    });

    // Marcar botón activo
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('i18n-active', btn.getAttribute('data-lang') === currentLang);
    });

    // Actualizar lang del documento (SEO + accesibilidad)
    document.documentElement.lang = currentLang;

    // Evento para scripts externos que necesiten reaccionar
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: currentLang } }));
  }

  // ── Cambiar idioma (API pública) ─────────────────────────────────────────
  async function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn(`[i18n] Idioma no soportado: ${lang}`);
      return;
    }
    currentLang = lang;
    localStorage.setItem('i18n_lang', lang);
    translations = await loadTranslations(lang);
    applyTranslations();
  }

  // ── Re-aplicar sin recargar (útil para componentes cargados dinámicamente)
  function reapply() {
    applyTranslations();
  }

  // ── Inicializar ──────────────────────────────────────────────────────────
  async function init() {
    console.log('[i18n] Inicializando sistema de traducciones...');
    const lang = detectLang();
    console.log('[i18n] Idioma detectado:', lang);
    currentLang  = lang;
    translations = await loadTranslations(lang);
    applyTranslations();
    console.log('[i18n] Sistema listo ✓');

    // Conectar botones de idioma (data-lang)
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });
  }

  // ── API pública ──────────────────────────────────────────────────────────
  window.i18n = {
    setLang,
    reapply,
    getCurrentLang: () => currentLang,
    t: resolve,
  };

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();