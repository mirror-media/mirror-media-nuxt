import localforage from 'localforage'

const key = 'mm-login-destination'

export default {
  async set(route) {
    const destination = route?.query?.destination ?? '/'
    await localforage.setItem(key, destination)
  },
  async redirect() {
    const destination = (await localforage.getItem(key)) ?? '/'
    await localforage.removeItem(key)
    window.location.replace(destination)
  },
}
