# 目的簡介
透過監聽 DOM 以及 Vue Router event，組織相關資訊，並傳送至 [GCP Could Logging](https://paper.dropbox.com/doc/GCP-logs-user-behavior-logs--BapveT3~nZxA5Fmi1GVB2C2TAg-jp2jKHA9tT7B7t4VTVRNP) ，達到蒐集使用者行為數據的目的。

# 此 plugin 自動監聽的 event types
1. `pageview`
   - 串接 Vue Router [`beforeEach`](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) guard 來達到當使用者每次進入一個頁面時發送 log。
2. `click`
   - 監聽 `window` `click` event 來達到當使用者每次點擊頁面元素時發送 log。
3. `exit`
   - 監聽 `window` `beforeunload` event 來達到當使用者每次離開頁面前發送 log。
     - 利用 [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) 來確保 log request 能夠在 page unloaded 時發送不至於遺失。
     - 利用 [timeme.js](https://github.com/jasonzissman/TimeMe.js/) 來作為計算使用者在頁面停留時間的工具。
4. `scroll-to-bottom`
   - 監聽 `window` `scroll` event 來達到當使用者每次滾動且滾動至頁面底部時發送 log。
     - 有利用 [`debounce`](https://lodash.com/docs/4.17.15#debounce) 函式避免效能影響。

# 此 plugin inject 的 global functions
1. `$sendUserBehaviorLog()`
   - 用於此 plugin 自動監聽的 event types 之外，提供於任何在 Vue components 中需要發送 log 時呼叫的 function。
     - 例子：
       - custom pageview event in premium-slug page component.
2. `$sendMembershipErrorLog()`
   - 用於發送 membership error 有關的 logs 用的 function，為製作會員訂閱時臨時加上的 function，以利檢查會員遇到問題時方便追蹤原因。

# Beacon API
被發明用來發送具有分析性質資料 requests 且兼顧效能的 Web API，詳見 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) ，簡列重點如下：
- 相比於一般的 requests，Beacon API requests 能夠確保在 page unloaded 時發送不至於遺失。
- 相比於一般的 requests，Beacon API requests 不期待有 response，本生就是為了發送具有分析性質的資料到 server 而生，如 log data。

# 其他
- log data properties 中有許多欄位皆從 legacy code 一路沿用至今，僅為了向過去相容而一直保留，所有欄位是否還有所必要皆有討論空間。
- 大部分的程式碼皆有 unit tests，位於 `user-behavior-log/__tests__/` 資料夾中，相關技術規格可直接參考 unit tests。
