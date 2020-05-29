export const SOCIAL_URLS = {
  subscribe:
    'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
  magazine: 'https://mybook.taiwanmobile.com/contentGroup/MIR0100100001',
  auth: 'https://www.mirrormedia.mg/story/webauthorize/',
  ad: 'https://www.mirrormedia.mg/story/ad1018001/index.html',
  campaign: 'https://www.mirrormedia.mg/category/campaign',
  downloadApp: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',

  facebookFoodtravel: 'https://www.facebook.com/MirrorMediaFoodTravel/',
}

const LINE_LINK = {
  name: 'line',
  href: 'https://line.me/R/ti/p/%40cuk1273e',
}
const WEIBO_LINK = {
  name: 'weibo',
  href: 'http://www.weibo.com/u/6030041924?is_all=1',
}
const FACEBOOK_LINK = {
  name: 'facebook',
  href: 'https://www.facebook.com/mirrormediamg/',
}
const INSTAGRAM_LINK = {
  name: 'instagram',
  href: 'https://www.instagram.com/mirror_media/',
}
const RSS_LINK = {
  name: 'rss',
  href: 'https://www.mirrormedia.mg/rss/rss.xml',
}
const EMAIL_LINK = {
  name: 'email',
  href: 'mailto:mirror885@mirrormedia.mg',
}

export const SOCIAL_MEDIA_LINKS = [
  LINE_LINK,
  WEIBO_LINK,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  RSS_LINK,
  EMAIL_LINK,
]

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

// their order is important, DON'T change it at will
export const SUB_BRAND_LINKS = {
  mirrorvoic: {
    name: 'mirrorvoice',
    title: '鏡好聽',
    href: 'https://voice.mirrorfiction.com/',
  },
  mirrorfiction: {
    name: 'mirrorfiction',
    title: '鏡文學',
    href: 'https://www.mirrorfiction.com/',
  },
  readr: {
    name: 'readr',
    title: 'READr 讀+',
    href: 'https://www.readr.tw/',
  },
}
