// ESLint 9+ flat config for ArchiCG.
//
// Lints only ArchiCG-authored sources under lib/ and the top-level
// custom files. Vendored libraries (lib/vendor/), the reveal.js
// distribution under js/ and plugin/, and node_modules are ignored.

"use strict";

const browserGlobals = {
  // Window / DOM
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  location: "readonly",
  history: "readonly",
  screen: "readonly",
  console: "readonly",
  alert: "readonly",
  confirm: "readonly",
  prompt: "readonly",
  Element: "readonly",
  HTMLElement: "readonly",
  Node: "readonly",
  Event: "readonly",
  MouseEvent: "readonly",
  KeyboardEvent: "readonly",
  CustomEvent: "readonly",
  // Timers
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  // Storage / IO
  localStorage: "readonly",
  sessionStorage: "readonly",
  XMLHttpRequest: "readonly",
  fetch: "readonly",
  FileReader: "readonly",
  Blob: "readonly",
  File: "readonly",
  FormData: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  btoa: "readonly",
  atob: "readonly",
  // SVG
  SVGElement: "readonly",
  // Misc
  Image: "readonly",
  DOMParser: "readonly",
  XMLSerializer: "readonly",
  getComputedStyle: "readonly",
  matchMedia: "readonly",
};

const jqueryGlobals = {
  $: "readonly",
  jQuery: "readonly",
};

const projectGlobals = {
  // Third-party libraries used as page-scope globals
  cytoscape: "readonly",
  w2ui: "readonly",
  w2layout: "readonly",
  w2toolbar: "readonly",
  w2sidebar: "readonly",
  w2grid: "readonly",
  w2popup: "readonly",
  w2alert: "readonly",
  w2confirm: "readonly",
  w2prompt: "readonly",
  w2utils: "readonly",
  d3: "readonly",
  _: "readonly",
  Reveal: "readonly",
  vis: "readonly",
  Papa: "readonly",
  JSZip: "readonly",
  JSZipUtils: "readonly",
  saveAs: "readonly",
  swal: "readonly",
  uuid: "readonly",
  // ArchiCG configuration object loaded by config.js
  configuration: "writable",
};

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".git/**",
      "lib/vendor/**",
      "js/**",
      "plugin/**",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...browserGlobals,
        ...jqueryGlobals,
        ...projectGlobals,
      },
    },
    rules: {
      "no-implicit-globals": "error",
      "no-var": "warn",
      "no-new-func": "error",
      "no-unused-vars": ["warn", { args: "none" }],
      "no-redeclare": "warn",
      eqeqeq: ["warn", "smart"],
    },
  },
];
