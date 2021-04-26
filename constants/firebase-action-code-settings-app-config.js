import { ENV } from '~/configs/config'

export default ENV === 'prod' || ENV === 'staging'
  ? {
      iOS: {
        bundleId: 'com.mirrormedia.news',
      },
      android: {
        packageName: 'com.mirrormedia.news',
        installApp: false,
        minimumVersion: '12',
      },
      dynamicLinkDomain: 'mirrormedia.page.link',
    }
  : {
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
