// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer:{
    port: 3001,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  // Forward /api/v1/** from Nuxt (:3001) to the NestJS API (:3000)
  routeRules: {
    '/api/v1/**': { proxy: 'http://localhost:3000/api/v1/**' },
  },
});
