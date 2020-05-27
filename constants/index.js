const SOCIAL_URLS = {
  line: 'https://line.me/R/ti/p/%40cuk1273e',
  weibo: 'http://www.weibo.com/u/6030041924?is_all=1',
  facebook: 'https://www.facebook.com/mirrormediamg/',
  instagram: 'https://www.instagram.com/mirror_media/',
  rss: 'https://www.mirrormedia.mg/rss/rss.xml',
  email: 'mailto:mirror885@mirrormedia.mg',

  subscribe:
    'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
  magazine: 'https://mybook.taiwanmobile.com/contentGroup/MIR0100100001',
  auth: 'https://www.mirrormedia.mg/story/webauthorize/',
  ad: 'https://www.mirrormedia.mg/story/ad1018001/index.html',
  campaign: 'https://www.mirrormedia.mg/category/campaign',
  downloadApp: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',

  facebookFoodtravel: 'https://www.facebook.com/MirrorMediaFoodTravel/',
}

// their order is important, DON'T change it at will
export const MEDIA_LINKS = {
  line: {
    name: 'line',
    href: SOCIAL_URLS.line,
  },
  weibo: {
    name: 'weibo',
    href: SOCIAL_URLS.weibo,
  },
  facebook: {
    name: 'facebook',
    href: SOCIAL_URLS.facebook,
  },
  instagram: {
    name: 'instagram',
    href: SOCIAL_URLS.instagram,
  },
  rss: {
    name: 'rss',
    href: SOCIAL_URLS.rss,
  },
  email: {
    name: 'email',
    href: SOCIAL_URLS.email,
  },
}

// their order is important, DON'T change it at will
export const OTHER_LINKS = {
  subscribe: {
    name: 'subscribe',
    title: '訂閱鏡週刊',
    href: SOCIAL_URLS.subscribe,
  },
  magazine: {
    name: 'magazine',
    title: '訂閱電子雜誌',
    href: SOCIAL_URLS.magazine,
  },
  auth: {
    name: 'auth',
    title: '內容授權',
    href: SOCIAL_URLS.auth,
  },
  ad: {
    name: 'ad',
    title: '廣告合作',
    href: SOCIAL_URLS.ad,
  },
  campaign: {
    name: 'campaign',
    title: '活動專區',
    href: SOCIAL_URLS.campaign,
  },
  downloadApp: {
    name: 'download',
    title: '下載APP',
    href: SOCIAL_URLS.downloadApp,
  },
}
