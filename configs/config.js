export const API_PROTOCOL = process.env.API_PROTOCOL || 'http'
export const API_HOST = process.env.API_HOST || '104.199.190.189'
export const API_PORT = process.env.API_PORT || '8080'
export const API_HOST_MEMBERSHIP_GATEWAY =
  process.env.API_HOST_MEMBERSHIP_GATEWAY || 'app-dev.mirrormedia.mg'
export const API_PATH_MEMBERSHIP_GATEWAY =
  process.env.API_PATH_MEMBERSHIP_GATEWAY || '/api/v0/'
export const API_PORT_MEMBERSHIP_GATEWAY =
  process.env.API_PORT_MEMBERSHIP_GATEWAY || '80'
export const API_TIMEOUT = process.env.API_TIMEOUT || 5000
export const SALEOR_HOST = process.env.SALEOR_HOST || '104.155.209.114'
export const API_PATH_FRONTEND = process.env.API_PATH_FRONTEND || 'api/v2'
export const DOMAIN_NAME = process.env.DOMAIN_NAME || 'www.mirrormedia.mg'
export const ENV = process.env.ENV || 'local'
export const IS_AD_DISABLE = process.env.IS_AD_DISABLE || false
export const GPT_MODE = process.env.GPT_MODE || 'dev'
export const PREVIEW_QUERY = process.env.PREVIEW_QUERY || 'preview=true'
export const REDIS_READ_HOST = process.env.REDIS_READ_HOST || 'redis-read-host'
export const REDIS_WRITE_HOST =
  process.env.REDIS_WRITE_HOST || 'redis-write-host'
export const REDIS_PORT = process.env.REDIS_PORT || 'redis-port'
export const REDIS_AUTH = process.env.REDIS_AUTH || 'redis-auth'
export const URL_STATIC_COMBO_SECTIONS =
  process.env.URL_STATIC_COMBO_SECTIONS ||
  'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'
export const GCP_PROJECT_ID =
  process.env.GCP_PROJECT_ID || 'mirrormedia-1470651750304'
export const GCP_STACKDRIVER_LOG_NAME =
  process.env.GCP_STACKDRIVER_LOG_NAME || 'mirror-media-nuxt-user-behavior'
export const GCP_KEYFILE = process.env.GCP_KEYFILE || './gcskeyfile.json'
export const GOOGLE_OPT_CONTAINER_ID =
  process.env.GOOGLE_OPT_CONTAINER_ID || 'OPT-NHZNB2Z'
export const API_MEMBER_SUBSCRIPTION_GATEWAY =
  process.env.API_MEMBER_SUBSCRIPTION_GATEWAY ||
  'app-dev.mirrormedia.mg/api/v2/graphql/member'
export const NEWEBPAY_KEY = process.env.NEWEBPAY_KEY || 'newebpay-key'
export const NEWEBPAY_IV = process.env.NEWEBPAY_IV || 'newebpay-iv'
export const K3_API_FOR_GET_POSTS =
  process.env.K3_API_FOR_GET_POSTS || 'k3-api-for-get-posts'
export const NEWEBPAY_PAPERMAG_KEY =
  process.env.NEWEBPAY_PAPERMAG_KEY || 'newebpay-papermag-key'
export const NEWEBPAY_PAPERMAG_IV =
  process.env.NEWEBPAY_PAPERMAG_IV || 'newebpay-papermag-iv'
export const ISRAFEL_ORIGIN = process.env.ISRAFEL_ORIGIN || 'israfel-origin'
export const NEWEBPAY_MEMBERSHIP_API_URL =
  process.env.NEWEBPAY_MEMBERSHIP_API_URL ||
  'https://ccore.newebpay.com/MPG/mpg_gateway'
export const NEWEBPAY_PAPERMAG_API_URL =
  process.env.NEWEBPAY_PAPERMAG_API_URL ||
  'https://ccore.newebpay.com/MPG/mpg_gateway'
