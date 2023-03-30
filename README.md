# mirror-media-nuxt

鏡週刊網站前端

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Yarn version

因為 v2、v3 的 yarn 版本，在執行 `yarn dev` `yarn build` 時，會跳出許多錯誤，
所以目前本專案仍採用 classic stable version。
截至 2022.4.28，最新的 classic stable version 為 1.22.18，開發時請使用~1.22.0 的版本。
To avoid unpredictable error occur when developing, please use Classic Stable version of yarn(~1.22.0).

## Environment Variables

| 變數名稱                          | 資料型態         | 初始值                                       | 變數說明                                                                      |
| --------------------------------- | ---------------- | -------------------------------------------- | ----------------------------------------------------------------------------- | --- |
| ENV                               | 字串             | 'local'                                      | 系統環境，目前已知有；`local`、`dev`、`staging`、`production` 和 `lighthouse` |
| REDIS_READ_HOST                   | 字串             | 'redis-read-host'                            | 讀取用的 Redis hostname or ip                                                 |
| REDIS_WRITE_HOST                  | 字串             | 'redis-write-host'                           | 寫入用的 Redis hostname or ip                                                 |
| REDIS_AUTH                        | 字串             | 'redis-auth'                                 | Reids 驗證用資訊                                                              |
| NEWEBPAY_KEY                      | 長度為 32 的字串 | 'newebpay-key'                               | 藍新支付 API key (Premium 訂閱)                                               |
| NEWEBPAY_IV                       | 長度為 16 的字串 | 'newebpay-iv'                                | 藍新支付 API iv (Premium 訂閱)                                                |
| NEWEBPAY_MEMBERSHIP_API_URL       | 字串             | 'https://ccore.newebpay.com/MPG/mpg_gateway' | 藍新支付 API URL (Premium 訂閱)                                               |
| NEWEBPAY_PAPERMAG_KEY             | 字串             | 'newebpay-papermag-key'                      | 藍新支付 API key (紙本雜誌)                                                   |
| NEWEBPAY_PAPERMAG_IV              | 字串             | 'newebpay-papermag-iv'                       | 藍新支付 API iv (紙本雜誌)                                                    |
| NEWEBPAY_PAPERMAG_API_URL         | 字串             | 'https://ccore.newebpay.com/MPG/mpg_gateway' | 藍新支付 API URL (紙本雜誌)                                                   |
| ISRAFEL_ORIGIN                    | 字串             | 'israfel-origin'                             | Israfel URL                                                                   |
| API_HOST                          | 字串             | 'api-host'                                   | API GATEWAY URL                                                               |
| API_HOST_MEMBERSHIP_GATEWAY       | 字串             | 'api-host-membership-gateway'                | API GATEWAY URL                                                               |
| API_MEMBER_SUBSCRIPTION_GATEWAY   | 字串             | 'api-member-subscription-gateway'            | API GATEWAY URL                                                               |
| IS_AD_DISABLE                     | 布林值           | false                                        |                                                                               |     |
| PREMIUM_AD_FEATURE_TOGGLE         | 布林值           | false                                        | 用 'on' 啟用的數值 ...                                                        |
| ENABLE_CLOUD_LOGGING              | 布林值           | false                                        | 開啟 gcloud/logging 行為                                                      |
| LINEPAY_CHANNEL_ID                | 字串             | ''                                           | LINE Pay 串接所需的 channel id                                                |
| LINEPAY_CHANNEL_KEY               | 字串             | ''                                           | LINE Pay 串接所需的 channel key                                               |
| LINEPAY_CLIENT_MODE               | 字串             | 'development'                                | 串接 LINE Pay 的模式，數值有 `development` 和 `production`                    |
| PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME | 字串             | 'linepay-webhook-dev'                        | LINE Pay 付款資訊寫入 PubSub 的主題名稱                                       |
| SEARCH_URL                        | 字串             | 'search-url/search'                          | 搜尋頁面 url                                                                  |
| MEMBER_ARTICLE_HISTORY_MAX_AGE    | 字串             | '30'                                         | 會員訂閱前閱覽紀錄有效期限，以分鐘為單位                                      |
| DONATION_PAGE_URL                 | 字串             | undefined                                    | 捐款頁網址（目前捐款頁為外部頁面，使用 `/donate` 作為 proxy ）                |
| WARM_LIFE_FEATURE_TOGGLE          | 布林值           | false                                        | 用 'on' 啟用的數值 ...                                                        |

## Feature Toggle

| 變數名稱                                     | 資料型態    | 初始值 | 變數說明                            |
| -------------------------------------------- | ----------- | ------ | ----------------------------------- |
| EMAIL_VERIFY_FEATURE_TOGGLE                  | 'on', 'off' | 'off'  |                                     |
| NO_AD_FEATURE_TOGGLE                         | 'on', 'off' | 'off'  |                                     |
| TOPIC_LIST_FEATURE_TOGGLE                    | 'on', 'off' | 'off'  |                                     |
| SUBSCRIPTION_PRICE_FEATURE_TOGGLE            | 'on', 'off' | 'off'  |                                     |
| HEADER_EXTERNALS_FEATURE_TOGGLE              | 'on', 'off' | 'off'  |                                     |
| LINEPAY_PAYMENT_UI_TOGGLE                    | 'on', 'off' | 'off'  | 確認付款頁 LINEPay 支付功能啟用開關 |
| RECORD_MEMBER_ARTICLE_HISTORY_FEATURE_TOGGLE | 'on', 'off' | 'off'  | 記錄會員訂閱前閱覽紀錄              |
| DONATE_FEATURE_TOGGLE                        | 'on', 'off' | 'off'  | 捐款功能啟用開關                    |

※ 在執行指令時，使用 `key=value` 的前綴來執行，例如：`ENV=dev yarn dev`，即可設定執行時的環境變數。
