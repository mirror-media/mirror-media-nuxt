import { ENV } from '~/configs/config'

export default (function getConfig(ENV) {
  switch (ENV) {
    case 'prod': {
      return {
        iOS: {
          bundleId: 'com.mirrormedia.news',
        },
        android: {
          packageName: 'com.mirrormedia.news',
          installApp: false,
          minimumVersion: '12',
        },
        dynamicLinkDomain: 'mirrorweekly.page.link',
      }
    }

    case 'staging': {
      return {
        iOS: {
          bundleId: 'com.mirrormedia.news.dev',
        },
        android: {
          packageName: 'com.mirrormedia.news.dev',
          installApp: false,
          minimumVersion: '12',
        },
        dynamicLinkDomain: 'mirrormediastaging.page.link',
      }
    }

    case 'dev':
    default: {
      return {
        iOS: {
          bundleId: 'com.mirrormedia.news.dev',
        },
        android: {
          packageName: 'com.mirrormedia.news.dev',
          installApp: false,
          minimumVersion: '12',
        },
        dynamicLinkDomain: 'mirrormediadev.page.link',
      }
    }
  }
})(ENV)
