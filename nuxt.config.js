module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/css/base.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vuePluginsGlobal.js',
    '~/plugins/vuePluginsGlobal.client.js',
    '~/plugins/vueDirectivesGlobal.js',
    '~/plugins/requests/index.js',
    '~/plugins/article/index.js',
  ],
  /*
   ** Nuxt.js Server Middleware
   */
  serverMiddleware: [
    '~/api/headers.js',
    { path: '/api', handler: '~/api/index.js' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    /*
     ** googleAnalytics module configuration
     ** https://github.com/nuxt-community/analytics-module
     */
    [
      '@nuxtjs/google-analytics',
      {
        id: () => {
          return document.domain.match(/^(www|nuxt).mirrormedia.mg/gs)
            ? 'UA-83609754-1'
            : 'UA-83609754-2'
        },
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  styleResources: {
    scss: '~/scss/*.scss',
  },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: ['lodash'],
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.extensions = ['.js']

      // lodash-webpack-plugin
      const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
      config.plugins.push(new LodashModuleReplacementPlugin({ paths: true }))
    },
  },
}
