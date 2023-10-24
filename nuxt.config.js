export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  components: [{ path: '~/components', pathPrefix: false }],
  modules: ['nuxt-mongoose', 'nuxt-vue3-google-signin', '@pinia/nuxt'],
  mongoose: {
    uri: process.env.MONGO_URI,
    options: {},
    modelsDir: 'db'
  },
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },
  runtimeConfig: {
    public: {
      host: process.env.HOST,
      slackClientId: process.env.SLACK_CLIENT_ID,
      googleSignIn: {
        // Sometimes, environmental variables are not loaded properly
        clientId: process.env.GOOGLE_CLIENT_ID
      }
    }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  routes: { '/': { prerender: true } },
  devtools: { enabled: true }
});
