const READR_URL = 'https://www.readr.tw'

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
const SOCIAL_MEDIA_LINKS = [
  LINE_LINK,
  WEIBO_LINK,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  RSS_LINK,
  EMAIL_LINK,
]

const SUBSCRIBE_LINK = {
  name: 'subscribe',
  title: '鏡週刊紙本雜誌',
  href: 'https://www.mirrormedia.mg/papermag',
}
const MAGAZINE_LINK = {
  name: 'magazine',
  title: '訂閱電子雜誌',
  href: 'https://mybook.taiwanmobile.com/contentGroup/MIR0100100001',
}
const DIGITAL_LINK = {
  name: 'digital',
  title: '鏡週刊數位訂閱',
  href: 'https://www.mirrormedia.mg/subscribe',
}
const AUTH_LINK = {
  name: 'auth',
  title: '內容授權',
  href: 'https://www.mirrormedia.mg/story/webauthorize/',
}
const AD_LINK = {
  name: 'ad',
  title: '廣告合作',
  href: 'https://www.mirrormedia.mg/story/ad1018001/index.html',
}
const CAMPAIGN_LINK = {
  name: 'campaign',
  title: '活動專區',
  href: 'https://www.mirrormedia.mg/category/campaign',
}
const WEBAUTHORIZE_LINK = {
  name: 'webauthorize',
  title: '內容授權',
  href: '/story/webauthorize/',
}
const DOWNLOAD_APP_LINK = {
  name: 'download',
  title: '下載APP',
  href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
}
const MEDIA_DISCIPLINE_LINK = {
  name: 'discipline',
  title: '新聞自律綱要',
  href: 'https://www.mirrormedia.mg/story/20200710edi030/',
}
const PROMOTION_LINKS = [
  MAGAZINE_LINK,
  AUTH_LINK,
  AD_LINK,
  CAMPAIGN_LINK,
  WEBAUTHORIZE_LINK,
  DOWNLOAD_APP_LINK,
  MEDIA_DISCIPLINE_LINK,
]

const MIRRORVOICE_LINK = {
  name: 'mirrorvoice',
  title: '鏡好聽',
  href: 'https://voice.mirrorfiction.com/',
}
const MIRRORFICTION_LINK = {
  name: 'mirrorfiction',
  title: '鏡文學',
  href: 'https://www.mirrorfiction.com/',
}
const READR_LINK = {
  name: 'readr',
  title: 'READr 讀+',
  href: READR_URL,
}
const SUB_BRAND_LINKS = [MIRRORVOICE_LINK, MIRRORFICTION_LINK, READR_LINK]

const VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING = {
  // 鏡封面
  video_coverstory: 'PLftq_bkhPR3ZtDGBhyqVGObQXazG_O3M3',

  // 鏡娛樂
  video_entertainment: 'PLftq_bkhPR3aj8UaqBvel6wia54AM5wlh',

  // 鏡社會
  video_society: 'PLftq_bkhPR3bLVBh5khl2pLxgFoPwrbfl',

  // 鏡調查
  video_investigation: 'PLftq_bkhPR3YOrSnIpcqSkY3hPE2TjXfW',

  // 鏡人物
  video_people: 'PLftq_bkhPR3YkNjH8VQZ__8nXZ9INIjAu',

  // 鏡財經
  video_finance: 'PLftq_bkhPR3afBv0Wg_oUqjd_pkWIJm2h',

  // 鏡食旅
  video_foodtravel: 'PLftq_bkhPR3baCfd6RU_1hbkY8ynXssun',

  // 娛樂透視
  video_ent_perspective: 'PLftq_bkhPR3YxUNEIHIMA2fsM-DqxCHMb',

  // 鏡錶誌
  video_carandwatch: 'PLgvIJQ8OtT8LOdwVF4P9hdQiuf6uAiwb6',
}

const SECTION_IDS = {
  member: '5fe15f1e123c831000ee54c2',
  news: '57e1e0e5ee85930e00cad4e9',
  entertainment: '57e1e11cee85930e00cad4ea',
  businessmoney: '596441d04bbe120f002a319a',
  people: '596441604bbe120f002a3197',
  international: '5964400d4bbe120f002a3191',
  foodtravel: '57dfe399ee85930e00cad4d6',
  mafalda: '5971aa8ce531830d00e32812',
  culture: '5964418a4bbe120f002a3198',
  carandwatch: '57dfe3b0ee85930e00cad4d7',
}

// 企劃特輯
const CATEGORY_ID_MARKETING = '57fca2f5c9b7a70e004e6df9'

const SITE_TITLE = '鏡週刊 Mirror Media'
const SITE_DESCRIPTION =
  '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
const SITE_URL = 'https://www.mirrormedia.mg'

const SECTION_MEMBER_NAME = [
  'people',
  'businessmoney',
  'foodtravel',
  'entertainment',
  'timesquare',
]

const ARTICLE_DATE_TIME_POSTFIX = '臺北時間'

export { default as SITE_OG_IMG } from '~/assets/default-og-img.png'
export {
  READR_URL,
  SOCIAL_MEDIA_LINKS,
  SUBSCRIBE_LINK,
  AUTH_LINK,
  PROMOTION_LINKS,
  SUB_BRAND_LINKS,
  VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING,
  SECTION_IDS,
  CATEGORY_ID_MARKETING,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  SECTION_MEMBER_NAME,
  DIGITAL_LINK,
  ARTICLE_DATE_TIME_POSTFIX,
}
