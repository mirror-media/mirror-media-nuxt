const SITE_TITLE = '鏡週刊 Mirror Media'
const SITE_DESCRIPTION =
  '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
const SITE_KEYWORDS = '鏡週刊,mirror media,新聞人物,娛樂焦點,美食旅遊,瑪法達'
const SITE_URL = 'https://www.mirrormedia.mg'
const SITE_OG_IMG = `${SITE_URL}/assets/mirrormedia/notImage.png` // 來自 plate-vue
const FB_APP_ID = '175313259598308'
const FB_PAGE_ID = '1855418728011324'
const { ENV = 'dev', API_PATH_FRONTEND } = require('./configs/config')

module.exports = {
  /**
   * Headers of the page
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
        property: 'og:title',
        content: SITE_TITLE,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: SITE_DESCRIPTION,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: SITE_OG_IMG,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: SITE_URL,
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: SITE_TITLE,
      },
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: 'zh_TW',
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'article',
      },
      {
        hid: 'fb:app_id',
        property: 'fb:app_id',
        content: FB_APP_ID,
      },
      {
        hid: 'fb:pages',
        property: 'fb:pages',
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
        content: SITE_OG_IMG,
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
        hid: 'gptLink',
        rel: 'preload',
        href: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
        as: 'script',
      },
    ],
    script: [
      // likr 禾多推播
      ...(ENV !== 'lighthouse'
        ? [
            {
              hid: 'likrNotification',
              innerHTML: `window.AviviD = window.AviviD || {settings:{},status:{}}; AviviD.web_id = "mirrormedia"; AviviD.category_id = "20180905000003"; AviviD.tracking_platform = 'likr'; (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&timestamp='+new Date().getTime();f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-W9F4QDN'); (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&timestamp='+new Date().getTime();f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-MKB8VFG');`,
            },
          ]
        : []),

      // https://developers.google.com/doubleclick-gpt/guides/general-best-practices#load_statically
      {
        hid: 'gptScript',
        src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
        async: true,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      likrNotification: ['innerHTML'],
    },
  },

  /**
   * Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /**
   * Global CSS
   */
  css: ['~/css/base.css', 'swiper/css/swiper.css'],

  /**
   * Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vuePluginsGlobal.js',
    '~/plugins/vuePluginsGlobal.client.js',
    '~/plugins/vueDirectivesGlobal.js',
    '~/plugins/requests/index.js',
    '~/plugins/user-behavior-log/index.client.js',
  ],

  /**
   * Nuxt.js Server Middleware
   */
  serverMiddleware: [
    '~/api/headers.js',
    {
      path: `/${API_PATH_FRONTEND}/gcs`,
      handler: '~/api/gcs.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/combo`,
      handler: '~/api/combo.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/tracking`,
      handler: '~/api/tracking.js',
    },
    { path: `/${API_PATH_FRONTEND}/saleor`, handler: '~/api/saleor-proxy.js' },
    {
      path: `/${API_PATH_FRONTEND}/membership/v0`,
      handler: '~/api/membership-proxy.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/membership/v1`,
      handler: '~/api/membership-proxy-v1.js',
    },
    { path: `/${API_PATH_FRONTEND}`, handler: '~/api/index.js' },
  ],

  /**
   * Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/composition-api',

    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',

    /**
     * googleAnalytics module configuration
     * https://github.com/nuxt-community/analytics-module
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
    '@nuxtjs/svg',
  ],

  /**
   * Nuxt.js modules
   */
  modules: [
    'nuxt-user-agent',

    /*
     * ...(process.env.NODE_ENV === 'production' &&
     * (ENV === 'prod' || ENV === 'staging')
     *   ? ['@mirror-media/nuxt-ssr-cache']
     *   : []),
     */
    '@mirror-media/nuxt-ssr-cache',

    [
      '@nuxtjs/firebase',
      {
        /*
         * exposed apiKey in config is not a security risk
         * see: https://stackoverflow.com/a/37484053
         */
        config:
          ENV === 'prod' || ENV === 'staging'
            ? {
                apiKey: 'AIzaSyDluvbZhIQgcicqXVarLkdP4PG6maZlEMI',
                authDomain: 'mirromedia-app.firebaseapp.com',
                databaseURL: 'https://mirromedia-app.firebaseio.com',
                projectId: 'mirromedia-app',
                storageBucket: 'mirromedia-app.appspot.com',
                messagingSenderId: '231032158952',
                appId: '1:231032158952:web:975862d0b50f8bdd1d275d',
                measurementId: 'G-Q1GK3C4WNR',
              }
            : {
                apiKey: 'AIzaSyAavk46-8OQ4B2cv0TOqxOMjd5Fe4tIauc',
                authDomain: 'mirrormediaapptest.firebaseapp.com',
                databaseURL: 'https://mirrormediaapptest.firebaseio.com',
                projectId: 'mirrormediaapptest',
                storageBucket: 'mirrormediaapptest.appspot.com',
                messagingSenderId: '305253456270',
                appId: '1:305253456270:web:21f9851dd09f60ebfbacdf',
                measurementId: 'G-EY5CYC602Z',
              },
        services: {
          auth: {
            ssr: true,
            initialize: {
              onAuthStateChangedMutation:
                'membership/ON_AUTH_STATE_CHANGED_MUTATION',
            },
          },
        },

        /*
         * disable lazy-load due to issue with $fire.authReady() and $fireModule
         * https://github.com/nuxt-community/firebase-module/issues/366
         */

        // lazy: true,
      },
    ],
    [
      '@nuxtjs/pwa',
      {
        // disable the modules you don't need
        meta: false,
        icon: false,

        /*
         * if you omit a module key form configuration sensible defaults will be applied
         * manifest: false,
         */

        workbox: {
          importScripts: [
            // ...
            '/firebase-auth-sw.js',
          ],

          /*
           * by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
           * only set this true for testing and remember to always clear your browser cache in development
           */
          dev: process.env.NODE_ENV !== 'production',
        },
      },
    ],
    '@nuxtjs/apollo',
  ],

  // config for @mirror-media/nuxt-ssr-cache
  cache: {
    /**
     * Workaround, pages array must exist and not empty,
     * see: https://github.com/arash16/nuxt-ssr-cache/blob/master/src/middleware.js#L34
     */
    pages: ['/'],

    key(route) {
      // We should configure cache pages path right here.
      const ignorePages = /^(?!\/login|\/profile|\/finishSignUp|\/cancelMembership|\/premium).+/
      const cachePages = [ignorePages]

      const shouldCacheCurrentRoute = cachePages.some((pat) =>
        pat instanceof RegExp ? pat.test(route) : route.startsWith(pat)
      )
      if (shouldCacheCurrentRoute) {
        const prefixForGrep = 'mirror-media-nuxt'
        const version = require('./package.json').version
        const prefix = `${prefixForGrep}_${ENV}@${version}:`
        return `${prefix}${route}`
      }
    },
    store: {
      type: 'redis',

      /**
       * readHost and writeHost working in @mirror-media/nuxt-ssr-cache only,
       * for redis write/read master-slave replication
       * Not working in the original nuxt-ssr-cache package
       */
      readHost: require('./configs/config').REDIS_READ_HOST,
      writeHost: require('./configs/config').REDIS_WRITE_HOST,
      port: require('./configs/config').REDIS_PORT,
      auth_pass: require('./configs/config').REDIS_AUTH,
      ttl: 60 * 5,
    },
  },

  styleResources: {
    scss: '~/scss/*.scss',
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/v2/membership/v1/graphql',
        browserHttpEndpoint: '/api/v2/membership/v1/graphql',
      },
      userClient: '~/apollo-config-user-client.js',
      saleorClient: {
        httpEndpoint: 'http://localhost:3000/api/v2/saleor/graphql/',
        browserHttpEndpoint: '/api/v2/saleor/graphql/',
      },
    },
  },

  /**
   * Build configuration
   */
  build: {
    babel: {
      plugins: ['lodash'],
      presets({ isServer }, [preset, options]) {
        options.corejs = { version: 3, proposals: true }
      },
    },

    /**
     * You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.extensions = ['.js']

      // lodash-webpack-plugin
      const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
      config.plugins.push(new LodashModuleReplacementPlugin({ paths: true }))

      // // Extend only webpack config for client-bundle
      // if (ctx.isClient) {
      //   config.devtool = 'source-map'
      // }
    },
  },

  /**
   * Nuxt Telemetry configuration
   * Doc: https://github.com/nuxt/telemetry#opting-out
   */
  telemetry: false,
}
