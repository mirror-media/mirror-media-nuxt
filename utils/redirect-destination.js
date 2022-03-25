import localforage from 'localforage'

const localStorageKey = 'mm-login-destination'
const defaultDestination = '/section/member'

/*
 *本功能用於會員登入時，一系列的頁面跳轉，最後回到網站成功登入後，能夠回到會員原先正在瀏覽的頁面使用
 * 範例情境：
 * 1. 使用者目前在會員文章頁 /premium/something
 * 2. 跳轉至登入頁，並帶上 1. 的頁面路徑資訊，如 /login?destination=/premium/something
 * 3. 進入登入頁，且登入頁載入時負責檢查 ?destination query，塞入 localStorage
 * 4. 使用第三方登入，並包含頁面跳轉至第三方平台做驗證
 * 5. 第三方平台驗證成功，回到 login 頁
 * 6. login 頁負責登入成功後，檢查 localStorage 有無先前之 destination 資訊，若有則 redirect
 */
export default {
  async set(route, key = localStorageKey) {
    const destination = route?.query?.destination ?? defaultDestination
    await localforage.setItem(key, destination)
  },
  async redirect(urlKey = localStorageKey) {
    const destination =
      (await localforage.getItem(urlKey)) ?? defaultDestination
    await localforage.removeItem(urlKey)
    window.location.replace(destination)
  },
}
