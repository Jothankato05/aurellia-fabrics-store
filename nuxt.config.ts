// nuxt.config.ts
import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "@nuxt/image", "notivue/nuxt", "@nuxtjs/i18n"],

  i18n: {
    defaultLocale: "en",
    strategy: "prefix_except_default",
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: true,
    },
    locales: [
      { code: "en", iso: "en-GB", file: "en-GB.json", name: "🇬🇧 English" },
      { code: "nb", iso: "nb-NO", file: "nb-NO.json", name: "🇳🇴 Norsk (Bokmål)" },
      { code: "nl", iso: "nl-NL", file: "nl-NL.json", name: "🇳🇱 Nederlands" },
      { code: "de", iso: "de-DE", file: "de-DE.json", name: "🇩🇪 Deutsch" },
    ],
  },

  notivue: {
    position: "top-center",
    limit: 3,
    notifications: { global: { duration: 3000 } },
  },

  css: ["notivue/notification.css", "notivue/animations.css"],

  runtimeConfig: {
    gqlHost: process.env.GQL_HOST || "",
    public: {
      version: pkg.version,
    },
  },

  routeRules: {
    // Pre-render at build time — served as static HTML from Cloudflare CDN, zero backend calls
    "/": { prerender: true },
    "/categories": { prerender: true },

    // Product pages: serve stale for 24h, revalidate in background
    "/product/**": { swr: 86400 },

    "/favorites": { ssr: false },

    // API: tell Cloudflare's CDN to cache responses at the edge
    "/api/products": { cache: { maxAge: 3600, staleMaxAge: 86400 } },
    "/api/categories": { cache: { maxAge: 3600, staleMaxAge: 86400 } },
    "/api/product": { cache: { maxAge: 3600, staleMaxAge: 86400 } },
    "/api/search": { cache: { maxAge: 300, staleMaxAge: 3600 } },

    // Immutable JS/CSS assets — browser caches forever
    "/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
  },

  nitro: {
    preset: process.env.NODE_ENV === "production" ? "cloudflare_pages" : undefined,
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
      // Auto-discover and pre-render all product + category pages at build time
      crawlLinks: true,
    },
  },

  compatibilityDate: "2025-01-01",
});
