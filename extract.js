#!/usr/bin/env node
/**
 * extract.js — Extractor automático de textos para i18n
 * 
 * Uso: node extract.js .
 * 
 * Qué hace:
 *  1. Recorre todos los .html en subcarpetas
 *  2. Extrae el texto visible de cada elemento
 *  3. Agrega data-i18n="pagina.elemento.N" automáticamente
 *  4. Genera locales/en.json con todos los textos originales (inglés)
 *  5. Genera locales/es.json y locales/pt.json con placeholders para traducir
 */

const fs = require('fs');
const path = require('path');

// ── Configuración ──────────────────────────────────────────────────────────
const SITE_ROOT = process.argv[2] || '.';
const LOCALES_DIR = path.join(SITE_ROOT, 'locales');
const DEFAULT_LANG = 'en';

// Etiquetas de las que extraer texto visible
const TAGS_TO_TRANSLATE = [
  'h1','h2','h3','h4','h5','h6',
  'p','a','button','span','li','td','th',
  'label','option','figcaption','caption','blockquote','small'
];

// Atributos que también se traducen
const ATTRS_TO_TRANSLATE = ['placeholder', 'alt', 'title', 'aria-label'];

// Elementos a IGNORAR
const SKIP_TAGS = new Set(['script','style','code','pre','svg','noscript']);
// ──────────────────────────────────────────────────────────────────────────

function parseAndTransform(htmlContent, pageKey, masterEn) {
  let keyCounter = {};

  TAGS_TO_TRANSLATE.forEach(tag => {
    const regex = new RegExp(
      `(<${tag}(\\s[^>]*)?>)([^<]+)(<\\/${tag}>)`,
      'gi'
    );
    htmlContent = htmlContent.replace(regex, (match, open, attrs, text, close) => {
      const trimmed = text.trim();
      if (!trimmed || /^[\d\s\W]+$/.test(trimmed) || open.includes('data-i18n')) {
        return match;
      }
      if (SKIP_TAGS.has(tag)) return match;

      const counter = keyCounter[tag] = (keyCounter[tag] || 0) + 1;
      const key = `${pageKey}.${tag}${counter}`;
      masterEn[key] = trimmed;

      const newOpen = open.replace(`<${tag}`, `<${tag} data-i18n="${key}"`).replace(/\s+>/g, '>');
      return `${newOpen}${text}${close}`;
    });
  });

  ATTRS_TO_TRANSLATE.forEach(attr => {
    const regex = new RegExp(`(${attr})="([^"]+)"`, 'gi');
    htmlContent = htmlContent.replace(regex, (match, attrName, value) => {
      const trimmed = value.trim();
      if (!trimmed) return match;

      const counter = keyCounter[attr] = (keyCounter[attr] || 0) + 1;
      const key = `${pageKey}.${attr}${counter}`;
      masterEn[key] = trimmed;

      return `${attrName}="${value}" data-i18n-${attrName}="${key}"`;
    });
  });

  return htmlContent;
}

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function fileToPageKey(filePath, siteRoot) {
  let rel = path.relative(siteRoot, filePath);
  rel = rel.replace(/\\/g, '/');
  rel = rel.replace(/\.html$/, '');
  rel = rel.replace(/\/index$/, '');
  rel = rel.replace(/\//g, '_') || 'home';
  return rel;
}

// ── Main ───────────────────────────────────────────────────────────────────
console.log('\n🌐  i18n Extractor — iniciando...\n');

if (!fs.existsSync(SITE_ROOT)) {
  console.error(`❌  No se encontró la carpeta: ${SITE_ROOT}`);
  process.exit(1);
}

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR, { recursive: true });
  console.log(`📁  Creado: ${LOCALES_DIR}`);
}

const htmlFiles = findHtmlFiles(SITE_ROOT);
console.log(`📄  Archivos HTML encontrados: ${htmlFiles.length}\n`);

const masterEn = {};
let totalKeys = 0;

for (const filePath of htmlFiles) {
  const pageKey = fileToPageKey(filePath, SITE_ROOT);
  console.log(`  ✏️   Procesando: ${path.relative(SITE_ROOT, filePath)} → clave "${pageKey}"`);

  let html = fs.readFileSync(filePath, 'utf-8');
  const before = Object.keys(masterEn).length;

  html = parseAndTransform(html, pageKey, masterEn);

  const added = Object.keys(masterEn).length - before;
  totalKeys += added;
  console.log(`       ${added} textos extraídos`);

  fs.writeFileSync(filePath, html, 'utf-8');
}

// Guardar en.json — idioma original (inglés)
fs.writeFileSync(
  path.join(LOCALES_DIR, 'en.json'),
  JSON.stringify(masterEn, null, 2),
  'utf-8'
);
console.log(`\n✅  locales/en.json generado (${totalKeys} claves) — idioma base`);

// Generar es.json y pt.json con marcadores para traducir
['es', 'pt'].forEach(lang => {
  const outPath = path.join(LOCALES_DIR, `${lang}.json`);
  const langLabel = lang === 'es' ? 'ES' : 'PT';

  if (!fs.existsSync(outPath)) {
    const copy = {};
    for (const [k, v] of Object.entries(masterEn)) {
      copy[k] = `[${langLabel}] ${v}`;
    }
    fs.writeFileSync(outPath, JSON.stringify(copy, null, 2), 'utf-8');
    console.log(`✅  locales/${lang}.json generado`);
  } else {
    const existing = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
    let added = 0;
    for (const [k, v] of Object.entries(masterEn)) {
      if (!existing[k]) {
        existing[k] = `[${langLabel}] ${v}`;
        added++;
      }
    }
    fs.writeFileSync(outPath, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`✅  locales/${lang}.json actualizado (+${added} claves nuevas)`);
  }
});

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨  Listo. Pasos siguientes:
   1. Abre locales/es.json y traduce los valores marcados con [ES]
   2. Abre locales/pt.json y traduce los valores marcados con [PT]
   3. Copia i18n.js a tu carpeta /js/ e inclúyelo en cada HTML
   4. Agrega los botones de idioma en tu navbar.html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);