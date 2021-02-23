import localforage from 'localforage'

const key = 'mm-login-destination'
const defaultDestination = '/section/member'

export default {
  async set(route) {
    const destination = route?.query?.destination ?? defaultDestination
    await localforage.setItem(key, destination)
  },
  async redirect() {
    const destination = (await localforage.getItem(key)) ?? defaultDestination
    await localforage.removeItem(key)
    window.location.replace(destination)
  },
}
