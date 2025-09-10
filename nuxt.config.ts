export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/seo",
    "@vueuse/nuxt",
  ],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  site: {
    // TODO Configure site
    url: "https://example.com",
    name: "Website name",
    description: "Website description",
    defaultLocale: "en",
    indexable: false,
  },
  experimental: {
    typedPages: true,
  },
  compatibilityDate: "2025-07-01",
  eslint: {
    config: {
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
  // Custom styles
  css: ["~~/app/assets/css/main.css"],
})
