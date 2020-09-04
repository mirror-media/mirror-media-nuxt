const SITE_TITLE = '鏡週刊 Mirror Media'
const SITE_DESCRIPTION =
  '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
const SITE_KEYWORDS = '鏡週刊,mirror media,新聞人物,娛樂焦點,美食旅遊,瑪法達'
const SITE_OG_IMAGE =
  'https://www.mirrormedia.mg/assets/mirrormedia/notImage.png'
const SITE_URL = 'https://www.mirrormedia.mg'
const FB_APP_ID = '175313259598308'
const FB_PAGE_ID = '1855418728011324'

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'zh-Hant',
    },
    title: SITE_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'robots',
        name: 'robots',
        content: 'index',
      },
      {
        hid: 'description',
        name: 'description',
        content: SITE_DESCRIPTION,
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: SITE_KEYWORDS,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: SITE_TITLE,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: SITE_DESCRIPTION,
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: SITE_OG_IMAGE,
      },
      {
        hid: 'og:url',
        name: 'og:url',
        content: SITE_URL,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: SITE_TITLE,
      },
      {
        hid: 'og:locale',
        name: 'og:locale',
        content: 'zh_TW',
      },
      {
        hid: 'og:type',
        name: 'og:type',
        content: 'article',
      },
      {
        hid: 'fb:app_id',
        name: 'fb:app_id',
        content: FB_APP_ID,
      },
      {
        hid: 'fb:pages',
        name: 'fb:pages',
        content: FB_PAGE_ID,
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: SITE_TITLE,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: SITE_DESCRIPTION,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: SITE_OG_IMAGE,
      },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },

      // https://developers.google.com/doubleclick-gpt/guides/general-best-practices#use_preload_when_appropriate
      {
        rel: 'preload',
        href: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
        as: 'script',
      },
    ],
    script: [
      // https://developers.google.com/doubleclick-gpt/guides/general-best-practices#load_statically
      {
        src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
        async: true,
      },
    ],
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
    {
      path: '/api/combo',
      handler: '~/api/combo.js',
    },
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
    '@nuxtjs/dayjs',
    'nuxt-user-agent',
    '@mirror-media/nuxt-ssr-cache',
  ],
  // config for @mirror-media/nuxt-ssr-cache
  cache: {
    /*
     ** Workaround, pages array must exist and not empty,
     ** see: https://github.com/arash16/nuxt-ssr-cache/blob/master/src/middleware.js#L34
     */
    pages: ['/'],

    key(route) {
      // We should configure cache pages path right here.
      const cachePages = ['/']

      const shouldCacheCurrentRoute = cachePages.some((pat) =>
        pat instanceof RegExp ? pat.test(route) : route.startsWith(pat)
      )
      if (shouldCacheCurrentRoute) {
        const prefixForGrep = 'mirror-media-nuxt:'
        return `${prefixForGrep}${route}`
      }
    },
    store: {
      type: 'redis',
      /*
       ** readHost and writeHost working in @mirror-media/nuxt-ssr-cache only,
       ** for redis write/read master-slave replication
       ** Not working in the original nuxt-ssr-cache package
       */
      readHost: require('./configs/config').REDIS_READ_HOST,
      writeHost: require('./configs/config').REDIS_WRITE_HOST,
      port: require('./configs/config').REDIS_PORT,
      auth_pass: require('./configs/config').REDIS_AUTH,
      ttl: 60 * 5,
    },
  },
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
      presets({ isServer }, [preset, options]) {
        options.corejs = { version: 3, proposals: true }
      },
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
    optimization: {
      splitChunks: {
        maxSize: 15 * 1024, // 15kb
      },
    },
  },
  /*
   ** Nuxt Telemetry configuration
   ** Doc: https://github.com/nuxt/telemetry#opting-out
   */
  telemetry: false,
}
