// Web: the browser already has localStorage. Metro picks this file on web
// (".web.ts"), so the SQLite polyfill and its WebAssembly never load in the browser.
export const sessionStorage = typeof window === 'undefined' ? undefined : window.localStorage;
