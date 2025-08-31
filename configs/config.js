/* eslint import/no-mutable-exports:0 */
const API_PORT = '8080'
const API_PATH_FRONTEND = 'api/v2'
const API_PATH_MEMBERSHIP_GATEWAY = '/api/v0'
const API_PORT_MEMBERSHIP_GATEWAY = '80'
const GCP_KEYFILE = './gcskeyfile.json'
const GCP_PROJECT_ID = 'mirrormedia-1470651750304'
const GCP_STACKDRIVER_LOG_NAME = 'mirror-media-nuxt-user-behavior'
const PREVIEW_QUERY = 'preview=true'
const REDIS_PORT = 6379
const URL_STATIC_COMBO_SECTIONS =
  'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'

// The following variables are from environment variables
const ENV = process.env.ENV || 'local'
const REDIS_READ_HOST = process.env.REDIS_READ_HOST || 'redis-read-host'
const REDIS_WRITE_HOST = process.env.REDIS_WRITE_HOST || 'redis-write-host'
const REDIS_AUTH = process.env.REDIS_AUTH || 'redis-auth'
const NEWEBPAY_KEY = process.env.NEWEBPAY_KEY || 'newebpay-key'
const NEWEBPAY_IV = process.env.NEWEBPAY_IV || 'newebpay-iv'
const NEWEBPAY_PAPERMAG_KEY =
  process.env.NEWEBPAY_PAPERMAG_KEY || 'newebpay-papermag-key'
const NEWEBPAY_PAPERMAG_IV =
  process.env.NEWEBPAY_PAPERMAG_IV || 'newebpay-papermag-iv'
const ISRAFEL_ORIGIN = process.env.ISRAFEL_ORIGIN || 'israfel-origin'
const IS_AD_DISABLE = process.env.IS_AD_DISABLE === 'true' || false
const PREMIUM_AD_FEATURE_TOGGLE =
  process.env.PREMIUM_AD_FEATURE_TOGGLE === 'on' || false
const ENABLE_CLOUD_LOGGING = process.env.ENABLE_CLOUD_LOGGING === 'true'
const LINEPAY_CHANNEL_ID = process.env.LINEPAY_CHANNEL_ID || ''
const LINEPAY_CHANNEL_KEY = process.env.LINEPAY_CHANNEL_KEY || ''
const LINEPAY_CLIENT_MODE = ['development', 'production'].includes(
  process.env.LINEPAY_CLIENT_MODE
)
  ? process.env.LINEPAY_CLIENT_MODE
  : 'development'
const SEARCH_URL = process.env.SEARCH_URL || 'search-url/search'
const DONATION_PAGE_URL = process.env.DONATION_PAGE_URL
const WARM_LIFE_FEATURE_TOGGLE =
  process.env.WARM_LIFE_FEATURE_TOGGLE === 'on' || false

// The following variables are given values according to different `ENV`
let API_HOST = ''
let API_HOST_MEMBERSHIP_GATEWAY = ''
let API_MEMBER_SUBSCRIPTION_GATEWAY = ''
let API_PROTOCOL = ''
let API_TIMEOUT = 5000
let DOMAIN_NAME = ''
let GOOGLE_OPT_CONTAINER_ID = ''
let GPT_MODE = ''
let SALEOR_HOST = ''
let NEWEBPAY_MEMBERSHIP_API_URL = ''
let NEWEBPAY_PAPERMAG_API_URL = ''
let PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME = ''
let WEEKLY_API_SERVER_ORIGIN = ''
switch (ENV) {
  case 'prod':
    API_HOST = 'tr-projects-rest'
    API_HOST_MEMBERSHIP_GATEWAY = 'apigateway.default.svc.cluster.local'
    API_MEMBER_SUBSCRIPTION_GATEWAY =
      'apigateway.default.svc.cluster.local/api/v2/graphql/member'
    API_PROTOCOL = 'http'
    API_TIMEOUT = 1500
    DOMAIN_NAME = 'www.mirrormedia.mg'
    GOOGLE_OPT_CONTAINER_ID = 'OPT-N9L3WX3'
    GPT_MODE = 'prod'
    SALEOR_HOST = 'saleor-mirror.default.svc.cluster.local'
    NEWEBPAY_MEMBERSHIP_API_URL =
      process.env.NEWEBPAY_MEMBERSHIP_API_URL ||
      'https://core.newebpay.com/MPG/mpg_gateway'
    NEWEBPAY_PAPERMAG_API_URL =
      process.env.NEWEBPAY_PAPERMAG_API_URL ||
      'https://core.newebpay.com/MPG/mpg_gateway'
    PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME =
      process.env.PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME || 'linepay-webhook'
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-prod-ufaummkd5q-de.a.run.app'
    break
  case 'staging':
    API_HOST = 'tr-projects-rest'
    API_HOST_MEMBERSHIP_GATEWAY = 'apigateway.default.svc.cluster.local'
    API_MEMBER_SUBSCRIPTION_GATEWAY =
      'apigateway.default.svc.cluster.local/api/v2/graphql/member'
    API_PROTOCOL = 'http'
    API_TIMEOUT = 1500
    DOMAIN_NAME = 'www-staging.mirrormedia.mg'
    GOOGLE_OPT_CONTAINER_ID = 'OPT-N9L3WX3'
    GPT_MODE = 'prod'
    SALEOR_HOST = 'saleor-mirror.default.svc.cluster.local'
    NEWEBPAY_MEMBERSHIP_API_URL =
      process.env.NEWEBPAY_MEMBERSHIP_API_URL ||
      'https://core.newebpay.com/MPG/mpg_gateway'
    NEWEBPAY_PAPERMAG_API_URL =
      process.env.NEWEBPAY_PAPERMAG_API_URL ||
      'https://ccore.newebpay.com/MPG/mpg_gateway'
    PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME =
      process.env.PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME || 'linepay-webhook-staging'
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-staging-ufaummkd5q-de.a.run.app'
    break
  case 'dev':
    API_HOST = 'rest-service'
    API_HOST_MEMBERSHIP_GATEWAY = 'apigateway'
    API_MEMBER_SUBSCRIPTION_GATEWAY = 'apigateway/api/v2/graphql/member'
    API_PROTOCOL = 'http'
    API_TIMEOUT = 5000
    DOMAIN_NAME = 'dev.mirrormedia.mg'
    GOOGLE_OPT_CONTAINER_ID = 'OPT-NHZNB2Z'
    GPT_MODE = 'dev'
    SALEOR_HOST = 'saleor-mirror'
    NEWEBPAY_MEMBERSHIP_API_URL =
      process.env.NEWEBPAY_MEMBERSHIP_API_URL ||
      'https://ccore.newebpay.com/MPG/mpg_gateway'
    NEWEBPAY_PAPERMAG_API_URL =
      process.env.NEWEBPAY_PAPERMAG_API_URL ||
      'https://ccore.newebpay.com/MPG/mpg_gateway'
    PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME =
      process.env.PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME || 'linepay-webhook-dev'
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-dev-ufaummkd5q-de.a.run.app'
    break
  default:
    API_HOST = process.env.API_HOST || 'api-host'
    API_HOST_MEMBERSHIP_GATEWAY =
      process.env.API_HOST_MEMBERSHIP_GATEWAY || 'api-host-membership-gateway'
    API_MEMBER_SUBSCRIPTION_GATEWAY =
      process.env.API_MEMBER_SUBSCRIPTION_GATEWAY ||
      'api-member-subscription-gateway'
    API_PROTOCOL = 'http'
    API_TIMEOUT = 5000
    DOMAIN_NAME = 'dev.mirrormedia.mg'
    GOOGLE_OPT_CONTAINER_ID = 'OPT-NHZNB2Z'
    GPT_MODE = 'dev'
    SALEOR_HOST = 'saleor-mirror'
    NEWEBPAY_MEMBERSHIP_API_URL =
      process.env.NEWEBPAY_MEMBERSHIP_API_URL ||
      'https://ccore.newebpay.com/MPG/mpg_gateway'
    NEWEBPAY_PAPERMAG_API_URL =
      process.env.NEWEBPAY_PAPERMAG_API_URL ||
      'https://ccore.newebpay.com/MPG/mpg_gateway'
    PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME =
      process.env.PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME || 'linepay-webhook-dev'
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-dev-ufaummkd5q-de.a.run.app'
}

export {
  API_HOST,
  API_HOST_MEMBERSHIP_GATEWAY,
  API_MEMBER_SUBSCRIPTION_GATEWAY,
  API_PATH_FRONTEND,
  API_PATH_MEMBERSHIP_GATEWAY,
  API_PORT,
  API_PORT_MEMBERSHIP_GATEWAY,
  API_PROTOCOL,
  API_TIMEOUT,
  DOMAIN_NAME,
  ENV,
  GCP_KEYFILE,
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
  GOOGLE_OPT_CONTAINER_ID,
  GPT_MODE,
  ISRAFEL_ORIGIN,
  IS_AD_DISABLE,
  NEWEBPAY_IV,
  NEWEBPAY_KEY,
  NEWEBPAY_PAPERMAG_IV,
  NEWEBPAY_PAPERMAG_KEY,
  PREVIEW_QUERY,
  REDIS_AUTH,
  REDIS_PORT,
  REDIS_READ_HOST,
  REDIS_WRITE_HOST,
  SALEOR_HOST,
  URL_STATIC_COMBO_SECTIONS,
  NEWEBPAY_MEMBERSHIP_API_URL,
  NEWEBPAY_PAPERMAG_API_URL,
  PREMIUM_AD_FEATURE_TOGGLE,
  ENABLE_CLOUD_LOGGING,
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_KEY,
  LINEPAY_CLIENT_MODE,
  SEARCH_URL,
  PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME,
  DONATION_PAGE_URL,
  WARM_LIFE_FEATURE_TOGGLE,
  WEEKLY_API_SERVER_ORIGIN,
}
