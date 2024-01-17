const express = require('express')
const SITE_TITLE = '鏡週刊 Mirror Media'
const SITE_DESCRIPTION =
  '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
const SITE_KEYWORDS = '鏡週刊,mirror media,新聞人物,娛樂焦點,美食旅遊,瑪法達'
const SITE_URL = 'https://www.mirrormedia.mg'
const SITE_OG_IMG = `${SITE_URL}/assets/mirrormedia/notImage.png` // 來自 plate-vue
const FB_APP_ID = '175313259598308'
const FB_PAGE_ID = '1855418728011324'
const {
  ENV = 'dev',
  API_PATH_FRONTEND,
  GOOGLE_OPT_CONTAINER_ID,
} = require('./configs/config')

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
      ...(ENV !== 'lighthouse'
        ? [
            // comScore Tag
            {
              hid: 'comScore',
              innerHTML: `
                var _comscore = _comscore || [];
                _comscore.push({ c1: "2", c2: "24318560" });
                (function() {
                  var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
                  s.async = true; s.src = "https://sb.scorecardresearch.com/cs/24318560/beacon.js";
                  el.parentNode.insertBefore(s, el);
                })();
              `,
            },

            // https://support.google.com/optimize/answer/7513085
            {
              hid: 'googleOptimize',
              src: `https://www.googleoptimize.com/optimize.js?id=${GOOGLE_OPT_CONTAINER_ID}`,
            },

            // Alexa Certify Javascript
            {
              hid: 'alexa',
              innerHTML: `
                _atrk_opts = { atrk_acct:"JEZvr1zDGU20kU", domain:"mirrormedia.mg",dynamic: true};
                (function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
              `,
            },

            // Facebook Pixel
            {
              hid: 'facebookPixel',
              innerHTML: `!function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '176410021005270');
                fbq('track', 'PageView');`,
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
    noscript: [
      // Alexa Certify Javascript
      {
        hid: 'alexaNoScript',
        innerHTML:
          '<img src="https://certify.alexametrics.com/atrk.gif?account=JEZvr1zDGU20kU" style="display:none" height="1" width="1" alt="" />',
      },

      // comScore Tag
      {
        hid: 'comScoreNoScript',
        innerHTML:
          '<img src="https://sb.scorecardresearch.com/p?c1=2&amp;c2=24318560&amp;cv=3.6.0&amp;cj=1" />',
      },

      // Facebook Pixel
      {
        hid: 'facebookPixelNoScript',
        innerHTML:
          '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=176410021005270&ev=PageView&noscript=1"/>',
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      alexa: ['innerHTML'],
      alexaNoScript: ['innerHTML'],
      comScore: ['innerHTML'],
      comScoreNoScript: ['innerHTML'],
      facebookPixel: ['innerHTML'],
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
    { src: '~/plugins/vuelidate', ssr: true },
    '~/plugins/google-optimize-experiments/index.js',
    '~/plugins/ad/index.client.js',
  ],

  /**
   * Nuxt.js Server Middleware
   */
  serverMiddleware: [
    express.urlencoded({ extended: true }),
    '~/api/headers.js',
    {
      path: `/${API_PATH_FRONTEND}/gcs`,
      handler: '~/api/gcs.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/grouped-gcs`,
      handler: '~/api/grouped-gcs.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/subscribe-magazine/payload`,
      handler: '~/api/subscribe-magazine/payload.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/subscribe-magazine/info`,
      handler: '~/api/subscribe-magazine/info.js',
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
    {
      path: `/${API_PATH_FRONTEND}/member-subscription/v0`,
      handler: '~/api/member-subscription-proxy.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/member-subscription/v2`,
      handler: '~/api/member-subscription-proxy-v2.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/newebpay/v1`,
      handler: '~/api/newebpay.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/linepay/v1`,
      handler: '~/api/linepay.js',
    },
    {
      path: `/${API_PATH_FRONTEND}/papermag/v1`,
      handler: '~/api/papermag.js',
    },
    { path: `/${API_PATH_FRONTEND}`, handler: '~/api/index.js' }, // this proxy MUST be in the last of serverMiddleware
  ],

  /**
   * Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/composition-api/module',

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
          return document.domain.match(
            /^(www|www-staging|nuxt).mirrormedia.mg/gs
          )
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
    '@nuxtjs/axios',

    ...(process.env.NODE_ENV === 'production' &&
    (ENV === 'prod' || ENV === 'staging')
      ? ['@mirror-media/nuxt-ssr-cache']
      : []),

    [
      '@nuxtjs/firebase',
      {
        /*
         * exposed apiKey in config is not a security risk
         * see: https://stackoverflow.com/a/37484053
         */
        config: (function getFirebaseConfig(ENV) {
          switch (ENV) {
            case 'prod': {
              return {
                apiKey: 'AIzaSyBZVaJXDbtc6O6Iy36OeYDG8Cd9pB2vq54',
                authDomain: 'www.mirrormedia.mg',
                projectId: 'mirror-weekly',
                storageBucket: 'mirror-weekly.appspot.com',
                messagingSenderId: '814835936704',
                appId: '1:814835936704:web:ce5288f6d1c0f71828ec25',
                measurementId: 'G-2FDRC4S37L',
              }
            }

            case 'staging': {
              return {
                apiKey: 'AIzaSyD-cFjoIjlEn7-dZtl3zw7OYCRPerl5URs',
                authDomain: 'www-staging.mirrormedia.mg',
                projectId: 'mirrormedia-staging',
                storageBucket: 'mirrormedia-staging.appspot.com',
                messagingSenderId: '388524095772',
                appId: '1:388524095772:web:e3739160c042909827a2d9',
              }
            }

            case 'dev':
            default: {
              return {
                apiKey: 'AIzaSyAavk46-8OQ4B2cv0TOqxOMjd5Fe4tIauc',
                authDomain: 'mirrormediaapptest.firebaseapp.com',
                databaseURL: 'https://mirrormediaapptest.firebaseio.com',
                projectId: 'mirrormediaapptest',
                storageBucket: 'mirrormediaapptest.appspot.com',
                messagingSenderId: '305253456270',
                appId: '1:305253456270:web:21f9851dd09f60ebfbacdf',
                measurementId: 'G-8YH4MW9NX5',
              }
            }
          }
        })(ENV),
        services: {
          auth: {
            ssr: {
              ignorePaths: [
                '/papermag/return',
                '/subscribe/return',
                '/subscribe/confirm',
                '/campaigns',
                '/projects',
                '/dist',
                '/assets',
                '/json',
                '/rss',
                '/questionnaire',
                '/robots.txt',
                '/manifest.json',
                '/firebase-messaging-sw.js',
                '/ads.txt',
                '/hodo_adject.php',
              ],
            },
            initialize: {
              onAuthStateChangedAction:
                'membership/ON_AUTH_STATE_CHANGED_ACTION',
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
    'vue-scrollto/nuxt',
    '@nuxtjs/gtm',
  ],
  axios: {
    proxy: true,
  },

  // config for @mirror-media/nuxt-ssr-cache
  cache: {
    /**
     * Workaround, pages array must exist and not empty,
     * see: https://github.com/arash16/nuxt-ssr-cache/blob/master/src/middleware.js#L34
     */
    pages: ['/'],

    key(route) {
      // We should configure cache pages path right here.
      const ignorePages =
        /^(?!\/login|\/profile|\/finishSignUp|\/cancelMembership|\/magazine|\/topic|\/subscribe).+/
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
    hoistUseStatements: true,
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/v2/membership/v1/graphql',
        browserHttpEndpoint: '/api/v2/membership/v1/graphql',
      },
      userClient: '~/apollo-config-user-client.js',
      memberSubscription: '~/apollo-config-member-subscription.js',
    },
  },

  gtm: {
    id: (function getGTMId(ENV) {
      switch (ENV) {
        case 'prod': {
          return 'GTM-NCH86SP'
        }

        case 'staging': {
          return 'GTM-KVDZ27K'
        }

        case 'dev':
        default: {
          return 'GTM-PBNLSMX'
        }
      }
    })(ENV),
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

      /*
       * lodash-webpack-plugin
       * const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
       * config.plugins.push(new LodashModuleReplacementPlugin({ paths: true }))
       */

      // // Extend only webpack config for client-bundle
      // if (ctx.isClient) {
      //   config.devtool = 'source-map'
      // }

      // ref: https://stackoverflow.com/questions/66720347/module-not-found-cant-resolve-child-process-google-spreadsheet
      config.node = {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        tls: 'empty',
      }
    },
  },

  /**
   * Nuxt Telemetry configuration
   * Doc: https://github.com/nuxt/telemetry#opting-out
   */
  telemetry: false,

  router: {
    extendRoutes(routes, resolve) {
      // Toggle on the feature of replace /topic origin pages/topic/_id.vue page component with deprecated/topic-page/Topic.vue
      const originalTopicRouteIndex = routes.findIndex(
        function getRouteNameTopic(route) {
          return route.name === 'topic-id'
        }
      )
      routes.splice(originalTopicRouteIndex, 1)
      routes.push({
        path: '/topic/:topicId',
        component: resolve(__dirname, 'deprecated/topic-page/Topic.vue'),
        name: 'topic-id',
      })
    },
  },

  /*
   *  runtime config for feature toggle
   *    if you decide to add certain environment variable when developing on local,
   *    please add command to assign environment variable key and value,
   *    which will temporarily add environment variable(or change value of existing environment variable)
   *    until you break the program in execution.
   *    for example:
   *    $ CERTAIN_FEATURE_TOGGLE=on yarn dev
   */

  publicRuntimeConfig: {
    linepayUiToggle: process.env.LINEPAY_PAYMENT_UI_TOGGLE === 'on',
    recordMemberArticleToggle:
      process.env.RECORD_MEMBER_ARTICLE_HISTORY_FEATURE_TOGGLE === 'on',
    recordMemberArticleMaxAge:
      parseInt(process.env.MEMBER_ARTICLE_HISTORY_MAX_AGE) || 30,
    donateFeatureToggle: process.env.DONATE_FEATURE_TOGGLE === 'on',
    warmlifeFeatureToggle: process.env.WARM_LIFE_FEATURE_TOGGLE === 'on',
    purchaseOneTimeFeatureToggle:
      process.env.PURCHASE_ONE_TIME_FEATURE_TOGGLE === 'on',
  },

  env: {
    ENV,
  },
}
