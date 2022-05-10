'use strict'
import dfpUnitId from './dfpUnit.js'

export const MARKETING_CATGORY_ID = '57fca2f5c9b7a70e004e6df9'

export const SECTION_MAP = {
  // news
  '57e1e0e5ee85930e00cad4e9': {
    sectionName: 'news',
    bgcolor: '#30bac8',
    latestNewsOrder: 1,
  },

  // entertainment
  '57e1e11cee85930e00cad4ea': {
    sectionName: 'entertainment',
    bgcolor: '#bf3284',
    latestNewsOrder: 2,
  },

  // businessmoney category-business-money
  '596441d04bbe120f002a319a': {
    sectionName: 'businessmoney',
    bgcolor: '#009045',
    latestNewsOrder: 3,
  },
  'category-business-money': {
    sectionName: 'businessmoney',
    bgcolor: '#009045',
  },

  // people
  '596441604bbe120f002a3197': {
    sectionName: 'people',
    bgcolor: '#efa256',
    latestNewsOrder: 4,
  },

  // videohub
  '5975ab2de531830d00e32b2f': { sectionName: 'videohub', bgcolor: '#969696' },

  // international
  '5964400d4bbe120f002a3191': {
    sectionName: 'international',
    bgcolor: '#911f27',
    latestNewsOrder: 5,
  },

  // foodtravel
  '57dfe399ee85930e00cad4d6': {
    sectionName: 'foodtravel',
    bgcolor: '#eac151',
    latestNewsOrder: 6,
  },

  // mafalda
  '5971aa8ce531830d00e32812': {
    sectionName: 'mafalda',
    bgcolor: '#662d8e',
    latestNewsOrder: 9,
  },

  // culture
  '5964418a4bbe120f002a3198': {
    sectionName: 'culture',
    bgcolor: '#009245',
    latestNewsOrder: 7,
  },

  // watch
  '57dfe3b0ee85930e00cad4d7': {
    sectionName: 'watch',
    bgcolor: '#003153',
    latestNewsOrder: 8,
  },

  // external
  external: { sectionName: 'external', bgcolor: '#fb9d18' },
}

/*
 *
 * export const DEFAULT_SECTION_BGCOLOR = '#bcbcbc'
 *
 * export const OATH_PLAYLIST = {
 *   '5c4151124d981a0001477e0e': {
 *     order: 1,
 *     name: '鏡封面',
 *     categoryName: 'video_coverstory',
 *     id: '5c4151124d981a0001477e0e',
 *   },
 *   '5c41528dbd70380001962364': {
 *     order: 2,
 *     name: '鏡娛樂',
 *     categoryName: 'video_ent_headline',
 *     id: '5c41528dbd70380001962364',
 *   },
 *   '5c4152a184dc1c0001266e49': {
 *     order: 3,
 *     name: '鏡社會',
 *     categoryName: 'video_society',
 *     id: '5c4152a184dc1c0001266e49',
 *   },
 *   '5c4152bd84dc1c0001266e4a': {
 *     order: 4,
 *     name: '鏡調查',
 *     categoryName: 'video_investigation',
 *     id: '5c4152bd84dc1c0001266e4a',
 *   },
 *   '5c4151d0b1d38a000134ef53': {
 *     order: 5,
 *     name: '鏡財經理財',
 *     categoryName: 'video_finance',
 *     id: '5c4151d0b1d38a000134ef53',
 *   },
 *   '5c4152b1bd70380001962365': {
 *     order: 6,
 *     name: '鏡人物',
 *     categoryName: 'video_people',
 *     id: '5c4152b1bd70380001962365',
 *   },
 *   '5c4150842274b40001ccc6a8': {
 *     order: 7,
 *     name: '鏡食旅',
 *     categoryName: 'video_foodtravel',
 *     id: '5c4150842274b40001ccc6a8',
 *   },
 *   '5c4152dd84dc1c0001266e4b': {
 *     order: 8,
 *     name: '娛樂透視',
 *     categoryName: 'video_ent_perspective',
 *     id: '5c4152dd84dc1c0001266e4b',
 *   },
 *   '5c50116a4d981a0001477ead': {
 *     order: 9,
 *     name: '汽車鐘錶',
 *     categoryName: 'video_carandwatch',
 *     id: '5c50116a4d981a0001477ead',
 *   },
 * }
 *
 * export const OATH_ALL_VIDEO_PLAYLIST_ID = '5c418881b1d38a000134ef54'
 *
 * export const OATH_COPMANY_ID = '5bffbccda00f3047dec3381c'
 *
 * export const OATH_PLAYER_LIST = {
 *   singleVideo: {
 *     mobile: '5c51889d023e750d08904cac',
 *     desktop: '5c4e8789600c9a7e62ade71a',
 *   },
 *   section: {
 *     mobile: '5c4e7cc9f79c4150001f2b08',
 *     desktop: '5c0f55eddbaab306353048ec',
 *   },
 *   category: {
 *     video_coverstory: {
 *       mobile: '5c637faf0ca7c818a67f5666',
 *       desktop: '5c637bf6655b6811301dc253',
 *     },
 *     video_ent_headline: {
 *       mobile: '5c637fdfbc03933c303087e7',
 *       desktop: '5c637c3ffcd67b64d6bcb72a',
 *     },
 *     video_society: {
 *       mobile: '5c638012901437133811e74f',
 *       desktop: '5c637c63f79c416e58c84bf4',
 *     },
 *     video_foodtravel: {
 *       mobile: '5c638048f674e0279ef0da2e',
 *       desktop: '5c637c8a47e8a27bc1c5ff6f',
 *     },
 *     video_people: {
 *       mobile: '5c63807c0822e834ba8786c3',
 *       desktop: '5c637ca6367f6d2729a33334',
 *     },
 *     video_investigation: {
 *       mobile: '5c6380b3f344784fcf660775',
 *       desktop: '5c637cce0822e834ba8785af',
 *     },
 *     video_finance: {
 *       mobile: '5c6381350ca7c818a67f56db',
 *       desktop: '5c637cf1f79c416e58c84c1e',
 *     },
 *     video_ent_perspective: {
 *       mobile: '5c63817b600c9a19e8d49eb5',
 *       desktop: '5c637d27cd15ef2e5cdfcc97',
 *     },
 *     video_carandwatch: {
 *       mobile: '5c63817b497fa178dc9bcfeb',
 *       desktop: '5c637d4e98f45d75d802f77d',
 *     },
 *   },
 * }
 *
 */
export const DFP_SIZE_MAPPING = {
  default: [
    { browser: [0, 0], ad_sizes: [] },
    {
      browser: [970, 200],
      ad_sizes: [
        [1, 1],
        [970, 90],
        [970, 250],
        [300, 250],
        [300, 600],
      ],
    },
  ],
  'mobile-only': [
    {
      browser: [1, 1],
      ad_sizes: [
        [1, 1],
        [320, 100],
        [300, 250],
        [320, 480],
        [336, 280],
      ],
    },
    { browser: [970, 200], ad_sizes: [] },
  ],
  'less-than-320-only': [
    {
      browser: [1, 1],
      ad_sizes: [
        [1, 1],
        [320, 100],
        [300, 250],
        [320, 480],
      ],
    },
    { browser: [970, 200], ad_sizes: [] },
  ],
}

export const DFP_UNITS = dfpUnitId
export const DFP_ID = '40175602'
export const DFP_OPTIONS = {
  dfpID: '',
  setTargeting: {},
  setCategoryExclusion: '',
  setLocation: '',
  enableSyncRendering: false,
  enableSingleRequest: true,
  collapseEmptyDivs: 'original',
  refreshExisting: true,
  disablePublisherConsole: false,
  disableInitialLoad: true,
  setCentering: false,
  noFetch: false,
  namespace: undefined,
  sizeMapping: [],
  afterAdBlocked: undefined,
  afterEachAdLoaded: undefined,
  afterAllAdsLoaded: undefined,
}

//
// /*
//  * Vpon ad is abandoned 20180810 BY KC
//  * export const VPON_CONFIG = {
//  *   vpon_ad_test: '0',
//  *   // vpon_ad_licensy_key: '8a8081825d0c002f015d35a443c237c0',
//  *   vpon_ad_licensy_key: '8a8081825e98980c015e9d59341707d0',
//  *   vpon_ad_format: 'mi',
//  *   debug: true
//  * }
//  */
//
// export const GA_ID = 'UA-83609754-1'
// export const GA_TEST_ID = 'UA-83609754-2'
// export const COMSCORE_C2_ID = '24318560'
// export const ALEXA_ATRK_ACCT = 'JEZvr1zDGU20kU'
//
// export const MATCHED_CONTENT_AD_CLIENT = 'ca-pub-7986335951683342'
// export const MATCHED_CONTENT_AD_SLOT = '3362911316'
//
export const SOCIAL_LINK = {
  AD: 'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam',
  AUTH: 'https://www.mirrormedia.mg/story/webauthorize/',
  DOWNLOADAPP: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
  EMAIL: 'mailto:mirror885@mirrormedia.mg',
  FACEBOOK: 'https://www.facebook.com/mirrormediamg/',
  FACEBOOK_FOODTRAVEL: 'https://www.facebook.com/MirrorMediaFoodTravel/',
  FEED: 'https://www.mirrormedia.mg/rss/rss.xml',
  INSTAGRAM: 'https://www.instagram.com/mirror_media/',
  LINE: 'https://line.me/R/ti/p/%40cuk1273e',
  MAGAZINE: 'https://mybook.taiwanmobile.com/contentGroup/MIR0100100001',
  SUBSCRIBE:
    'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
  DISPILINE: 'https://www.mirrormedia.mg/story/20200710edi030/',
  WECHAT: '#',
  WEIBO: 'http://www.weibo.com/u/6030041924?is_all=1',
}

export const AUTHOR = 'AUTHOR'

export const CATEGORY = 'CATEGORY'

export const EXTERNALS = 'EXTERNALS'

export const SEARCH = 'SEARCH'

export const SECTION = 'SECTION'

export const TAG = 'TAG'

export const TOPIC = 'TOPIC'

export const SECTION_FOODTRAVEL_ID = '57dfe399ee85930e00cad4d6'

export const SECTION_WATCH_ID = '57dfe3b0ee85930e00cad4d7'

export const CATEGORY_POLITICAL_ID = '5979ac0de531830d00e330a7'

export const CATEGORY_CITY_NEWS_ID = '5979ac33e531830d00e330a9'

export const CATEGORY_BUSINESS_ID = '57e1e16dee85930e00cad4ec'

export const CATEGORY_LATESTNEWS_ID = '57e1e200ee85930e00cad4f3'

export const CATEGORY_INTERVIEW_ID = '5975642de531830d00e32a5b'

export const CATEGORY_ORALREADING_ID = '58ef372a7bce2b0e0048288c'

export const AUDIO_ID = '58ef372a7bce2b0e0048288c'

export const CAMPAIGN_ID = '5859e7e5c0ff6d0d00246263'

export const MARKETING_ID = '57fca2f5c9b7a70e004e6df9'

export const VIDEOHUB_ID = '5975ab2de531830d00e32b2f'

export const TOPIC_FINPROJECT_ID = '5948a49fe28c300d0035971a'

export const TOPIC_PROTEST_ID = '59151f0ff2179c0d0089b7d5'

export const TOPIC_WATCH_ID = '586cd15c3c1f950d00ce2e78'

export const TAG_INTERVIEW_ID = '59647e9e4bbe120f002a3282'

export const TAG_ORALREADING_ID = '59647e964bbe120f002a3281'

export const SITE_DESCRIPTION =
  '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'

export const SITE_KEYWORDS =
  '鏡週刊,mirror media,新聞人物,娛樂焦點,美食旅遊,瑪法達'

export const SITE_OGIMAGE =
  'https://www.mirrormedia.mg/assets/mirrormedia/notImage.png'

export const SITE_TITLE = '鏡週刊 Mirror Media'

export const SITE_TITLE_SHORT = '鏡週刊'

export const SITE_URL = 'https://www.mirrormedia.mg'

export const SITE_MOBILE_URL = 'https://m.mirrormedia.mg'

export const SITE_PROJ_URL = 'https://www.readr.tw'

export const SITE_DOMAIN = 'mirrormedia.mg'

export const FB_APP_ID = '175313259598308'

export const FB_PAGE_ID = '1855418728011324'

export const RELATED_LIST_MAX = 10

export const RECOMM_HITORY_MAX_IN_LOCALSTORAGE = 10
