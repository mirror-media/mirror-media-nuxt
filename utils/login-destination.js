import localforage from 'localforage'

const localStorageKey = 'mm-login-destination'
const defaultDestination = '/section/member'

export default {
  async set(route) {
    const destination = route?.query?.destination ?? defaultDestination
    await localforage.setItem(localStorageKey, destination)
  },
  async redirect() {
    const destination =
      (await localforage.getItem(localStorageKey)) ?? defaultDestination
    await localforage.removeItem(localStorageKey)
    window.location.replace(destination)
  },
}
